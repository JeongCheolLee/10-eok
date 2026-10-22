import { tickerTitle } from "@/lib/tickers";
import { getLoadedDataInfo } from "../lib/data";
import { fmt, manLabel, freqLabel, freqWord, ymdKo } from "../lib/fmt";
import { needsFx } from "../lib/dataInfo";
import type { Calc, Plan, RowsBy } from "../lib/plan";

export function CalculationBasis({ plan, calc, rowsBy }: { plan: Plan; calc: Calc; rowsBy: RowsBy }) {
  const series = calc.result.series;
  const start = series[0]?.date;
  const end = series[series.length - 1]?.date;
  const tickers = plan.holdings.map((holding) => holding.ticker);
  const fxDates = tickers.flatMap((ticker) => {
    const date = getLoadedDataInfo(ticker)?.fxAsOf;
    return date ? [{ ticker, date }] : [];
  });
  const amountMode = plan.mode === "amount" && !calc.tracking;
  const startReason = calc.tracking
    ? "입력한 시작일을 기준으로 계산했어요. 그날 자료가 없으면 계산할 수 있는 첫 거래일부터 시작해요."
    : amountMode
      ? "선택한 기간을 최근 가격 기준일에서 거슬러 계산했어요."
      : calc.reach
        ? "10억을 넘은 경우 중 가장 최근에 시작한 달을 찾았어요. 결과의 기간은 시작한 때부터 처음 10억을 넘긴 때까지예요."
        : "실제 거래 자료가 있는 첫 달부터 계산했어요.";

  return (
    <details className="card calculation-basis">
      <summary>계산 기준 보기</summary>
      <div className="basis-content">
        <dl className="basis-list">
          <div><dt>계산 기간</dt><dd>{start && end ? `${ymdKo(start)} ~ ${ymdKo(end)}` : "계산할 거래 내역이 없어요"}</dd></div>
          <div><dt>시작일</dt><dd>{startReason}</dd></div>
          <div><dt>사는 날과 금액</dt><dd>
            {freqLabel(plan)} · {freqWord(plan.freq)} {fmt.amount(calc.monthlyWon)}
            {plan.holdings.length > 1 && <ul>{plan.holdings.map((holding, index) => <li key={holding.ticker}>{tickerTitle(holding.ticker)} {fmt.amount(calc.portfolio?.holdings[index]?.amountWon ?? holding.amount * 10_000)}</li>)}</ul>}
            {plan.freq === "daily" ? <p>장이 열리는 날마다 샀다고 계산해요.</p> : <p>{plan.freq === "monthly" && plan.buyDay === 29 ? "그달 마지막 거래일에 샀다고 계산해요." : "장이 쉬는 날이면 다음 거래일에 샀다고 계산해요."}</p>}
          </dd></div>
          <div><dt>처음 넣은 돈</dt><dd>{plan.lump > 0 ? manLabel(plan.lump) : "0원"}{plan.lump > 0 && plan.holdings.length > 1 && <p>ETF마다 넣는 금액의 비율대로 나눴어요.</p>}</dd></div>
          <div><dt>배당</dt><dd>{plan.reinvest ? "받은 배당으로 같은 ETF를 다시 샀다고 계산해요." : "배당금은 계산에 넣지 않았어요."}</dd></div>
          <div><dt>세금·수수료</dt><dd>계산에 넣지 않았어요.</dd></div>
          <div><dt>가격 자료</dt><dd>실제로 거래된 기간만 사용해요. 거래 시작 전 추정 가격은 포함하지 않아요.
            <ul>{tickers.map((ticker) => {
              const info = getLoadedDataInfo(ticker);
              const rows = rowsBy[ticker];
              const first = info?.actualStart ?? rows?.[0]?.date;
              const last = info?.priceAsOf ?? rows?.[rows.length - 1]?.date;
              return <li key={ticker}>{tickerTitle(ticker)}{first && last ? ` · ${ymdKo(first)} ~ ${ymdKo(last)}` : ""}</li>;
            })}</ul>
          </dd></div>
          {needsFx(tickers) && <div><dt>환율 자료</dt><dd>
            달러로 거래되는 ETF는 해당 날짜 환율로 원화로 바꿔 계산해요. 해당 날짜 환율이 없으면 직전 값을 사용해요.
            {fxDates.map(({ ticker, date }) => <p key={ticker}>{tickerTitle(ticker)} · {ymdKo(date)}까지의 환율 자료를 사용해요.</p>)}
          </dd></div>}
        </dl>
        <p className="data-note">입력한 조건대로 샀을 때의 결과라 실제 계좌 금액과 다를 수 있어요. 가격 자료는 Yahoo Finance, 환율 자료는 FRED에서 가져와요.</p>
      </div>
    </details>
  );
}
