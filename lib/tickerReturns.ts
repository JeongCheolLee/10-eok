import { composeRows, type FxBundle, type PxBundle } from "./backtest/compose";
import { actualHistoryRows } from "./tickerHistory";
import { tickerCurrency } from "./tickers";

export const RETURN_YEARS = [1, 3, 5] as const;
export type ReturnYears = typeof RETURN_YEARS[number];
export type PeriodReturn = { cagr: number; start: string; end: string };
export type TickerReturns = {
  version: 1;
  asOf: string;
  generatedAt: string;
  rows: Record<string, Partial<Record<ReturnYears, PeriodReturn | null>>>;
};
const DAY = 86_400_000;
/** 원화, 배당 재투자 기준의 보유 수익률. 적립식 투자 수익률과 구별한다. */
export function buildTickerReturns(bundles: PxBundle[], fx: FxBundle): TickerReturns {
  const histories = bundles.map((px) => ({ symbol: px.ticker, rows: actualHistoryRows(px.ticker, composeRows(px, tickerCurrency(px.ticker) === "KRW" ? null : fx)) }));
  if (!histories.length) throw new Error("수익률을 계산할 자료가 없어요");
  // 양국 시장이 모두 마감한 공통 기준일. 소스 지연으로 기준일을 과도하게 당기지 않는다.
  const ends = histories.map(({ rows }) => rows[rows.length - 1].date).sort();
  if ((Date.parse(ends.at(-1)!) - Date.parse(ends[0])) / DAY > 7) throw new Error("종목별 자료 기준일 차이가 7일을 넘어요");
  const asOf = ends[0];
  const out: TickerReturns = { version: 1, asOf, generatedAt: new Date().toISOString(), rows: {} };
  for (const { symbol, rows } of histories) {
    out.rows[symbol] = {};
    const end = rows.filter((r) => r.date <= asOf).at(-1)!;
    for (const years of RETURN_YEARS) {
      const anchor = new Date(asOf + "T00:00:00Z");
      anchor.setUTCFullYear(anchor.getUTCFullYear() - years);
      const date = anchor.toISOString().slice(0, 10);
      const start = rows.find((r) => r.date >= date);
      const days = start ? (Date.parse(end.date) - Date.parse(start.date)) / DAY : 0;
      // 짧은 이력을 더 짧은 기간의 수익률로 바꿔 보여주지 않는다.
      if (!start || rows[0].date > date || days <= 0 || (Date.parse(start.date) - Date.parse(date)) / DAY > 7) {
        out.rows[symbol][years] = null;
        continue;
      }
      const ratio = (end.price * end.fx) / (start.price * start.fx);
      const cagr = Math.pow(ratio, 365.2425 / days) - 1;
      if (!Number.isFinite(cagr)) throw new Error(`수익률 계산 오류: ${symbol}`);
      out.rows[symbol][years] = { cagr, start: start.date, end: end.date };
    }
  }
  return out;
}
