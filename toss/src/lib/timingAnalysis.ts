import type { Row } from "@/lib/backtest/types";
import { calcTiming, type Calc, type Plan, type Timing } from "./plan";

export type TimingAnalysis =
  | { status: "unavailable"; reason: "multiple-etfs" | "insufficient-data" | "calculation-error" }
  | { status: "ready"; durationMonths: number; result: NonNullable<Timing> };

/** Prepare the exact result before offering an ad. An ad must never unlock an empty analysis. */
export function prepareTimingAnalysis(rows: Row[], plan: Plan, calc: Calc): TimingAnalysis {
  if (plan.holdings.length !== 1) return { status: "unavailable", reason: "multiple-etfs" };
  const durationMonths = Math.max(12, calc.result.months);
  try {
    const result = calcTiming(rows, plan, calc.monthlyWon, durationMonths);
    if (!result || result.samples < 2) return { status: "unavailable", reason: "insufficient-data" };
    return { status: "ready", durationMonths, result };
  } catch {
    return { status: "unavailable", reason: "calculation-error" };
  }
}
