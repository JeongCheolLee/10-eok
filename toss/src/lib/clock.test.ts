import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_PLAN, withHoldings } from "./plan";

const mock = vi.hoisted(() => ({ raw: null as string | null, fail: false }));
vi.mock("./platform", () => ({ storage: {
  get: async () => mock.raw,
  set: async (_key: string, value: string) => { if (mock.fail) return false; mock.raw = value; return true; },
} }));
import { loadSavedClocks, removeSavedClock, saveClock } from "./clock";

beforeEach(() => { mock.raw = null; mock.fail = false; });

describe("saved calculations", () => {
  it.each([1, 2])("keeps an existing v%s condition when adding a new one", async (v) => {
    const { holdings, ...legacy } = DEFAULT_PLAN;
    mock.raw = JSON.stringify({ v, plan: v === 1 ? legacy : DEFAULT_PLAN, savedAt: "2026-10-20T00:00:00.000Z" });
    const old = (await loadSavedClocks())[0];
    expect(old.plan.holdings).toEqual(holdings);
    await saveClock(withHoldings(DEFAULT_PLAN, [{ ticker: "QQQ", amount: 50 }]));
    const saved = await loadSavedClocks();
    expect(saved.map((item) => item.plan.ticker)).toEqual(["QQQ", "SPY"]);
    expect(saved[1].id).toBe(old.id);
    expect(JSON.parse(mock.raw!).v).toBe(3);
  });
  it("updates an identical condition without adding a duplicate", async () => {
    await saveClock(DEFAULT_PLAN);
    const id = (await loadSavedClocks())[0].id;
    await saveClock({ ...DEFAULT_PLAN, years: 20, weekday: 5 });
    expect(await loadSavedClocks()).toHaveLength(1);
    expect((await loadSavedClocks())[0].id).toBe(id);
  });
  it("distinguishes amounts, schedules, lump sums, dividends, dates and modes", async () => {
    for (const plan of [DEFAULT_PLAN,
      withHoldings(DEFAULT_PLAN, [{ ticker: "SPY", amount: 150 }]),
      { ...DEFAULT_PLAN, buyDay: 15 }, { ...DEFAULT_PLAN, lump: 1000 },
      { ...DEFAULT_PLAN, reinvest: false }, { ...DEFAULT_PLAN, freq: "weekly" as const },
      { ...DEFAULT_PLAN, tracking: true, startDate: "2020-01-01" },
      { ...DEFAULT_PLAN, mode: "amount" as const },
    ]) await saveClock(plan);
    expect(await loadSavedClocks()).toHaveLength(8);
  });
  it("keeps multiple ETF allocations and deduplicates reordered holdings", async () => {
    const hs = [{ ticker: "QQQ", amount: 50 }, { ticker: "SCHD", amount: 30 }];
    await saveClock(withHoldings(DEFAULT_PLAN, hs));
    await saveClock(withHoldings(DEFAULT_PLAN, [...hs].reverse()));
    expect(await loadSavedClocks()).toHaveLength(1);
    expect((await loadSavedClocks())[0].plan.holdings).toEqual([...hs].reverse());
  });
  it("does not lose a condition during concurrent saves", async () => {
    await Promise.all([saveClock(DEFAULT_PLAN), saveClock({ ...DEFAULT_PLAN, lump: 1000 })]);
    expect(await loadSavedClocks()).toHaveLength(2);
  });
  it("deletes only the selected item and supports deleting the last item", async () => {
    await saveClock(DEFAULT_PLAN);
    await saveClock({ ...DEFAULT_PLAN, lump: 1000 });
    const [first, second] = await loadSavedClocks();
    await removeSavedClock(second.id);
    expect((await loadSavedClocks()).map((item) => item.id)).toEqual([first.id]);
    await removeSavedClock(first.id);
    expect(await loadSavedClocks()).toEqual([]);
  });
  it("keeps existing data and reports write/delete failures", async () => {
    await saveClock(DEFAULT_PLAN);
    const before = mock.raw;
    mock.fail = true;
    expect(await saveClock({ ...DEFAULT_PLAN, lump: 1000 })).toBe(false);
    expect(await removeSavedClock((await loadSavedClocks())[0].id)).toBe(false);
    expect(mock.raw).toBe(before);
  });
  it("rejects an unselected draft", async () => {
    expect(await saveClock({ ...DEFAULT_PLAN, ticker: "", holdings: [] })).toBe(false);
    expect(mock.raw).toBeNull();
  });
  it("ignores malformed data and preserves valid neighbors", async () => {
    mock.raw = "invalid";
    expect(await loadSavedClocks()).toEqual([]);
    mock.raw = JSON.stringify({ v: 3, items: [null, { id: "bad" }, { id: "ok", plan: DEFAULT_PLAN, savedAt: "2026-10-23" }] });
    expect((await loadSavedClocks()).map((item) => item.id)).toEqual(["ok"]);
  });
});
