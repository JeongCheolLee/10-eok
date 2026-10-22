import { describe, expect, it } from "vitest";
import type { Row } from "@/lib/backtest/types";
import { runBacktest, runFirstReach } from "@/lib/backtest/simulate";
import { compareContributions } from "./contributionComparison";
import { calcPlan, DEFAULT_PLAN, scheduleOf, withHoldings, type Calc, type Plan } from "./plan";
import { runPortfolio } from "./portfolio";

const rows: Row[] = Array.from({ length: 36 }, (_, i) => ({
  date: `${2020 + Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, "0")}-01`,
  price: 100 + i * 4, raw: 100 + i * 2, fx: 1,
}));
const rowsBy = { QLD: rows, QQQ: rows.map((r, i) => ({ ...r, price: 100 + i, raw: 100 + i / 2 })) };
const plan: Plan = { ...DEFAULT_PLAN, tracking: true, startDate: "2020-05-01", lump: 200 };
const expected = (p: Plan, c: Calc, amount: number) => runBacktest(rows, {
  monthly: amount, initial: p.lump * 10_000, buyDay: p.buyDay,
  schedule: scheduleOf(p), reinvestDividends: p.reinvest,
  startDate: c.result.series[0].date, endDate: c.result.series[c.result.series.length - 1].date,
  target: Number.MAX_SAFE_INTEGER,
});

describe("same-period contribution comparison", () => {
  const holidayRows: Row[] = ["2022-12-30", "2023-01-03", "2023-01-04", "2023-01-09", "2023-01-10", "2023-01-17", "2023-01-23", "2023-01-24"].map((date, i) => ({ date, price: 100 + 10 * i, fx: 1 }));

  it("preserves a weekly purchase rolled from a holiday Monday to Tuesday", () => {
    const p: Plan = { ...plan, freq: "weekly", weekday: 1, startDate: "2023-01-02" };
    const data = { QLD: holidayRows };
    // Calc carries the original schedule anchor separately from its first plotted day.
    const c = Object.assign(calcPlan(data, p), { calculationStart: p.startDate });
    const result = compareContributions(p, data, c, c.monthlyWon);
    expect(result.startDate).toBe("2023-01-03");
    expect(result.baseline.value).toBe(c.result.value);
    expect(result.baseline.principal).toBe(c.result.principal);
    expect(result.alternate).toEqual(result.baseline);
    const skipped = runBacktest(holidayRows, { monthly: c.monthlyWon, initial: p.lump * 10_000, schedule: scheduleOf(p), buyDay: p.buyDay, startDate: result.startDate, target: Number.MAX_SAFE_INTEGER });
    expect(result.baseline.principal - skipped.principal).toBe(c.monthlyWon);
  });

  it("preserves each ETF's first rolled buy and lump date across different trading calendars", () => {
    const p = withHoldings({ ...plan, freq: "weekly", weekday: 1, startDate: "2023-01-02" }, [{ ticker: "QLD", amount: 30 }, { ticker: "QQQ", amount: 70 }]);
    const data = { QLD: holidayRows, QQQ: holidayRows.filter((r) => r.date !== "2023-01-03") };
    const c = calcPlan(data, p);
    const anchored = Object.assign(c, { calculationStart: c.portfolio!.startDate });
    const result = compareContributions(p, data, anchored, c.monthlyWon);
    expect(result.startDate).toBe("2023-01-03");
    expect(result.baseline.value).toBeCloseTo(c.result.value, 7);
    expect(result.baseline.principal).toBeCloseTo(c.result.principal, 7);
    expect(result.alternate).toEqual(result.baseline);
  });

  it("exposes the searched start anchor without rerunning the first-reach search", () => {
    const r = runFirstReach(holidayRows, { monthly: 100_000, buyDay: 1, schedule: { kind: "weekly", weekday: 1 }, target: Number.MAX_SAFE_INTEGER });
    expect(r.calculationStart).toBe("2022-12-01");
    const replay = runBacktest(holidayRows, { monthly: 100_000, buyDay: 1, schedule: { kind: "weekly", weekday: 1 }, startDate: r.calculationStart, target: Number.MAX_SAFE_INTEGER });
    expect(replay.value).toBe(r.value);
    expect(replay.principal).toBe(r.principal);
  });

  it("uses the exact visible window even when data exists before and after it", () => {
    const c = calcPlan(rowsBy, plan);
    c.result = { ...c.result, series: c.result.series.slice(2, -3) };
    const result = compareContributions(plan, rowsBy, c, 2_000_000);
    expect(result.startDate).toBe(c.result.series[0].date);
    expect(result.endDate).toBe(c.result.series.at(-1)?.date);
    for (const s of [result.baseline, result.alternate]) {
      const r = expected(plan, c, s.amountWon);
      expect(s.value).toBe(r.value);
      expect(s.principal).toBe(r.principal);
    }
  });

  it("keeps the full horizon when the alternate crosses 10억 early", () => {
    const c = calcPlan(rowsBy, plan);
    const amount = 1_000_000_000;
    const result = compareContributions(plan, rowsBy, c, amount);
    const full = expected(plan, c, amount);
    const early = runBacktest(rows, { monthly: amount, initial: plan.lump * 10_000, buyDay: 1, startDate: result.startDate, endDate: result.endDate });
    expect(early.reachedDate).not.toBe(result.endDate);
    expect(result.alternate.value).toBe(full.value);
    expect(result.alternate.value).toBeGreaterThan(early.value);
    expect(result.alternate.principal).toBe(full.principal);
  });

  it("scales multiple ETFs proportionally and keeps the lump allocation", () => {
    const p = withHoldings(plan, [{ ticker: "QLD", amount: 30 }, { ticker: "QQQ", amount: 70 }]);
    const c = calcPlan(rowsBy, p);
    const result = compareContributions(p, rowsBy, c, 2_000_000);
    const wanted = runPortfolio(rowsBy, [{ ticker: "QLD", amount: 60 }, { ticker: "QQQ", amount: 140 }], {
      lump: p.lump, buyDay: p.buyDay, schedule: scheduleOf(p), reinvest: p.reinvest, tax: p.tax, target: Number.MAX_SAFE_INTEGER,
    }, result.startDate, result.endDate);
    expect(result.alternate.value).toBeCloseTo(wanted.value, 6);
    expect(result.alternate.principal).toBeCloseTo(wanted.principal, 6);
    const lump = runPortfolio(rowsBy, p.holdings, { lump: 0, buyDay: p.buyDay, schedule: scheduleOf(p), reinvest: p.reinvest, tax: false, target: Number.MAX_SAFE_INTEGER }, result.startDate, result.endDate);
    expect(2 * result.baseline.principal - result.alternate.principal).toBeCloseTo(p.lump * 10_000, 6);
    expect(result.baseline.value - lump.value).toBeCloseTo(2 * result.baseline.value - result.alternate.value, 6);
    expect(p.holdings.map((h) => h.amount)).toEqual([30, 70]);
  });

  it("uses the calculated amount-mode contribution instead of plan.amount", () => {
    const p: Plan = { ...plan, tracking: false, mode: "amount", years: 2 };
    const c = calcPlan(rowsBy, p);
    expect(c.monthlyWon).not.toBe(p.amount * 10_000);
    const result = compareContributions(p, rowsBy, c, 2_000_000);
    expect(result.baseline.amountWon).toBe(c.monthlyWon);
    expect(result.baseline.value).toBe(expected(p, c, c.monthlyWon).value);
  });

  it("uses calculated multi-ETF amounts and the same mix in amount mode", () => {
    const p = withHoldings({ ...plan, tracking: false, mode: "amount", years: 2 }, [{ ticker: "QLD", amount: 20 }, { ticker: "QQQ", amount: 80 }]);
    const c = calcPlan(rowsBy, p);
    const result = compareContributions(p, rowsBy, c, c.monthlyWon * 2);
    expect(result.baseline.amountWon).toBe(c.monthlyWon);
    expect(2 * result.baseline.principal - result.alternate.principal).toBeCloseTo(p.lump * 10_000, 5);
  });

  it("preserves schedule, reinvestment and a zero calculated single baseline", () => {
    const p: Plan = { ...plan, tracking: false, mode: "amount", years: 2, lump: 200_000, reinvest: false, freq: "daily" };
    const c = calcPlan(rowsBy, p);
    expect(c.monthlyWon).toBe(0);
    const result = compareContributions(p, rowsBy, c, 10_000);
    expect(result.baseline.value).toBe(expected(p, c, 0).value);
    expect(result.baseline.principal).toBe(p.lump * 10_000);
    expect(result.alternate.value).toBe(expected(p, c, 10_000).value);
  });

  it.each([NaN, Infinity, -Infinity, -1, 0, 9_999, Number.MAX_VALUE])("rejects invalid alternate %s", (input) => {
    expect(() => compareContributions(plan, rowsBy, calcPlan(rowsBy, plan), input)).toThrow(RangeError);
  });
});
