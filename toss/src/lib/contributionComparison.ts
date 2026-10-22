import { runBacktest } from "@/lib/backtest/simulate";
import { US_TAX_RULE, KR_FOREIGN_TAX_RULE } from "@/lib/backtest/types";
import { tickerTax } from "@/lib/tickers";
import { scheduleOf, type Calc, type Plan, type RowsBy } from "./plan";
import { runPortfolio } from "./portfolio";

export type ContributionScenario = { amountWon: number; value: number; principal: number };
export type ContributionComparisonResult = {
  startDate: string;
  endDate: string;
  baseline: ContributionScenario;
  alternate: ContributionScenario;
};

/** Compare only the per-purchase contribution, over the visible result's exact window.
 * Amounts are won, including the amount mode's calculated baseline. Never search a start date.
 */
export function compareContributions(plan: Plan, rowsBy: RowsBy, calc: Calc, alternateWon: number): ContributionComparisonResult {
  if (!Number.isFinite(alternateWon) || alternateWon < 10_000 || alternateWon > Number.MAX_SAFE_INTEGER) {
    throw new RangeError("비교할 금액은 1만원 이상으로 입력해 주세요");
  }
  if (!Number.isFinite(calc.monthlyWon) || calc.monthlyWon < 0) throw new RangeError("Invalid baseline amount");
  const startDate = calc.result.series[0]?.date;
  const endDate = calc.result.series[calc.result.series.length - 1]?.date;
  if (!startDate || !endDate) throw new Error("Comparison requires a result window");
  const sum = plan.holdings.reduce((s, h) => s + h.amount, 0);
  const weights = plan.holdings.map((h) => sum > 0 ? h.amount / sum : 1 / plan.holdings.length);
  const opts = {
    lump: plan.lump, schedule: scheduleOf(plan), buyDay: plan.buyDay,
    reinvest: plan.reinvest, tax: plan.tax, target: Number.MAX_SAFE_INTEGER,
  };
  const simulate = (amountWon: number): ContributionScenario => {
    if (plan.holdings.length === 1) {
      const kind = tickerTax(plan.ticker);
      const taxRule = plan.tax ? kind === "us" ? US_TAX_RULE : kind === "kr-foreign" ? KR_FOREIGN_TAX_RULE : undefined : undefined;
      const r = runBacktest(rowsBy[plan.ticker], {
        monthly: amountWon, initial: plan.lump * 10_000, schedule: opts.schedule,
        buyDay: plan.buyDay, reinvestDividends: plan.reinvest, taxRule,
        startDate, endDate, target: Number.MAX_SAFE_INTEGER,
      });
      return { amountWon, value: r.value, principal: r.principal };
    }
    // A zero baseline can occur when the initial lump already covers the target.
    // Its existing portfolio retains the allocation used by the amount solver.
    if (amountWon === 0) return { amountWon, value: calc.result.value, principal: calc.result.principal };
    const holdings = plan.holdings.map((h, i) => ({ ticker: h.ticker, amount: amountWon / 10_000 * weights[i] }));
    const r = runPortfolio(rowsBy, holdings, opts, startDate, endDate);
    return { amountWon, value: r.value, principal: r.principal };
  };
  return { startDate, endDate, baseline: simulate(calc.monthlyWon), alternate: simulate(alternateWon) };
}
