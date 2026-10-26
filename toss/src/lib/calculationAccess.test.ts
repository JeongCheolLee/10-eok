import { describe, expect, it } from "vitest";
import { createCalculationAccess } from "./calculationAccess";
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
