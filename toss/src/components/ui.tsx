import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { TICKERS, tickerInfo, tickerMonogram, tickerTitle, tickerSubtitle } from "@/lib/tickers";
import { attachBanner, inToss } from "../lib/platform";

/* ── 아이콘 (모노톤 스트로크) ── */
const I = ({ d, fill }: { d: string; fill?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const ChevronLeft = () => <I d="M15 5l-7 7 7 7" />;
export const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>;
export const Dots = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>;
export const XIcon = () => <I d="M6 6l12 12M18 6L6 18" />;
export const Check = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>;
export const ArrowDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" /></svg>;
export const ArrowUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>;

/* ── 네비게이션 바 (토스 SDK가 그리는 영역의 프로토타입. 실제 앱에선 granite.config navigationBar) ── */
export function NavBar({ back, onMenu, onClose, title = "10억 모으기" }: { back?: () => void; onMenu: () => void; onClose: () => void; title?: string }) {
  if (inToss) return null; // 토스 앱이 네비게이션 바를 그린다 (apps-in-toss.config navigationBar)
  return (
    <header className="nav">
      {back && <button type="button" className="icon-btn" aria-label="뒤로" onClick={back}><ChevronLeft /></button>}
      <span className="nav-logo" aria-hidden="true">10</span>
      <div className="nav-title">{title}</div>
      <button type="button" className="icon-btn" aria-label="더보기" onClick={onMenu}><Dots /></button>
      <button type="button" className="icon-btn" aria-label="닫기" onClick={onClose}><XIcon /></button>
    </header>
  );
}

/* ── 시계 링 (C 시안 모티프: 10억까지 진행률) ── */
export function Ring({ size = 112, stroke = 9, progress, children }: { size?: number; stroke?: number; progress: number; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  const cx = size / 2;
  const ticks = [0, 90, 180, 270];
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--brand-weak-2)" strokeWidth={stroke} />
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--brand)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} transform={`rotate(-90 ${cx} ${cx})`} className="ring-arc" />
        {ticks.map((a) => (
          <line key={a} x1={cx} y1={stroke + 4} x2={cx} y2={stroke + 9} stroke="var(--brand-strong)" strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} ${cx} ${cx})`} opacity="0.5" />
        ))}
      </svg>
      <div className="ring-inner">{children}</div>
    </div>
  );
}

/* ── 자산 성장 차트 ── */
type Pt = { date: string; value: number; principal: number };
function downsample(pts: Pt[], max: number): Pt[] {
  if (pts.length <= max) return pts;
  const step = (pts.length - 1) / (max - 1);
  const out: Pt[] = [];
  for (let i = 0; i < max; i++) out.push(pts[Math.round(i * step)]);
  out[out.length - 1] = pts[pts.length - 1];
  return out;
}
function niceStep(maxV: number): number {
  for (const s of [1e8, 2e8, 2.5e8, 5e8, 1e9, 2e9, 2.5e9, 5e9, 1e10]) if (maxV / s <= 4) return s;
  return 2e10;
}
export function Chart({ series, target }: { series: Pt[]; target: number }) {
  const pts = useMemo(() => downsample(series, 120), [series]);
  const W = 360, H = 170, L = 38, R = 10, T = 14, B = 24;
  if (pts.length < 2) return null;
  const maxRaw = Math.max(target, ...pts.map((p) => p.value)) * 1.05;
  const step = niceStep(maxRaw);
  const maxV = Math.ceil(maxRaw / step) * step;
  const x = (i: number) => L + (i / (pts.length - 1)) * (W - L - R);
  const y = (v: number) => T + (H - T - B) * (1 - v / maxV);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const dp = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.principal).toFixed(1)}`).join(" ");
  const base = (H - B).toFixed(1);
  const area = `${d} L${x(pts.length - 1).toFixed(1)},${base} L${L},${base} Z`;
  const yTicks: number[] = [];
  for (let v = 0; v <= maxV + 1; v += step) yTicks.push(v);
  const fy = Number(pts[0].date.slice(0, 4)), ly = Number(pts[pts.length - 1].date.slice(0, 4));
  const ystep = Math.max(1, Math.ceil((ly - fy) / 5));
  const xTicks: { yr: number; x: number; anchor: "start" | "middle" | "end" }[] = [];
  for (let yr = fy; yr <= ly; yr += ystep) {
    let idx = pts.findIndex((p) => p.date >= `${yr}-01-01`);
    if (idx < 0) idx = pts.length - 1;
    const px = x(idx);
    xTicks.push({ yr, x: px, anchor: px < L + 14 ? "start" : px > W - R - 14 ? "end" : "middle" });
  }
  const last = pts[pts.length - 1];
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${pts[0].date.slice(0, 4)}년부터 ${ly}년까지 평가액과 넣은 돈의 변화`}>
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--grey200)" strokeWidth="1" />
          <text x={L - 6} y={y(v) + 3.5} textAnchor="end" fontSize="10" fill="var(--grey500)">{v === 0 ? "0" : `${v / 1e8}억`}</text>
        </g>
      ))}
      <line x1={L} x2={W - R} y1={y(target)} y2={y(target)} stroke="var(--grey500)" strokeWidth="1.2" strokeDasharray="4 4" />
      <text x={L + 4} y={y(target) - 4} textAnchor="start" fontSize="10" fill="var(--grey600)">목표 {target / 1e8}억</text>
      <path d={area} fill="var(--brand)" fillOpacity="0.13" />
      <path d={dp} fill="none" stroke="var(--grey500)" strokeWidth="1.5" />
      <path d={d} fill="none" stroke="var(--brand)" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx={x(pts.length - 1)} cy={y(last.value)} r="4.5" fill="var(--brand)" stroke="#fff" strokeWidth="2" />
      {xTicks.map((t) => (
        <text key={t.yr} x={t.x} y={H - 7} textAnchor={t.anchor} fontSize="10" fill="var(--grey500)">{t.yr}</text>
      ))}
    </svg>
  );
}

/* ── 숫자 스테퍼 + 프리셋 칩 ── */
export function Stepper({ id, label, value, unit, min, max, step, chips, chipLabel, onChange, accent }: {
  id: string; label: string; value: number; unit: string; min: number; max: number; step: number;
  chips?: number[]; chipLabel?: (v: number) => string; onChange: (v: number) => void; accent?: boolean;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => { setText(String(value)); }, [value]);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const commit = () => { const n = parseInt(text.replace(/[^0-9]/g, ""), 10); onChange(Number.isFinite(n) ? clamp(n) : value); };
  return (
    <>
      <div className="row">
        <label htmlFor={id} className="field">
          <span className={"field-label" + (accent ? " brand" : "")}>{label}</span>
          <span className="field-value-wrap">
            <input id={id} className="field-input" inputMode="numeric" value={text} onChange={(e) => setText(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} style={{ width: `${Math.max(2, text.length + 0.5)}ch` }} />
            <span className="unit">{unit}</span>
          </span>
        </label>
        <div className="stepper-btns">
          <button type="button" className="stepper-btn" aria-label={`${label} 줄이기`} onClick={() => onChange(clamp(value - step))}>−</button>
          <button type="button" className="stepper-btn" aria-label={`${label} 늘리기`} onClick={() => onChange(clamp(value + step))}>+</button>
        </div>
      </div>
      {chips && (
        <div className="chips">
          {chips.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={c === value} onClick={() => onChange(c)}>{chipLabel ? chipLabel(c) : `${c}${unit}`}</button>
          ))}
        </div>
      )}
    </>
  );
}

/* ── 스위치 행 (ListRow right=Switch) ── */
export function SwitchRow({ id, title, desc, checked, onChange, disabled }: { id: string; title: string; desc?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={"switch-row" + (disabled ? " disabled" : "")} htmlFor={id}>
      <span className="field"><span className="row-title">{title}</span>{desc && <span className="row-desc">{desc}</span>}</span>
      <input id={id} type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch" aria-hidden="true"><span className="knob" /></span>
    </label>
  );
}

/* ── 바텀시트: 종목 선택 (검색) ── */
export function TickerSheet({ current, onPick, onClose }: { current: string; onPick: (t: string) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const list = TICKERS.filter((t) => !q || t.symbol.toLowerCase().includes(q.toLowerCase()) || t.name.includes(q));
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label="종목 선택" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-head">
          <div className="sheet-title">어떤 종목을 모을까요?</div>
          <input ref={ref} className="search" placeholder="종목 검색" value={q} onChange={(e) => setQ(e.target.value)} aria-label="종목 검색" />
        </div>
        <div className="sheet-list">
          {list.map((t) => (
            <button key={t.symbol} type="button" className="list-row list-btn" aria-pressed={t.symbol === current} onClick={() => onPick(t.symbol)}>
              <span className="avatar" style={{ background: t.color }}>{tickerMonogram(t.symbol)}</span>
              <span className="field"><span className="row-title">{tickerTitle(t.symbol)}</span><span className="row-desc">{tickerSubtitle(t.symbol)}{t.splice ? " · 상장 전은 추정치" : ""}{t.shortHistory ? " · 데이터가 짧아요" : ""}</span></span>
              {t.symbol === current && <span className="brand-text" aria-hidden="true"><Check /></span>}
            </button>
          ))}
          {list.length === 0 && <div className="empty">검색 결과가 없어요</div>}
        </div>
        <div className="sheet-foot"><button type="button" className="btn dark-weak md" onClick={onClose}>닫기</button></div>
      </div>
    </div>
  );
}

/* ── ⋯ 메뉴 (토스 기본 메뉴의 프로토타입: 공유·신고·알림 등은 토스가 제공) ── */
export function Menu({ items, onClose }: { items: { label: string; onClick: () => void; danger?: boolean }[]; onClose: () => void }) {
  return (
    <div className="menu-backdrop" onClick={onClose}>
      <div className="menu" role="menu" onClick={(e) => e.stopPropagation()}>
        {items.map((it) => (
          <button key={it.label} type="button" role="menuitem" className={"menu-item" + (it.danger ? " danger" : "")} onClick={() => { it.onClick(); onClose(); }}>{it.label}</button>
        ))}
      </div>
    </div>
  );
}

/* ── 보상형 광고 모의 (토스: loadFullScreenAd → showFullScreenAd → userEarnedReward) ── */
export function AdGate({ onReward, onClose }: { onReward: () => void; onClose: () => void }) {
  const [left, setLeft] = useState(3);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <div className="ad-modal" role="dialog" aria-modal="true" aria-label="보상형 광고">
      <div className="ad-box">
        <div className="ad-badge">AD</div>
        <div className="ad-title">광고 미리보기</div>
        <div className="ad-desc">미니앱에서는 토스 보상형 광고가 여기에 나와요. 끝까지 보면 분석이 열려요.</div>
        <div className="ad-timer" aria-live="polite">{left > 0 ? `${left}초 남았어요` : "다 봤어요"}</div>
        <div className="ad-actions">
          {left > 0 ? <button type="button" className="btn dark-weak md" onClick={onClose}>닫기</button> : <button type="button" className="btn md" onClick={onReward}>분석 열기</button>}
        </div>
      </div>
    </div>
  );
}

export function Toast({ msg }: { msg: string }) {
  return msg ? <div className="toast" role="status">{msg}</div> : null;
}

export function Avatar({ symbol, size = 36 }: { symbol: string; size?: number }) {
  const info = tickerInfo(symbol);
  return <span className="avatar" style={{ background: info.color, width: size, height: size, fontSize: size <= 28 ? 9 : 10 }}>{tickerMonogram(symbol)}</span>;
}

/* ── 배너 광고 슬롯: 토스에서는 TossAds.attachBanner, 밖에서는 자리만 ── */
export function AdSlot() {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let on = true;
    let dispose: (() => void) | null = null;
    if (ref.current) {
      attachBanner(ref.current).then((d) => { if (!on) { d?.(); return; } dispose = d; setLive(!!d); });
    }
    return () => { on = false; dispose?.(); };
  }, []);
  return (
    <div className={"ad-slot" + (live ? " live" : "")} role="region" aria-label="광고">
      <div ref={ref} className="ad-target" />
      {!live && <><span className="ad-badge">AD</span><span>광고 자리 · 토스 배너 96px</span></>}
    </div>
  );
}
