import { runBacktest } from "./backtest/simulate";
import {
  KR_FOREIGN_TAX_RULE,
  US_TAX_RULE,
  type BacktestInput,
  type Row,
} from "./backtest/types";
import { tickerInfo, tickerTax } from "./tickers";
import type { WebCalculation, WebPlan } from "@/lib/web-calculator";

// These boundaries match the generator's splice contracts and actual-history loader.
const ACTUAL_START: Record<string, string> = {
  JEPI: "2020-05-21",
  QQQM: "2020-10-13",
  "360750.KS": "2020-08-07",
  "458730.KS": "2023-06-20",
};
export type ComparisonWindow = {
  anchor: string;
  start: string;
  end: string;
  coverageStart: string;
  contribution: number;
};
export type ComparisonRow = { symbol: string } & (
  | {
      status: "available";
      value: number;
      principal: number;
      valuationDate: string;
      estimate?: { proxy: string; from: string; to: string };
    }
  | { status: "unavailable"; start: string; end: string }
  | { status: "error" }
);
export function webComparisonWindow(
  plan: WebPlan,
  calculation: WebCalculation,
  baseline: Row[][],
): ComparisonWindow | null {
  const start = calculation.result.series[0]?.date;
  const end = calculation.result.series.at(-1)?.date;
  if (!start || !end || baseline.some((rows) => !rows.length)) return null;
  const anchor = calculation.calculationStart;
  const coverageStart = [anchor, ...baseline.map((rows) => rows[0].date)]
    .sort()
    .at(-1)!;
  return {
    anchor,
    start,
    end,
    coverageStart,
    contribution: calculation.contribution,
  };
}
export function compareWebEtf(
  plan: WebPlan,
  window: ComparisonWindow,
  symbol: string,
  rows: Row[],
  cpi?: BacktestInput["cpi"],
): ComparisonRow {
  const first = rows[0]?.date,
    last = rows.at(-1)?.date;
  if (!first || !last) return { symbol, status: "error" };
  if (first > window.coverageStart || last < window.end)
    return { symbol, status: "unavailable", start: first, end: last };
  const covered =
    window.coverageStart > window.anchor
      ? rows.filter((row) => row.date >= window.coverageStart)
      : rows;
  const kind = tickerTax(symbol);
  const result = runBacktest(covered, {
    monthly: window.contribution,
    initial: plan.lump,
    startDate: window.anchor,
    endDate: window.end,
    buyDay: plan.buyDay,
    schedule:
      plan.freq === "daily"
        ? { kind: "daily" }
        : plan.freq === "weekly"
          ? { kind: "weekly", weekday: plan.weekday }
          : { kind: "monthly", day: plan.buyDay },
    reinvestDividends: plan.reinvest,
    cpi,
    taxRule: plan.tax
      ? kind === "us"
        ? US_TAX_RULE
        : kind === "kr-foreign"
          ? KR_FOREIGN_TAX_RULE
          : undefined
      : undefined,
    // Always compare the original final day, including after first reaching the goal.
    target: Number.MAX_VALUE,
  });
  if (!result.series.length)
    return { symbol, status: "unavailable", start: first, end: last };
  const actual = ACTUAL_START[symbol],
    proxy = tickerInfo(symbol).splice?.proxy;
  const from = result.series[0].date;
  const to = actual
    ? covered
        .filter((row) => row.date < actual && row.date <= window.end)
        .at(-1)?.date
    : undefined;
  return {
    symbol,
    status: "available",
    value: result.value,
    principal: result.principal,
    valuationDate: result.series.at(-1)!.date,
    ...(proxy && to && from <= to ? { estimate: { proxy, from, to } } : {}),
  };
}
export function comparisonGroup(symbol: string): string {
  return (
    tickerInfo(symbol).group ??
    (
      {
        QLD: "leverage",
        TQQQ: "leverage",
        SCHD: "dividend",
        JEPI: "dividend",
        JEPQ: "dividend",
        SOXX: "sector",
        VGT: "sector",
        VNQ: "sector",
        GLD: "bond-gold",
        TLT: "bond-gold",
        AGG: "bond-gold",
      } as Record<string, string>
    )[symbol] ??
    "index"
  );
}
export const COMPARISON_GROUPS = [
  "index",
  "dividend",
  "sector",
  "bond-gold",
  "kr-listed",
  "leverage",
];

/** Representative funds first within a type; this is not a performance order. */
export const COMPARISON_TICKERS = [
  "SPY",
  "QQQ",
  "VOO",
  "QQQM",
  "SPYM",
  "DIA",
  "VT",
  "069500.KS",
  "SCHD",
  "JEPI",
  "JEPQ",
  "VYM",
  "DGRO",
  "SOXX",
  "VGT",
  "VNQ",
  "TLT",
  "GLD",
  "AGG",
  "360750.KS",
  "133690.KS",
  "458730.KS",
  "TQQQ",
  "SOXL",
  "QLD",
];
