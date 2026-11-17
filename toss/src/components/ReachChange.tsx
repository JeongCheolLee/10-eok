import { tickerTitle } from "@/lib/tickers";
import type { Calc, Plan, RowsBy } from "../lib/plan";
import { reachChange } from "../lib/reachChange";
import { fmt, signedPct, signedWon, ymdKo } from "../lib/fmt";
import { ChevronRight } from "./ui";

export function ReachChange({ calc, plan, rowsBy }: { calc: Calc; plan: Plan; rowsBy: RowsBy }) {
  const change = reachChange(calc, plan, rowsBy);
  if (!change) return null;
  const rate = (value: number) => `${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}원`;
  return <details className="reach-change">
    <summary>도달 후 달라진 점 보기<span className="chev"><ChevronRight /></span></summary>
    <p>{ymdKo(change.from)}에 처음 넘은 뒤<br />{ymdKo(change.to)}까지의 변화예요.</p>
    <dl>
      <div><dt>추가로 넣은 돈</dt><dd>{fmt.money(change.contributed)}</dd></div>
      <div><dt>평가액 증감</dt><dd>{signedWon(change.valueChange)}</dd></div>
      {change.markets.map((market) => <div className="reach-market" key={market.ticker}>
        <dt>{tickerTitle(market.ticker)} {plan.reinvest ? "배당 포함 수익률" : "주가 변화"}</dt><dd>{signedPct(market.priceReturn)}</dd>
        {market.fx && <><dt>달러 환율 변화</dt><dd>{signedPct(market.fx.change)}<span>{rate(market.fx.from)} → {rate(market.fx.to)}</span></dd></>}
      </div>)}
    </dl>
    <p>종목 수익률은 거래 통화 기준이에요. {change.markets.some((market) => market.fx)
      ? "원화 평가액에는 환율과 추가로 산 수량도 반영해요."
      : "평가액에는 추가로 산 수량도 반영해요."}</p>
  </details>;
}
