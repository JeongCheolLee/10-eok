import { describe, expect, it } from "vitest";
import { calcPlan, DEFAULT_PLAN, withHoldings } from "./plan";
import { prepareTimingAnalysis } from "./timingAnalysis";
import type { Row } from "@/lib/backtest/types";

const rows = (months: number): Row[] => Array.from({ length: months }, (_, i) => ({
  date: new Date(Date.UTC(2020, i, 1)).toISOString().slice(0, 10), price: 100 + i, fx: 1000,
}));
// 기본 종목이 바뀌어도(10/22 QLD→SPY) 테스트가 흔들리지 않게 종목을 직접 지정
const plan = withHoldings({ ...DEFAULT_PLAN, tracking: true, startDate: "2021-01-01" }, [{ ticker: "QLD", amount: 100 }]);

describe("analysis eligibility before a rewarded ad", () => {
  it("does not offer an analysis with fewer than two complete windows", () => {
    const data = rows(13);
    const calc = calcPlan({ QLD: data }, { ...plan, startDate: "2020-01-01" });
    expect(prepareTimingAnalysis(data, plan, calc)).toEqual({ status: "unavailable", reason: "insufficient-data" });
  });
  it("prepares and keeps the actual result before unlocking it", () => {
    const data = rows(25);
    const calc = calcPlan({ QLD: data }, plan);
    const analysis = prepareTimingAnalysis(data, plan, calc);
    expect(analysis.status).toBe("ready");
    if (analysis.status !== "ready") throw new Error("expected available analysis");
    expect(analysis.durationMonths).toBe(12);
    expect(analysis.result.samples).toBeGreaterThanOrEqual(2);
    expect(analysis.result.max).toBeGreaterThanOrEqual(analysis.result.min);
  });
  it("keeps unsupported multiple-ETF analysis out of the ad flow", () => {
    const data = rows(25);
    const calc = calcPlan({ QLD: data }, plan);
    expect(prepareTimingAnalysis(data, { ...plan, holdings: [...plan.holdings, { ticker: "SPY", amount: 100 }] }, calc))
      .toEqual({ status: "unavailable", reason: "multiple-etfs" });
  });
});
