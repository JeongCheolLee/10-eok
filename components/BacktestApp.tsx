"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Row } from "@/lib/backtest/types";
import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import { runToToday, requiredMonthly, timingRange, monthsBetween } from "@/lib/backtest/simulate";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";
import { GrowthChart } from "@/components/GrowthChart";
import { MonthlyLog } from "@/components/MonthlyLog";
import { monthlySnapshots } from "@/lib/backtest/monthly";
import { TickerLogo } from "@/components/TickerLogo";
import type { Locale } from "@/lib/i18n/locales";
import { getMarket, type Market } from "@/lib/i18n/markets";
import { getFormatter } from "@/lib/i18n/format";
import { getDict, type Dict } from "@/lib/i18n/dict";
import { TICKERS, type TickerInfo, tickerInfo, tickerName, tickerTitle, tickerSubtitle, tickerCurrency } from "@/lib/tickers";
import { tickerDesc } from "@/lib/i18n/tickerNames";


type Screen = "intro" | "form" | "loading" | "result";
type Mode = "time" | "amount"; // time=기간이 궁금(정방향), amount=금액이 궁금(역산)
type Initial = { ticker: string; mode: Mode; amount: number; years: number; lump: number; buyDay: number; target: number; infl: boolean; reinvest: boolean; tax: boolean } | null;

/** 매수일 표시: 29일 이상은 '말일'(그 달 마지막 거래일)로 계산·표시. 라벨은 로케일 사전에서. */
const dayLabel = (day: number, t: Dict["calc"]["day"]) => (day >= 29 ? t.last : t.nth(day));

/** <b> 강조가 문장 중간에 든 카피 파츠를 렌더 (사전은 순수 데이터, <b> 구조는 컴포넌트에서). */
function BoldLine({ p }: { p: { pre: string; bold: string; post: string } }) {
  return <>{p.pre}<b>{p.bold}</b>{p.post}</>;
}

export function BacktestApp({ initial, locale }: { initial: Initial; locale: Locale }) {
  const market = getMarket(locale);
  const fmt = getFormatter(locale);
  const d = getDict(locale);
  // 이 시장에서 고를 수 있는 종목(설정 순서 유지)
  const marketTickers = useMemo(() => TICKERS.filter((t) => market.tickers.includes(t.symbol)), [market]);

  const [ticker, setTicker] = useState(initial?.ticker ?? market.tickers[0]);
  const [mode, setMode] = useState<Mode>(initial?.mode ?? "time");
  const [amount, setAmount] = useState(initial?.amount ?? market.monthly.default); // 시장 입력 단위(ko 만원)
  const [years, setYears] = useState(initial?.years ?? 10); // 역산 모드: 목표 기간(년)
  const [lump, setLump] = useState(initial?.lump ?? market.lump.default); // 초기 투자금 (시장 입력 단위)
  const [buyDay, setBuyDay] = useState(Math.min(initial?.buyDay ?? 1, 29)); // 29 = 말일(29~31 통합)
  const [target, setTarget] = useState(initial?.target ?? market.goal.default); // 시장 입력 단위(ko 억)
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
  // 환율은 통화별 1파일 — 종목이 바뀌어도 재사용하도록 프라미스를 캐시.
  const fxRef = useRef<Promise<FxBundle> | null>(null);

  // 선택 종목 로드: px(가격) + fx(환율) 분리 파일을 받아 합성 (캐시)
  useEffect(() => {
    let cancel = false;
    const cached = cacheRef.current[ticker];
    if (cached) { setRows(cached); return; }
    setRows(null);
    const fetchJson = (path: string) =>
      fetch(path).then((r) => { if (!r.ok) throw new Error(path); return r.json(); });
    const pxP: Promise<PxBundle> = fetchJson(`/data/px/${ticker.toLowerCase()}.json`);
    // 자산 통화 = 타깃 통화면 환율 불필요(ko의 KODEX, en의 USD 종목). 그 외엔 시장 환율 파일 1회 로드·재사용.
    const fxP: Promise<FxBundle | null> =
      tickerCurrency(ticker) === market.currency || !market.fxFile
        ? Promise.resolve(null)
        : (fxRef.current ??= fetchJson(`/data/${market.fxFile}`));
    Promise.all([pxP, fxP])
      .then(([px, fx]) => { if (cancel) return; const rw = composeRows(px, fx); cacheRef.current[ticker] = rw; setRows(rw); })
      .catch(() => { if (!cancel) { fxRef.current = null; setLoadErr(true); } });
    return () => { cancel = true; };
  }, [ticker, market]);

  // 물가연동용 CPI 1회 로드
  useEffect(() => {
    if (!market.cpiFile) { setCpi(null); return; }
    fetch(`/data/${market.cpiFile}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j?.series) setCpi(j.series.map(([ym, idx]: [string, number]) => ({ ym, idx }))); })
      .catch(() => {});
  }, [market]);

  // 목표·적립·목돈을 시장 입력 단위 → 통화값으로 (ko: 억=1e8, 만원=1e4)
  const goalValue = target * market.goal.unit;
  const goalStr = fmt.milestone(goalValue); // 목표 라벨 ("10억" | "$1M")
  const goalParts = fmt.amountParts(goalValue); // 히어로 큰 숫자용 숫자/단위 분리
  // 종목 데이터로 가능한 최대 기간(년). 역산 모드 기간 입력 상한.
  const maxYears = rows ? Math.max(1, Math.floor(monthsBetween(rows[0].date, rows[rows.length - 1].date) / 12)) : 40;
  const yearsUsed = Math.min(years, maxYears);

  const calc = useMemo(() => {
    if (!rows) return null;
    const opts = { initial: lump * market.lump.unit, buyDay, target: goalValue, cpi: infl && cpi ? cpi : undefined, reinvestDividends: reinvest, taxMode: tax && tickerCurrency(ticker) === "USD" };
    if (mode === "time") {
      return { result: runToToday(rows, { monthly: amount * market.monthly.unit, ...opts }), reqMonthly: null as number | null };
    }
    const endDate = rows[rows.length - 1].date;
    const startDate = startMonthsAgo(endDate, yearsUsed * 12);
    const { monthly, result } = requiredMonthly(rows, { monthly: 0, startDate, ...opts });
    return { result, reqMonthly: monthly };
  }, [rows, mode, amount, years, maxYears, lump, buyDay, goalValue, infl, cpi, reinvest, tax, ticker]); // eslint-disable-line

  const result = calc?.result ?? null;
  const reqMonthly = calc?.reqMonthly ?? null;

  // 데이터 특성 안내: 상장 이전을 유사 지수로 합성 접합한 종목(splice) / 이력이 짧은 종목(shortHistory).
  const tinfo = tickerInfo(ticker);
  const dataNote = tinfo.splice
    ? d.calc.dataNote.synthetic(tinfo.splice.label)
    : tinfo.shortHistory
      ? d.calc.dataNote.short
      : null;

  // 타이밍 리스크: 같은 플랜·같은 기간을 시작 시점만 바꿔봤을 때의 최종 평가액 폭
  const timing = useMemo(() => {
    if (!rows || !result) return null;
    const monthly = mode === "amount" ? (reqMonthly ?? 0) : amount * market.monthly.unit;
    const dur = mode === "amount" ? yearsUsed * 12 : result.months;
    if (dur < 12) return null; // 1년 미만은 표본/의미 부족
    return timingRange(rows, { monthly, initial: lump * market.lump.unit, buyDay, cpi: infl && cpi ? cpi : undefined, reinvestDividends: reinvest, taxMode: tax && tickerCurrency(ticker) === "USD" }, dur);
  }, [rows, mode, amount, reqMonthly, result?.months, yearsUsed, lump, buyDay, infl, cpi, reinvest, tax, ticker]); // eslint-disable-line

  // 차트/월별 표에 쓰는 시계열: 기간 모드에서 도달했으면 도달일까지 잘라 여정만 보여준다.
  const chartSeries = useMemo(() => {
    if (!result) return [];
    return mode === "time" && result.reached ? sliceToReached(result.series, result.reachedDate!) : result.series;
  }, [result, mode]);
  // 월별 스냅샷 (각 달 마지막 거래일). 표시 구간과 동일한 series에서 파생.
  const monthly = useMemo(() => monthlySnapshots(chartSeries), [chartSeries]);

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
    // 경로는 현재 로케일 경로 유지(/, /en 등) — "/" 하드코딩 시 영어 화면에서 주소가 한국어 루트로 바뀐다
    if (screen === "result") window.history.replaceState(null, "", `${location.pathname}?${query}`);
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
  const animPrincipal = useAnimatedNumber(result?.principal ?? 0, screen === "result" ? 1000 : 0);
  const animReq = useAnimatedNumber(reqMonthly ?? 0, screen === "result" ? 1000 : 0);
  const reached = !!result?.reached;
  const heroMonths = Math.round(animMonths);

  // 타이밍 카드 브릿지: 히어로 숫자(운 좋은 특정 시작)와 중앙값을 잇는 한 줄. 입력에 따라 참이 되도록 분기.
  const timingBridge = useMemo(() => {
    if (!timing || !result) return null;
    const med = timing.median;
    const tgt = goalValue;
    const medRough = fmt.approx(med);
    const goal = fmt.milestone(goalValue);
    if (result.reached && med < tgt) {
      return d.calc.timing.bridge.reachedMedianBelow(fmt.money(result.value), medRough, goal);
    }
    if (result.reached && med >= tgt) {
      return d.calc.timing.bridge.reachedMedianAbove(medRough, goal, fmt.money(timing.min));
    }
    return d.calc.timing.bridge.notReached(medRough, fmt.money(timing.min), fmt.money(timing.max));
  }, [timing, result, goalValue, target]); // eslint-disable-line

  function submit() {
    setScreen("loading");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setScreen("result"), reduce ? 0 : 900);
  }
  function share() {
    const url = `${location.origin}/?${query}`;
    const name = tickerDesc(ticker, locale);
    const text =
      mode === "amount"
        ? (reqMonthly === 0
            ? d.calc.share.lumpOnly(name, goalStr)
            : d.calc.share.amountMode(name, yearsUsed, goalStr, fmt.amount(reqMonthly ?? 0)))
        : reached
          ? d.calc.share.timeReached(name, lump > 0 ? fmt.unitAmount(lump, market.lump.unitLabel) : "", fmt.unitAmount(amount, market.monthly.unitLabel), goalStr, result!.years, result!.monthsRem)
          : d.calc.share.timeNotReached(name, goalStr);
    if (navigator.share) { navigator.share({ title: "10-eok", text, url }).catch(() => {}); }
    else { navigator.clipboard?.writeText(`${text} ${url}`); setToast(d.calc.toast.linkCopied); window.setTimeout(() => setToast(""), 2000); }
  }

  if (loadErr) {
    return (
      <div className="overlay">
        <div className="ov-msg">{d.calc.error.loadFailed.line1}<br />{d.calc.error.loadFailed.line2}</div>
        <button className="btn" style={{ width: "auto", padding: "14px 28px" }} onClick={() => location.reload()}>{d.calc.error.retry}</button>
      </div>
    );
  }

  return (
    <main className="app">
      <div className="top">
        {screen === "result" && <div className="tag">{d.calc.result.tapToEdit}</div>}
      </div>

      {screen === "intro" && <Intro onStart={() => setScreen("form")} tickerCount={marketTickers.length} t={d.calc.intro} />}

      {screen === "form" && (
        <Form
          ticker={ticker} mode={mode} amount={amount} years={years} maxYears={maxYears} lump={lump} buyDay={buyDay}
          market={market} tickers={marketTickers} t={d.calc}
          onTicker={setTicker} onMode={setMode} onAmount={setAmount} onYears={setYears} onLump={setLump} onDay={setBuyDay} onSubmit={submit}
        />
      )}

      {(screen === "loading" || (screen === "result" && !result)) && (
        <div className="overlay">
          <div className="spinner" />
          <div className="ov-msg">{d.calc.loading.calculating}</div>
        </div>
      )}

      {screen === "result" && result && (
        <div className="reveal" key={revealKey}>
          <div className="modetoggle rv" style={{ ["--i" as string]: 0 }}>
            <button className={mode === "time" ? "on" : ""} aria-pressed={mode === "time"} onClick={() => { setMode("time"); setEditMode(null); }}>{d.calc.mode.timeTab}</button>
            <button className={mode === "amount" ? "on" : ""} aria-pressed={mode === "amount"} onClick={() => { setMode("amount"); setEditMode(null); }}>{d.calc.mode.amountTab}</button>
          </div>
          <p className="mode-cap rv" style={{ ["--i" as string]: 0, marginBottom: 10 }}>
            <BoldLine p={mode === "time" ? d.calc.mode.capTime(goalStr) : d.calc.mode.capAmount(goalStr)} />
          </p>
          <div className="chips-wrap" ref={chipsRef}>
            <div className="chips">
              <button className={"chip rv" + (editMode === "ticker" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "ticker" ? null : "ticker"))}>
                <div className="k">{d.calc.chip.ticker}</div><div className="v vrow"><TickerLogo symbol={ticker} size={18} />{tickerTitle(ticker)}</div>
              </button>
              {mode === "time" ? (
                <button className={"chip rv" + (editMode === "amount" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "amount" ? null : "amount"))}>
                  <div className="k">{d.calc.chip.monthly}</div><div className="v">{fmt.unitAmount(amount, market.monthly.unitLabel)}</div>
                </button>
              ) : (
                <button className={"chip rv" + (editMode === "years" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "years" ? null : "years"))}>
                  <div className="k">{d.calc.chip.period}</div><div className="v">{d.calc.chip.periodValue(yearsUsed)}</div>
                </button>
              )}
              <button className={"chip rv" + (editMode === "lump" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "lump" ? null : "lump"))}>
                <div className="k">{d.calc.chip.lump}</div><div className="v">{lump > 0 ? fmt.unitAmount(lump, market.lump.unitLabel) : d.calc.chip.none}</div>
              </button>
              <button className={"chip rv" + (editMode === "day" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "day" ? null : "day"))}>
                <div className="k">{d.calc.chip.buyDay}</div><div className="v">{dayLabel(buyDay, d.calc.day)}</div>
              </button>
              <button className={"chip rv" + (editMode === "target" ? " open" : "")} style={{ ["--i" as string]: 0 }} onClick={() => setEditMode((m) => (m === "target" ? null : "target"))}>
                <div className="k">{d.calc.chip.goal}</div><div className="v">{goalStr}</div>
              </button>
            </div>
            {editMode && (
              <div className="chip-dropdown rv" style={{ ["--i" as string]: 0 }}>
                {editMode === "ticker" && (
                  <TickerSelect value={ticker} tickers={marketTickers} onChange={(s) => { setTicker(s); setEditMode(null); }} t={d.calc.select} locale={locale} />
                )}
                {editMode === "amount" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">{d.calc.dropdown.monthlyLabel}</div>
                    <StepInput value={amount} onChange={setAmount} min={market.monthly.min} max={market.monthly.max} step={market.monthly.step} suffix={market.monthly.unitLabel} t={d.calc.stepper} />
                  </div>
                )}
                {editMode === "years" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">{d.calc.dropdown.yearsLabel(maxYears)}</div>
                    <StepInput value={years} onChange={setYears} min={1} max={maxYears} step={1} suffix={d.calc.units.years} t={d.calc.stepper} />
                  </div>
                )}
                {editMode === "lump" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">{d.calc.dropdown.lumpLabel}</div>
                    <StepInput value={lump} onChange={setLump} min={market.lump.min} max={market.lump.max} step={market.lump.step} suffix={market.lump.unitLabel} t={d.calc.stepper} />
                  </div>
                )}
                {editMode === "day" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">{d.calc.dropdown.buyDayLabel}</div>
                    <StepInput value={buyDay} onChange={setBuyDay} min={1} max={29} step={1} suffix={d.calc.units.day} labelOverride={(v) => (v >= 29 ? d.calc.day.last : null)} t={d.calc.stepper} />
                  </div>
                )}
                {editMode === "target" && (
                  <div className="chip-dropdown-field">
                    <div className="chip-dropdown-label">{d.calc.dropdown.goalLabel}</div>
                    <StepInput value={target} onChange={setTarget} min={market.goal.min} max={market.goal.max} step={market.goal.step} suffix={market.goal.unitLabel} t={d.calc.stepper} />
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
                  <div className="lead rv" style={{ ["--i" as string]: 1 }}>{d.calc.hero.lumpOnlyLead}</div>
                  <div className="num pop" style={{ ["--i" as string]: 2 }}>{goalParts.n}<span className="u">{goalParts.u}</span> <span className="u">{d.calc.hero.achieved}</span></div>
                  <div className="span rv" style={{ ["--i" as string]: 3 }}>{d.calc.hero.lumpOnlySpan(yearsUsed, fmt.money(result.value))}</div>
                </>
              ) : (
                <>
                  <div className="lead rv" style={{ ["--i" as string]: 1 }}>{d.calc.hero.amountLead(yearsUsed, goalStr)}</div>
                  <div className="num pop" style={{ ["--i" as string]: 2 }}>{fmt.amountParts(animReq).n}<span className="u">{fmt.amountParts(animReq).u}</span></div>
                  <div className="span rv" style={{ ["--i" as string]: 3 }}>
                    {d.calc.hero.amountSpan(tickerDesc(ticker, locale), lump > 0 ? fmt.unitAmount(lump, market.lump.unitLabel) : "", fmt.money(result.principal), fmt.money(result.value))}
                  </div>
                </>
              )
            ) : (
              <>
                <div className={"lead rv" + (reached ? "" : " under")} style={{ ["--i" as string]: 1 }}>
                  {reached ? d.calc.hero.timeLeadReached(lump > 0 ? fmt.unitAmount(lump, market.lump.unitLabel) : "", fmt.unitAmount(amount, market.monthly.unitLabel)) : d.calc.hero.timeLeadUnder}
                </div>
                <div className="num pop" style={{ ["--i" as string]: 2 }}>
                  {Math.floor(heroMonths / 12)}<span className="u">{d.calc.hero.durYear}</span> {heroMonths % 12}<span className="u">{d.calc.hero.durMonth}</span>
                  {reached && <span className="u">{d.calc.hero.durIn}</span>}
                </div>
                <div className="span rv" style={{ ["--i" as string]: 3 }}>
                  {reached
                    ? d.calc.hero.timeSpanReached(goalStr, result.series[0] ? fmt.ym(result.series[0].date) : "", fmt.money(result.value))
                    : d.calc.hero.timeSpanUnder(result.series[0] ? fmt.ym(result.series[0].date) : "", fmt.rough(result.value), goalStr)}
                </div>
              </>
            )}
            {(mode === "amount" || reached) && <Confetti />}
          </div>

          <div className="card rv" style={{ ["--i" as string]: 4 }}>
            <div className="clab"><span>{d.calc.card.growthTitle(market.currency)}</span><span>{d.calc.card.goalLabel(goalStr)}</span></div>
            <GrowthChart
              series={chartSeries}
              target={goalValue} reached={mode === "amount" ? true : reached} locale={locale}
            />
            <div className="stats">
              <div className="stat"><div className="k">{d.calc.stat.principal}</div><div className="v">{fmt.money(animPrincipal)}</div></div>
              <div className="stat"><div className="k">{d.calc.stat.finalValue}</div><div className={"v" + (mode === "amount" || reached ? " up" : "")}>{fmt.money(result.value)}</div></div>
              <div className="stat" style={{ cursor: "help" }} onClick={() => setTipOpen((v) => !v)}>
                <div className="k">{d.calc.stat.cagr} ⓘ</div><div className="v up">{fmt.pct(result.cagr)}</div>
              </div>
            </div>
          </div>

          {dataNote && <p className="data-note rv" style={{ ["--i" as string]: 4 }}>ⓘ {dataNote}</p>}

          {tipOpen && <div id="tip">{d.calc.tip.cagr(fmt.pct(result.cagr))}</div>}

          {timing && (
            <div className="card rv" style={{ ["--i" as string]: 5 }}>
              <div className="clab"><span>{d.calc.timing.title}</span></div>
              <p className="timing-lead"><BoldLine p={d.calc.timing.lead(fmt.amount(mode === "amount" ? (reqMonthly ?? 0) : amount * market.monthly.unit), Math.round((mode === "amount" ? yearsUsed * 12 : result.months) / 12))} /></p>
              <div className="stats" style={{ borderTop: 0, paddingTop: 0, marginTop: 4 }}>
                <div className="stat"><div className="k">{d.calc.timing.worst}</div><div className="v">{fmt.money(timing.min)}</div></div>
                <div className="stat"><div className="k">{d.calc.timing.median}</div><div className="v">{fmt.money(timing.median)}</div></div>
                <div className="stat"><div className="k">{d.calc.timing.best}</div><div className="v up">{fmt.money(timing.max)}</div></div>
              </div>
              {timingBridge && <p className="timing-lead" style={{ marginTop: 10, color: "var(--ink)" }}>{timingBridge}</p>}
              <div className="timing-note">{d.calc.timing.note(fmt.ym(timing.minStart), fmt.ym(timing.maxStart), timing.samples)}</div>
            </div>
          )}

          {monthly.length > 0 && (
            <div className="card rv" style={{ ["--i" as string]: 6 }}>
              <div className="clab"><span>{d.calc.card.monthlyLogTitle}</span><span>{d.calc.card.buyDaySummary(dayLabel(buyDay, d.calc.day), mode === "amount" ? fmt.amount(reqMonthly ?? 0) : fmt.unitAmount(amount, market.monthly.unitLabel))}</span></div>
              <p className="loglead">{d.calc.card.monthlyLogLead}</p>
              <MonthlyLog months={monthly} target={goalValue} locale={locale} />
            </div>
          )}

          <div className="opts rv" style={{ ["--i" as string]: 7 }}>
            {market.cpiFile && (
              <label className="opt">
                <span>{d.calc.opt.inflationLabel} <i>{d.calc.opt.inflationDesc}</i></span>
                <input type="checkbox" checked={infl} onChange={(e) => setInfl(e.target.checked)} />
              </label>
            )}
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

          <div className="btnrow rv" style={{ ["--i" as string]: 8, marginBottom: 24 }}>
            <button className="btn share" onClick={share}>{d.calc.result.shareButton}</button>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function sliceToReached<T extends { date: string }>(series: T[], reachedDate: string): T[] {
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

function Confetti() {
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} style={{ ["--n" as string]: i }} />
      ))}
    </div>
  );
}

function StepInput({ value, onChange, min, max, step, suffix, bare, labelOverride, t }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix: string; bare?: boolean;
  /** 특정 값에서 숫자 입력 대신 정적 라벨을 보여줄 때 (예: 매수일 29 → '말일'). null이면 기본 숫자 입력. */
  labelOverride?: (v: number) => string | null;
  t: { decrease: string; increase: string };
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => { setText(String(value)); }, [value]);
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const commit = (raw: string) => {
    const n = parseInt(raw, 10);
    onChange(Number.isFinite(n) ? clamp(n) : value);
  };
  const label = labelOverride ? labelOverride(value) : null;
  return (
    <div className={"stepper" + (bare ? " bare" : "")}>
      <button type="button" aria-label={t.decrease} onClick={() => onChange(clamp(value - step))}>−</button>
      <div className="val">
        {label != null ? (
          <span className="static">{label}</span>
        ) : (
          <>
            <input
              inputMode="numeric"
              value={text}
              onChange={(e) => setText(e.target.value.replace(/[^0-9]/g, ""))}
              onBlur={(e) => commit(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            />
            <span className="suffix">{suffix}</span>
          </>
        )}
      </div>
      <button type="button" aria-label={t.increase} onClick={() => onChange(clamp(value + step))}>+</button>
    </div>
  );
}

function Intro({ onStart, tickerCount, t }: { onStart: () => void; tickerCount: number; t: Dict["calc"]["intro"] }) {
  return (
    <>
      <div className="intro-mid">
        <h1><b>{t.titleBold}</b>,<br />{t.titleRest}</h1>
        <div className="sub">{t.sub.pre}<b>{t.sub.bold}</b>{t.sub.post}</div>
        <div className="intro-disc">{t.disclaimer}</div>
      </div>
      <div className="cta">
        <button className="btn" onClick={onStart}>{t.startButton}</button>
        <div className="hint">{t.hint(tickerCount)}</div>
      </div>
    </>
  );
}

function Form({
  ticker, mode, amount, years, maxYears, lump, buyDay, market, tickers, t, onTicker, onMode, onAmount, onYears, onLump, onDay, onSubmit,
}: {
  ticker: string; mode: Mode; amount: number; years: number; maxYears: number; lump: number; buyDay: number;
  market: Market; tickers: TickerInfo[]; t: Dict["calc"];
  onTicker: (v: string) => void; onMode: (m: Mode) => void; onAmount: (v: number) => void; onYears: (v: number) => void; onLump: (v: number) => void; onDay: (v: number) => void; onSubmit: () => void;
}) {
  return (
    <>
      <div className="form-mid">
        <div>
          <div className="modetoggle">
            <button className={mode === "time" ? "on" : ""} aria-pressed={mode === "time"} onClick={() => onMode("time")}>{t.mode.timeTab}</button>
            <button className={mode === "amount" ? "on" : ""} aria-pressed={mode === "amount"} onClick={() => onMode("amount")}>{t.mode.amountTab}</button>
          </div>
          <p className="mode-cap">
            <BoldLine p={mode === "time" ? t.form.capTime : t.form.capAmount} />
          </p>
        </div>
        <div className="field">
          <div className="flabel">{t.form.tickerLabel}</div>
          <TickerSelect value={ticker} tickers={tickers} onChange={onTicker} t={t.select} locale={market.locale} />
        </div>
        <div className="field">
          <div className="flabel">{t.form.lumpLabel}</div>
          <StepInput value={lump} onChange={onLump} min={market.lump.min} max={market.lump.max} step={market.lump.step} suffix={market.lump.unitLabel} t={t.stepper} />
        </div>
        {mode === "time" ? (
          <div className="field">
            <div className="flabel">{t.form.monthlyLabel}</div>
            <StepInput value={amount} onChange={onAmount} min={market.monthly.min} max={market.monthly.max} step={market.monthly.step} suffix={market.monthly.unitLabel} t={t.stepper} />
          </div>
        ) : (
          <div className="field">
            <div className="flabel">{t.form.yearsLabel(maxYears)}</div>
            <StepInput value={years} onChange={onYears} min={1} max={maxYears} step={1} suffix={t.units.years} t={t.stepper} />
          </div>
        )}
        <div className="field">
          <div className="flabel">{t.form.buyDayLabel}</div>
          <StepInput value={buyDay} onChange={onDay} min={1} max={29} step={1} suffix={t.units.day} labelOverride={(v) => (v >= 29 ? t.day.last : null)} t={t.stepper} />
        </div>
      </div>
      <div className="cta">
        <button className="btn" onClick={onSubmit}>{mode === "amount" ? t.form.submitAmount : t.form.submitTime}</button>
      </div>
    </>
  );
}

function TickerSelect({ value, tickers, onChange, t, locale }: { value: string; tickers: TickerInfo[]; onChange: (s: string) => void; t: Dict["calc"]["select"]; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  // 부제(카테고리)는 로케일별. ko는 기존 tickerSubtitle(한국 주식/한국어 이름), en/ja/de는 tickerDesc 번역.
  const subOf = (sym: string) => (locale === "ko" ? tickerSubtitle(sym) : tickerDesc(sym, locale));
  const list = tickers.filter((it) => !s || it.symbol.toLowerCase().includes(s) || subOf(it.symbol).toLowerCase().includes(s));
  return (
    <div className="select">
      <button className="select-btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="select-cur">
          <TickerLogo symbol={value} size={26} />
          <span className="pcol"><span className="pn">{tickerTitle(value)}</span><span className="ps">{subOf(value)}</span></span>
        </span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div className="select-panel">
          <input className="select-search" placeholder={t.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          <div className="select-list">
            {list.map((it) => (
              <button key={it.symbol} className={"select-item" + (it.symbol === value ? " sel" : "")} onClick={() => { onChange(it.symbol); setOpen(false); setQ(""); }}>
                <TickerLogo symbol={it.symbol} size={28} />
                <span className="pcol"><span className="pn">{tickerTitle(it.symbol)}</span><span className="ps">{subOf(it.symbol)}</span></span>
              </button>
            ))}
            {list.length === 0 && <div className="select-empty">{t.empty}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
