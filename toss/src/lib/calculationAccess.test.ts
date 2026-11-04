import { describe, expect, it } from "vitest";
import { createCalculationAccess, loadCalculationAccess, koreanDay, untilKoreanMidnight } from "./calculationAccess";
import { DEFAULT_PLAN, withHoldings } from "./plan";

const plan = (amount: number) => withHoldings(DEFAULT_PLAN, [{ ticker: "SPY", amount }]);
const memoryStore = () => {
  let raw: string | null = null;
  return { getItem: () => raw, setItem: (_key: string, value: string) => { raw = value; } };
};

describe("calculation access", () => {
  it("allows two distinct successful calculations, then requires an ad", () => {
    const access = createCalculationAccess();
    for (const amount of [100, 200]) {
      expect(access.needsAd(plan(amount))).toBe(false);
      access.complete(plan(amount));
    }
    expect(access.remaining()).toBe(0);
    expect(access.needsAd(plan(300))).toBe(true);
    expect(access.needsAd(plan(100))).toBe(false);
  });
  it("does not consume quota for input checks, failed attempts or ad cancellation", () => {
    const access = createCalculationAccess();
    access.needsAd(plan(100)); access.needsAd(plan(100));
    expect(access.remaining()).toBe(2);
    access.complete(plan(100)); access.complete(plan(200));
    access.needsAd(plan(300));
    expect(access.needsAd(plan(300))).toBe(true);
    expect(access.isUnlocked()).toBe(false);
  });
  it("deduplicates repeated completions and irrelevant or reordered inputs", () => {
    const access = createCalculationAccess();
    const p = withHoldings(DEFAULT_PLAN, [{ ticker: "SPY", amount: 100 }, { ticker: "QQQ", amount: 50 }]);
    access.complete(p); access.complete(p);
    access.complete(withHoldings({ ...p, years: 20, weekday: 5 }, [...p.holdings].reverse()));
    expect(access.remaining()).toBe(1);
    access.complete({ ...p, reinvest: false });
    expect(access.remaining()).toBe(0);
  });
  it("exempts saved/shared results and only the current calculation on ad failure", () => {
    const access = createCalculationAccess();
    access.complete(plan(50), true);
    expect(access.remaining()).toBe(2);
    access.complete(plan(100)); access.complete(plan(200));
    access.complete(plan(300), true);
    expect(access.needsAd(plan(300))).toBe(false);
    expect(access.needsAd(plan(400))).toBe(true);
    expect(access.isUnlocked()).toBe(false);
  });
  it("unlocks unlimited calculations only on reward and survives a reload", () => {
    const store = memoryStore();
    const access = createCalculationAccess(store);
    access.complete(plan(100)); access.complete(plan(200));
    const reloaded = createCalculationAccess(store);
    expect(reloaded.needsAd(plan(300))).toBe(true);
    reloaded.reward(); reloaded.reward();
    expect(createCalculationAccess(store).needsAd(plan(999))).toBe(false);
    expect(createCalculationAccess(memoryStore()).remaining()).toBe(2);
    expect(createCalculationAccess(memoryStore()).isUnlocked()).toBe(false);
  });
  it("handles unavailable or corrupt storage without blocking calculation", () => {
    const access = createCalculationAccess({ getItem() { throw Error(); }, setItem() { throw Error(); } });
    access.complete(plan(100)); access.complete(plan(200)); access.reward();
    expect(access.needsAd(plan(300))).toBe(false);
    for (const raw of ["bad", '{"used":-1,"unlocked":true,"seen":[]}', '{"used":2,"unlocked":true,"seen":[null]}']) {
      expect(createCalculationAccess({ getItem: () => raw, setItem() {} }).remaining()).toBe(2);
    }
  });
});


describe("Korean daily allowance", () => {
  it("resets quota and earned reward exactly at Korean midnight, without reopening", () => {
    let now = Date.parse("2026-11-02T14:59:59.999Z");
    const store = memoryStore();
    const access = createCalculationAccess(store, () => now);
    access.complete(plan(100)); access.complete(plan(200)); access.reward();
    expect(access.isUnlocked()).toBe(true);
    expect(koreanDay(now)).toBe("2026-11-02");
    expect(untilKoreanMidnight(now)).toBe(1);
    now += 1;
    expect(access.isUnlocked()).toBe(false);
    expect(access.remaining()).toBe(2);
    expect(access.known(plan(100))).toBe(false);
    expect(createCalculationAccess(store, () => now).remaining()).toBe(2);
    expect(koreanDay(now)).toBe("2026-11-03");
  });
  it("replaces the previous day on reopening and grants a midnight-spanning ad on completion day", () => {
    const store = memoryStore();
    let now = Date.parse("2026-12-31T14:59:00Z");
    const access = createCalculationAccess(store, () => now);
    access.complete(plan(100)); access.complete(plan(200));
    now = Date.parse("2026-12-31T15:00:01Z");
    expect(createCalculationAccess(store, () => now).remaining()).toBe(2);
    access.reward();
    expect(createCalculationAccess(store, () => now).isUnlocked()).toBe(true);
    expect(koreanDay(now)).toBe("2027-01-01");
  });
  it("persists sequentially through asynchronous SDK Storage and survives app recreation", async () => {
    const values = new Map<string, string>();
    const store = {
      get: async (key: string) => values.get(key) ?? null,
      set: async (key: string, value: string) => { await Promise.resolve(); values.set(key, value); },
    };
    const now = () => Date.parse("2026-11-02T01:00:00Z");
    const access = await loadCalculationAccess(store, now);
    access.complete(plan(100)); access.complete(plan(200));
    await access.flush();
    const reopened = await loadCalculationAccess(store, now);
    expect(reopened.needsAd(plan(300))).toBe(true);
    reopened.reward(); reopened.complete(plan(300));
    await reopened.flush();
    expect((await loadCalculationAccess(store, now)).isUnlocked()).toBe(true);
  });
  it("keeps a working in-memory allowance when native storage rejects", async () => {
    const access = await loadCalculationAccess({ get: async () => { throw Error(); }, set: async () => { throw Error(); } });
    access.complete(plan(100)); access.complete(plan(200)); access.reward();
    await access.flush();
    expect(access.isUnlocked()).toBe(true);
  });
});
