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
  const errors = [];
  const shots = [
    { name: "home", url: "/", wait: "10억까지 계산하기" },
    { name: "result", url: "/?t=QLD&m=100&d=1&f=m", wait: "계산 저장하기" },
    { name: "clock", url: "/?page=clock", wait: "최근 종가로 계산한 평가액", saved: true },
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

  // 캡션: UX 라이팅 규칙(해요체·느낌표 없음·과거형 가정·추천 표현 금지·'실제 과거 가격' 일괄 표현 금지 — 일부 종목은 상장 전 추정치).
  const caps = {
    home: ["매달 100만원씩 샀다면,<br>10억까지 몇 년 걸렸을까요", "매달·매주·매일 ETF를 샀다면 어땠을지<br>과거 가격과 환율로 계산해요"],
    result: ["처음 10억을 넘기까지<br>얼마나 걸렸을까요", "처음 10억을 넘은 때와 지금 금액,<br>넣은 돈·연평균을 한 화면에서 봐요"],
    clock: ["저장한 계산을<br>새 가격으로 다시 봐요", "저장한 조건과 최근 평가액,<br>넣은 돈을 한 화면에서 확인해요"],
    compare: ["같은 돈, 다른 ETF였다면<br>누가 빨랐을까요", `${TICKER_COUNT}개 ETF를 같은 조건으로 비교해요<br>특정 종목을 추천하지 않아요`],
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
      <div style="display:inline-block;background:${GREEN};color:#fff;font-weight:800;font-size:22px;padding:8px 16px;border-radius:12px">주식으로 10억 부자되기</div>
      <h1 style="margin:28px 0 0;font-size:52px;line-height:1.22;font-weight:800;letter-spacing:-0.02em">10억까지,<br>얼마나 걸렸을까요</h1>
      <p style="margin:22px 0 0;font-size:22px;line-height:1.5;color:${SUB}">ETF를 매달·매주·매일 샀다면 어땠을지<br>과거 가격과 환율로 계산해요.<br>계산을 저장하면 새 가격으로 다시 계산해요.</p>
      <p style="margin:26px 0 0;font-size:16px;line-height:1.5;color:${SUB}">과거 데이터로 계산한 참고용 결과예요.<br>특정 종목을 추천하지 않고, 미래 수익을 보장하지 않아요.</p></div>
    ${phone("home", 280, 620, 60, 30, 8)}${phone("result", 280, 920, 90, 30, 8)}${phone("clock", 280, 1220, 120, 30, 8)}</body></html>`;
  // 로고: store/logo.svg(돈주머니 $, 2026-10-22 사용자 선택). 600×600 불투명·각진 모서리.
  const logo = `<!doctype html><html><body style="margin:0;width:600px;height:600px">${fs.readFileSync(path.join(OUT, "logo.svg"), "utf8")}</body></html>`;

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
