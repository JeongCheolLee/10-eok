import { beforeEach, describe, expect, it, vi } from "vitest";

type BannerCallbacks = { onAdRendered: () => void; onNoFill: () => void; onAdFailedToRender: () => void };
const sdk = vi.hoisted(() => ({
  destroy: vi.fn(),
  initialize: vi.fn<(args: { callbacks: { onInitialized: () => void; onInitializationFailed: () => void } }) => void>(),
  attach: vi.fn<(id: string, element: HTMLElement, options: { callbacks: BannerCallbacks }) => { destroy: () => void }>(),
}));
vi.mock("@apps-in-toss/web-framework", () => ({
  getOperationalEnvironment: () => "sandbox",
  TossAds: { initialize: sdk.initialize, attachBanner: Object.assign(sdk.attach, { isSupported: () => true }) },
  // 배너는 전면/리워드 API가 지원되지 않아도 독립적으로 동작해야 한다.
  loadFullScreenAd: { isSupported: () => false },
}));

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  sdk.initialize.mockImplementation(({ callbacks }) => callbacks.onInitialized());
  sdk.attach.mockImplementation(() => ({ destroy: sdk.destroy }));
});

describe("banner visibility", () => {
  it("waits for rendered, collapses on no-fill/failure, and can show a later render", async () => {
    const { attachBanner } = await import("./platform");
    const visible = vi.fn();
    await attachBanner({} as HTMLElement, visible);
    expect(visible.mock.calls).toEqual([[false]]);
    const callbacks = sdk.attach.mock.calls[0][2].callbacks;
    callbacks.onAdRendered(); callbacks.onNoFill(); callbacks.onAdRendered(); callbacks.onAdFailedToRender();
    expect(visible.mock.calls).toEqual([[false], [true], [false], [true], [false]]);
  });
  it("ignores callbacks after disposal", async () => {
    const { attachBanner } = await import("./platform");
    const visible = vi.fn();
    const dispose = await attachBanner({} as HTMLElement, visible);
    dispose!();
    sdk.attach.mock.calls[0][2].callbacks.onAdRendered();
    expect(sdk.destroy).toHaveBeenCalledOnce();
    expect(visible.mock.calls).toEqual([[false]]);
  });
  it("stays collapsed when initialization fails", async () => {
    sdk.initialize.mockImplementation(({ callbacks }) => callbacks.onInitializationFailed());
    const { attachBanner } = await import("./platform");
    const visible = vi.fn();
    expect(await attachBanner({} as HTMLElement, visible)).toBeNull();
    expect(sdk.attach).not.toHaveBeenCalled();
    expect(visible.mock.calls).toEqual([[false]]);
  });
  it("collapses if attachment throws", async () => {
    sdk.attach.mockImplementation(() => { throw new Error("failed to attach"); });
    const { attachBanner } = await import("./platform");
    const visible = vi.fn();
    expect(await attachBanner({} as HTMLElement, visible)).toBeNull();
    expect(visible).toHaveBeenLastCalledWith(false);
  });
});
