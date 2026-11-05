import { describe, expect, it, vi } from "vitest";
import { createAnalysisAccess } from "./analysisAccess";
import { conditionKey } from "./conditionKey";
import { DEFAULT_PLAN, withHoldings } from "./plan";

describe("analysis access per condition", () => {
  it("persists across app sessions, isolates changed conditions, and ignores display order", async () => {
    const data = new Map<string, string>();
    const store = { get: async (key: string) => data.get(key) ?? null, set: async (key: string, value: string) => { data.set(key, value); return true; } };
    const plan = withHoldings(DEFAULT_PLAN, [{ ticker: "SPY", amount: 10 }, { ticker: "QQQ", amount: 20 }]);
    const a = createAnalysisAccess(store);
    expect(await a.has(conditionKey(plan))).toBe(false);
    expect(await a.grant(conditionKey(plan))).toBe(true);
    const b = createAnalysisAccess(store);
    expect(await b.has(conditionKey(withHoldings(plan, [...plan.holdings].reverse())))).toBe(true);
    expect(await b.has(conditionKey({ ...plan, lump: 10 }))).toBe(false);
    expect(await b.has(conditionKey({ ...plan, reinvest: false }))).toBe(false);
  });
  it("retains a real reward in memory when storage fails, without claiming persistence", async () => {
    const a = createAnalysisAccess({ get: vi.fn().mockRejectedValue(Error()), set: vi.fn().mockResolvedValue(false) });
    expect(await a.has("one")).toBe(false); expect(await a.grant("one")).toBe(false);
    expect(await a.has("one")).toBe(true); expect(await a.has("two")).toBe(false);
  });
});
