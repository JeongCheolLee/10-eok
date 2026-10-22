import { describe, expect, it } from "vitest";
import type { Row } from "@/lib/backtest/types";
import { calcPlan, DEFAULT_PLAN, withHoldings, type Plan } from "./plan";
import { compareContributions } from "./contributionComparison";

const rows = (lastPrice: number): Row[] => Array.from({ length: 25 }, (_, i) => ({
  date: `${2020 + Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, "0")}-01`,
  price: i === 24 ? lastPrice : 100, fx: 1,
}));
const plan: Plan = { ...DEFAULT_PLAN, ticker: "SPY", holdings: [{ ticker: "SPY", amount: 100 }], mode: "amount", years: 2, lump: 200_000 };

describe("금액 모드의 최근 평가액", () => {
  it("목돈만으로 일찍 목표를 넘어도 선택한 기간 끝까지 평가한다", () => {
    const rowsBy = { SPY: rows(150) };
    const calc = calcPlan(rowsBy, plan);
    expect(calc.monthlyWon).toBe(0);
    expect(calc.result.reachedDate).toBe("2020-01-01");
    expect(calc.result.value).toBe(3_000_000_000);
    expect(calc.result.months).toBe(24);
    const comparison = compareContributions(plan, rowsBy, calc, 1_000_000);
    expect(comparison.baseline.value).toBe(calc.result.value);
    expect(comparison.baseline.principal).toBe(calc.result.principal);
  });

  it("여러 ETF에 나눈 목돈의 원래 비율을 유지하며 마지막 날까지 평가한다", () => {
    const multi = withHoldings(plan, [{ ticker: "SPY", amount: 80 }, { ticker: "QQQ", amount: 20 }]);
    const rowsBy = { SPY: rows(150), QQQ: rows(50) };
    const calc = calcPlan(rowsBy, multi);
    expect(calc.monthlyWon).toBe(0);
    expect(calc.result.reachedDate).toBe("2020-01-01");
    expect(calc.result.value).toBe(2_600_000_000);
    expect(calc.result.months).toBe(24);
    expect(calc.portfolio?.holdings.map((h) => h.value)).toEqual([2_400_000_000, 200_000_000]);
    const comparison = compareContributions(multi, rowsBy, calc, 1_000_000);
    expect(comparison.baseline.value).toBe(calc.result.value);
    expect(comparison.baseline.principal).toBe(calc.result.principal);
  });
});
