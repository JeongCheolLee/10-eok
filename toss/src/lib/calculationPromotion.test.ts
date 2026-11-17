import { describe, expect, it, vi } from "vitest";
import { createCalculationPromotion, promotionConfig, promotionStorageKey, type PromotionConfig, type PromotionDeps } from "./calculationPromotion";

const config: PromotionConfig = { code: "TEST_CALC", amount: 3, startsAt: 100, endsAt: 1000, test: true };
function setup() {
  const data = new Map<string, string>();
  const deps: PromotionDeps = {
    get: async (key) => data.get(key) ?? null,
    set: async (key, value) => { data.set(key, value); },
    identify: async () => "user-one",
    grant: vi.fn(async () => ({ key: "receipt-1" })),
    reference: () => "request-1", now: () => 500,
  };
  return { data, deps, controller: createCalculationPromotion(config, deps) };
}

describe("calculation promotion", () => {
  it("allows a fresh test run while retaining all old receipts and deduplicating the same run", async () => {
    const { deps, data } = setup();
    const run = (id: string | null) => createCalculationPromotion(config, {
      ...deps,
      get: (key) => deps.get(promotionStorageKey(config, key, id)),
      set: (key, value) => deps.set(promotionStorageKey(config, key, id), value),
    });
    await run(null).complete(true);
    await run("preview-2").initialize();
    expect(deps.grant).toHaveBeenCalledTimes(1);
    await run("preview-2").complete(true);
    await run("preview-2").complete(true);
    await run(null).complete(true);
    expect(deps.grant).toHaveBeenCalledTimes(2);
    expect(data.size).toBe(2);
  });
  it("never bypasses a live receipt through testRun", async () => {
    const { deps } = setup();
    const live = { ...config, code: "LIVE_CALC", test: false };
    for (const id of [null, "preview-2", "preview-3"]) {
      await createCalculationPromotion(live, {
        ...deps,
        get: (key) => deps.get(promotionStorageKey(live, key, id)),
        set: (key, value) => deps.set(promotionStorageKey(live, key, id), value),
      }).complete(true);
    }
    expect(deps.grant).toHaveBeenCalledOnce();
  });
  it("requires both a test code and test mode, and rejects invalid run IDs", () => {
    expect(promotionStorageKey({ ...config, test: false }, "receipt", "new")).toBe("receipt");
    expect(promotionStorageKey({ ...config, code: "LIVE_CALC" }, "receipt", "new")).toBe("receipt");
    for (const id of [null, "", "a/b", "a".repeat(65)]) {
      expect(promotionStorageKey(config, "receipt", id)).toBe("receipt");
    }
  });
  it("never grants on entry or a restored/shared result", async () => {
    const { controller, deps } = setup();
    await controller.initialize(); await controller.complete(false); await controller.retry();
    expect(controller.snapshot().status).toBe("ready"); expect(deps.grant).not.toHaveBeenCalled();
  });
  it("grants exactly once for concurrent results and after reopening", async () => {
    const { controller, deps } = setup();
    await Promise.all([controller.complete(true), controller.complete(true), controller.complete(true)]);
    expect(controller.snapshot().status).toBe("paid"); expect(deps.grant).toHaveBeenCalledOnce(); expect(deps.grant).toHaveBeenCalledWith("TEST_CALC", 3);
    await createCalculationPromotion(config, deps).complete(true); expect(deps.grant).toHaveBeenCalledOnce();
  });
  it("persists pending before the SDK call", async () => {
    const { controller, deps, data } = setup();
    deps.grant = vi.fn(async () => { expect(JSON.parse([...data.values()][0]).status).toBe("pending"); return { key: "receipt" }; });
    await controller.complete(true); expect(controller.snapshot().status).toBe("paid");
  });
  it("does not retry an unknown outcome, even after restart", async () => {
    const { controller, deps } = setup();
    deps.grant = vi.fn().mockRejectedValue(Error("network lost"));
    await controller.complete(true); expect(controller.snapshot().status).toBe("uncertain");
    await controller.retry(); await controller.complete(true);
    const reopened = createCalculationPromotion(config, deps); await reopened.complete(true);
    expect(reopened.snapshot().status).toBe("uncertain"); expect(deps.grant).toHaveBeenCalledOnce();
  });
  it("shows an uncertain state after timeout and accepts a late success without regranting", async () => {
    vi.useFakeTimers();
    try {
      const { deps } = setup();
      let resolve!: (value: { key: string }) => void;
      deps.grant = vi.fn(() => new Promise<{ key: string }>((done) => { resolve = done; }));
      const controller = createCalculationPromotion(config, { ...deps, timeoutMs: 100 });
      const result = controller.complete(true);
      await vi.advanceTimersByTimeAsync(101);
      expect(controller.snapshot().status).toBe("uncertain");
      await controller.retry(); expect(deps.grant).toHaveBeenCalledOnce();
      resolve({ key: "late" }); await result;
      expect(controller.snapshot().status).toBe("paid");
    } finally { vi.useRealTimers(); }
  });
  it("allows explicit retry after a confirmed 4110 failure", async () => {
    const { controller, deps } = setup();
    deps.grant = vi.fn().mockRejectedValueOnce({ code: "4110" }).mockResolvedValue({ key: "second" });
    await controller.complete(true); expect(controller.snapshot().status).toBe("retryable");
    await controller.retry(); expect(controller.snapshot().status).toBe("paid"); expect(deps.grant).toHaveBeenCalledTimes(2);
  });
  it.each(["4100", "4109", "4112", "4114", "4116", "40000", "UNSUPPORTED_APP_VERSION"])("does not regrant after terminal error %s", async (code) => {
    const { controller, deps } = setup(); deps.grant = vi.fn().mockRejectedValue({ code });
    await controller.complete(true); await controller.retry();
    await createCalculationPromotion(config, deps).complete(true); expect(deps.grant).toHaveBeenCalledOnce();
  });
  it("does not pay when identity or receipt read/write is unavailable", async () => {
    for (const field of ["identify", "get", "set"] as const) {
      const { controller, deps } = setup(); deps[field] = vi.fn().mockRejectedValue(Error("storage failure"));
      await controller.complete(true); expect(controller.snapshot().status).toBe("unavailable"); expect(deps.grant).not.toHaveBeenCalled();
    }
  });
  it("does not treat a corrupt receipt as a new user", async () => {
    const { controller, deps } = setup(); deps.get = async () => "broken";
    await controller.complete(true); expect(deps.grant).not.toHaveBeenCalled();
  });
  it("keeps the pending marker if success cannot be saved", async () => {
    const { controller, deps } = setup(); const set = deps.set;
    deps.set = async (key, value) => { if (JSON.parse(value).status === "paid") throw Error("disk"); await set(key, value); };
    await controller.complete(true); expect(controller.snapshot().status).toBe("paid");
    await createCalculationPromotion(config, deps).complete(true); expect(deps.grant).toHaveBeenCalledOnce();
  });
  it("uses separate receipt keys for different users and campaigns", async () => {
    const { controller, deps } = setup(); await controller.complete(true);
    deps.identify = async () => "user-two";
    await createCalculationPromotion(config, deps).complete(true);
    await createCalculationPromotion({ ...config, code: "TEST_OTHER" }, deps).complete(true);
    expect(deps.grant).toHaveBeenCalledTimes(3);
  });
  it("checks campaign time again after calculation", async () => {
    const { controller, deps } = setup(); await controller.initialize(); deps.now = () => 1001;
    // A closure allows time to advance in an already-created controller.
    let now = 500; const active = createCalculationPromotion(config, { ...deps, now: () => now });
    await active.initialize(); now = 1000; await active.complete(true);
    expect(active.snapshot().status).toBe("ended"); expect(deps.grant).not.toHaveBeenCalled();
  });
  it("rejects success-shaped responses without a nonempty reward key", async () => {
    const { controller, deps } = setup(); deps.grant = vi.fn().mockResolvedValue({ key: "" });
    await controller.complete(true); expect(controller.snapshot().status).toBe("uncertain");
  });
});

describe("promotion build configuration", () => {
  const env = { VITE_CALC_PROMOTION_MODE: "test", VITE_CALC_PROMOTION_CODE: "TEST_CALC", VITE_CALC_PROMOTION_AMOUNT: "3", VITE_CALC_PROMOTION_START: "2026-11-10T00:00:00+09:00", VITE_CALC_PROMOTION_END: "2026-11-17T00:00:00+09:00" };
  it("defaults to off and validates explicit amount, dates, and test/live code pairing", () => {
    expect(promotionConfig({})).toBeNull(); expect(promotionConfig(env)?.amount).toBe(3);
    for (const patch of [{ VITE_CALC_PROMOTION_MODE: "live" }, { VITE_CALC_PROMOTION_AMOUNT: "0" }, { VITE_CALC_PROMOTION_AMOUNT: "3.5" }, { VITE_CALC_PROMOTION_AMOUNT: "5001" }, { VITE_CALC_PROMOTION_START: "bad" }, { VITE_CALC_PROMOTION_END: env.VITE_CALC_PROMOTION_START }, { VITE_CALC_PROMOTION_CODE: "" }]) expect(promotionConfig({ ...env, ...patch })).toBeNull();
    expect(promotionConfig({ ...env, VITE_CALC_PROMOTION_MODE: "live", VITE_CALC_PROMOTION_CODE: "APPROVED" })?.test).toBe(false);
  });
});
