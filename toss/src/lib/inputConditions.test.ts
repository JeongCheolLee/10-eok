import { describe, expect, it } from "vitest";
import { holdingsForFrequency, startDateError } from "./inputConditions";

describe("input conditions", () => {
  it("preserves each ETF's allocation when opening a new frequency", () => {
    const holdings = [{ ticker: "SPY", amount: 250 }, { ticker: "QQQ", amount: 50 }];
    expect(holdingsForFrequency(holdings, "weekly", {})).toEqual(holdings);
  });
  it("restores amounts by ticker, including after adding another ETF", () => {
    expect(holdingsForFrequency([{ ticker: "QQQ", amount: 10 }, { ticker: "SPY", amount: 25 }, { ticker: "VT", amount: 30 }], "monthly", { monthly: { SPY: 250, QQQ: 50 } })).toEqual([
      { ticker: "QQQ", amount: 50 }, { ticker: "SPY", amount: 250 }, { ticker: "VT", amount: 30 },
    ]);
  });
  it("respects the target frequency minimum", () => {
    expect(holdingsForFrequency([{ ticker: "SPY", amount: 1 }], "monthly", {})[0].amount).toBe(10);
  });
  it.each(["", "2099-01-01", "2026-02-30", "1989-12-31", "invalid"])("blocks unusable dates: %s", (value) => {
    expect(startDateError(value, "2026-10-22")).not.toBeNull();
  });
  it("allows today and a valid leap day", () => {
    expect(startDateError("2026-10-22", "2026-10-22")).toBeNull();
    expect(startDateError("2024-02-29", "2026-10-22")).toBeNull();
  });
});
