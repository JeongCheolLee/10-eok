import { ImageResponse } from "next/og";
import { bundleToRows, type Bundle } from "@/lib/backtest/types";
import { runToToday } from "@/lib/backtest/simulate";
import { tickerInfo, tickerName, TICKERS } from "@/lib/tickers";
import { eok } from "@/lib/format";

export const runtime = "nodejs";

const DAYS = [1, 5, 10, 15, 25];

function ymK(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  return `${y}년 ${m}월`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const t = (url.searchParams.get("t") || "QLD").toUpperCase();
  const m = parseInt(url.searchParams.get("m") || "100", 10);
  const d = parseInt(url.searchParams.get("d") || "1", 10);
  let g = parseInt(url.searchParams.get("g") || "10", 10);
  if (!Number.isFinite(g) || g < 1 || g > 100) g = 10;
  let lump = parseInt(url.searchParams.get("i") || "0", 10);
  if (!Number.isFinite(lump) || lump < 0 || lump > 1_000_000) lump = 0;
  const lumpPart = lump > 0 ? `처음 ${lump.toLocaleString()}만원 + ` : "";

  const font = await fetch(`${origin}/fonts/Pretendard-Bold.otf`).then((r) => r.arrayBuffer());

  const valid = TICKERS.some((x) => x.symbol === t) && Number.isFinite(m) && m >= 10 && DAYS.includes(d);
  let lead = "과거에 매달 모았다면";
  let big = `${g}억까지 얼마나?`;
  let sub = "실제 과거 가격 + 그날 환율로 백테스트";
  let color = tickerInfo(t).color;

  if (valid) {
    try {
      const b: Bundle = await fetch(`${origin}/data/${t.toLowerCase()}.json`).then((r) => r.json());
      const res = runToToday(bundleToRows(b), { monthlyKRW: m * 10000, initialKRW: lump * 10000, buyDay: d, targetKRW: g * 100_000_000 });
      if (res.reached) {
        lead = `지금 ${g}억이 되려면`;
        big = `${res.years}년 ${res.monthsRem}개월 전부터`;
        sub = `${tickerName(t)}(${t}) · ${lumpPart}매달 ${m}만원 · ${res.series[0] ? ymK(res.series[0].date) : ""}부터 → 지금 ${eok(res.valueKRW)}`;
      } else {
        lead = `${tickerName(t)}(${t}) · ${lumpPart}매달 ${m}만원`;
        big = `아직 ${g}억은 멀어요`;
        sub = `전 구간 모아도 지금 ${eok(res.valueKRW)}`;
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
