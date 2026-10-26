import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button, ListRow, Switch } from "@toss/tds-mobile";
import { tickerTitle } from "@/lib/tickers";
import { NavBar, Chart, AdSlot, Avatar, ChevronRight } from "../components/ui";
import { loadRowsBy } from "../lib/data";
import { analytics, shareResult } from "../lib/platform";
import { calcPlan, commonEnd, TARGET, type Calc, type Plan, type RowsBy, shareQueryOf } from "../lib/plan";
import { saveClock } from "../lib/clock";
import { fmt, manLabel, ymKo, ymdKo, mdKo, durKo, freqAdverb, freqWord, holdingsTitle, eulReul } from "../lib/fmt";
import { CalculationBasis } from "../components/CalculationBasis";
import { RollingNumber } from "../components/RollingNumber";

export type ResultEntrance = "reveal" | "quick";

export function ResultScreen({ plan, entrance = "quick", onCalculate, calculationLabel, busy, back, onEdit, goClock, goCompare, showToast, onMenu, onClose }: {
  entrance?: ResultEntrance;
  plan: Plan; onCalculate: (p: Plan) => void; calculationLabel: (p: Plan) => string; busy: boolean; back: () => void; onEdit: () => void; goClock: () => void; goCompare: () => void; showToast: (m: string) => void; onMenu: () => void; onClose: () => void;
}) {
  const [rowsBy, setRowsBy] = useState<RowsBy | null>(null);
  const [err, setErr] = useState(false);
  const [retry, setRetry] = useState(0);
  const [optsOpen, setOptsOpen] = useState(false);
  const [reinvest, setReinvest] = useState(plan.reinvest);
  useEffect(() => setReinvest(plan.reinvest), [plan.reinvest]);
  const [tip, setTip] = useState(false);

  const tickers = plan.holdings.map((h) => h.ticker);
  const tickersKey = tickers.join(",");
  const multi = tickers.length > 1;
  useEffect(() => {
    let on = true;
    setRowsBy(null); setErr(false);
    loadRowsBy(tickers).then((r) => { if (on) setRowsBy(r); }).catch(() => { if (on) setErr(true); });
    return () => { on = false; };
  }, [tickersKey, retry]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { analytics.screen("result", { ticker: plan.ticker, holdings: tickers.length, mode: plan.mode }); }, [tickersKey, plan.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // 계산이 실패하면(데이터 이상 등) 화면을 깨뜨리지 않고 오류 상태로
  const calc: Calc | "error" | null = useMemo(() => {
    if (!rowsBy) return null;
    try { return calcPlan(rowsBy, plan); } catch (e) { console.error(e); return "error"; }
  }, [rowsBy, plan]);
  const rows = rowsBy?.[plan.ticker] ?? null;

  if (err || calc === "error") {
    return (
      <div className="screen">
        <NavBar back={back} onMenu={onMenu} onClose={onClose} />
        <div className="state">
          <div className="state-title">데이터를 불러오지 못했어요</div>
          <div className="state-desc">잠시 후 다시 시도해 주세요</div>
          <Button size="large" onClick={() => setRetry((value) => value + 1)}>다시 시도하기</Button>
        </div>
      </div>
    );
  }
  if (!calc || !rowsBy || !rows) {
    return (
      <div className="screen">
        <NavBar back={back} onMenu={onMenu} onClose={onClose} />
        <div className="state"><div className="spinner" aria-hidden="true" /><div className="state-desc">계산 중…</div></div>
      </div>
    );
  }

  if (calc.result.series.length === 0) {
    return <div className="screen">
      <NavBar back={back} onMenu={onMenu} onClose={onClose} />
      <div className="state">
        <div className="state-title">이 날짜로 계산할 자료가 없어요</div>
        <div className="state-desc">선택한 ETF의 가격 자료는 {ymdKo(commonEnd(rowsBy, plan))}까지예요. 시작일을 앞당겨 주세요.</div>
        <Button size="large" onClick={onEdit}>시작일 바꾸기</Button>
      </div>
    </div>;
  }

  const r = calc.result;
  const port = calc.portfolio;
  const names = holdingsTitle(plan);
  const adverb = freqAdverb(plan);
  const lumpStr = plan.lump > 0 ? `${manLabel(plan.lump)}으로 시작해 ` : "";
  const buyStr = `${lumpStr}${adverb} ${eulReul(names)} ${multi ? "합계 " : ""}${fmt.amount(calc.monthlyWon)}어치`;
  const start = r.series[0]?.date ?? rows[0].date;
  // 가격 기준일: 모든 종목에 가격이 있는 마지막 날(분산 매수면 종목 중 가장 이른 마지막 날)
  const end = multi ? commonEnd(rowsBy, plan) : rows[rows.length - 1].date;
  const asOf = `${mdKo(end)} 기준`;
  const limited = port?.limitedBy ? port.holdings.find((h) => h.ticker === port.limitedBy) : undefined;
  const progressPct = Math.round((r.value / TARGET) * 100);
  const reachedTime = !calc.tracking && plan.mode === "time" && r.reached && !!calc.reach;

  // 데이터가 모자라 고른 조건을 바꿔 계산했으면 한 줄로(분산 매수 limitedBy 안내와 같은 문장 꼴)
  const adj = calc.adjusted;
  const adjNote = adj
    ? adj.kind === "years"
      ? `${tickerTitle(adj.ticker)} 데이터가 ${ymKo(adj.dataStart)}부터라 ${adj.to}년으로 계산했어요`
      : `${tickerTitle(adj.ticker)} 데이터가 ${ymKo(adj.to)}부터라 그때부터 계산했어요`
    : limited ? `${tickerTitle(limited.ticker)} 데이터가 ${ymKo(limited.dataStart)}부터라 그때부터 계산했어요` : null;

  let lead: string, num: string, sub: ReactNode;
  if (calc.tracking) {
    lead = "입력한 조건으로 계산한 평가액";
    num = fmt.money(r.value);
    const state = r.value >= TARGET ? "10억을 넘었어요" : `10억까지 ${progressPct}%`;
    sub = <>{ymKo(start)}부터 {buyStr} 샀다고 계산했어요<br />{asOf} · {state} · 넣은 돈 {fmt.money(r.principal)}</>;
  } else if (plan.mode === "amount") {
    lead = `지난 ${calc.yearsUsed}년간 10억이 되려면 필요했던 금액`;
    num = calc.reqMonthly === 0 ? "처음 목돈만으로 충분했어요" : `${freqWord(plan.freq)} ${fmt.amount(calc.reqMonthly ?? 0)}`;
    sub = calc.reqMonthly === 0
      ? <>{ymKo(start)}에 {eulReul(names)} {manLabel(plan.lump)}어치 샀다면<br />{asOf} 10억이 넘었어요</>
      : <>{ymKo(start)}부터 {lumpStr}{adverb} {eulReul(names)} {fmt.amount(calc.reqMonthly ?? 0)}씩 샀다면<br />{asOf} 10억이 됐어요</>;
  } else if (reachedTime && calc.reach) {
    lead = "처음 10억을 넘기까지";
    num = durKo(r.years, r.monthsRem);
    sub = <>{ymKo(start)}부터 샀다면<br />{ymdKo(calc.reach.date)}에 처음 넘었어요.</>;
  } else {
    lead = "이 기간에는 10억을 넘지 않았어요";
    num = fmt.money(r.value);
    sub = <>{ymKo(start)}부터 {durKo(r.years, r.monthsRem)} 동안 {buyStr} 샀을 때<br />{asOf} 금액이에요</>;
  }
  const statsLabel = reachedTime ? "이후에도 계속 샀을 때" : asOf;
  const cagrPct = `${Math.abs(Math.round(r.cagr * 100))}%`;
  const amtMode = plan.mode === "amount" && !calc.tracking;
  const query = shareQueryOf(plan);

  // 공유 문구는 앞뒤 설명 없이 전달되므로 문장 안에 과거 조건(시작 시점·기간·기준일)을 담는다.
  const shareTextOf = (): string => {
    const tail = "\n\n주식으로 10억 모으기";
    const condition = `${eulReul(names)} ${adverb} ${multi ? "합계 " : ""}${fmt.amount(calc.monthlyWon)}씩 샀다면`;
    const initial = plan.lump > 0 ? `\n처음 목돈 ${manLabel(plan.lump)}` : "";
    if (calc.tracking) {
      return `꾸준히 모았다면 ${fmt.money(r.value)}\n${condition}${initial}\n${ymdKo(start)} 시작 · ${ymdKo(end)} 평가액${tail}`;
    }
    if (plan.mode === "amount") {
      return calc.reqMonthly === 0
        ? `처음 목돈만으로 10억을 넘었어요\n${ymKo(start)}에 ${eulReul(names)} ${manLabel(plan.lump)}어치 샀다면\n${ymdKo(end)} 기준${tail}`
        : `지난 ${calc.yearsUsed}년, 10억까지 필요했던 금액\n${eulReul(names)} ${adverb} ${fmt.amount(calc.reqMonthly ?? 0)}씩 샀다면${initial}\n${ymKo(start)} 시작 · ${ymdKo(end)} 기준${tail}`;
    }
    if (reachedTime && calc.reach) {
      return `10억을 처음 넘기까지 ${durKo(r.years, r.monthsRem)}\n${condition}${initial}\n${ymKo(start)} 시작 · ${ymdKo(calc.reach.date)} 첫 도달${tail}`;
    }
    return `이 기간 동안 모았다면 ${fmt.money(r.value)}\n${condition}${initial}\n${ymKo(start)} 시작 · ${ymdKo(end)} 기준, 10억 미도달${tail}`;
  };

  const share = async () => {
    analytics.click("share", { ticker: plan.ticker, holdings: tickers.length });
    const res = await shareResult(shareTextOf(), query);
    if (res === "copied") showToast("결과를 복사했어요 · 토스에서는 공유 링크로 열려요");
    if (res === "failed") showToast("지금은 공유할 수 없어요");
  };
  const save = async () => {
    let ok = false;
    try { const res: unknown = await saveClock(plan); ok = res !== false; } catch { ok = false; }
    if (!ok) { showToast("저장하지 못했어요. 다시 시도해 주세요"); return; }
    analytics.click("save_clock", { ticker: plan.ticker, holdings: tickers.length });
    showToast("계산을 저장했어요");
    goClock();
  };

  return (
    <div className={`screen result-screen result-${entrance}`}>
      <NavBar back={back} onMenu={onMenu} onClose={onClose} />
      <section className="result-hero" aria-label="계산 결과">
        {reachedTime ? <>
          <p className="result-scenario">{names}</p>
          <p className="result-contribution">{plan.freq === "daily" ? "거래일마다" : freqWord(plan.freq)} <strong>{multi ? "합계 " : ""}{fmt.amount(calc.monthlyWon)}씩</strong> 샀다면</p>
          {plan.lump > 0 && <p className="result-lump">{ymdKo(start)}에 {manLabel(plan.lump)}을 먼저 넣고 시작</p>}
          <p className="result-label">처음 10억을 넘기까지</p>
          <h1 className="result-number" aria-label={num}>
            {r.years > 0 && <span className="duration-part"><RollingNumber value={r.years} animate={entrance === "reveal"} /><small>년</small></span>}{" "}
            <span className="duration-part"><RollingNumber value={r.monthsRem} animate={entrance === "reveal"} /><small>개월</small></span>
          </h1>
        </> : <>
          <p className="result-label">{lead}</p>
          <h1 className={"result-number" + (amtMode ? " amount-number" : "")}>{num}</h1>
        </>}
        <p className="result-story">{sub}</p>
      </section>
      {reachedTime && <section className="result-current" aria-label="계속 모았을 때의 평가액">
        <p>이후에도 계속 모았다면 <strong>{fmt.money(r.value)}</strong></p>
        <p className="result-current-date">{ymdKo(end)} 기준{r.value < TARGET ? " · 다시 10억 아래로 내려왔어요." : ""}</p>
      </section>}
      {(adjNote || !reachedTime) && <div className="data-notes">
        {adjNote && <p className="data-note">{adjNote}</p>}
        {!reachedTime && <p className="data-note">{mdKo(end)} 종가 기준 · 실제 거래 기간으로 계산했어요</p>}
      </div>}

      <div className="card result-chart">
        <div className="card-head">
          <span>평가액 변화</span>
          <span className="legend"><i className="dot brand" />평가액 <i className="dot grey" />넣은 돈</span>
        </div>
        <Chart series={r.series} target={TARGET} mark={calc.reach?.date} />
        <p className="chart-help">그래프를 누르면 그때의 금액을 볼 수 있어요.</p>
        <div className="stats-label">{statsLabel}</div>
        <div className="stats">
          <div className="stat"><span className="stat-k">넣은 돈</span><span className="stat-v">{fmt.money(r.principal)}</span></div>
          <div className="stat"><span className="stat-k">평가액</span><span className="stat-v">{fmt.money(r.value)}</span></div>
          <div className="stat">
            <span className="stat-k"><button type="button" className="info" aria-label="연평균 설명" aria-expanded={tip} aria-controls="annual-return-help" onClick={() => setTip((v) => !v)}>연평균 <span aria-hidden="true">ⓘ</span></button></span>
            <span className={"stat-v " + (r.cagr >= 0 ? "up" : "down")}>{fmt.pct(r.cagr)}</span>
          </div>
        </div>
        {tip && <div id="annual-return-help" className="tip">연평균 {fmt.pct(r.cagr)}는 평가액이 1년에 평균 {cagrPct}씩 {r.cagr >= 0 ? "늘었다는" : "줄었다는"} 뜻이에요. {names} 과거 가격으로 계산했어요.</div>}
      </div>

      <div className="result-actions">
        <div className="result-share">
          <Button display="full" size="large" style={{ borderRadius: 14 }} onClick={share}>
            <span className="result-share-label"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3m-4 4 4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>결과 공유하기</span>
          </Button>
        </div>
        <Button display="full" size="large" color="dark" variant="weak" style={{ borderRadius: 14 }} onClick={onEdit}>조건 바꿔보기</Button>
        <Button display="full" size="large" color="dark" variant="weak" style={{ borderRadius: 14 }} onClick={save}>계산 저장하기</Button>
      </div>

      {port && (
        <>
          <div className="list-head"><span>종목별</span></div>
          <ul className="tds-list">
            {port.holdings.map((h) => (
              <ListRow
                key={h.ticker}
                left={<Avatar symbol={h.ticker} />}
                contents={<ListRow.Texts type="2RowTypeA" top={tickerTitle(h.ticker)} bottom={<span className="holding-result-detail"><span>{freqWord(plan.freq)} {fmt.amount(h.amountWon)}</span><span>넣은 돈 {fmt.money(h.principal)}</span></span>} />}
                right={<span className="right"><span className="row-title">{fmt.money(h.value)}</span><span className={"row-desc " + (h.cagr >= 0 ? "up" : "down")}>연평균 {fmt.pct(h.cagr)}</span></span>}
              />
            ))}
          </ul>
        </>
      )}

      <div className="list-head"><button type="button" className="text-btn" onClick={goCompare}>같은 조건으로 비교하기 <ChevronRight /></button></div>

      <ul className="tds-list">
        <ListRow
          contents={<ListRow.Texts type="2RowTypeA" top="계산 옵션" bottom={`배당 ${plan.reinvest ? "재투자" : "미반영"}`} />}
          right={<span className={"chev" + (optsOpen ? " open" : "")}><ChevronRight /></span>}
          onClick={() => setOptsOpen((v) => !v)}
          aria-expanded={optsOpen}
        />
        {optsOpen && (
          <>
            <ListRow
              contents={<ListRow.Texts type="2RowTypeA" top="배당 재투자" bottom="받은 배당으로 다시 사요" />}
              right={<Switch checked={reinvest} onChange={(_, c) => setReinvest(c)} aria-label="배당 재투자" />}
            />
            {reinvest !== plan.reinvest && <li className="row"><div><p className="data-note">바꾼 배당 조건으로 다시 계산해요.</p><Button disabled={busy} onClick={() => onCalculate({ ...plan, reinvest })}>{busy ? "계산 중…" : calculationLabel({ ...plan, reinvest })}</Button></div></li>}
          </>
        )}
      </ul>

      <CalculationBasis plan={plan} calc={calc} rowsBy={rowsBy} />

      <AdSlot />
      <p className="disc">과거 자료로 계산한 결과예요.<br />특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </div>
  );
}
