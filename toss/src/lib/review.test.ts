import { describe, expect, it, vi } from "vitest";
vi.mock("./platform", () => ({ inToss: false, requestAppReview: vi.fn(), storage: { get: vi.fn(), set: vi.fn() } }));
import { createReviewPrompt } from "./review";

const memory = () => {
  let raw: string | null = null;
  return { get: async () => raw, set: async (_key: string, value: string) => { raw = value; return true; } };
};
describe("optional review request", () => {
  it("requires two completed calculations and a successful-save trigger", async () => {
    const ask = vi.fn(); const review = createReviewPrompt(memory(), ask);
    await review.afterSave(); await review.completed(); await review.afterSave();
    expect(ask).not.toHaveBeenCalled();
    await review.completed(); expect(ask).not.toHaveBeenCalled();
    await Promise.all([review.afterSave(), review.afterSave()]);
    expect(ask).toHaveBeenCalledOnce();
  });
  it("persists a 30-day cooldown across sessions and caps each session to one attempt", async () => {
    const store = memory(); const ask = vi.fn(); let now = 1_800_000_000_000;
    const review = createReviewPrompt(store, ask, () => now);
    await review.completed(); await review.completed(); await review.afterSave();
    await createReviewPrompt(store, ask, () => now).afterSave(); expect(ask).toHaveBeenCalledOnce();
    now += 30 * 86400_000;
    await review.afterSave(); expect(ask).toHaveBeenCalledOnce();
    await createReviewPrompt(store, ask, () => now).afterSave(); expect(ask).toHaveBeenCalledTimes(2);
  });
  it("does not prompt if history cannot be persisted, and swallows SDK rejection", async () => {
    const ask = vi.fn().mockRejectedValue(Error("unavailable")); const store = memory();
    const review = createReviewPrompt(store, ask);
    await review.completed(); await review.completed();
    const originalSet = store.set; store.set = async () => false;
    await review.afterSave(); expect(ask).not.toHaveBeenCalled();
    store.set = originalSet;
    const again = createReviewPrompt(store, ask);
    await expect(again.afterSave()).resolves.toBeUndefined();
    await again.afterSave(); expect(ask).toHaveBeenCalledOnce();
  });
});
