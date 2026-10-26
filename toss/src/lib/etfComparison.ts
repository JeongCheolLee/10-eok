import { runBacktest } from "@/lib/backtest/simulate";
import { US_TAX_RULE, KR_FOREIGN_TAX_RULE, type Row } from "@/lib/backtest/types";
import { tickerTax } from "@/lib/tickers";
import type { ComparisonEstimate } from "./data";
import { scheduleOf, type Calc, type Plan, type RowsBy } from "./plan";

export type ComparisonWindow = {
  anchor: string; start: string; end: string; coverageStart: string;
  amountWon: number; value: number; principal: number;
};
export type EtfComparison =
  | { symbol: string; status: "available"; value: number; principal: number; valuationDate: string; estimate?: ComparisonEstimate & { from: string; to: string } }
  | { symbol: string; status: "unavailable"; dataStart: string; dataEnd: string }
  | { symbol: string; status: "error" };

/** The schedule anchor can precede the original ETF's first trading day in its first month. */
export function comparisonWindow(plan: Plan, rowsBy: RowsBy, calc: Calc): ComparisonWindow | null {
  const start = calc.result.series[0]?.date;
  const end = calc.result.series.at(-1)?.date;
  if (!start || !end) return null;
  const anchor = calc.calculationStart ?? start;
  const coverageStart = [anchor, ...plan.holdings.map((h) => rowsBy[h.ticker][0].date)].sort().at(-1)!;
  return { anchor, start, end, coverageStart, amountWon: calc.monthlyWon, value: calc.result.value, principal: calc.result.principal };
}

/** Change only the ETF: do not solve for a new start, contribution, or end date. */
export function compareEtf(plan: Plan, window: ComparisonWindow, symbol: string, rows: Row[], estimate?: ComparisonEstimate): EtfComparison {
  const first = rows[0]?.date;
  const last = rows.at(-1)?.date;
  if (!first || !last) return { symbol, status: "error" };
  if (first > window.coverageStart || last < window.end) {
    return { symbol, status: "unavailable", dataStart: first, dataEnd: last };
  }
  const kind = tickerTax(symbol);
  const taxRule = plan.tax ? kind === "us" ? US_TAX_RULE : kind === "kr-foreign" ? KR_FOREIGN_TAX_RULE : undefined : undefined;
  // A searched month can start before the baseline ETF's first real quote.
  // Keep its schedule anchor but do not buy older comparison data before that boundary.
  // Retain pre-anchor quotes when coverage starts at the anchor: they let a
  // holiday's scheduled purchase roll forward to the next trading day.
  const coveredRows = window.coverageStart > window.anchor
    ? rows.filter((row) => row.date >= window.coverageStart)
    : rows;
  const result = runBacktest(coveredRows, {
    monthly: window.amountWon, initial: plan.lump * 10_000,
    schedule: scheduleOf(plan), buyDay: plan.buyDay, reinvestDividends: plan.reinvest, taxRule,
    startDate: window.anchor, endDate: window.end, target: Number.MAX_SAFE_INTEGER,
  });
  const valuationDate = result.series.at(-1)?.date;
  if (!valuationDate) return { symbol, status: "unavailable", dataStart: first, dataEnd: last };
  const estimateEnd = estimate ? coveredRows.filter((row) => row.date < estimate.actualStart && row.date <= valuationDate).at(-1)?.date : undefined;
  const from = result.series[0].date;
  const usedEstimate = estimate && estimateEnd && from <= estimateEnd
    ? { ...estimate, from, to: estimateEnd } : undefined;
  return { symbol, status: "available", value: result.value, principal: result.principal, valuationDate, ...(usedEstimate ? { estimate: usedEstimate } : {}) };
}
