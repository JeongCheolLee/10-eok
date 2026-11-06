// 앱 정보용 이미지 생성 — 로고 600×600, 세로 636×1048 ×5, 가로 1504×741 ×5.
// 실제 앱 화면의 의미 있는 영역을 캡처한다. UI와 계산 결과를 재작성하지 않는다.
// 사용: cd toss && node_modules/.bin/vite build && node store/make-assets.cjs   (루트 node_modules의 @playwright/test 사용)
// dist에 data/가 없으면 ../public/data를 대신 서빙한다(브라우저 모드는 상대 경로 data/를 읽음).
const http = require("http"); const fs = require("fs"); const os = require("os"); const path = require("path");
const { chromium } = require("@playwright/test");
const ROOT = path.resolve(__dirname, "..", ".."), DIST = path.join(ROOT, "toss", "dist"), DATA = path.join(ROOT, "public", "data"), OUT = __dirname;
const RAW = fs.mkdtempSync(path.join(os.tmpdir(), "10eok-shots-"));
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
  let f = path.join(DIST, p);
  if (!fs.existsSync(f) && p.startsWith("/data/")) f = path.join(DATA, p.slice(6));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { if (p.includes(".")) { res.statusCode = 404; return res.end(); } f = path.join(DIST, "index.html"); }
  res.setHeader("Content-Type", MIME[path.extname(f)] || "application/octet-stream"); fs.createReadStream(f).pipe(res);
});
const FONT = `"Toss Product Sans", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif`;
const INK = "#191f28", SUB = "#4e5968";
const SAVED_PLAN = { ticker: "SPY", holdings: [{ ticker: "SPY", amount: 100 }], mode: "time", amount: 100, years: 10, lump: 0, freq: "monthly", buyDay: 1, weekday: 1, tracking: false, startDate: "", reinvest: true, tax: false };
const SAVED = JSON.stringify({ v: 3, items: [
  { id: "store-spy", plan: SAVED_PLAN, savedAt: "2026-11-04T00:00:00.000Z" },
  { id: "store-qqq", plan: { ...SAVED_PLAN, ticker: "QQQ", amount: 50, holdings: [{ ticker: "QQQ", amount: 50 }], lump: 1000 }, savedAt: "2026-11-03T00:00:00.000Z" },
] });
const settled = (page) => page.waitForFunction(() => !document.body.innerText.includes("계산 중"), null, { timeout: 90000 });

(async () => {
  await new Promise((r) => server.listen(4188, r));
  const base = "http://localhost:4188";
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, locale: "ko-KR", reducedMotion: "reduce" });
  const regions = {};
  const notes = {};
  const captureRegion = async (page, name, first, last = first) => {
    const a = await first.boundingBox(), b = await last.boundingBox();
    if (!a || !b) throw new Error(`${name}: missing capture region`);
    const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    const width = Math.max(a.x + a.width, b.x + b.width) - x;
    const height = Math.max(a.y + a.height, b.y + b.height) - y;
    await page.screenshot({ path: path.join(RAW, `${name}.png`), clip: { x, y, width, height } });
    regions[name] = { width, height };
    fs.copyFileSync(path.join(RAW, `${name}.png`), path.join(OUT, `screen-${name}.png`));
  };
  const errors = [];
  const shots = [
    { name: "home", url: "/", wait: "10억까지 계산하기" },
    { name: "picker", url: "/", wait: "10억까지 계산하기" },
    { name: "result", url: "/?t=SPY&m=100&d=1&f=m", wait: "계산 저장하기" },
    { name: "clock", url: "/?page=clock", wait: "저장한 조건을 누르면 최신 자료로 다시 계산해요", saved: true },
    { name: "compare", url: "/?t=JEPQ&m=50&d=1&f=m", wait: "계산 저장하기" },
    { name: "analysis", url: "/?t=SPY&m=100&d=1&f=m", wait: "계산 저장하기" },
  ];
  for (const s of shots) {
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("SafeAreaInsets")) errors.push(`${s.name}: ${m.text().slice(0, 160)}`); });
    if (s.saved) await page.addInitScript((v) => localStorage.setItem("10eok-toss-clock-v1", v), SAVED); else await page.addInitScript(() => localStorage.clear());
    await page.goto(base + s.url, { waitUntil: "load" });
    try { await settled(page); await page.waitForFunction((t) => document.body.innerText.includes(t), s.wait, { timeout: 20000 }); }
    catch (e) { throw new Error(`${s.name}: wait failed — ${e.message.split("\n")[0]}`); }
    if (s.name === "compare") {
      await page.getByRole("button", { name: "같은 조건으로 비교하기" }).click();
      await page.locator(".comparison-etf").first().waitFor();
      await page.waitForFunction(() => !document.body.innerText.includes("나머지 ETF를 불러오는 중"));
    }
    await page.waitForTimeout(400);
    // 등록 이미지는 광고가 없는 상태로 캡처한다. 브라우저 전용 테스트 광고 박스는 소개 이미지에 넣지 않는다.
    await page.addStyleTag({ content: '.ad-slot { display: none !important; }' });
    await page.evaluate(() => document.fonts.ready);
    if (s.name === "picker") {
      await page.getByRole('button', { name: 'ETF 선택하기', exact: true }).click();
      await page.getByRole('dialog').waitFor();
      await page.waitForTimeout(350);
    }
    // 각 화면의 의미 있는 구간 끝에서 캡처해 입력·버튼·ETF 행이 반으로 잘리지 않게 한다.
    if (s.name === "home") await page.setViewportSize({ width: 390, height: Math.ceil(await page.locator('.input-screen').evaluate(e => e.scrollHeight)) });
    if (s.name === "clock") await page.setViewportSize({ width: 390, height: Math.ceil(await page.locator(".saved-screen").evaluate(e => e.scrollHeight)) });
    if (s.name === "result") await page.setViewportSize({ width: 390, height: Math.ceil(await page.locator('.result-actions').evaluate(e => e.getBoundingClientRect().bottom + 20)) });
    if (s.name === "compare") {
      await page.locator('#comparison-sort').selectOption('type');
      await page.setViewportSize({ width: 390, height: Math.ceil(await page.locator('.comparison-etf').nth(1).evaluate(e => e.getBoundingClientRect().bottom + 16)) });
    }
    if (s.name === "analysis") {
      await page.getByRole("button", { name: "광고 보고 상세 분석 보기", exact: true }).click();
      await page.getByRole("button", { name: "분석 열기", exact: true }).click({ timeout: 10000 });
      await page.locator(".resilience-details").waitFor();
      await page.setViewportSize({ width: 390, height: 7000 });
    }
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(RAW, `${s.name}.png`) });
    if (s.name !== "analysis") fs.copyFileSync(path.join(RAW, `${s.name}.png`), path.join(OUT, `screen-${s.name}.png`));
    fs.writeFileSync(path.join(RAW, `${s.name}.txt`), await page.evaluate(() => document.body.innerText));
    await page.evaluate(() => window.scrollTo(0, 0));
    if (s.name === "home") await captureRegion(page, "input-detail", page.locator(".input-screen > .section-label").first(), page.locator(".input-primary"));
    if (s.name === "compare") {
      notes.compare = await page.locator(".comparison-window").innerText();
      await captureRegion(page, "compare-detail", page.locator(".comparison-group h2").first(), page.locator(".comparison-etf").nth(1));
    }
    if (s.name === "result") {
      notes.result = await page.locator(".result-current").innerText();
      await captureRegion(page, "chart-detail", page.locator(".result-chart"));
    }
    if (s.name === "analysis") {
      notes.analysis = await page.locator(".resilience-period").innerText();
      await captureRegion(page, "loss-detail", page.locator(".resilience-details > article").first());
      const fiveYears = page.locator(".resilience-checkpoint").filter({ has: page.getByRole("heading", { name: "5년 뒤", exact: true }) });
      await captureRegion(page, "growth-detail", fiveYears);
      notes.growth = await page.locator(".resilience-details > article").nth(3).locator(":scope > p").first().innerText();
    }
    await page.close();
  }
  await ctx.close();

  // 화면의 숫자와 문구는 캡처 그대로 사용한다. 설명은 기능과 예시 조건을 분리한다.
  const slides = [
    { key: "home", image: "input-detail", label: "내 조건으로 시작해요", title: "월급날마다 모았다면<br><em>10억까지 얼마나?</em>", sub: "ETF와 모을 금액을 고르고<br>과거의 결과를 계산해요", context: "매달, 매주, 매일 원하는 주기로", foot: "기본 계산은 횟수 제한 없이 무료예요.", color: "#eaf7f1" },
    { key: "compare", image: "compare-detail", label: "같은 조건으로 비교해요", title: "같은 돈, 같은 기간<br><em>ETF만 달랐다면?</em>", sub: "기간과 납입 조건은 그대로 두고<br>ETF별 결과를 나란히 봐요", context: notes.compare.split(/\n+/).join("<br>"), foot: "실제 거래 자료로 계산한 결과의 일부예요.", color: "#edf3fc" },
    { key: "analysis", image: "loss-detail", label: "투자 과정 돌아보기", title: "10억까지 가는 길<br><em>버틸 수 있었을까요?</em>", sub: "가장 큰 손실률과 손실 금액,<br>손실이 이어진 기간을 살펴봐요", context: "SPY를 매달 100만원씩 샀다면<br>" + notes.analysis.split(/\n+/).join("<br>"), foot: "상세 분석은 리워드 광고 시청 후 확인해요.", color: "#f3f0fa" },
    { key: "growth", image: "growth-detail", label: "손실 이후도 살펴봐요", title: "힘들었던 그때도<br><em>계속 적립했다면?</em>", sub: "1년 뒤, 3년 뒤, 5년 뒤<br>평가액과 추가로 넣은 돈을 함께 봐요", context: "SPY를 매달 100만원씩 샀다면<br>" + notes.growth.replace("부터 같은 금액과 주기로 계속 적립한 결과예요.", " 이후에도 같은 조건으로 적립했어요."), foot: "상세 분석은 리워드 광고 시청 후 확인해요.", color: "#eaf7f1" },
    { key: "result", image: "chart-detail", label: "결과를 한눈에 확인해요", title: "처음 10억을 넘은 날<br><em>그 이후까지</em>", sub: "넣은 돈과 평가액의 변화를<br>그래프로 확인하고 결과를 공유해요", context: "SPY를 매달 100만원씩 샀다면<br>" + notes.result.split(/\n+/).join("<br>"), foot: "그래프를 누르면 그날의 금액을 볼 수 있어요.", color: "#edf3fc" },
  ];
  const img = (n) => "data:image/png;base64," + fs.readFileSync(path.join(RAW, `${n}.png`)).toString("base64");
  const brand = fs.readFileSync(path.join(OUT, "logo.svg"), "utf8");
  const common = `*{box-sizing:border-box}body{margin:0;font-family:${FONT};color:${INK};overflow:hidden}h1{font-weight:800;letter-spacing:-.045em;line-height:1.24;margin:17px 0 14px}em{font-style:normal;color:#00875a}p{margin:0;line-height:1.55;word-break:keep-all}.brand{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:700}.brand svg{width:28px;height:28px;border-radius:8px}.label{font-weight:700;color:#566676;font-size:18px}.sub{font-size:22px;color:${SUB}}.panel{position:absolute;background:white;border:1px solid #ffffff;border-radius:28px;box-shadow:0 18px 48px #182d3c12;overflow:hidden;padding:20px}.panel img{display:block;width:100%}.context{font-size:16px;color:${SUB};line-height:1.5;margin-bottom:16px}.foot{font-size:17px;font-weight:600;color:${SUB}}.legal{font-size:13px;color:#667680;line-height:1.5}.page{font-size:14px;color:#667680;font-weight:600}`;
  const panel = (s, left, top, width, maxHeight) => {
    return `<div class="panel" data-max-height="${maxHeight}" style="left:${left}px;top:${top}px;width:${width}px"><p class="context">${s.context}</p><img src="${img(s.image)}" style="margin:auto" alt="${s.label}"></div>`;
  };
  const legal = "과거 자료로 계산한 예시예요. 미래 수익을 보장하지 않아요.";
  const vert = (s, i) => `<!doctype html><html lang="ko"><head><style>${common}</style></head><body style="width:636px;height:1048px;position:relative;background:${s.color}">
    <div style="position:absolute;left:44px;top:34px" class="brand">${brand}주식으로 10억 모으기</div>
    <div style="position:absolute;left:44px;right:36px;top:100px"><p class="label">${s.label}</p><h1 style="font-size:46px">${s.title}</h1><p class="sub">${s.sub}</p></div>
    ${panel(s, 36, 350, 564, 585)}
    <div style="position:absolute;left:44px;right:36px;bottom:32px"><p class="foot">${s.foot}</p><p class="legal" style="margin-top:10px">${legal}</p></div>
    <span class="page" style="position:absolute;right:36px;top:42px">0${i} / 05</span></body></html>`;
  const wide = (s, i) => `<!doctype html><html lang="ko"><head><style>${common}</style></head><body style="width:1504px;height:741px;position:relative;background:${s.color}">
    <div class="brand" style="position:absolute;left:70px;top:48px">${brand}주식으로 10억 모으기</div>
    <div style="position:absolute;left:70px;top:165px;width:690px"><p class="label">${s.label}</p><h1 style="font-size:58px">${s.title}</h1><p class="sub" style="font-size:26px;margin-top:24px">${s.sub}</p><p class="foot" style="margin-top:38px">${s.foot}</p></div>
    ${panel(s, 825, 40, 610, 650)}
    <p class="legal" style="position:absolute;left:70px;bottom:40px">${legal}</p><span class="page" style="position:absolute;left:70px;top:110px">0${i} / 05</span></body></html>`;
  // 로고: store/logo.svg(숫자 10, 2026-10-26 사용자 선택). 600×600 불투명·각진 모서리.
  const logo = `<!doctype html><html><body style="margin:0;width:600px;height:600px">${fs.readFileSync(path.join(OUT, "logo.svg"), "utf8")}</body></html>`;

  const render = async (html, w, h, file) => {
    const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const p = await c.newPage(); await p.setContent(html, { waitUntil: "load" });
    await p.evaluate(async () => {
      await document.fonts.ready;
      for (const panel of document.querySelectorAll(".panel")) {
        const context = panel.querySelector(".context"), image = panel.querySelector("img");
        await image.decode();
        const room = Number(panel.dataset.maxHeight) - context.getBoundingClientRect().height - 56;
        image.style.width = `${Math.min(panel.clientWidth - 40, room * image.naturalWidth / image.naturalHeight)}px`;
      }
    });
    const invalid = await p.evaluate(() => [...document.querySelectorAll(".panel")].some(panel => {
      const box = panel.getBoundingClientRect();
      return box.bottom > innerHeight - (innerWidth === 636 ? 105 : 30) || box.right > innerWidth;
    }));
    if (invalid) throw new Error(`${file}: panel overlaps footer or canvas edge`);
    await p.screenshot({ path: path.join(OUT, file), clip: { x: 0, y: 0, width: w, height: h } }); await c.close();
  };
  await render(logo, 600, 600, "logo-600.png");
  const outputs = [];
  for (const [index, slide] of slides.entries()) {
    const portrait = `shot-${index + 1}-${slide.key}-636x1048.png`;
    const landscape = index === 0 ? "shot-wide-1504x741.png" : `shot-wide-${index + 1}-${slide.key}-1504x741.png`;
    await render(vert(slide, index + 1), 636, 1048, portrait);
    await render(wide(slide, index + 1), 1504, 741, landscape);
    outputs.push(portrait, landscape);
  }
  // Old numbered exports must not get mixed into the new upload set.
  for (const file of fs.readdirSync(OUT).filter(f => /^shot-.*\.png$/.test(f))) {
    if (!outputs.includes(file)) fs.rmSync(path.join(OUT, file));
  }
  const thumbs = outputs.filter(f => !f.includes("wide")).map(f => `<div><img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f)).toString("base64")}" style="width:318px;display:block"><p style="font:12px sans-serif;padding:8px">${f}</p></div>`).join("");
  await render(`<!doctype html><html><body style="margin:0;padding:16px;background:#dbe3e1;display:flex;gap:12px">${thumbs}</body></html>`, 1670, 580, "preview-renewed.png");
  const wideThumbs = outputs.filter(f => f.includes("wide")).map(f => `<div><img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f)).toString("base64")}" style="width:752px;display:block"><p style="font:12px sans-serif;margin:8px">${f}</p></div>`).join("");
  await render(`<!doctype html><html><body style="margin:0;padding:16px;background:#dbe3e1;display:grid;grid-template-columns:752px 752px;gap:16px">${wideThumbs}</body></html>`, 1552, 1260, "preview-wide-renewed.png");
  fs.writeFileSync(path.join(OUT, "capture-notes.json"), JSON.stringify({ capturedAt: new Date().toISOString(), source: "toss/dist + public/data", notes, regions, outputs }, null, 2) + "\n");
  fs.rmSync(path.join(OUT, "screen-analysis.png"), { force: true });
  await browser.close(); server.close();
  console.log("raw captures:", RAW);
  console.log("errors:", errors.length ? "\n" + errors.join("\n") : "none");
  if (errors.length) process.exitCode = 1;
})().catch((e) => { console.error(e); process.exit(1); });
