"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { bundleToRows, type Bundle, type Row } from "@/lib/backtest/types";
import { runToToday, requiredMonthly, monthsBetween } from "@/lib/backtest/simulate";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";
import { AppLogo } from "@/components/AppLogo";
import { GrowthChart } from "@/components/GrowthChart";
import { TickerLogo } from "@/components/TickerLogo";
import { eok, eok1, pct, ym } from "@/lib/format";
import { TICKERS, DEFAULT_TICKER, tickerName, tickerTitle, tickerSubtitle, tickerCurrency } from "@/lib/tickers";


type Screen = "intro" | "form" | "loading" | "result";
type Mode = "time" | "amount"; // time=기간이 궁금(정방향), amount=금액이 궁금(역산)
type Initial = { ticker: string; mode: Mode; amount: number; years: number; lump: number; buyDay: number; target: number; infl: boolean; reinvest: boolean; tax: boolean } | null;

export function BacktestApp({ initial }: { initial: Initial }) {
  const [ticker, setTicker] = useState(initial?.ticker ?? DEFAULT_TICKER);
  const [mode, setMode] = useState<Mode>(initial?.mode ?? "time");
  const [amount, setAmount] = useState(initial?.amount ?? 100); // 만원
  const [years, setYears] = useState(initial?.years ?? 10); // 역산 모드: 목표 기간(년)
  const [lump, setLump] = useState(initial?.lump ?? 0); // 초기 투자금 (만원)
  const [buyDay, setBuyDay] = useState(initial?.buyDay ?? 1);
  const [target, setTarget] = useState(initial?.target ?? 10); // 억
  const [infl, setInfl] = useState(initial?.infl ?? false);
  const [reinvest, setReinvest] = useState(initial?.reinvest ?? true);
  const [tax, setTax] = useState(initial?.tax ?? false);
  const [cpi, setCpi] = useState<{ ym: string; idx: number }[] | null>(null);
  const [screen, setScreen] = useState<Screen>(initial ? "result" : "intro");
  const [editMode, setEditMode] = useState<null | "amount" | "years" | "lump" | "day" | "ticker" | "target">(null);
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
  // 종목 데이터로 가능한 최대 기간(년). 역산 모드 기간 입력 상한.
  const maxYears = rows ? Math.max(1, Math.floor(monthsBetween(rows[0].date, rows[rows.length - 1].date) / 12)) : 40;
  const yearsUsed = Math.min(years, maxYears);

  const calc = useMemo(() => {
    if (!rows) return null;
    const opts = { initialKRW: lump * 10000, buyDay, targetKRW, cpi: infl && cpi ? cpi : undefined, reinvestDividends: reinvest, taxMode: tax && tickerCurrency(ticker) === "USD" };
    if (mode === "time") {
      return { result: runToToday(rows, { monthlyKRW: amount * 10000, ...opts }), reqMonthly: null as number | null };
    }
    const endDate = rows[rows.length - 1].date;
    const startDate = startMonthsAgo(endDate, yearsUsed * 12);
    const { monthlyKRW, result } = requiredMonthly(rows, { monthlyKRW: 0, startDate, ...opts });
    return { result, reqMonthly: monthlyKRW };
  }, [rows, mode, amount, years, maxYears, lump, buyDay, targetKRW, infl, cpi, reinvest, tax, ticker]); // eslint-disable-line

  const result = calc?.result ?? null;
  const reqMonthly = calc?.reqMonthly ?? null;

  const query =
    `t=${ticker}` +
    (mode === "amount" ? `&mode=amt&y=${years}` : `&m=${amount}`) +
    (lump > 0 ? `&i=${lump}` : "") +
    `&d=${buyDay}&g=${target}` +
    (infl ? "&infl=1" : "") + (!reinvest ? "&div=0" : "") + (tax ? "&tax=1" : "");

  // 결과 화면 진입/갱신 시 애니메이션 재트리거 (결과가 바뀔 때만)
  useEffect(() => {
    if (screen === "result" && result) setRevealKey((k) => k + 1);
  }, [screen, mode, result?.reachedDate, result?.months, reqMonthly]); // eslint-disable-line

  // 공유용 URL 동기화: 입력값이 바뀔 때마다 주소창을 최신으로 (결과 변화 여부와 무관)
  useEffect(() => {
    if (screen === "result") window.history.replaceState(null, "", `/?${query}`);
  }, [screen, query]);

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
  const animReq = useAnimatedNumber(reqMonthly ?? 0, screen === "result" ? 1000 : 0);
  const reached = !!result?.reached;
  const heroMonths = Math.round(animMonths);

  function submit() {
    setScreen("loading");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setScreen("result"), reduce ? 0 : 900);
  }
  function share() {
    const url = `${location.origin}/?${query}`;
    const text =
      mode === "amount"
        ? (reqMonthly === 0
            ? `${tickerName(ticker)} · 초기 투자금만으로 ${target}억 달성!`
            : `${tickerName(ticker)}로 ${yearsUsed}년 안에 ${target}억 모으려면 매달 ${manwon(reqMonthly ?? 0)}!`)
        : reached
          ? `${tickerName(ticker)}에${lump > 0 ? ` ${lump}만원으로 시작해` : ""} 매달 ${amount}만원씩 모았다면 ${target}억까지 ${result!.years}년 ${result!.monthsRem}개월!`
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
        <AppLogo />
        <div className="brand">10-eok</div>
        {screen === "result" && <div className="tag">탭하면 변경</div>}
      </div>

      {screen === "intro" && <Intro onStart={() => setScreen("form")} />}

      {screen === "form" && (
        <Form
          ticker={ticker} mode={mode} amount={amount} years={years} maxYears={maxYears} lump={lump} buyDay={buyDay}
          onTicker={setTicker} onMode={setMode} onAmount={setAmount} onYears={setYears} onLump={setLump} onDay={setBuyDay} onSubmit={submit}
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
          <div className="modetoggle rv" style={{ ["--i" as string]: 0, marginBottom: 10 }}>
            <button className={mode === "time" ? "on" : ""} onClick={() => { setMode("time"); setEditMode(null); }}>기간이 궁금</button>
            <button className={mode === "amount" ? "on" : ""} onClick={() => { setMode("amount"); setEditMode(null); }}>금액이 궁금</button>
          </div>
          <div className="chips-wrap" ref={chipsRef}>
            <div className="chips">
              <button className={"chip rv" + (editMode === "ticker" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "ticker" ? null : "ticker"))}>
                <div className="k">종목</div><div className="v vrow"><TickerLogo symbol={ticker} size={18} />{tickerTitle(ticker)}</div>
              </button>
              {mode === "time" ? (
                <button className={"chip rv" + (editMode === "amount" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "amount" ? null : "amount"))}>
                  <div className="k">매달</div><div className="v">{amount}만원</div>
                </button>
              ) : (
                <button className={"chip rv" + (editMode === "years" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "years" ? null : "years"))}>
                  <div className="k">기간</div><div className="v">{yearsUsed}년 안에</div>
                </button>
              )}
              <button className={"chip rv" + (editMode === "lump" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "lump" ? null : "lump"))}>
                <div className="k">초기금</div><div className="v">{lump > 0 ? `${lump}만원` : "없음"}</div>
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
                {editMode === "years" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">목표 기간 (최대 {maxYears}년)</div>
                    <StepInput value={years} onChange={setYears} min={1} max={maxYears} step={1} suffix="년" />
                  </div>
                )}
                {editMode === "lump" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">초기 투자금</div>
                    <StepInput value={lump} onChange={setLump} min={0} max={1000000} step={100} suffix="만원" />
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
            {mode === "amount" ? (
              reqMonthly === 0 ? (
                <>
                  <div className="lead rv" style={{ ["--i" as string]: 1 }}>초기 투자금만으로</div>
                  <div className="num pop" style={{ ["--i" as string]: 2 }}>{target}<span className="u">억</span> <span className="u">달성</span></div>
                  <div className="span rv" style={{ ["--i" as string]: 3 }}>{yearsUsed}년 전 초기 투자금만으로 이미 {eok(result.valueKRW)} · 매달 적립 없이도 OK</div>
                </>
              ) : (
                <>
                  <div className="lead rv" style={{ ["--i" as string]: 1 }}>{yearsUsed}년 안에 {target}억, 매달</div>
                  <div className="num pop" style={{ ["--i" as string]: 2 }}>{manwonParts(animReq).n}<span className="u">{manwonParts(animReq).u}</span></div>
                  <div className="span rv" style={{ ["--i" as string]: 3 }}>
                    {tickerName(ticker)} 기준{lump > 0 ? ` · 초기 ${lump}만원 포함` : ""} · 원금 {eok(result.principalKRW)} 넣어 {eok(result.valueKRW)} 만들기
                  </div>
                </>
              )
            ) : (
              <>
                <div className={"lead rv" + (reached ? "" : " under")} style={{ ["--i" as string]: 1 }}>
                  {reached ? `${lump > 0 ? `${lump}만원으로 시작해 ` : ""}매달 ${amount}만원씩이면` : "전 구간 모아도"}
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
              </>
            )}
            {(mode === "amount" || reached) && <Confetti />}
          </div>

          <div className="card rv" style={{ ["--i" as string]: 4 }}>
            <div className="clab"><span>자산 성장 (KRW)</span><span>목표 {target}억</span></div>
            <GrowthChart
              series={mode === "time" && reached ? sliceToReached(result.series, result.reachedDate!) : result.series}
              target={targetKRW} reached={mode === "amount" ? true : reached}
            />
            <div className="stats">
              <div className="stat"><div className="k">원금</div><div className="v">{eok(animPrincipal)}</div></div>
              <div className="stat"><div className="k">최종 금액</div><div className={"v" + (mode === "amount" || reached ? " up" : "")}>{eok(result.valueKRW)}</div></div>
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

/** "YYYY-MM-DD"에서 n개월 전 달의 1일 (YYYY-MM-01). */
function startMonthsAgo(end: string, n: number): string {
  let [y, m] = end.split("-").map(Number);
  m -= n;
  while (m <= 0) { m += 12; y -= 1; }
  return `${y}-${String(m).padStart(2, "0")}-01`;
}

/** 월 적립액(KRW) → 큰 수는 억, 그 외 만원 단위 문자열. */
function manwon(won: number): string {
  const p = manwonParts(won);
  return `${p.n}${p.u}`;
}
function manwonParts(won: number): { n: string; u: string } {
  if (won >= 100_000_000) return { n: (Math.round(won / 10_000_000) / 10).toString(), u: "억" };
  return { n: Math.round(won / 10_000).toLocaleString(), u: "만원" };
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
  ticker, mode, amount, years, maxYears, lump, buyDay, onTicker, onMode, onAmount, onYears, onLump, onDay, onSubmit,
}: {
  ticker: string; mode: Mode; amount: number; years: number; maxYears: number; lump: number; buyDay: number;
  onTicker: (v: string) => void; onMode: (m: Mode) => void; onAmount: (v: number) => void; onYears: (v: number) => void; onLump: (v: number) => void; onDay: (v: number) => void; onSubmit: () => void;
}) {
  return (
    <>
      <div className="form-mid">
        <div className="modetoggle">
          <button className={mode === "time" ? "on" : ""} onClick={() => onMode("time")}>기간이 궁금</button>
          <button className={mode === "amount" ? "on" : ""} onClick={() => onMode("amount")}>금액이 궁금</button>
        </div>
        <div className="field">
          <div className="flabel">종목</div>
          <TickerSelect value={ticker} onChange={onTicker} />
        </div>
        <div className="field">
          <div className="flabel">초기 투자금</div>
          <StepInput value={lump} onChange={onLump} min={0} max={1000000} step={100} suffix="만원" />
        </div>
        {mode === "time" ? (
          <div className="field">
            <div className="flabel">매달 적립 금액</div>
            <StepInput value={amount} onChange={onAmount} min={10} max={100000} step={10} suffix="만원" />
          </div>
        ) : (
          <div className="field">
            <div className="flabel">목표 기간 (최대 {maxYears}년)</div>
            <StepInput value={years} onChange={onYears} min={1} max={maxYears} step={1} suffix="년" />
          </div>
        )}
        <div className="field">
          <div className="flabel">매수일 (매달 며칠)</div>
          <StepInput value={buyDay} onChange={onDay} min={1} max={31} step={1} suffix="일" />
        </div>
      </div>
      <div className="cta">
        <button className="btn" onClick={onSubmit}>{mode === "amount" ? "필요 금액 계산하기" : "10억까지 계산하기"}</button>
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
