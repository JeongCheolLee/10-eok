import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { tickerInfo, tickerMonogram, tickerTitle } from "@/lib/tickers";
import { GROUPS, TOSS_DISPLAY_TICKERS, tickerGroup, tossSubtitle } from "../lib/groups";
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
/** 앱 로고(숫자 10). 웹 파비콘·store/logo.svg와 같은 형태. 토스 네비바는 콘솔에 등록한 로고를 사용한다. */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg className="nav-logo" width={size} height={size} viewBox="0 0 128 128" aria-hidden="true">
      <rect width="128" height="128" rx="30" fill="#00A56B" />
      <path d="M25 45L40 34H48V94H34V52L25 58Z" fill="white" />
      <rect x="61" y="34" width="42" height="60" rx="21" fill="white" />
      <rect x="75" y="47" width="14" height="34" rx="7" fill="#00A56B" />
    </svg>
  );
}

export function NavBar({ back, onMenu, onClose, title = "주식으로 10억 모으기" }: { back?: () => void; onMenu: () => void; onClose: () => void; title?: string }) {
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

/* ── 평가액 변화 차트 ── */
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
/** mark: 처음 target을 넘은 날(있으면 그 지점에 테두리 점).
 *  estUntil: 상장 전 추정 가격이 끝나는 날(실제 가격 첫날). 있으면 그 전 구간에 옅은 띠. */
export function Chart({ series, target, mark, estUntil }: { series: Pt[]; target: number; mark?: string; estUntil?: string }) {
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
  // 추정 구간 띠: 첫 점부터 실제 가격 첫날 직전 점까지
  const estI = estUntil && pts[0].date < estUntil ? pts.findIndex((p) => p.date >= estUntil) : -1;
  const estX = estI < 0 ? (estUntil && pts[0].date < estUntil ? x(pts.length - 1) : null) : x(Math.max(0, estI));
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
          <text x={L - 6} y={y(v) + 3.5} textAnchor="end" fontSize="10" fill="var(--text-secondary)">{v === 0 ? "0" : `${v / 1e8}억`}</text>
        </g>
      ))}
      {estX != null && estX > L && <rect className="est-band" x={L} y={T} width={estX - L} height={H - T - B} />}
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
          <circle cx={hx} cy={y(h.principal)} r="3.5" fill="var(--text-secondary)" stroke="#fff" strokeWidth="1.5" />
          <circle cx={hx} cy={y(h.value)} r="4.5" fill="var(--brand)" stroke="#fff" strokeWidth="2" />
        </g>
      ) : <circle cx={x(pts.length - 1)} cy={y(last.value)} r="4.5" fill="var(--brand)" stroke="#fff" strokeWidth="2" />}
      {xTicks.map((t) => (
        <text key={t.yr} x={t.x} y={H - 7} textAnchor={t.anchor} fontSize="10" fill="var(--text-secondary)">{t.yr}</text>
      ))}
    </svg>
    {h && (
      <div className="chart-tip" style={tipOnLeft ? { left: `${(L / W) * 100 + 2}%` } : { right: `${(R / W) * 100 + 1}%` }} aria-live="polite">
        <span className="chart-tip-d">{ymKo(h.date)}{estUntil && h.date < estUntil ? " · 추정치" : ""}</span>
        <span>평가액 <b>{fmt.money(h.value)}</b></span>
        <span>넣은 돈 {fmt.money(h.principal)}</span>
      </div>
    )}
    </div>
  );
}

/* ── 숫자 스테퍼 + 프리셋 칩 ── */
type NumericValidity = (id: string, valid: boolean) => void;
function useNumericDraft(id: string, value: number, min: number, max: number, onChange: (value: number) => void, onValidityChange?: NumericValidity) {
  const [text, setText] = useState(String(value));
  useEffect(() => { setText(String(value)); }, [value]);
  const numeric = /^\d+$/.test(text) && Number.isSafeInteger(Number(text));
  const valid = numeric && Number(text) >= min && Number(text) <= max;
  useEffect(() => { onValidityChange?.(id, valid); }, [id, valid, onValidityChange]);
  useEffect(() => () => { onValidityChange?.(id, true); }, [id, onValidityChange]);
  const choose = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    setText(String(clamped));
    onChange(clamped);
  };
  const commit = () => { if (numeric) choose(Number(text)); };
  return { text, setText, valid, numeric, choose, commit };
}

export function Stepper({ id, label, value, unit, min, max, step, stepLabel, chips, chipLabel, onChange, accent, onValidityChange }: {
  id: string; label: string; value: number; unit: string; min: number; max: number; step: number; stepLabel?: string;
  chips?: number[]; chipLabel?: (v: number) => string; onChange: (v: number) => void; accent?: boolean; onValidityChange?: NumericValidity;
}) {
  const { text, setText, valid, numeric, choose, commit } = useNumericDraft(id, value, min, max, onChange, onValidityChange);
  return (
    <>
      <div className="row">
        <label htmlFor={id} className="field">
          <span className={"field-label" + (accent ? " brand" : "")}>{label}</span>
          <span className="field-value-wrap">
            <input id={id} className="field-input" inputMode="numeric" value={text} aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined} onChange={(e) => setText(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} style={{ width: `${Math.max(2, Math.min(8, text.length + 0.5))}ch` }} />
            <span className="unit">{unit}</span>
          </span>
        </label>
        <div className="stepper-col">
          <div className="stepper-btns">
            <button type="button" className="stepper-btn" aria-label={`${label} ${stepLabel ?? ""} 줄이기`} onClick={() => choose(value - step)}>−</button>
            <button type="button" className="stepper-btn" aria-label={`${label} ${stepLabel ?? ""} 늘리기`} onClick={() => choose(value + step)}>+</button>
          </div>
          {stepLabel && <span className="step-hint">{stepLabel}씩</span>}
        </div>
      </div>
      {!valid && <p id={`${id}-error`} className="input-error" role="status">{numeric ? `${min.toLocaleString()}~${max.toLocaleString()}${unit}으로 입력해 주세요.` : unit === "년" ? "기간을 숫자로 입력해 주세요." : "금액을 숫자로 입력해 주세요."}</p>}
      {chips && (
        <div className="chips">
          {chips.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={valid && Number(text) === c} onClick={() => choose(c)}>{chipLabel ? chipLabel(c) : `${c}${unit}`}</button>
          ))}
        </div>
      )}
    </>
  );
}

/* ── 분산 매수 종목 행: 아바타(누르면 종목 변경) · 이름 · 금액 입력 · −/+ · 빼기 ── */
export function HoldingRow({ symbol, value, unit, min, max, step, share, onChange, onPick, onRemove, onValidityChange }: {
  symbol: string; value: number; unit: string; min: number; max: number; step: number; share?: number;
  onChange: (v: number) => void; onPick: () => void; onRemove: () => void; onValidityChange?: NumericValidity;
}) {
  const name = tickerTitle(symbol);
  const id = `h-${symbol}`;
  const { text, setText, valid, numeric, choose, commit } = useNumericDraft(id, value, min, max, onChange, onValidityChange);
  return (
    <div className="row holding-row">
      <button type="button" className="holding-pick" aria-label={`${name} 종목 바꾸기`} aria-haspopup="dialog" onClick={onPick}><Avatar symbol={symbol} size={36} /></button>
      <label htmlFor={id} className="field">
        <span className="field-label">{name}{share != null && <span className="share"> · {Math.round(share * 100)}%</span>}</span>
        <span className="field-value-wrap">
          <input id={id} className="field-input" inputMode="numeric" value={text} aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined} onChange={(e) => setText(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} style={{ width: `${Math.max(2, Math.min(8, text.length + 0.5))}ch` }} />
          <span className="unit">{unit}</span>
        </span>
        {!valid && <span id={`${id}-error`} className="numeric-error" role="status">{numeric ? `${min.toLocaleString()}~${max.toLocaleString()}${unit}으로 입력해 주세요.` : "금액을 숫자로 입력해 주세요."}</span>}
      </label>
      <div className="stepper-btns">
        <button type="button" className="stepper-btn" aria-label={`${name} 금액 줄이기`} onClick={() => choose(value - step)}>−</button>
        <button type="button" className="stepper-btn" aria-label={`${name} 금액 늘리기`} onClick={() => choose(value + step)}>+</button>
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  // 목록부터 둘러볼 수 있도록 검색 입력 대신 대화상자에 포커스를 둔다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // 시트 밖의 형제 영역을 키보드·보조 기술에서 제외한다.
    const background: { element: HTMLElement; inert: boolean }[] = [];
    let branch: HTMLElement | null = dialog.parentElement;
    while (branch && branch !== document.body) {
      for (const sibling of Array.from(branch.parentElement?.children ?? [])) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          background.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    dialog.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== "Tab") return;
      const targets = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]')).filter((element) => element.getClientRects().length > 0);
      const first = targets[0]; const last = targets[targets.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialog)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener("keydown", keydown);
    return () => {
      dialog.removeEventListener("keydown", keydown);
      document.body.style.overflow = previousOverflow;
      for (const { element, inert } of background) element.inert = inert;
      // 첫 선택 후에는 빈 선택 버튼이 사라질 수 있다.
      const target = opener?.isConnected ? opener : document.querySelector<HTMLElement>('[aria-haspopup="dialog"]');
      target?.focus({ preventScroll: true });
    };
  }, []);
  const ql = q.trim().toLowerCase();
  const list = TOSS_DISPLAY_TICKERS.filter((t) => !ql || t.symbol.toLowerCase().includes(ql) || t.name.toLowerCase().includes(ql) || tossSubtitle(t.symbol).includes(ql));
  const groups = GROUPS.map((g) => ({ ...g, items: list.filter((t) => tickerGroup(t.symbol) === g.id) })).filter((g) => g.items.length > 0);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div ref={dialogRef} className="sheet" role="dialog" aria-modal="true" aria-label="종목 선택" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-head">
          <div className="sheet-title">어떤 ETF가 궁금하세요?</div>
          <input className="search" placeholder="종목 검색" value={q} onChange={(e) => setQ(e.target.value)} aria-label="종목 검색" />
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
                const extra = g.id === "kr-listed" ? "" : tossSubtitle(t.symbol);
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

/* ── 배너 광고 슬롯: 토스에서는 TossAds.attachBanner, 밖(프로토타입)에서는 미리보기 자리 ──
 *  토스 안에서 광고를 붙이지 못하면(미지원·로드 실패) 영역을 남기지 않는다. */
export function AdSlot() {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let on = true;
    let dispose: (() => void) | null = null;
    if (ref.current) {
      attachBanner(ref.current, (rendered) => { if (on) setLive(rendered); }).then((d) => { if (!on) { d?.(); return; } dispose = d; });
    }
    return () => { on = false; dispose?.(); };
  }, []);
  if (inToss) {
    // 붙기 전·실패 시엔 높이 0(빈 회색 박스 없음). 붙으면 SDK가 채운 높이만큼.
    return <div className={"ad-slot live" + (live ? "" : " pending")} role={live ? "region" : undefined} aria-label={live ? "광고" : undefined} aria-hidden={live ? undefined : true}><div ref={ref} className="ad-target" /></div>;
  }
  return (
    <div className="ad-slot" role="region" aria-label="광고 미리보기">
      <div ref={ref} className="ad-target" />
      <span className="ad-badge">AD</span><span>배너 광고 미리보기</span>
    </div>
  );
}
