import { composeRows, type FxBundle, type PxBundle } from "./backtest/compose";
import { actualHistoryRows } from "./tickerHistory";
import { tickerCurrency } from "./tickers";

export const RETURN_YEARS = [1, 3, 5] as const;
export type ReturnYears = typeof RETURN_YEARS[number];
export type AnnualReturn = { start: string; end: string; rate: number };
export type PeriodReturn = {
  /** 구 버전 미니앱 호환용. 새 선택 목록에는 meanAnnualReturn을 표시한다. */
  cagr: number;
  meanAnnualReturn: number;
  annualReturns: AnnualReturn[];
  start: string;
  end: string;
};
export type TickerReturns = {
  version: 1;
  annualMethod: "arithmetic-mean";
  asOf: string;
  generatedAt: string;
  rows: Record<string, Partial<Record<ReturnYears, PeriodReturn | null>>>;
};
const DAY = 86_400_000;
/** 윤일의 전년 경계는 3월로 넘기지 않고 2월 마지막 날에 맞춘다. */
function yearsBefore(date: string, years: number): string {
  const anchor = new Date(date + "T00:00:00Z");
  const month = anchor.getUTCMonth();
  anchor.setUTCFullYear(anchor.getUTCFullYear() - years);
  if (anchor.getUTCMonth() !== month) anchor.setUTCDate(0);
  return anchor.toISOString().slice(0, 10);
}
/** 원화·배당 재투자 기준. 기준일부터 역산한 각 1년 보유 수익률의 산술평균. */
export function buildTickerReturns(bundles: PxBundle[], fx: FxBundle): TickerReturns {
  const histories = bundles.map((px) => ({ symbol: px.ticker, rows: actualHistoryRows(px.ticker, composeRows(px, tickerCurrency(px.ticker) === "KRW" ? null : fx)) }));
  if (!histories.length) throw new Error("수익률을 계산할 자료가 없어요");
  // 양국 시장이 모두 마감한 공통 기준일. 소스 지연으로 기준일을 과도하게 당기지 않는다.
  const ends = histories.map(({ rows }) => rows[rows.length - 1].date).sort();
  if ((Date.parse(ends.at(-1)!) - Date.parse(ends[0])) / DAY > 7) throw new Error("종목별 자료 기준일 차이가 7일을 넘어요");
  const asOf = ends[0];
  const out: TickerReturns = { version: 1, annualMethod: "arithmetic-mean", asOf, generatedAt: new Date().toISOString(), rows: {} };
  for (const { symbol, rows } of histories) {
    out.rows[symbol] = {};
    const end = rows.filter((r) => r.date <= asOf).at(-1)!;
    for (const years of RETURN_YEARS) {
      const date = yearsBefore(asOf, years);
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
      const boundaries = Array.from({ length: years }, (_, index) => {
        const anniversary = yearsBefore(asOf, years - index);
        const row = rows.find((r) => r.date >= anniversary);
        return row && (Date.parse(row.date) - Date.parse(anniversary)) / DAY <= 7 ? row : null;
      });
      boundaries.push(end);
      const annualReturns: AnnualReturn[] = [];
      for (let i = 0; i < years; i++) {
        const left = boundaries[i], right = boundaries[i + 1];
        if (!left || !right || left.date >= right.date) break;
        const rate = right.price * right.fx / (left.price * left.fx) - 1;
        if (!Number.isFinite(rate)) throw new Error(`연간 수익률 계산 오류: ${symbol}`);
        annualReturns.push({ start: left.date, end: right.date, rate });
      }
      // 중간 연도 자료가 없으면 그 해를 빼고 평균내지 않는다.
      out.rows[symbol][years] = annualReturns.length === years
        ? { cagr, meanAnnualReturn: annualReturns.reduce((sum, item) => sum + item.rate, 0) / years, annualReturns, start: start.date, end: end.date }
        : null;
    }
  }
  return out;
}
