import { ImageResponse } from "next/og";
import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import { runToToday, requiredMonthly, monthsBetween } from "@/lib/backtest/simulate";
import { tickerInfo, tickerName, tickerCurrency } from "@/lib/tickers";
import { isAllLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { getMarket } from "@/lib/i18n/markets";
import { getFormatter } from "@/lib/i18n/format";
import { getOgCopy } from "@/lib/content/og";

export const runtime = "nodejs";

function startMonthsAgo(end: string, n: number): string {
  let [y, m] = end.split("-").map(Number);
  m -= n;
  while (m <= 0) { m += 12; y -= 1; }
  return `${y}-${String(m).padStart(2, "0")}-01`;
}

// ja는 Pretendard가 가나·한자를 커버하지 않으므로 렌더 텍스트에 맞춘 Noto Sans JP 서브셋을
// Google Fonts에서 동적으로 가져온다(실패 시 Pretendard 폴백 — 최악의 경우 두부글자지만 이미지는 생성).
async function loadNotoJP(text: string): Promise<ArrayBuffer> {
  const api = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(text)}`;
  // 구형 UA로 요청해 woff2 대신 truetype/opentype을 받는다(satori는 woff2 미지원 가능성).
  const css = await fetch(api, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Version/5.1 Safari/534.30" },
  }).then((r) => r.text());
  const m = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/);
  if (!m) throw new Error("noto jp: no ttf url in css");
  const res = await fetch(m[1]);
  if (!res.ok) throw new Error("noto jp: font fetch failed");
  return res.arrayBuffer();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const lParam = url.searchParams.get("l") || "";
  const locale: Locale = isAllLocale(lParam) ? lParam : DEFAULT_LOCALE;
  const market = getMarket(locale);
  const fmt = getFormatter(locale);
  const copy = getOgCopy(locale);

  const t = (url.searchParams.get("t") || market.tickers[0]).toUpperCase();
  const mode = url.searchParams.get("mode") === "amt" ? "amount" : "time";
  const m = parseInt(url.searchParams.get("m") || String(market.monthly.default), 10);
  const d = parseInt(url.searchParams.get("d") || "1", 10);
  let g = parseInt(url.searchParams.get("g") || String(market.goal.default), 10);
  if (!Number.isFinite(g) || g < 1 || g > 100) g = market.goal.default;
  let lump = parseInt(url.searchParams.get("i") || "0", 10);
  if (!Number.isFinite(lump) || lump < 0) lump = 0;
  let yrs = parseInt(url.searchParams.get("y") || "10", 10);
  if (!Number.isFinite(yrs) || yrs < 1) yrs = 10;

  const target = g * market.goal.unit;
  const goalStr = fmt.milestone(target);
  const lumpStr = lump > 0 ? copy.lumpLabel(fmt.unitAmount(lump, market.lump.unitLabel)) : "";

  const tickerOk = market.tickers.includes(t) && Number.isFinite(d) && d >= 1 && d <= 31;
  const valid = tickerOk && (mode === "amount" ? true : Number.isFinite(m) && m >= 1);
  const ref = locale === "ko" ? `${tickerName(t)}(${t})` : t;

  let lead = copy.defaultLead;
  let big = copy.defaultBig(goalStr);
  let sub = copy.defaultSub;
  const color = tickerInfo(t).color;

  if (valid) {
    try {
      const isNative = tickerCurrency(t) === market.currency;
      const [px, fxB] = await Promise.all([
        fetch(`${origin}/data/px/${t.toLowerCase()}.json`).then((r) => r.json() as Promise<PxBundle>),
        !isNative && market.fxFile
          ? fetch(`${origin}/data/${market.fxFile}`).then((r) => r.json() as Promise<FxBundle>)
          : Promise.resolve(null),
      ]);
      const rows = composeRows(px, fxB);
      if (mode === "amount") {
        const maxYears = Math.max(1, Math.floor(monthsBetween(rows[0].date, rows[rows.length - 1].date) / 12));
        const yUsed = Math.min(yrs, maxYears);
        const startDate = startMonthsAgo(rows[rows.length - 1].date, yUsed * 12);
        const { monthly, result } = requiredMonthly(rows, { monthly: 0, initial: lump * market.lump.unit, buyDay: d, startDate, target });
        lead = copy.amountLead(yUsed, goalStr);
        big = monthly === 0 ? copy.amountBigLump : copy.amountBig(fmt.amount(monthly));
        sub = copy.amountSub(ref, lumpStr, fmt.money(result.principal), fmt.money(result.value));
      } else {
        const res = runToToday(rows, { monthly: m * market.monthly.unit, initial: lump * market.lump.unit, buyDay: d, target });
        const monthlyStr = fmt.unitAmount(m, market.monthly.unitLabel);
        if (res.reached) {
          lead = copy.timeLead(goalStr);
          big = copy.timeBig(res.years, res.monthsRem);
          sub = copy.timeSub(ref, monthlyStr, lumpStr, res.series[0] ? fmt.ym(res.series[0].date) : "", fmt.money(res.value));
        } else {
          lead = copy.missLead(ref, monthlyStr, lumpStr);
          big = copy.missBig(goalStr);
          sub = copy.missSub(fmt.money(res.value));
        }
      }
    } catch { /* 기본 카드 유지 */ }
  }

  // 폰트: ko/en/de는 Pretendard(라틴·한글 커버). ja는 Noto Sans JP 서브셋(텍스트 맞춤) 시도.
  const pretendard = await fetch(`${origin}/fonts/Pretendard-Bold.otf`).then((r) => r.arrayBuffer());
  let fontFamily = "Pretendard";
  let fonts: { name: string; data: ArrayBuffer; weight: 700; style: "normal" }[] = [
    { name: "Pretendard", data: pretendard, weight: 700, style: "normal" },
  ];
  if (locale === "ja") {
    try {
      const jp = await loadNotoJP(`${lead}${big}${sub}10-eok${t}`);
      fontFamily = "Noto Sans JP";
      fonts = [{ name: "Noto Sans JP", data: jp, weight: 700, style: "normal" }];
    } catch { /* Pretendard 폴백 */ }
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "#121212", color: "#fff", padding: "72px 80px", fontFamily }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: "#1ed760", display: "flex" }} />
          <div style={{ fontSize: 30, fontWeight: 700 }}>10-eok</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 28, background: color, color: "#fff", fontSize: t.length >= 4 ? 18 : 22, fontWeight: 700, marginLeft: 18 }}>{t}</div>
        </div>
        <div style={{ fontSize: 34, color: "#1ed760", fontWeight: 700, marginBottom: 14 }}>{lead}</div>
        <div style={{ fontSize: 116, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>{big}</div>
        <div style={{ fontSize: 30, color: "#b3b3b3", marginTop: 26 }}>{sub}</div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
