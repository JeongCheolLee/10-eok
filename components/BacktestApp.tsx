"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { bundleToRows, type Bundle, type Row } from "@/lib/backtest/types";
import { runToToday } from "@/lib/backtest/simulate";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";
import { GrowthChart } from "@/components/GrowthChart";
import { TickerLogo } from "@/components/TickerLogo";
import { eok, eok1, pct, ym } from "@/lib/format";
import { TICKERS, DEFAULT_TICKER, tickerName, tickerTitle, tickerSubtitle, tickerCurrency } from "@/lib/tickers";


type Screen = "intro" | "form" | "loading" | "result";
type Initial = { ticker: string; amount: number; buyDay: number; target: number; infl: boolean; reinvest: boolean; tax: boolean } | null;

export function BacktestApp({ initial }: { initial: Initial }) {
  const [ticker, setTicker] = useState(initial?.ticker ?? DEFAULT_TICKER);
  const [amount, setAmount] = useState(initial?.amount ?? 100); // 만원
  const [buyDay, setBuyDay] = useState(initial?.buyDay ?? 1);
  const [target, setTarget] = useState(initial?.target ?? 10); // 억
  const [infl, setInfl] = useState(initial?.infl ?? false);
  const [reinvest, setReinvest] = useState(initial?.reinvest ?? true);
  const [tax, setTax] = useState(initial?.tax ?? false);
  const [cpi, setCpi] = useState<{ ym: string; idx: number }[] | null>(null);
  const [screen, setScreen] = useState<Screen>(initial ? "result" : "intro");
  const [editMode, setEditMode] = useState<null | "amount" | "day" | "ticker" | "target">(null);
  const [tipOpen, setTipOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [revealKey, setRevealKey] = useState(0);
  const chipsRef = useRef<HTMLDivElement>(null);

  const [rows, setRows] = useState<Row[] | null>(initial ? null : null);
  const [loadErr, setLoadErr] = useState(false);
  const cacheRef = useRef<Record<string, Row[]>>({});

  // 선택 종목 번들 로드 (캐시)
  useEffect(() => {
    let cancel = false;
    const cached = cacheRef.current[ticker];
    if (cached) { setRows(cached); return; }
    setRows(null);
    fetch(`/data/${ticker.toLowerCase()}.json`)
      .then((r) => { if (!r.ok) throw new Error("bundle"); return r.json(); })
      .then((b: Bundle) => { if (cancel) return; const rw = bundleToRows(b); cacheRef.current[ticker] = rw; setRows(rw); })
      .catch(() => { if (!cancel) setLoadErr(true); });
    return () => { cancel = true; };
  }, [ticker]);

  // 물가연동용 CPI 1회 로드
  useEffect(() => {
    fetch("/data/cpi-kr.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j?.series) setCpi(j.series.map(([ym, idx]: [string, number]) => ({ ym, idx }))); })
      .catch(() => {});
  }, []);

  const targetKRW = target * 100_000_000;
  const result = useMemo(
    () => (rows ? runToToday(rows, { monthlyKRW: amount * 10000, buyDay, targetKRW, cpi: infl && cpi ? cpi : undefined, reinvestDividends: reinvest, taxMode: tax && tickerCurrency(ticker) === "USD" }) : null),
    [rows, amount, buyDay, targetKRW, infl, cpi, reinvest, tax, ticker],
  );

  // 결과 화면 진입/갱신 시 애니메이션 재트리거 + 공유용 URL 동기화
  useEffect(() => {
    if (screen === "result" && result) {
      setRevealKey((k) => k + 1);
      window.history.replaceState(null, "", `/?t=${ticker}&m=${amount}&d=${buyDay}&g=${target}${infl ? "&infl=1" : ""}${!reinvest ? "&div=0" : ""}${tax ? "&tax=1" : ""}`);
    }
  }, [screen, result?.reachedDate, result?.months]); // eslint-disable-line

  useEffect(() => {
    if (!editMode) return;
    function onDown(e: MouseEvent) {
      if (chipsRef.current && !chipsRef.current.contains(e.target as Node)) setEditMode(null);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [editMode]);

  const months = result?.months ?? 0;
  const animMonths = useAnimatedNumber(months, screen === "result" ? 1000 : 0);
  const animPrincipal = useAnimatedNumber(result?.principalKRW ?? 0, screen === "result" ? 1000 : 0);
  const reached = !!result?.reached;
  const heroMonths = Math.round(animMonths);

  function submit() {
    setScreen("loading");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setScreen("result"), reduce ? 0 : 900);
  }
  function share() {
    const url = `${location.origin}/?t=${ticker}&m=${amount}&d=${buyDay}&g=${target}`;
    const text = reached
      ? `${tickerName(ticker)}에 매달 ${amount}만원씩 모았다면 ${target}억까지 ${result!.years}년 ${result!.monthsRem}개월!`
      : `${tickerName(ticker)} 적립 백테스트 — ${target}억까지 얼마나 걸릴까?`;
    if (navigator.share) { navigator.share({ title: "10-eok", text, url }).catch(() => {}); }
    else { navigator.clipboard?.writeText(`${text} ${url}`); setToast("링크가 복사됐어요"); window.setTimeout(() => setToast(""), 2000); }
  }

  if (loadErr) {
    return (
      <div className="overlay">
        <div className="ov-msg">데이터를 못 불러왔어요.<br />잠시 후 다시 시도해 주세요.</div>
        <button className="btn" style={{ width: "auto", padding: "14px 28px" }} onClick={() => location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <main className="app">
      <div className="top">
        <svg className="logo" viewBox="0 0 64 64" aria-hidden>
          <rect width="64" height="64" rx="15" fill="#1ed760" />
          <g fill="none" stroke="#0b0b0b" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 26 l6 -4 v24" />
            <path d="M49 35 a11 11 0 1 0 -4 8" />
            <path d="M33 43 l6 -6 4 4 8 -9" />
            <path d="M46 27 h5 v5" />
          </g>
        </svg>
        <div className="brand">10-eok</div>
        {screen === "result" && <div className="tag">탭하면 변경</div>}
      </div>

      {screen === "intro" && <Intro onStart={() => setScreen("form")} />}

      {screen === "form" && (
        <Form
          ticker={ticker} amount={amount} buyDay={buyDay}
          onTicker={setTicker} onAmount={setAmount} onDay={setBuyDay} onSubmit={submit}
        />
      )}

      {(screen === "loading" || (screen === "result" && !result)) && (
        <div className="overlay">
          <div className="spinner" />
          <div className="ov-msg">계산 중…</div>
        </div>
      )}

      {screen === "result" && result && (
        <div className="reveal" key={revealKey}>
          <div className="chips-wrap" ref={chipsRef}>
            <div className="chips">
              <button className={"chip rv" + (editMode === "ticker" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "ticker" ? null : "ticker"))}>
                <div className="k">종목</div><div className="v vrow"><TickerLogo symbol={ticker} size={18} />{tickerTitle(ticker)}</div>
              </button>
              <button className={"chip rv" + (editMode === "amount" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "amount" ? null : "amount"))}>
                <div className="k">매달</div><div className="v">{amount}만원</div>
              </button>
              <button className={"chip rv" + (editMode === "day" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "day" ? null : "day"))}>
                <div className="k">매수일</div><div className="v">{buyDay}일</div>
              </button>
              <button className={"chip rv" + (editMode === "target" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "target" ? null : "target"))}>
                <div className="k">목표</div><div className="v">{target}억</div>
              </button>
            </div>
            {editMode && (
              <div className="chip-dropdown rv" style={{ ["--i" as string]: 0 }}>
                {editMode === "ticker" && (
                  <TickerSelect value={ticker} onChange={(s) => { setTicker(s); setEditMode(null); }} />
                )}
                {editMode === "amount" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">매달 적립 금액</div>
                    <StepInput value={amount} onChange={setAmount} min={10} max={100000} step={10} suffix="만원" />
                  </div>
                )}
                {editMode === "day" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">매수일 (매달 며칠)</div>
                    <StepInput value={buyDay} onChange={setBuyDay} min={1} max={31} step={1} suffix="일" />
                  </div>
                )}
                {editMode === "target" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">목표 금액</div>
                    <StepInput value={target} onChange={setTarget} min={1} max={100} step={1} suffix="억" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hero">
            <div className="hero-glow" />
            <div className={"lead rv" + (reached ? "" : " under")} style={{ ["--i" as string]: 1 }}>
              {reached ? `매달 ${amount}만원씩이면` : "전 구간 모아도"}
            </div>
            <div className="num pop" style={{ ["--i" as string]: 2 }}>
              {Math.floor(heroMonths / 12)}<span className="u">년</span> {heroMonths % 12}<span className="u">개월</span>
              {reached && <span className="u"> 만에</span>}
            </div>
            <div className="span rv" style={{ ["--i" as string]: 3 }}>
              {reached
                ? `${target}억을 모을 수 있어요 · ${result.series[0] ? ym(result.series[0].date) : ""}부터 모았다면 지금 ${eok(result.valueKRW)}`
                : `${result.series[0] ? ym(result.series[0].date) : ""}부터 모아도 지금 ${eok1(result.valueKRW)} · ${target}억까진 멀어요`}
            </div>
            {reached && <Confetti />}
          </div>

          <div className="card rv" style={{ ["--i" as string]: 4 }}>
            <div className="clab"><span>자산 성장 (KRW)</span><span>목표 {target}억</span></div>
            <GrowthChart
              series={reached ? sliceToReached(result.series, result.reachedDate!) : result.series}
              target={targetKRW} reached={reached}
            />
            <div className="stats">
              <div className="stat"><div className="k">원금</div><div className="v">{eok(animPrincipal)}</div></div>
              <div className="stat"><div className="k">최종 금액</div><div className={"v" + (reached ? " up" : "")}>{eok(result.valueKRW)}</div></div>
              <div className="stat" style={{ cursor: "help" }} onClick={() => setTipOpen((v) => !v)}>
                <div className="k">연평균 ⓘ</div><div className="v up">{pct(result.cagr)}</div>
              </div>
            </div>
          </div>

          {tipOpen && <div id="tip">연평균 {pct(result.cagr)}는 1년에 평균 이만큼씩 늘었다는 뜻이에요. (과거 수익률 기준)</div>}

          <div className="opts rv" style={{ ["--i" as string]: 5 }}>
            <label className="opt">
              <span>물가만큼 매년 인상 <i>적립액을 물가지수만큼 올림</i></span>
              <input type="checkbox" checked={infl} onChange={(e) => setInfl(e.target.checked)} />
            </label>
            {/* 배당 재투자·양도세 토글은 일단 숨김 (기능 보류)
            <label className="opt">
              <span>배당 재투자 <i>끄면 주가만(가격수익), 배당 제외</i></span>
              <input type="checkbox" checked={reinvest} onChange={(e) => setReinvest(e.target.checked)} />
            </label>
            <label className="opt">
              <span>양도세 반영 <i>해외주식 22%(250만 공제) · 국내주식 비과세</i></span>
              <input type="checkbox" checked={tax} onChange={(e) => setTax(e.target.checked)} />
            </label>
            */}
          </div>

          <button className="btn share rv" style={{ ["--i" as string]: 6, marginBottom: 24 }} onClick={share}>결과 공유하기</button>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function sliceToReached(series: { date: string; valueKRW: number }[], reachedDate: string) {
  const i = series.findIndex((s) => s.date === reachedDate);
  return i >= 0 ? series.slice(0, i + 1) : series;
}

function Confetti() {
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} style={{ ["--n" as string]: i }} />
      ))}
    </div>
  );
}

function StepInput({ value, onChange, min, max, step, suffix, bare }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix: string; bare?: boolean;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => { setText(String(value)); }, [value]);
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const commit = (raw: string) => {
    const n = parseInt(raw, 10);
    onChange(Number.isFinite(n) ? clamp(n) : value);
  };
  return (
    <div className={"stepper" + (bare ? " bare" : "")}>
      <button type="button" aria-label="줄이기" onClick={() => onChange(clamp(value - step))}>−</button>
      <div className="val">
        <input
          inputMode="numeric"
          value={text}
          onChange={(e) => setText(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        />
        <span className="suffix">{suffix}</span>
      </div>
      <button type="button" aria-label="늘리기" onClick={() => onChange(clamp(value + step))}>+</button>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <>
      <div className="intro-mid">
        <h1><b>10억 모으기</b>,<br />얼마나 걸릴까?</h1>
        <div className="sub">ETF로 10억 모으기 — 실제 과거 주가와 환율로 계산해 드려요.</div>
      </div>
      <div className="cta">
        <button className="btn" onClick={onStart}>계산 시작하기</button>
        <div className="hint">종목·금액·날짜만 정하면 끝 · 약 5초</div>
      </div>
    </>
  );
}

function Form({
  ticker, amount, buyDay, onTicker, onAmount, onDay, onSubmit,
}: {
  ticker: string; amount: number; buyDay: number;
  onTicker: (v: string) => void; onAmount: (v: number) => void; onDay: (v: number) => void; onSubmit: () => void;
}) {
  return (
    <>
      <div className="form-mid">
        <div className="field">
          <div className="flabel">종목</div>
          <TickerSelect value={ticker} onChange={onTicker} />
        </div>
        <div className="field">
          <div className="flabel">매달 적립 금액</div>
          <StepInput value={amount} onChange={onAmount} min={10} max={100000} step={10} suffix="만원" />
        </div>
        <div className="field">
          <div className="flabel">매수일 (매달 며칠)</div>
          <StepInput value={buyDay} onChange={onDay} min={1} max={31} step={1} suffix="일" />
        </div>
      </div>
      <div className="cta">
        <button className="btn" onClick={onSubmit}>10억까지 계산하기</button>
      </div>
    </>
  );
}

function TickerSelect({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const list = TICKERS.filter((t) => !s || t.symbol.toLowerCase().includes(s) || t.name.toLowerCase().includes(s));
  return (
    <div className="select">
      <button className="select-btn" onClick={() => setOpen((o) => !o)}>
        <span className="select-cur">
          <TickerLogo symbol={value} size={26} />
          <span className="pcol"><span className="pn">{tickerTitle(value)}</span><span className="ps">{tickerSubtitle(value)}</span></span>
        </span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div className="select-panel">
          <input className="select-search" placeholder="종목 검색 (이름·티커)" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          <div className="select-list">
            {list.map((t) => (
              <button key={t.symbol} className={"select-item" + (t.symbol === value ? " sel" : "")} onClick={() => { onChange(t.symbol); setOpen(false); setQ(""); }}>
                <TickerLogo symbol={t.symbol} size={28} />
                <span className="pcol"><span className="pn">{tickerTitle(t.symbol)}</span><span className="ps">{tickerSubtitle(t.symbol)}</span></span>
              </button>
            ))}
            {list.length === 0 && <div className="select-empty">검색 결과 없음</div>}
          </div>
        </div>
      )}
    </div>
  );
}
