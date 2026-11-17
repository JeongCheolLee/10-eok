import { describe, expect, it } from "vitest";
import { calcPlan, DEFAULT_PLAN, type Calc } from "./plan";
import { reachChange } from "./reachChange";
import type { Row } from "@/lib/backtest/types";

const rows: Row[] = [
  { date: "2025-01-02", price: 90, raw: 100, fx: 1500 },
  { date: "2025-02-03", price: 99, raw: 105, fx: 1350 },
  { date: "2025-02-04", price: 1000, raw: 1000, fx: 2000 },
];
const calc: Calc = {
  result: { reached: true, reachedDate: rows[0].date, years: 1, months: 12, monthsRem: 0, cagr: 0,
    principal: 201e6, value: 995e6,
    series: [{ date: rows[0].date, value: 1e9, principal: 200e6 }, { date: rows[1].date, value: 995e6, principal: 201e6 }] },
  reach: { date: rows[0].date, value: 1e9, principal: 200e6 },
  reqMonthly: null, monthlyWon: 1e6, yearsUsed: 1, tracking: false, portfolio: null,
};

describe("changes after first reaching the target", () => {
  it("separates extra contributions from value change and excludes later data", () => {
    const c = reachChange(calc, DEFAULT_PLAN, { SPY: rows })!;
    expect(c.contributed).toBe(1e6);
    expect(c.valueChange).toBe(-5e6);
    expect(c.markets[0].priceReturn).toBeCloseTo(.1);
    expect(c.markets[0].fx?.change).toBeCloseTo(-.1);
    expect(c.markets[0].to).toBe("2025-02-03");
  });
  it("uses raw prices when dividends are excluded", () => {
    expect(reachChange(calc, { ...DEFAULT_PLAN, reinvest: false }, { SPY: rows })!.markets[0].priceReturn).toBeCloseTo(.05);
  });
  it("does not imply a currency conversion for Korean listed securities", () => {
    const plan = { ...DEFAULT_PLAN, holdings: [{ ticker: "005930.KS", amount: 100 }, { ticker: "SPY", amount: 100 }] };
    const markets = reachChange(calc, plan, { "005930.KS": rows, SPY: rows })!.markets;
    expect(markets[0].fx).toBeNull();
    expect(markets[1].fx?.from).toBe(1500);
  });
  it("uses the last available session on holidays and omits unavailable histories", () => {
    const c = { ...calc, reach: { ...calc.reach!, date: "2025-01-03" } };
    expect(reachChange(c, DEFAULT_PLAN, { SPY: rows })!.markets[0].from).toBe("2025-01-02");
    expect(reachChange(c, DEFAULT_PLAN, {})!.markets).toEqual([]);
  });
  it("does not show a comparison without a later valuation or a target crossing", () => {
    expect(reachChange({ ...calc, reach: null }, DEFAULT_PLAN, { SPY: rows })).toBeNull();
    expect(reachChange({ ...calc, reach: { ...calc.reach!, date: rows[1].date } }, DEFAULT_PLAN, { SPY: rows })).toBeNull();
  });
  it("agrees with the engine for a falling exchange rate despite contributions", () => {
    const plan = { ...DEFAULT_PLAN, tracking: true, startDate: rows[0].date, lump: 100000 };
    const result = calcPlan({ SPY: rows.slice(0, 2) }, plan);
    const first = result.result.series[0];
    const c = reachChange({ ...result, reach: first }, plan, { SPY: rows })!;
    // Existing units: price +10% and FX -10% combine to -1%, not 0%.
    expect(result.result.value).toBeCloseTo(first.value * .99 + c.contributed);
    expect(c.valueChange).toBeCloseTo(result.result.value - first.value);
  });
});
