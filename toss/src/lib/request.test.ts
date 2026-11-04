import { afterEach, describe, expect, it, vi } from "vitest";
import { DATA_TIMEOUT_MS, requestJson } from "./request";
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe("bounded data requests", () => {
  it("aborts hung connections and permits a fresh retry", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockImplementationOnce(() => new Promise(() => {}))
      .mockResolvedValue({ ok: true, json: async () => ({ ready: true }) });
    vi.stubGlobal("fetch", fetcher);
    const request = requestJson("/data"); const rejection = expect(request).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(DATA_TIMEOUT_MS); await rejection;
    expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true);
    await expect(requestJson("/data")).resolves.toEqual({ ready: true });
    expect(vi.getTimerCount()).toBe(0);
  });
  it("also bounds response body parsing and cleans up timers on HTTP failures", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: () => new Promise(() => {}) }));
    const rejection = expect(requestJson("/body")).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(DATA_TIMEOUT_MS); await rejection;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(requestJson("/error")).rejects.toThrow("503"); expect(vi.getTimerCount()).toBe(0);
  });
});
