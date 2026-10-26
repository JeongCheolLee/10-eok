// 앱 정보용 이미지 생성 — 로고 600×600, 세로 스크린샷 636×1048 ×4, 가로 1504×741 ×1 (콘솔 규격, 2026-10-20 확인)
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
const GREEN = "#02a262", INK = "#191f28", SUB = "#4e5968", TINT = "#eef8f3";
const SAVED_PLAN = { ticker: "SPY", holdings: [{ ticker: "SPY", amount: 100 }], mode: "time", amount: 100, years: 10, lump: 0, freq: "monthly", buyDay: 1, weekday: 1, tracking: false, startDate: "", reinvest: true, tax: false };
const SAVED = JSON.stringify({ v: 3, items: [
  { id: "store-spy", plan: SAVED_PLAN, savedAt: "2026-10-23T00:00:00.000Z" },
  { id: "store-qqq", plan: { ...SAVED_PLAN, ticker: "QQQ", amount: 50, holdings: [{ ticker: "QQQ", amount: 50 }], lump: 1000 }, savedAt: "2026-10-22T00:00:00.000Z" },
] });
// 미니앱 종목 수 = lib/tickers.ts TICKERS 전체(TOSS_TICKERS). TS라 require할 수 없어 항목 수를 센다.
const TICKER_COUNT = (() => {
  const src = fs.readFileSync(path.join(ROOT, "lib", "tickers.ts"), "utf8");
  const body = src.slice(src.indexOf("export const TICKERS"), src.indexOf("];", src.indexOf("export const TICKERS")));
  return (body.match(/\{\s*symbol:\s*"/g) || []).length;
})();
const settled = (page) => page.waitForFunction(() => !document.body.innerText.includes("계산 중"), null, { timeout: 90000 });

(async () => {
  await new Promise((r) => server.listen(4188, r));
  const base = "http://localhost:4188";
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, locale: "ko-KR" });
  const captureHeights = {};
  const errors = [];
  const shots = [
    { name: "home", url: "/", wait: "10억까지 계산하기" },
    { name: "picker", url: "/", wait: "10억까지 계산하기" },
    { name: "result", url: "/?t=SPY&m=100&d=1&f=m", wait: "계산 저장하기" },
    { name: "clock", url: "/?page=clock", wait: "조건을 누르면 그래프와 자세한 결과", saved: true },
    { name: "compare", url: "/?page=compare", wait: "다른 ETF였다면?", saved: true },
  ];
  for (const s of shots) {
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("SafeAreaInsets")) errors.push(`${s.name}: ${m.text().slice(0, 160)}`); });
    if (s.saved) await page.addInitScript((v) => localStorage.setItem("10eok-toss-clock-v1", v), SAVED); else await page.addInitScript(() => localStorage.clear());
    await page.goto(base + s.url, { waitUntil: "load" });
    try { await settled(page); await page.waitForFunction((t) => document.body.innerText.includes(t), s.wait, { timeout: 20000 }); }
    catch (e) { errors.push(`${s.name}: wait failed — ${e.message.split("\n")[0]}`); }
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
    if (s.name === "result") await page.setViewportSize({ width: 390, height: Math.ceil(await page.locator('.result-actions').evaluate(e => e.getBoundingClientRect().bottom + 20)) });
    if (s.name === "compare") {
      await page.locator('#comparison-sort').selectOption('type');
      await page.setViewportSize({ width: 390, height: Math.ceil(await page.locator('.comparison-etf').nth(1).evaluate(e => e.getBoundingClientRect().bottom + 16)) });
    }
    await page.waitForTimeout(100);
    captureHeights[s.name] = page.viewportSize().height;
    await page.screenshot({ path: path.join(RAW, `${s.name}.png`) });
    fs.copyFileSync(path.join(RAW, `${s.name}.png`), path.join(OUT, `screen-${s.name}.png`));
    fs.writeFileSync(path.join(RAW, `${s.name}.txt`), await page.evaluate(() => document.body.innerText));
    await page.close();
  }
  await ctx.close();

  // 캡션: UX 라이팅 규칙(해요체·느낌표 없음·과거형 가정·추천 표현 금지·'실제 과거 가격' 일괄 표현 금지 — 미니앱은 실제 거래 자료만 사용).
  const caps = {
    home: ["월급날마다 모았다면,<br>10억까지 얼마나 걸렸을까요", "궁금한 ETF와 모을 금액을 고르고<br>과거의 결과를 확인해요"],
    result: ["처음 10억을 넘기까지<br>얼마나 걸렸을까요", "얼마씩 샀을 때 몇 년 걸렸는지,<br>이후 평가액과 구분해서 봐요"],
    clock: ["궁금한 조건을<br>하나씩 모아둬요", "저장한 조건을 누르면<br>그래프와 자세한 결과를 볼 수 있어요"],
    compare: ["같은 기간,<br>다른 ETF였다면?", `${TICKER_COUNT}개 ETF를 같은 조건으로 비교해요<br>특정 종목을 추천하지 않아요`],
  };
  const img = (n) => "data:image/png;base64," + fs.readFileSync(path.join(RAW, `${n}.png`)).toString("base64");
  const phone = (n, w, left, top, radius = 40, border = 10) => `<div style="position:absolute;left:${left}px;top:${top}px;width:${w}px;border-radius:${radius}px;border:${border}px solid ${INK};background:#fff;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.18)"><img src="${img(n)}" style="width:100%;display:block"></div>`;
  const fittedPhone = (n, maxWidth, center, top, maxHeight, border = 10) => {
    const w = Math.min(maxWidth, (maxHeight - border * 2) * 390 / captureHeights[n]);
    return phone(n, w, center - (w + border * 2) / 2, top, 30, border);
  };
  const vert = (n) => `<!doctype html><html lang="ko"><body style="margin:0;width:636px;height:1048px;overflow:hidden;position:relative;background:${TINT};font-family:${FONT};color:${INK}">
    <div style="position:absolute;left:0;right:0;top:72px;text-align:center;padding:0 40px">
      <h1 style="margin:0;font-size:38px;line-height:1.28;font-weight:800;letter-spacing:-0.02em">${caps[n][0]}</h1>
      <p style="margin:16px 0 0;font-size:19px;line-height:1.45;color:${SUB}">${caps[n][1]}</p></div>
    ${fittedPhone(n, 350, 318, 300, 720)}</body></html>`;
  const wide = `<!doctype html><html lang="ko"><body style="margin:0;width:1504px;height:741px;overflow:hidden;position:relative;background:${TINT};font-family:${FONT};color:${INK}">
    <div style="position:absolute;left:80px;top:140px;width:500px">
      <div style="display:inline-block;background:${GREEN};color:#fff;font-weight:800;font-size:22px;padding:8px 16px;border-radius:12px">주식으로 10억 모으기</div>
      <h1 style="margin:28px 0 0;font-size:52px;line-height:1.22;font-weight:800;letter-spacing:-0.02em">월급날마다 모았다면,<br><span style="color:${GREEN}">10억까지</span><br>얼마나 걸렸을까요</h1>
      <p style="margin:22px 0 0;font-size:22px;line-height:1.5;color:${SUB}">궁금한 ETF와 모을 금액을 골라요.<br>내 조건으로 과거의 결과를 확인해요.</p>
      <p style="margin:26px 0 0;font-size:16px;line-height:1.5;color:${SUB}">과거 자료로 계산한 결과예요.<br>특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p></div>
    ${fittedPhone("home", 300, 880, 50, 640, 8)}${fittedPhone("picker", 310, 1230, 110, 580, 8)}</body></html>`;
  // 로고: store/logo.svg(돈주머니 $, 2026-10-22 사용자 선택). 600×600 불투명·각진 모서리.
  const logo = `<!doctype html><html><body style="margin:0;width:600px;height:600px">${fs.readFileSync(path.join(OUT, "logo.svg"), "utf8")}</body></html>`;

  const render = async (html, w, h, file) => {
    const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const p = await c.newPage(); await p.setContent(html, { waitUntil: "load" }); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, file), clip: { x: 0, y: 0, width: w, height: h } }); await c.close();
  };
  await render(logo, 600, 600, "logo-600.png");
  // 입력 → 저장 → 비교 → 결과. 구체적인 도달 기간은 마지막 이미지에서만 소개한다.
  let i = 1; for (const n of ["home", "clock", "compare", "result"]) await render(vert(n), 636, 1048, `shot-${i++}-${n}-636x1048.png`);
  await render(wide, 1504, 741, "shot-wide-1504x741.png");
  // 이전 번호의 생성본을 남기면 콘솔에 잘못 올릴 수 있어 새 출력 성공 후 정리한다.
  for (const file of ["shot-2-result-636x1048.png", "shot-3-clock-636x1048.png", "shot-4-compare-636x1048.png"]) fs.rmSync(path.join(OUT, file), { force: true });
  await browser.close(); server.close();
  console.log("raw captures:", RAW);
  console.log("errors:", errors.length ? "\n" + errors.join("\n") : "none");
})().catch((e) => { console.error(e); process.exit(1); });
