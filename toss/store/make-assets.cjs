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
const SAVED = JSON.stringify({ v: 1, plan: { ticker: "QLD", mode: "time", amount: 100, years: 10, lump: 0, freq: "monthly", buyDay: 1, weekday: 1, tracking: false, startDate: "", reinvest: true, tax: false }, savedAt: "2026-10-20T00:00:00.000Z" });
const settled = (page) => page.waitForFunction(() => !document.body.innerText.includes("계산 중"), null, { timeout: 90000 });

(async () => {
  await new Promise((r) => server.listen(4188, r));
  const base = "http://localhost:4188";
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, locale: "ko-KR" });
  const errors = [];
  const shots = [
    { name: "home", url: "/", wait: "10억까지 계산하기" },
    { name: "result", url: "/?t=QLD&m=100&d=1&f=m", wait: "내 10억 시계로 저장하기" },
    { name: "clock", url: "/?page=clock", wait: "어제보다", saved: true },
    { name: "compare", url: "/?page=compare", wait: "누가 빨랐을까요" },
  ];
  for (const s of shots) {
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("SafeAreaInsets")) errors.push(`${s.name}: ${m.text().slice(0, 160)}`); });
    if (s.saved) await page.addInitScript((v) => localStorage.setItem("10eok-toss-clock-v1", v), SAVED); else await page.addInitScript(() => localStorage.clear());
    await page.goto(base + s.url, { waitUntil: "load" });
    try { await settled(page); await page.waitForFunction((t) => document.body.innerText.includes(t), s.wait, { timeout: 20000 }); }
    catch (e) { errors.push(`${s.name}: wait failed — ${e.message.split("\n")[0]}`); }
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(RAW, `${s.name}.png`) });
    fs.writeFileSync(path.join(RAW, `${s.name}.txt`), await page.evaluate(() => document.body.innerText));
    await page.close();
  }
  await ctx.close();

  // 캡션: UX 라이팅 규칙(해요체·느낌표 없음·과거형 가정·추천 표현 금지). 종목 수는 lib/i18n/markets.ts ko 목록(16)과 맞춘다.
  const caps = {
    home: ["매달 100만원이면,<br>10억까지 몇 년일까요", "매달·매주·매일 ETF를 샀다면 어땠을지<br>실제 과거 가격과 그날 환율로 계산해요"],
    result: ["넣은 돈·평가액·연평균을<br>한 화면에서 봐요", "배당 재투자와 양도세 반영 여부도<br>직접 고를 수 있어요"],
    clock: ["내 10억 시계,<br>어제보다 얼마나 가까워졌을까요", "저장해 두면 매일 아침 전날 종가로<br>다시 계산해요"],
    compare: ["같은 돈, 다른 ETF였다면<br>누가 빨랐을까요", "16개 ETF를 같은 조건으로 비교해요<br>특정 종목을 추천하지 않아요"],
  };
  const img = (n) => "data:image/png;base64," + fs.readFileSync(path.join(RAW, `${n}.png`)).toString("base64");
  const phone = (n, w, left, top, radius = 40, border = 10) => `<div style="position:absolute;left:${left}px;top:${top}px;width:${w}px;border-radius:${radius}px;border:${border}px solid ${INK};background:#fff;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.18)"><img src="${img(n)}" style="width:100%;display:block"></div>`;
  const vert = (n) => `<!doctype html><html lang="ko"><body style="margin:0;width:636px;height:1048px;overflow:hidden;position:relative;background:${TINT};font-family:${FONT};color:${INK}">
    <div style="position:absolute;left:0;right:0;top:72px;text-align:center;padding:0 40px">
      <h1 style="margin:0;font-size:38px;line-height:1.28;font-weight:800;letter-spacing:-0.02em">${caps[n][0]}</h1>
      <p style="margin:16px 0 0;font-size:19px;line-height:1.45;color:${SUB}">${caps[n][1]}</p></div>
    ${phone(n, 480, 78, 300)}</body></html>`;
  const wide = `<!doctype html><html lang="ko"><body style="margin:0;width:1504px;height:741px;overflow:hidden;position:relative;background:${TINT};font-family:${FONT};color:${INK}">
    <div style="position:absolute;left:80px;top:140px;width:500px">
      <div style="display:inline-block;background:${GREEN};color:#fff;font-weight:800;font-size:22px;padding:8px 16px;border-radius:12px">10억 모으기</div>
      <h1 style="margin:28px 0 0;font-size:52px;line-height:1.22;font-weight:800;letter-spacing:-0.02em">10억까지,<br>얼마나 걸릴까요</h1>
      <p style="margin:22px 0 0;font-size:22px;line-height:1.5;color:${SUB}">ETF를 매달·매주·매일 샀다면 어땠을지<br>실제 과거 가격과 환율로 계산해요.<br>저장하면 매일 아침 내 10억 시계가 다시 계산해요.</p>
      <p style="margin:26px 0 0;font-size:16px;line-height:1.5;color:${SUB}">과거 데이터로 계산한 참고용 결과예요.<br>특정 종목을 추천하지 않고, 미래 수익을 보장하지 않아요.</p></div>
    ${phone("home", 280, 620, 60, 30, 8)}${phone("result", 280, 920, 90, 30, 8)}${phone("clock", 280, 1220, 120, 30, 8)}</body></html>`;
  const logo = `<!doctype html><html><body style="margin:0;width:600px;height:600px;background:${GREEN};display:flex;align-items:center;justify-content:center;font-family:${FONT}">
    <svg width="600" height="600" viewBox="0 0 600 600"><circle cx="300" cy="300" r="214" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="34"/>
      <circle cx="300" cy="300" r="214" fill="none" stroke="#fff" stroke-width="34" stroke-linecap="round" stroke-dasharray="${(2*Math.PI*214*0.72).toFixed(1)} ${(2*Math.PI*214).toFixed(1)}" transform="rotate(-90 300 300)"/>
      <text x="300" y="306" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family='${FONT}' font-weight="800" font-size="160" letter-spacing="-4">10억</text></svg></body></html>`;

  const render = async (html, w, h, file) => {
    const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const p = await c.newPage(); await p.setContent(html, { waitUntil: "load" }); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, file), clip: { x: 0, y: 0, width: w, height: h } }); await c.close();
  };
  await render(logo, 600, 600, "logo-600.png");
  let i = 1; for (const n of ["home", "result", "clock", "compare"]) await render(vert(n), 636, 1048, `shot-${i++}-${n}-636x1048.png`);
  await render(wide, 1504, 741, "shot-wide-1504x741.png");
  await browser.close(); server.close();
  console.log("raw captures:", RAW);
  console.log("errors:", errors.length ? "\n" + errors.join("\n") : "none");
})().catch((e) => { console.error(e); process.exit(1); });
