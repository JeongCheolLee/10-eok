"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { getFormatter } from "@/lib/i18n/format";

type Pt = { date: string; value: number; principal: number };

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
  locale,
}: {
  series: Pt[];
  target: number;
  reached: boolean;
  locale: Locale;
}) {
  const fmt = getFormatter(locale);
  const W = 360, H = 128, pad = 8;
  const lineRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // 스크럽 중인 표시용 인덱스. null = 손 뗌(최종 결과 표시).
  const [scrubIdx, setScrubIdx] = useState<number | null>(null);

  const pts = useMemo(() => downsample(series, 140), [series]);

  // x축 시간 눈금(적응형): 항상 실제 시간 위치(frac)에 배치, 라벨 4~6개 유지.
  //  · 30개월 이상 → 연도 눈금(step=ceil(년수/5), 끝해 포함)
  //  · 30개월 미만 → 월 눈금({1,2,3,6,12} 중 라벨 5개 이하 되는 최소 간격, 같은 해 반복 시 "N월")
  const xTicks = useMemo(() => {
    const out: { label: string; frac: number; anchor: string }[] = [];
    if (pts.length < 2) return out;
    const first = pts[0].date, last = pts[pts.length - 1].date;
    const fy = Number(first.slice(0, 4)), fm = Number(first.slice(5, 7));
    const ly = Number(last.slice(0, 4)), lm = Number(last.slice(5, 7));
    const totalMonths = (ly - fy) * 12 + (lm - fm);
    const anchorOf = (fr: number) => (fr <= 0.02 ? "0" : fr >= 0.98 ? "-100%" : "-50%");
    // key(YYYY 또는 YYYY-MM) 이상 첫 포인트의 위치 비율
    const fracAt = (key: string, len: number) => {
      let idx = pts.findIndex((p) => p.date.slice(0, len) >= key);
      if (idx < 0) idx = pts.length - 1;
      return idx / (pts.length - 1);
    };
    if (totalMonths >= 30) {
      const step = Math.max(1, Math.ceil((ly - fy) / 5));
      const years: number[] = [];
      for (let y = fy; y <= ly; y += step) years.push(y);
      if (years[years.length - 1] !== ly) {
        if (ly - years[years.length - 1] <= 1) years[years.length - 1] = ly;
        else years.push(ly);
      }
      for (const yr of years) {
        const frac = fracAt(String(yr), 4);
        out.push({ label: String(yr), frac, anchor: anchorOf(frac) });
      }
    } else {
      let ms = 12;
      for (const s of [1, 2, 3, 6, 12]) { ms = s; if (totalMonths / s <= 5) break; }
      let y = fy, m = fm, prevY: number | null = null;
      while (y < ly || (y === ly && m <= lm)) {
        const frac = fracAt(`${y}-${String(m).padStart(2, "0")}`, 7);
        out.push({ label: prevY === y ? `${m}월` : `${y}.${m}`, frac, anchor: anchorOf(frac) });
        prevY = y; m += ms; while (m > 12) { m -= 12; y++; }
      }
    }
    return out;
  }, [pts]);

  const maxV = Math.max(target, ...pts.map((p) => p.value)) * 1.06 || 1;
  const x = (i: number) => (pts.length <= 1 ? 0 : (i / (pts.length - 1)) * W);
  const y = (v: number) => H - (v / maxV) * (H - pad);
  const targetY = H - (target / maxV) * (H - pad);

  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = pts.length ? `${d} L${W},${H} L0,${H} Z` : "";
  const lastI = pts.length - 1;
  const endX = x(lastI);
  const endY = y(pts[lastI]?.value ?? 0);

  // 손을 뗀 기본 상태는 최종 지점, 스크럽 중이면 그 지점.
  const view = scrubIdx != null ? pts[scrubIdx] : pts[lastI];
  const live = scrubIdx != null;
  const dotX = live ? x(scrubIdx) : endX;
  const dotY = live ? y(pts[scrubIdx].value) : endY;

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

  function moveTo(clientX: number) {
    const el = wrapRef.current;
    if (!el || pts.length <= 1) return;
    const rect = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const idx = Math.round(frac * (pts.length - 1));
    setScrubIdx((prev) => (prev === idx ? prev : idx));
  }

  return (
    <div className="growth">
      <div className={"chart-readout" + (live ? " live" : "")} aria-live="off">
        <span className="ro-date">{view ? fmt.ymd(view.date) : ""}</span>
        <span className="ro-vals">
          원금 <b>{fmt.compact(view?.principal ?? 0)}</b> → <b className="up">{fmt.compact(view?.value ?? 0)}</b>
          {view && view.principal > 0 && <span className="ro-badge">{fmt.growth(view.principal, view.value)}</span>}
        </span>
      </div>

      <div
        ref={wrapRef}
        className={"chart-scrub" + (live ? " live" : "")}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); moveTo(e.clientX); }}
        onPointerMove={(e) => { if (e.pointerType !== "touch" || e.buttons) moveTo(e.clientX); }}
        onPointerUp={() => setScrubIdx(null)}
        onPointerCancel={() => setScrubIdx(null)}
        onPointerLeave={(e) => { if (e.pointerType !== "touch") setScrubIdx(null); }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 128, color: "var(--accent)" }} aria-hidden="true">
          <line x1="0" y1={targetY} x2={W} y2={targetY} style={{ stroke: "var(--line-2)" }} strokeWidth="1" strokeDasharray="3 4" />
          <defs>
            <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.38" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {area && <path d={area} fill="url(#gfill)" />}
          <path ref={lineRef} d={d} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {reached && !live && <circle cx={endX} cy={endY} r="4" fill="#fff" stroke="currentColor" strokeWidth="2.5" className="pulse" />}
          <circle cx={dotX} cy={dotY} r="4" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        {live && <div className="chart-hairline" style={{ left: `${(dotX / W) * 100}%` }} />}
      </div>

      {xTicks.length > 0 && (
        <div className="chart-xaxis" aria-hidden="true">
          {xTicks.map((t, i) => (
            <span key={i} style={{ left: `${t.frac * 100}%`, transform: `translateX(${t.anchor})` }}>{t.label}</span>
          ))}
        </div>
      )}

      <div className={"chart-hint" + (live ? " off" : "")}>차트를 짚으면 그때의 결과가 보여요</div>
    </div>
  );
}
