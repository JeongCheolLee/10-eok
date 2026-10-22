import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { TICKERS, tickerInfo, tickerMonogram, tickerTitle } from "@/lib/tickers";
import { GROUPS, tickerGroup, tossSubtitle } from "../lib/groups";
import { attachBanner, inToss } from "../lib/platform";
import { fmt, ymKo } from "../lib/fmt";

/* ── 아이콘 (모노톤 스트로크) ── */
const I = ({ d, fill }: { d: string; fill?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const ChevronLeft = () => <I d="M15 5l-7 7 7 7" />;
export const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>;
export const Dots = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>;
export const XIcon = () => <I d="M6 6l12 12M18 6L6 18" />;
export const ChevronDown = () => <svg className="chev-down" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>;
export const Check = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>;
export const ArrowDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" /></svg>;
export const ArrowUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>;

/* ── 네비게이션 바 (토스 SDK가 그리는 영역의 프로토타입. 실제 앱에선 granite.config navigationBar) ── */
/** 앱 로고(돈주머니 $). store/logo.svg·public/favicon.svg와 같은 그림. 토스 안에서는 콘솔에 올린 로고를 토스 네비바가 그린다. */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg className="nav-logo" width={size} height={size} viewBox="0 0 600 600" aria-hidden="true">
      <rect width="600" height="600" fill="#02a262" />
      <path d="M224 119H376L340 204H260Z" fill="#ffe394" />
      <path d="M250 205C216 246 140 300 140 384C140 455 203 481 300 481C397 481 460 455 460 384C460 300 384 246 350 205Z" fill="#f5b700" />
      <path d="M350 205C384 246 460 300 460 384C460 455 397 481 300 481C368 460 398 425 398 374C398 310 366 251 331 205Z" fill="#d5960e" />
      <path d="M249 211H351" fill="none" stroke="#123c2d" strokeWidth="28" strokeLinecap="round" />
      <circle cx="300" cy="353" r="72" fill="#fff0bc" />
      <path d="M300 300V406M327 325C320 314 309 310 297 310C281 310 270 319 270 332C270 362 330 344 330 374C330 388 317 397 300 397C285 397 273 391 267 380" fill="none" stroke="#9a6a05" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NavBar({ back, onMenu, onClose, title = "10억 모으기" }: { back?: () => void; onMenu: () => void; onClose: () => void; title?: string }) {
  if (inToss) return null; // 토스 앱이 네비게이션 바를 그린다 (apps-in-toss.config navigationBar)
  return (
    <header className="nav">
      {back && <button type="button" className="icon-btn" aria-label="뒤로" onClick={back}><ChevronLeft /></button>}
      <LogoMark />
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
/** mark: 처음 target을 넘은 날(있으면 그 지점에 테두리 점). */
export function Chart({ series, target, mark }: { series: Pt[]; target: number; mark?: string }) {
  const pts = useMemo(() => downsample(series, 120), [series]);
  const [hi, setHi] = useState<number | null>(null); // 손가락·마우스가 가리키는 점
  const W = 360, H = 170, L = 38, R = 10, T = 14, B = 24;
  if (pts.length < 2) return null;
  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((vx - L) / (W - L - R)) * (pts.length - 1));
    setHi(Math.max(0, Math.min(pts.length - 1, i)));
  };
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
  // 도달 지점: 다운샘플된 점 중 mark 이후 첫 점(그날 값이 target 이상이 되도록 원본에서 찾는다)
  const markPt = mark ? series.find((p) => p.date >= mark) : undefined;
  const markI = markPt ? pts.findIndex((p) => p.date >= markPt.date) : -1;
  const h = hi != null ? pts[hi] : null;
  const hx = hi != null ? x(hi) : 0;
  const tipOnLeft = hx > W / 2; // 가리키는 점 반대편 위쪽에 말풍선을 띄워 겹치지 않게
  return (
    <div className="chart-wrap">
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img"
      onPointerDown={pick} onPointerMove={pick} onPointerLeave={() => setHi(null)} onPointerUp={(e) => { if (e.pointerType !== "mouse") setHi(null); }} onPointerCancel={() => setHi(null)} aria-label={`${pts[0].date.slice(0, 4)}년부터 ${ly}년까지 평가액과 넣은 돈의 변화`}>
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
      {markPt && markI >= 0 && (
        <g pointerEvents="none">
          <circle cx={x(markI)} cy={y(markPt.value)} r="6" fill="#fff" stroke="var(--brand-strong, var(--brand))" strokeWidth="2.5" />
          <text x={x(markI)} y={y(markPt.value) - 10} textAnchor={x(markI) > W - 50 ? "end" : x(markI) < L + 40 ? "start" : "middle"} fontSize="10" fontWeight="600" fill="var(--brand-strong, var(--brand))">처음 10억</text>
        </g>
      )}
      {h ? (
        <g pointerEvents="none">
          <line x1={hx} x2={hx} y1={T} y2={H - B} stroke="var(--grey400)" strokeWidth="1" />
          <circle cx={hx} cy={y(h.principal)} r="3.5" fill="var(--grey500)" stroke="#fff" strokeWidth="1.5" />
          <circle cx={hx} cy={y(h.value)} r="4.5" fill="var(--brand)" stroke="#fff" strokeWidth="2" />
        </g>
      ) : <circle cx={x(pts.length - 1)} cy={y(last.value)} r="4.5" fill="var(--brand)" stroke="#fff" strokeWidth="2" />}
      {xTicks.map((t) => (
        <text key={t.yr} x={t.x} y={H - 7} textAnchor={t.anchor} fontSize="10" fill="var(--grey500)">{t.yr}</text>
      ))}
    </svg>
    {h && (
      <div className="chart-tip" style={tipOnLeft ? { left: `${(L / W) * 100 + 2}%` } : { right: `${(R / W) * 100 + 1}%` }} aria-live="polite">
        <span className="chart-tip-d">{ymKo(h.date)}</span>
        <span>평가액 <b>{fmt.money(h.value)}</b></span>
        <span>넣은 돈 {fmt.money(h.principal)}</span>
      </div>
    )}
    </div>
  );
}

/* ── 숫자 스테퍼 + 프리셋 칩 ── */
export function Stepper({ id, label, value, unit, min, max, step, stepLabel, chips, chipLabel, onChange, accent }: {
  id: string; label: string; value: number; unit: string; min: number; max: number; step: number; stepLabel?: string;
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
        <div className="stepper-col">
          <div className="stepper-btns">
            <button type="button" className="stepper-btn" aria-label={`${label} ${stepLabel ?? ""} 줄이기`} onClick={() => onChange(clamp(value - step))}>−</button>
            <button type="button" className="stepper-btn" aria-label={`${label} ${stepLabel ?? ""} 늘리기`} onClick={() => onChange(clamp(value + step))}>+</button>
          </div>
          {stepLabel && <span className="step-hint">{stepLabel}씩</span>}
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

/* ── 분산 매수 종목 행: 아바타(누르면 종목 변경) · 이름 · 금액 입력 · −/+ · 빼기 ── */
export function HoldingRow({ symbol, value, unit, min, max, step, share, onChange, onPick, onRemove }: {
  symbol: string; value: number; unit: string; min: number; max: number; step: number; share?: number;
  onChange: (v: number) => void; onPick: () => void; onRemove: () => void;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => { setText(String(value)); }, [value]);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const commit = () => { const n = parseInt(text.replace(/[^0-9]/g, ""), 10); onChange(Number.isFinite(n) ? clamp(n) : value); };
  const name = tickerTitle(symbol);
  const id = `h-${symbol}`;
  return (
    <div className="row holding-row">
      <button type="button" className="holding-pick" aria-label={`${name} 종목 바꾸기`} aria-haspopup="dialog" onClick={onPick}><Avatar symbol={symbol} size={36} /></button>
      <label htmlFor={id} className="field">
        <span className="field-label">{name}{share != null && <span className="share"> · {Math.round(share * 100)}%</span>}</span>
        <span className="field-value-wrap">
          <input id={id} className="field-input" inputMode="numeric" value={text} onChange={(e) => setText(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} style={{ width: `${Math.max(2, text.length + 0.5)}ch` }} />
          <span className="unit">{unit}</span>
        </span>
      </label>
      <div className="stepper-btns">
        <button type="button" className="stepper-btn" aria-label={`${name} 금액 줄이기`} onClick={() => onChange(clamp(value - step))}>−</button>
        <button type="button" className="stepper-btn" aria-label={`${name} 금액 늘리기`} onClick={() => onChange(clamp(value + step))}>+</button>
      </div>
      <button type="button" className="icon-btn holding-del" aria-label={`${name} 빼기`} onClick={onRemove}><XIcon /></button>
    </div>
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
/** taken: 다른 행에서 이미 고른 종목(선택 불가) */
export function TickerSheet({ current, taken = [], onPick, onClose }: { current: string; taken?: string[]; onPick: (t: string) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const ql = q.trim().toLowerCase();
  const list = TICKERS.filter((t) => !ql || t.symbol.toLowerCase().includes(ql) || t.name.toLowerCase().includes(ql) || tossSubtitle(t.symbol).includes(ql));
  const groups = GROUPS.map((g) => ({ ...g, items: list.filter((t) => tickerGroup(t.symbol) === g.id) })).filter((g) => g.items.length > 0);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label="종목 선택" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-head">
          <div className="sheet-title">어떤 종목을 모을까요?</div>
          <input ref={ref} className="search" placeholder="종목 검색" value={q} onChange={(e) => setQ(e.target.value)} aria-label="종목 검색" />
        </div>
        <div className="sheet-list">
          {groups.map((g) => (
            <section key={g.id} className="sheet-group" aria-labelledby={`sg-${g.id}`}>
              <div className="sheet-group-head">
                <span id={`sg-${g.id}`} className="sheet-group-title">{g.label}</span>
                {g.desc && <span className="sheet-group-desc">{g.desc}</span>}
              </div>
              {g.items.map((t) => {
                const isTaken = t.symbol !== current && taken.includes(t.symbol);
                // 국내 상장 묶음 안에서는 부제 "국내 상장"이 겹치므로 이름(무엇을 담는지)만 둔다
                const sub = g.id === "kr-listed" ? "" : tossSubtitle(t.symbol);
                const extra = [sub, t.splice ? "상장 전은 추정치" : "", t.shortHistory ? "데이터가 짧아요" : ""].filter(Boolean).join(" · ");
                return (
                <button key={t.symbol} type="button" className="list-row list-btn" aria-pressed={t.symbol === current} disabled={isTaken} onClick={() => onPick(t.symbol)}>
                  <span className="avatar" style={{ background: t.color }}>{tickerMonogram(t.symbol)}</span>
                  <span className="field"><span className="row-title">{tickerTitle(t.symbol)}</span>{(isTaken || extra) && <span className="row-desc">{isTaken ? "이미 담았어요" : extra}</span>}</span>
                  {t.symbol === current && <span className="brand-text" aria-hidden="true"><Check /></span>}
                </button>
                );
              })}
            </section>
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
export function AdGate({ onReward, onClose, desc = "끝까지 보면 바로 열려요.", cta = "계속하기" }: { onReward: () => void; onClose: () => void; desc?: string; cta?: string }) {
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
        <div className="ad-desc">미니앱에서는 토스 보상형 광고가 여기에 나와요. {desc}</div>
        <div className="ad-timer" aria-live="polite">{left > 0 ? `${left}초 남았어요` : "다 봤어요"}</div>
        <div className="ad-actions">
          {left > 0 ? <button type="button" className="btn dark-weak md" onClick={onClose}>닫기</button> : <button type="button" className="btn md" onClick={onReward}>{cta}</button>}
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
