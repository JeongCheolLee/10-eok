"use client";
import { useEffect, useRef } from "react";

type Pt = { date: string; valueKRW: number };

/** 5천 포인트는 무거우니 표시용 다운샘플(균등 + 마지막 보존). */
function downsample(pts: Pt[], max: number): Pt[] {
  if (pts.length <= max) return pts;
  const step = (pts.length - 1) / (max - 1);
  const out: Pt[] = [];
  for (let i = 0; i < max; i++) out.push(pts[Math.round(i * step)]);
  out[out.length - 1] = pts[pts.length - 1];
  return out;
}

export function GrowthChart({
  series,
  target,
  reached,
}: {
  series: Pt[];
  target: number;
  reached: boolean;
}) {
  const W = 360, H = 128, pad = 8;
  const lineRef = useRef<SVGPathElement>(null);

  const pts = downsample(series, 140);
  const maxV = Math.max(target, ...pts.map((p) => p.valueKRW)) * 1.06 || 1;
  const x = (i: number) => (pts.length <= 1 ? 0 : (i / (pts.length - 1)) * W);
  const y = (v: number) => H - (v / maxV) * (H - pad);
  const targetY = H - (target / maxV) * (H - pad);

  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.valueKRW).toFixed(1)}`).join(" ");
  const area = pts.length ? `${d} L${W},${H} L0,${H} Z` : "";
  const lastI = pts.length - 1;
  const dotX = x(lastI);
  const dotY = y(pts[lastI]?.valueKRW ?? 0);

  // 마운트/데이터 변경 시 좌→우 그리기
  useEffect(() => {
    const L = lineRef.current;
    if (!L) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = L.getTotalLength();
    if (reduce) {
      L.style.strokeDasharray = "none";
      L.style.strokeDashoffset = "0";
      return;
    }
    L.style.transition = "none";
    L.style.strokeDasharray = String(len);
    L.style.strokeDashoffset = String(len);
    const raf = requestAnimationFrame(() => {
      L.style.transition = "stroke-dashoffset 1s ease";
      L.style.strokeDashoffset = "0";
    });
    return () => cancelAnimationFrame(raf);
  }, [d]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 128 }}>
      <line x1="0" y1={targetY} x2={W} y2={targetY} stroke="#4a4a4a" strokeWidth="1" strokeDasharray="3 4" />
      <defs>
        <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1ed760" stopOpacity="0.38" />
          <stop offset="1" stopColor="#1ed760" stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={area} fill="url(#gfill)" />}
      <path ref={lineRef} d={d} fill="none" stroke="#1ed760" strokeWidth="2.5" strokeLinecap="round" />
      {reached && <circle cx={dotX} cy={dotY} r="4" fill="#fff" stroke="#1ed760" strokeWidth="2.5" className="pulse" />}
      <circle cx={dotX} cy={dotY} r="4" fill="#fff" stroke="#1ed760" strokeWidth="2.5" />
    </svg>
  );
}
