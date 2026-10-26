import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Callbacks = { onEvent: (event: { type: string }) => void; onError: () => void };
const sdk = vi.hoisted(() => ({
  load: vi.fn<(args: Callbacks) => () => void>(() => () => {}),
  show: vi.fn<(args: Callbacks) => () => void>(() => () => {}),
}));
vi.mock("@apps-in-toss/web-framework", () => ({
  getOperationalEnvironment: () => "sandbox",
  TossAds: { attachBanner: { isSupported: () => true } },
  loadFullScreenAd: Object.assign(sdk.load, { isSupported: () => true }),
  showFullScreenAd: sdk.show,
}));
beforeEach(() => {
  vi.clearAllMocks(); vi.resetModules();
  vi.stubEnv("VITE_REWARDED_ADS_ENABLED", "true");
  vi.stubEnv("VITE_AD_REWARDED_ID", "test-explicit-rewarded-id");
});
afterEach(() => vi.unstubAllEnvs());
const handlers = () => ({ onReward: vi.fn(), onDismiss: vi.fn(), onError: vi.fn() });
describe("rewarded ad lifecycle", () => {
  it("does not reward an early dismissal", async () => {
    const { createRewarded } = await import("./platform");
    const ad = createRewarded()!; const h = handlers();
    ad.load(); sdk.load.mock.calls[0][0].onEvent({ type: "loaded" });
    ad.show(h); sdk.show.mock.calls[0][0].onEvent({ type: "dismissed" });
    expect(h.onReward).not.toHaveBeenCalled();
    expect(h.onDismiss).toHaveBeenCalledOnce();
    expect(sdk.load).toHaveBeenCalledTimes(2);
  });
  it("rewards earned completion, without treating subsequent dismissal as cancellation", async () => {
    const { createRewarded } = await import("./platform");
    const ad = createRewarded()!; const h = handlers();
    ad.load(); sdk.load.mock.calls[0][0].onEvent({ type: "loaded" });
    ad.show(h); const events = sdk.show.mock.calls[0][0];
    events.onEvent({ type: "userEarnedReward" }); events.onEvent({ type: "dismissed" });
    expect(h.onReward).toHaveBeenCalledOnce();
    expect(h.onDismiss).not.toHaveBeenCalled();
    expect(h.onError).not.toHaveBeenCalled();
  });
  it("falls back after load failure and retries loading for the next calculation", async () => {
    const { createRewarded } = await import("./platform");
    const ad = createRewarded()!; const h = handlers();
    ad.load(); sdk.load.mock.calls[0][0].onError(); ad.show(h);
    expect(h.onError).toHaveBeenCalledOnce();
    expect(h.onReward).not.toHaveBeenCalled();
    expect(sdk.show).not.toHaveBeenCalled();
    expect(sdk.load).toHaveBeenCalledTimes(2);
    sdk.load.mock.calls[1][0].onEvent({ type: "loaded" });
    ad.show(h); sdk.show.mock.calls[0][0].onEvent({ type: "failedToShow" });
    expect(h.onError).toHaveBeenCalledTimes(2);
    expect(h.onReward).not.toHaveBeenCalled();
  });
  it("never creates or loads rewarded ads while paused, even with an ID", async () => {
    vi.stubEnv("VITE_REWARDED_ADS_ENABLED", "false");
    const { createRewarded, REWARDED_ADS_ENABLED } = await import("./platform");
    expect(REWARDED_ADS_ENABLED).toBe(false);
    expect(createRewarded()).toBeNull();
    expect(sdk.load).not.toHaveBeenCalled(); expect(sdk.show).not.toHaveBeenCalled();
  });
  it("defaults to paused when the activation setting is absent", async () => {
    vi.stubEnv("VITE_REWARDED_ADS_ENABLED", undefined);
    const { createRewarded, REWARDED_ADS_ENABLED } = await import("./platform");
    expect(REWARDED_ADS_ENABLED).toBe(false); expect(createRewarded()).toBeNull();
    expect(sdk.load).not.toHaveBeenCalled();
  });
  it("requires an explicit ID instead of activating the fallback test placement", async () => {
    vi.stubEnv("VITE_AD_REWARDED_ID", undefined);
    const { createRewarded, REWARDED_ADS_ENABLED } = await import("./platform");
    expect(REWARDED_ADS_ENABLED).toBe(false); expect(createRewarded()).toBeNull();
    expect(sdk.load).not.toHaveBeenCalled();
  });
});
