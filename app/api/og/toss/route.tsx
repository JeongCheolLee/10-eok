import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { decodeResultCard, resultCardCopy } from "@/lib/share/resultCard";

export const runtime = "nodejs";
export async function GET(request: Request) {
  const card = decodeResultCard(new URL(request.url).searchParams.get("d"));
  if (!card) return new Response("Invalid result", { status: 400 });
  const copy = resultCardCopy(card);
  const font = await readFile(path.join(process.cwd(), "public/fonts/Pretendard-Bold.otf"));
  const points = card.graph.map((v, i) => `${i * 380 / (card.graph.length - 1)},${210 - v * .19}`).join(" ");
  const titleSize = copy.names.length > 40 ? 24 : copy.names.length > 23 ? 30 : 36;
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f1faf6", color: "#192c25", padding: "38px 52px", fontFamily: "Pretendard" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#008653", fontSize: 22 }}><div style={{ display: "flex", background: "#00a263", color: "white", padding: "6px 10px", borderRadius: 10 }}>10</div>주식으로 10억 모으기</div>
    <div style={{ display: "flex", marginTop: 24, fontSize: titleSize, lineHeight: 1.3 }}>{copy.names}</div>
    <div style={{ display: "flex", marginTop: 8, fontSize: 25, color: "#52675e" }}>{card.kind === "amount" ? card.lump > 0 ? `처음 목돈 ${copy.lump}으로 시작했다면` : "목돈 없이 시작했다면" : copy.condition}</div>
    <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", width: 650 }}>
        <div style={{ display: "flex", fontSize: 27 }}>{copy.label}</div>
        <div style={{ display: "flex", fontSize: copy.value.length > 12 ? 54 : 76, color: "#008653", letterSpacing: -2, marginTop: 8 }}>{copy.value}</div>
        <div style={{ display: "flex", fontSize: 23, color: "#52675e", marginTop: 16 }}>{card.kind === "reach" ? `${card.reached!.replaceAll("-", ".")} 첫 도달` : `넣은 돈 ${copy.principal}`}</div>
        {card.lump > 0 && card.kind !== "amount" && <div style={{ display: "flex", fontSize: 20, color: "#52675e", marginTop: 6 }}>처음 목돈 {copy.lump} 포함</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 380 }}>
        <div style={{ display: "flex", fontSize: 20, color: "#52675e", marginBottom: 8 }}>평가액 흐름</div>
        <svg width="380" height="220" viewBox="0 0 380 220"><line x1="0" y1="210" x2="380" y2="210" stroke="#c9dfd3" strokeWidth="2" /><polygon points={`0,210 ${points} 380,210`} fill="#d3f1e2" /><polyline points={points} fill="none" stroke="#009b60" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" /></svg>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #d3e5dc", paddingTop: 16, gap: 6, fontSize: 20, color: "#52675e" }}>
      <div style={{ display: "flex" }}>{copy.dates} · {card.reinvest ? "배당 재투자" : "배당 미반영"} · 세금·수수료 제외</div>
      <div style={{ display: "flex", fontSize: 18 }}>과거 자료로 계산한 결과예요. 미래 수익을 보장하지 않아요.</div>
    </div>
  </div>, { width: 1200, height: 600, fonts: [{ name: "Pretendard", data: font, weight: 700 }], headers: { "Cache-Control": "public, max-age=31536000, immutable", "X-Robots-Tag": "noindex" } });
}
