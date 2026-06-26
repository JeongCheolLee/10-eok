import { ImageResponse } from "next/og";
import { bundleToRows, type Bundle } from "@/lib/backtest/types";
import { runToToday, requiredMonthly, monthsBetween } from "@/lib/backtest/simulate";
import { tickerInfo, tickerName, TICKERS } from "@/lib/tickers";
import { eok } from "@/lib/format";

export const runtime = "nodejs";

function ymK(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  return `${y}년 ${m}월`;
}
function startMonthsAgo(end: string, n: number): string {
  let [y, m] = end.split("-").map(Number);
  m -= n;
  while (m <= 0) { m += 12; y -= 1; }
  return `${y}-${String(m).padStart(2, "0")}-01`;
}
function manwon(won: number): string {
  if (won >= 100_000_000) return `${Math.round(won / 10_000_000) / 10}억`;
  return `${Math.round(won / 10_000).toLocaleString()}만원`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const t = (url.searchParams.get("t") || "QLD").toUpperCase();
  const mode = url.searchParams.get("mode") === "amt" ? "amount" : "time";
  const m = parseInt(url.searchParams.get("m") || "100", 10);
  const d = parseInt(url.searchParams.get("d") || "1", 10);
  let g = parseInt(url.searchParams.get("g") || "10", 10);
  if (!Number.isFinite(g) || g < 1 || g > 100) g = 10;
  let lump = parseInt(url.searchParams.get("i") || "0", 10);
  if (!Number.isFinite(lump) || lump < 0) lump = 0;
  let yrs = parseInt(url.searchParams.get("y") || "10", 10);
  if (!Number.isFinite(yrs) || yrs < 1) yrs = 10;

  const font = await fetch(`${origin}/fonts/Pretendard-Bold.otf`).then((r) => r.arrayBuffer());

  const tickerOk = TICKERS.some((x) => x.symbol === t) && Number.isFinite(d) && d >= 1 && d <= 31;
  const valid = tickerOk && (mode === "amount" ? true : Number.isFinite(m) && m >= 10);
  let lead = "과거에 매달 모았다면";
  let big = `${g}억까지 얼마나?`;
  let sub = "실제 과거 가격 + 그날 환율로 백테스트";
  let color = tickerInfo(t).color;

  if (valid) {
    try {
      const b: Bundle = await fetch(`${origin}/data/${t.toLowerCase()}.json`).then((r) => r.json());
      const rows = bundleToRows(b);
      const lumpLabel = lump > 0 ? ` · 초기 ${lump}만원` : "";
      if (mode === "amount") {
        const maxYears = Math.max(1, Math.floor(monthsBetween(rows[0].date, rows[rows.length - 1].date) / 12));
        const yUsed = Math.min(yrs, maxYears);
        const startDate = startMonthsAgo(rows[rows.length - 1].date, yUsed * 12);
        const { monthlyKRW, result } = requiredMonthly(rows, { monthlyKRW: 0, initialKRW: lump * 10000, buyDay: d, startDate, targetKRW: g * 100_000_000 });
        lead = `${yUsed}년 안에 ${g}억 모으려면`;
        big = monthlyKRW === 0 ? "초기금만으로 달성!" : `매달 ${manwon(monthlyKRW)}`;
        sub = `${tickerName(t)}(${t}) 기준${lumpLabel} · 원금 ${eok(result.principalKRW)} → ${eok(result.valueKRW)}`;
      } else {
        const res = runToToday(rows, { monthlyKRW: m * 10000, initialKRW: lump * 10000, buyDay: d, targetKRW: g * 100_000_000 });
        if (res.reached) {
          lead = `지금 ${g}억이 되려면`;
          big = `${res.years}년 ${res.monthsRem}개월 전부터`;
          sub = `${tickerName(t)}(${t}) · 매달 ${m}만원${lumpLabel} · ${res.series[0] ? ymK(res.series[0].date) : ""}부터 → 지금 ${eok(res.valueKRW)}`;
        } else {
          lead = `${tickerName(t)}(${t}) · 매달 ${m}만원${lumpLabel}`;
          big = `아직 ${g}억은 멀어요`;
          sub = `전 구간 모아도 지금 ${eok(res.valueKRW)}`;
        }
      }
    } catch { /* 기본 카드 유지 */ }
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "#121212", color: "#fff", padding: "72px 80px", fontFamily: "Pretendard" }}>
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
    { width: 1200, height: 630, fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }] },
  );
}
