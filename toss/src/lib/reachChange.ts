import type { Calc, Plan, RowsBy } from "./plan";
import { tickerCurrency } from "@/lib/tickers";
import { lowerBound } from "@/lib/backtest/simulate";
import type { Row } from "@/lib/backtest/types";

function onOrBefore(rows: Row[], date: string): Row | undefined {
  const index = lowerBound(rows, date);
  return rows[index]?.date === date ? rows[index] : rows[index - 1];
}

/** Endpoint comparisons, not a decomposition of portfolio profit.
 * Each price return uses the same dividend assumption as the calculation.
 * Never use a row after the portfolio's last valuation date. */
export function reachChange(calc: Calc, plan: Plan, rowsBy: RowsBy) {
  const reach = calc.reach;
  const last = calc.result.series.at(-1);
  if (!reach || !last || last.date <= reach.date) return null;
  return {
    from: reach.date, to: last.date,
    contributed: last.principal - reach.principal,
    valueChange: last.value - reach.value,
    markets: plan.holdings.flatMap(({ ticker }) => {
      const rows = rowsBy[ticker] ?? [];
      const first = onOrBefore(rows, reach.date);
      const end = onOrBefore(rows, last.date);
      if (!first || !end) return [];
      const price = (row: Row) => plan.reinvest ? row.price : (row.raw ?? row.price);
      return [{ ticker, from: first.date, to: end.date,
        priceReturn: price(end) / price(first) - 1,
        fx: tickerCurrency(ticker) === "USD" ? { from: first.fx, to: end.fx, change: end.fx / first.fx - 1 } : null,
      }];
    }),
  };
}
