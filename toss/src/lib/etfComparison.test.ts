import { describe, expect, it } from "vitest";
import type { Row } from "@/lib/backtest/types";
import { calcPlan, DEFAULT_PLAN, withHoldings } from "./plan";
import { comparisonWindow, compareEtf } from "./etfComparison";

const rows: Row[] = Array.from({ length: 60 }, (_, i) => ({ date: `${2020 + Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, "0")}-01`, price: 100 + i * 4, raw: 100 + i * 2, fx: 1 }));
const base = withHoldings({ ...DEFAULT_PLAN, tracking: true, startDate: "2021-01-01", lump: 200 }, [{ ticker: "SPY", amount: 250 }]);

describe("same-period ETF comparison", () => {
  it("preserves a chosen start, amount and final valuation for the original ETF", () => {
    const calc = calcPlan({ SPY: rows }, base);
    const window = comparisonWindow(base, { SPY: rows }, calc)!;
    const compared = compareEtf(base, window, "SPY", rows);
    expect(window.anchor).toBe("2021-01-01");
    expect(window.amountWon).toBe(2_500_000);
    expect(compared).toMatchObject({ status: "available", value: calc.result.value, principal: calc.result.principal, valuationDate: rows.at(-1)!.date });
  });
  it("uses the solved amount instead of reverting amount mode to 100만원", () => {
    const plan = { ...base, tracking: false, mode: "amount" as const, years: 2 };
    const calc = calcPlan({ SPY: rows }, plan);
    const window = comparisonWindow(plan, { SPY: rows }, calc)!;
    expect(window.amountWon).toBe(calc.reqMonthly);
    expect(window.amountWon).not.toBe(1_000_000);
    expect(compareEtf(plan, window, "SPY", rows)).toMatchObject({ status: "available", value: calc.result.value, principal: calc.result.principal });
  });
  it("does not shorten the window for a newer or stale ETF", () => {
    const window = comparisonWindow(base, { SPY: rows }, calcPlan({ SPY: rows }, base))!;
    expect(compareEtf(base, window, "QQQ", rows.slice(20))).toMatchObject({ status: "unavailable" });
    expect(compareEtf(base, window, "QQQ", rows.slice(0, -1))).toMatchObject({ status: "unavailable" });
  });
  it("retains the schedule anchor across a holiday and dividend/lump conditions", () => {
    const holidayRows: Row[] = ["2022-12-30", "2023-01-03", "2023-01-04", "2023-01-09", "2023-01-17", "2023-01-23"].map((date, i) => ({ date, price: 100 + i * 20, raw: 100 + i * 10, fx: 1 }));
    const plan = { ...base, freq: "weekly" as const, weekday: 1 as const, startDate: "2023-01-02", reinvest: false };
    const calc = calcPlan({ SPY: holidayRows }, plan);
    const window = comparisonWindow(plan, { SPY: holidayRows }, calc)!;
    expect(window.start).toBe("2023-01-03");
    expect(window.anchor).toBe("2023-01-02");
    expect(compareEtf(plan, window, "SPY", holidayRows)).toMatchObject({ status: "available", value: calc.result.value, principal: calc.result.principal });
  });
  it("allows the baseline ETF when its first trading day is after the searched month's first day", () => {
    const midMonth = rows.map((row) => ({ ...row, date: row.date.slice(0, 8) + "15" }));
    const plan = { ...base, mode: "time" as const, tracking: false };
    const calc = calcPlan({ SPY: midMonth }, plan);
    const window = comparisonWindow(plan, { SPY: midMonth }, calc)!;
    expect(compareEtf(plan, window, "SPY", midMonth)).toMatchObject({ status: "available", value: calc.result.value });
  });
  it("uses the combined contribution and preserves the full horizon after crossing the goal", () => {
    const plan = withHoldings({ ...base, lump: 100_000 }, [{ ticker: "SPY", amount: 150 }, { ticker: "QQQ", amount: 100 }]);
    const calc = calcPlan({ SPY: rows, QQQ: rows }, plan);
    const window = comparisonWindow(plan, { SPY: rows, QQQ: rows }, calc)!;
    expect(window.amountWon).toBe(2_500_000);
    const compared = compareEtf(plan, window, "SPY", rows);
    expect(compared.status).toBe("available");
    if (compared.status === "available") {
      expect(compared.value).toBeCloseTo(calc.result.value, 5);
      expect(compared.valuationDate).toBe(rows.at(-1)!.date);
    }
  });
  it("does not buy earlier comparison data before the original ETF's first quote", () => {
    const olderRows: Row[] = Array.from({ length: 90 }, (_, i) => ({ date: new Date(Date.UTC(2020, 0, i + 1)).toISOString().slice(0, 10), price: 100, fx: 1 }));
    const laterRows = olderRows.slice(14);
    const plan = { ...base, tracking: false, freq: "daily" as const, lump: 0 };
    const calc = calcPlan({ SPY: laterRows }, plan);
    const window = comparisonWindow(plan, { SPY: laterRows }, calc)!;
    expect(window.anchor).toBe("2020-01-01");
    expect(window.start).toBe("2020-01-15");
    expect(compareEtf(plan, window, "QQQ", olderRows)).toMatchObject({ status: "available", value: calc.result.value, principal: calc.result.principal });
  });
  it("allows a zero contribution when the lump alone reaches the goal", () => {
    const plan = { ...base, lump: 100_000, mode: "amount" as const, tracking: false, years: 2 };
    const calc = calcPlan({ SPY: rows }, plan);
    const window = comparisonWindow(plan, { SPY: rows }, calc)!;
    expect(window.amountWon).toBe(0);
    expect(compareEtf(plan, window, "SPY", rows)).toMatchObject({ status: "available", value: calc.result.value });
  });
  it("has no comparison window when the chosen start is newer than all data", () => {
    const plan = { ...base, startDate: "2099-01-01" };
    expect(comparisonWindow(plan, { SPY: rows }, calcPlan({ SPY: rows }, plan))).toBeNull();
  });
});

describe("estimated comparison provenance", () => {
  const estimate = { proxy: "QQQ", actualStart: "2022-01-01", convertedToKrw: false };
  const window = comparisonWindow(base, { SPY: rows }, calcPlan({ SPY: rows }, base))!;
  it("marks only the estimated dates actually used and keeps amount and period", () => {
    const result = compareEtf(base, window, "QQQM", rows, estimate);
    const actual = compareEtf(base, window, "QQQ", rows);
    expect(result).toMatchObject({ status: "available", estimate: { ...estimate, from: "2021-01-01", to: "2021-12-01" } });
    if (result.status === "available" && actual.status === "available") {
      expect(result.value).toBe(actual.value);
      expect(result.principal).toBe(actual.principal);
      expect(result.valuationDate).toBe(window.end);
    }
  });
  it("keeps periods after the real boundary in the actual-only group", () => {
    const later = { ...window, anchor: "2022-01-01", start: "2022-01-01", coverageStart: "2022-01-01" };
    const result = compareEtf(base, later, "QQQM", rows, estimate);
    expect(result.status).toBe("available");
    expect(result).not.toHaveProperty("estimate");
  });
  it("does not extrapolate beyond the proxy coverage or stale ending data", () => {
    expect(compareEtf(base, window, "QQQM", rows.slice(20), estimate).status).toBe("unavailable");
    expect(compareEtf(base, window, "QQQM", rows.slice(0, -1), estimate).status).toBe("unavailable");
  });
  it("caps the estimated range when the entire compared period predates listing", () => {
    const result = compareEtf(base, { ...window, end: "2021-06-01" }, "QQQM", rows, estimate);
    expect(result).toMatchObject({ status: "available", estimate: { from: "2021-01-01", to: "2021-06-01" } });
  });
});
