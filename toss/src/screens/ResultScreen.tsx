import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button, ListRow, Switch, Top } from "@toss/tds-mobile";
import { tickerTitle } from "@/lib/tickers";
import { NavBar, Chart, AdSlot, Avatar } from "../components/ui";
import { loadRowsBy } from "../lib/data";
import { analytics, shareResult } from "../lib/platform";
import type { WatchAd } from "../App";
import { calcPlan, calcTiming, commonEnd, TARGET, type Calc, type Plan, type RowsBy } from "../lib/plan";
import { saveClock } from "../lib/clock";
import { fmt, manLabel, ymKo, ymdKo, durKo, freqAdverb, freqLabel, freqWord, holdingsTitle, eulReul, euroRo } from "../lib/fmt";

export function ResultScreen({ plan, setPlan, watchAd, back, goClock, showToast, onMenu, onClose }: {
  plan: Plan; setPlan: (p: Plan) => void; watchAd: WatchAd; back: () => void; goClock: () => void; showToast: (m: string) => void; onMenu: () => void; onClose: () => void;
}) {
  const [rowsBy, setRowsBy] = useState<RowsBy | null>(null);
  const [err, setErr] = useState(false);
  const [timingOpen, setTimingOpen] = useState(false);
  const [optsOpen, setOptsOpen] = useState(false);
  const [tip, setTip] = useState(false);

  const tickers = plan.holdings.map((h) => h.ticker);
  const tickersKey = tickers.join(",");
  const multi = tickers.length > 1;
  const load = () => {
    let on = true;
    setRowsBy(null); setErr(false);
    loadRowsBy(tickers).then((r) => { if (on) setRowsBy(r); }).catch(() => { if (on) setErr(true); });
    return () => { on = false; };
  };
  useEffect(() => { setTimingOpen(false); return load(); }, [tickersKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { analytics.screen("result", { ticker: plan.ticker, holdings: tickers.length, mode: plan.mode }); }, [tickersKey, plan.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // 계산이 실패하면(데이터 이상 등) 화면을 깨뜨리지 않고 오류 상태로
  const calc: Calc | "error" | null = useMemo(() => {
    if (!rowsBy) return null;
    try { return calcPlan(rowsBy, plan); } catch (e) { console.error(e); return "error"; }
  }, [rowsBy, plan]);
  const rows = rowsBy?.[plan.ticker] ?? null;
  const timing = useMemo(() => (!multi && timingOpen && rows && calc && calc !== "error" ? calcTiming(rows, plan, calc.monthlyWon, Math.max(12, calc.result.months)) : null), [multi, timingOpen, rows, calc, plan]);

  if (err || calc === "error") {
    return (
      <div className="screen">
        <NavBar back={back} onMenu={onMenu} onClose={onClose} />
        <div className="state">
          <div className="state-title">데이터를 불러오지 못했어요</div>
          <div className="state-desc">잠시 후 다시 시도해 주세요</div>
          <Button size="large" onClick={() => { load(); }}>다시 시도하기</Button>
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

  const r = calc.result;
  const port = calc.portfolio;
  const names = holdingsTitle(plan);
  const adverb = freqAdverb(plan);
  const lumpStr = plan.lump > 0 ? `${manLabel(plan.lump)}으로 시작해 ` : "";
  const buyStr = `${lumpStr}${adverb} ${eulReul(names)} ${fmt.amount(calc.monthlyWon)}어치`;
  const cond = `${names}에 ${lumpStr}${freqWord(plan.freq)} ${fmt.amount(calc.monthlyWon)}, ${freqLabel(plan)}`;
  const start = r.series[0]?.date ?? rows[0].date;
  const end = multi ? commonEnd(rowsBy, plan) : rows[rows.length - 1].date;
  const limited = port?.limitedBy ? port.holdings.find((h) => h.ticker === port.limitedBy) : undefined;
  const progressPct = Math.round((r.value / TARGET) * 100);

  let lead: string, num: string, sub: ReactNode;
  if (calc.tracking) {
    lead = `${ymKo(start)}부터 모은 내 돈`;
    num = fmt.money(r.value);
    sub = r.value >= TARGET ? `10억을 넘었어요 · 원금 ${fmt.money(r.principal)}` : `10억까지 ${progressPct}% · 원금 ${fmt.money(r.principal)} · ${buyStr} 샀다고 봤어요`;
  } else if (plan.mode === "amount") {
    lead = `${calc.yearsUsed}년 안에 10억을 모으려면`;
    num = calc.reqMonthly === 0 ? "목돈만으로 충분해요" : `${freqWord(plan.freq)} ${fmt.amount(calc.reqMonthly ?? 0)}`;
    sub = `${ymKo(start)}부터 지금까지 ${lumpStr}${adverb} ${eulReul(names)} 샀다고 봤어요`;
  } else if (r.reached && calc.reach) {
    // 처음 10억을 넘은 시점까지(반짝 고점 포함, 10/22). 오늘 금액은 따로 정직하게.
    lead = "10억 모으는 데 걸린 시간";
    num = durKo(r.years, r.monthsRem);
    const today = r.value >= TARGET ? `오늘은 ${fmt.money(r.value)}이에요` : `지금은 ${fmt.money(r.value)}으로 내려왔어요`;
    sub = <>{ymKo(start)}부터 {buyStr} 샀다면, {ymdKo(calc.reach.date)}에 처음 10억을 넘었어요<br />{today}</>;
  } else {
    lead = "아직 10억은 멀어요";
    num = fmt.money(r.value);
    sub = `${ymKo(start)}부터 ${durKo(r.years, r.monthsRem)} 동안 ${buyStr} 샀을 때 금액이에요`;
  }
  const amtMode = plan.mode === "amount" && !calc.tracking;
  const pick = multi ? `h=${plan.holdings.map((h) => `${h.ticker}:${h.amount}`).join(",")}` : `t=${plan.ticker}${amtMode ? "" : `&m=${plan.amount}`}`;
  const query = `${pick}${amtMode ? `&mode=amt&y=${plan.years}` : ""}${plan.lump > 0 ? `&i=${plan.lump}` : ""}&d=${plan.buyDay}&f=${plan.freq[0]}${plan.freq === "weekly" ? `&wd=${plan.weekday}` : ""}${calc.tracking ? `&s=${plan.startDate}` : ""}${!plan.reinvest ? "&div=0" : ""}`;

  const share = async () => {
    analytics.click("share", { ticker: plan.ticker, holdings: tickers.length });
    const text = calc.tracking
      ? `${cond} 모은 내 돈 ${fmt.money(r.value)} · 10억까지 ${progressPct}% — 10억 모으기`
      : plan.mode === "amount"
      ? `${euroRo(names)} ${calc.yearsUsed}년 안에 10억 모으려면 ${freqWord(plan.freq)} ${fmt.amount(calc.reqMonthly ?? 0)} — 10억 모으기`
      : r.reached
        ? `${cond} 모았다면 10억까지 ${durKo(r.years, r.monthsRem)} — 10억 모으기`
        : `${cond} 모았다면 지금 ${fmt.money(r.value)} — 10억 모으기`;
    const res = await shareResult(text, query);
    if (res === "copied") showToast("결과를 복사했어요 · 토스에서는 공유 링크로 열려요");
    if (res === "failed") showToast("지금은 공유할 수 없어요");
  };
  const openTiming = () => watchAd("timing", () => { setTimingOpen(true); analytics.click("timing_unlocked"); }, { desc: "끝까지 보면 분석이 열려요.", cta: "분석 열기" });

  return (
    <div className="screen">
      <NavBar back={back} onMenu={onMenu} onClose={onClose} />
      <Top
        upperGap={16}
        lowerGap={8}
        subtitleTop={<Top.SubtitleParagraph size={15}>{lead}</Top.SubtitleParagraph>}
        title={<Top.TitleParagraph size={28}>{num}</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>{sub}</Top.SubtitleParagraph>}
      />

      <div className="card">
        <div className="card-head">
          <span>자산 성장</span>
          <span className="legend"><i className="dot brand" />평가액 <i className="dot grey" />넣은 돈</span>
        </div>
        <Chart series={r.series} target={TARGET} mark={calc.reach?.date} />
        <div className="stats">
          <div className="stat"><span className="stat-k">넣은 돈</span><span className="stat-v">{fmt.money(r.principal)}</span></div>
          <div className="stat"><span className="stat-k">평가액</span><span className="stat-v">{fmt.money(r.value)}</span></div>
          <div className="stat">
            <span className="stat-k">연평균 <button type="button" className="info" aria-label="연평균 설명" aria-expanded={tip} onClick={() => setTip((v) => !v)}>ⓘ</button></span>
            <span className={"stat-v " + (r.cagr >= 0 ? "up" : "down")}>{fmt.pct(r.cagr)}</span>
          </div>
        </div>
        {tip && <div className="tip">연평균 {fmt.pct(r.cagr)}는 1년에 평균 이만큼씩 늘었다는 뜻이에요. ({names} 과거 수익률 기준)</div>}
      </div>

      {port && (
        <>
          <div className="list-head"><span>종목별</span></div>
          {limited && <p className="seg-note">{tickerTitle(limited.ticker)} 데이터가 {ymKo(limited.dataStart)}부터라 그때부터 계산했어요</p>}
          <ul className="tds-list">
            {port.holdings.map((h) => (
              <ListRow
                key={h.ticker}
                left={<Avatar symbol={h.ticker} />}
                contents={<ListRow.Texts type="2RowTypeA" top={tickerTitle(h.ticker)} bottom={`${freqWord(plan.freq)} ${fmt.amount(h.amountWon)} · 넣은 돈 ${fmt.money(h.principal)}`} />}
                right={<span className="right"><span className="row-title">{fmt.money(h.value)}</span><span className={"row-desc " + (h.cagr >= 0 ? "up" : "down")}>연평균 {fmt.pct(h.cagr)}</span></span>}
              />
            ))}
          </ul>
        </>
      )}

      <ul className="tds-list">
        <ListRow
          contents={<ListRow.Texts type="2RowTypeA" top="계산 옵션" bottom={`배당 ${plan.reinvest ? "재투자" : "미반영"}`} />}
          withArrow
          onClick={() => setOptsOpen((v) => !v)}
          aria-expanded={optsOpen}
        />
        {optsOpen && (
          <>
            <ListRow
              contents={<ListRow.Texts type="2RowTypeA" top="배당 재투자" bottom="받은 배당으로 다시 사요" />}
              right={<Switch checked={plan.reinvest} onChange={(_, c) => setPlan({ ...plan, reinvest: c })} aria-label="배당 재투자" />}
            />
          </>
        )}
      </ul>

      <div className="card brand-card">
        <div className="card-title">이 조건, 매일 확인할래요?</div>
        <div className="card-desc">저장하면 매일 아침 7시 30분 새 종가로 다시 계산해요. 열 때마다 어제보다 10억에 얼마나 가까워졌는지 볼 수 있어요.</div>
        <Button display="full" size="large" onClick={async () => { await saveClock(plan); analytics.click("save_clock", { ticker: plan.ticker, holdings: tickers.length }); showToast("내 10억 시계에 저장했어요"); goClock(); }}>내 10억 시계로 저장하기</Button>
      </div>

      <ul className="tds-list">
        {!timingOpen && !multi ? (
          <ListRow
            contents={<ListRow.Texts type="2RowTypeA" top="시작 시점에 따른 차이 보기" bottom="운 좋은 달과 나쁜 달은 얼마나 달랐을까요" />}
            right={<span className="pill brand">▶ 광고 보고 열기</span>}
            onClick={openTiming}
          />
        ) : null}
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="결과 공유하기" />} withArrow onClick={share} />
      </ul>
      {timingOpen && !multi && (
        <div className="card">
          <div className="card-title">시작 시점에 따른 결과</div>
          <div className="card-desc">같은 조건으로 {Math.max(12, r.months)}개월씩 모으되, 시작 달만 바꿔 {timing?.samples ?? 0}번 계산했어요.</div>
          {timing ? (
            <div className="timing">
              <div className="timing-row"><span className="k">가장 안 좋을 때</span><span className="v down">{fmt.money(timing.min)}</span><span className="d">{ymKo(timing.minStart)} 시작</span></div>
              <div className="timing-row"><span className="k">중간</span><span className="v">{fmt.money(timing.median)}</span><span className="d">절반은 이보다 많았어요</span></div>
              <div className="timing-row"><span className="k">가장 좋을 때</span><span className="v up">{fmt.money(timing.max)}</span><span className="d">{ymKo(timing.maxStart)} 시작</span></div>
            </div>
          ) : <div className="card-desc">표본이 부족해 계산할 수 없어요.</div>}
        </div>
      )}

      <AdSlot />
      <p className="disc">과거 데이터로 계산한 참고용 결과예요. 특정 종목을 추천하지 않고, 미래 수익을 보장하지 않아요. 가격 Yahoo Finance · 환율 FRED</p>
    </div>
  );
}
