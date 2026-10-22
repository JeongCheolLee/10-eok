import { useEffect, useState } from "react";
import { ListRow, TextButton, Top } from "@toss/tds-mobile";
import { TOSS_TICKERS, tickerTitle } from "@/lib/tickers";
import { tossSubtitle } from "../lib/groups";
import { NavBar, Avatar } from "../components/ui";
import { loadRows } from "../lib/data";
import { analytics } from "../lib/platform";
import { calcPlan, singlePlan, totalAmount, type Plan } from "../lib/plan";
import { fmt, mdKo, durKo, freqAdverb, freqWord, manLabel } from "../lib/fmt";

type RowOut = { symbol: string; reached: boolean; years: number; monthsRem: number; months: number; value: number; cagr: number; dataEnd?: string };
// 웹용 요약에는 상장 전 추정치가 섞여 있다. 비교도 실제 거래 이력으로 직접 계산한다.
/** 도달 종목은 빠른 순, 미달 종목은 평가액 큰 순(generator/summary.ts와 같은 규칙). */
function sortRows(rows: RowOut[]): RowOut[] {
  return [...rows].sort((a, b) => (a.reached !== b.reached ? (a.reached ? -1 : 1) : a.reached ? a.months - b.months : b.value - a.value));
}
/** 한 종목을 직접 계산. 데이터를 못 받으면 throw(loadRows 그대로) — 호출부가 '빠진 종목'으로 모은다. */
async function calcRow(symbol: string, p: Plan, monthlyMan: number): Promise<RowOut> {
  const rows = await loadRows(symbol);
  const r = calcPlan({ [symbol]: rows }, singlePlan(p, symbol, monthlyMan)).result;
  return { symbol, reached: r.reached, years: r.years, monthsRem: r.monthsRem, months: r.months, value: r.value, cagr: r.cagr, dataEnd: rows[rows.length - 1].date };
}
/** 종목별 마지막 종가일의 가장 이른·늦은 날. 다르면 화면이 범위를 보여준다. */
function endRange(rows: RowOut[]): { min: string; max: string } | null {
  const ends = rows.map((r) => r.dataEnd).filter((d): d is string => !!d).sort();
  return ends.length ? { min: ends[0], max: ends[ends.length - 1] } : null;
}
export function CompareScreen({ plan, back, onMenu, onClose }: { plan: Plan; back: () => void; onMenu: () => void; onClose: () => void }) {
  const [out, setOut] = useState<RowOut[]>([]);
  const [done, setDone] = useState(false);
  /** 데이터를 못 받아 빠진 종목 — 조용히 숨기지 않고 목록 아래 알리고 그 종목만 다시 시도한다. */
  const [failed, setFailed] = useState<string[]>([]);
  const [retrying, setRetrying] = useState(false);
  // 분산 매수면 1회 적립액 합계를 한 종목에 넣었다고 본다
  const multi = plan.holdings.length > 1;
  const monthlyMan = plan.mode === "time" || plan.tracking ? totalAmount(plan) : 100;
  const scenario = (): Plan => singlePlan({ ...plan, mode: "time", tracking: false, startDate: "" }, plan.ticker, monthlyMan);
  useEffect(() => { analytics.screen("compare"); }, []);
  useEffect(() => {
    let on = true;
    setOut([]); setDone(false); setFailed([]);
    const p = scenario();
    (async () => {
      const acc: RowOut[] = [];
      const miss: string[] = [];
      await Promise.all(TOSS_TICKERS.map(async (symbol) => {
        try {
          acc.push(await calcRow(symbol, p, monthlyMan));
          if (on) setOut(sortRows(acc));
        } catch { miss.push(symbol); }
      }));
      if (on) { setOut(sortRows(acc)); setFailed(miss); setDone(true); }
    })();
    return () => { on = false; };
  }, [plan.ticker, multi, plan.lump, plan.buyDay, plan.freq, plan.weekday, plan.reinvest, plan.tax, monthlyMan]);

  const retry = async () => {
    if (retrying) return;
    setRetrying(true);
    const p = scenario();
    const got: RowOut[] = [];
    const still: string[] = [];
    for (const symbol of failed) {
      try { got.push(await calcRow(symbol, p, monthlyMan)); } catch { still.push(symbol); }
    }
    setOut((prev) => sortRows([...prev.filter((r) => !got.some((g) => g.symbol === r.symbol)), ...got]));
    setFailed(still);
    setRetrying(false);
  };

  const range = endRange(out);
  const oneDay = !range || range.min === range.max;
  const asOfText = !range ? "종목별 마지막 종가에서 거꾸로 계산했어요."
    : oneDay ? `${mdKo(range.min)} 종가에서 거꾸로 계산했어요.`
    : `종목마다 마지막 종가일이 달라요. ${mdKo(range.min)}~${mdKo(range.max)} 종가에서 거꾸로 계산했어요.`;
  // 행의 '지금'은 기준일이 하나일 때만. 종가일이 섞이면 그 종목의 종가일을 적는다.
  const nowLabel = (o: RowOut) => (oneDay || !o.dataEnd ? "지금" : mdKo(o.dataEnd));

  return (
    <div className="screen">
      <NavBar back={back} onMenu={onMenu} onClose={onClose} />
      <Top
        upperGap={16}
        lowerGap={4}
        title={<Top.TitleParagraph size={22}>{multi ? <>{freqWord(plan.freq)} {manLabel(monthlyMan)}을 한 종목에 넣었다면,<br />10억까지 누가 빨랐을까요</> : <>{freqWord(plan.freq)} {monthlyMan}만원이면,<br />10억까지 누가 빨랐을까요</>}</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>{done ? out.length : TOSS_TICKERS.length}개 ETF를 {freqAdverb(plan)} 샀다면? {asOfText} 배당은 {plan.reinvest ? "다시 샀고" : "빼고"}, 세금·수수료는 계산에 넣지 않았어요.</Top.SubtitleParagraph>}
      />
      <div className="list-cols"><span>종목</span><span>10억까지 · 연평균</span></div>
      <ul className="tds-list">
        {out.map((o) => (
          <ListRow
            key={o.symbol}
            left={<Avatar symbol={o.symbol} />}
            contents={<ListRow.Texts type="2RowTypeA" top={tickerTitle(o.symbol)} bottom={tossSubtitle(o.symbol)} />}
            right={<span className="right"><span className={"row-title" + (o.reached ? "" : " muted")}>{o.reached ? durKo(o.years, o.monthsRem) : `다 모아도 ${fmt.money(o.value)}`}</span><span className="row-desc">{o.reached ? (o.value < 1e9 ? `${nowLabel(o)} ${fmt.money(o.value)} · ` : "") : `${durKo(o.years, o.monthsRem)} · `}연평균 {fmt.pct(o.cagr)}</span></span>}
          />
        ))}
        {done && failed.length > 0 && (
          <ListRow
            contents={<ListRow.Texts type="2RowTypeA" top="데이터를 불러오지 못해 빠졌어요" bottom={failed.map(tickerTitle).join("·")} />}
            right={<TextButton size="medium" variant="clear" disabled={retrying} onClick={retry}>다시 시도하기</TextButton>}
          />
        )}
        {!done && <ListRow contents={<ListRow.Texts type="1RowTypeA" top={`${out.length}/${TOSS_TICKERS.length} 계산 중…`} />} />}
      </ul>
      <p className="disc">'10억까지'는 가장 최근에 시작해서 10억을 넘은 경우, 처음 넘기까지 걸린 기간이에요. 그 뒤 10억 아래로 내려온 종목은 마지막 종가일 금액을 같이 적었어요. 10억을 넘지 않은 종목은 데이터가 있는 전체 기간을 모았을 때 금액이에요. 상장 전 추정 가격은 넣지 않고, 종목별 실제 거래 이력이 있는 기간만 계산했어요.</p>
      <p className="disc">과거 성과가 미래 수익을 보장하지 않아요. 특정 종목을 추천하지 않고, 투자 판단과 책임은 본인에게 있어요.</p>
    </div>
  );
}
