import { afterEach, describe, expect, it, vi } from "vitest";
import { startAnalysisReward, type AnalysisAdSdk } from "./analysisReward";
const fixture = () => {
  const offLoad = vi.fn(), offShow = vi.fn();
  const load = vi.fn<AnalysisAdSdk["load"]>(() => offLoad), show = vi.fn<AnalysisAdSdk["show"]>(() => offShow);
  const done = vi.fn();
  const dispose = startAnalysisReward({ load, show }, "reward-id", done);
  return { load, show, done, dispose, offLoad, offShow };
};
afterEach(() => vi.useRealTimers());
describe("opt-in analysis rewarded ad", () => {
  it("loads before showing and grants once only on earned reward", () => {
    const f = fixture(); expect(f.show).not.toHaveBeenCalled();
    f.load.mock.calls[0][0].onEvent({ type: "loaded" });
    const events = f.show.mock.calls[0][0];
    expect(events.options.adGroupId).toBe("reward-id");
    events.onEvent({ type: "impression" }); expect(f.done).not.toHaveBeenCalled();
    events.onEvent({ type: "userEarnedReward" }); events.onEvent({ type: "userEarnedReward" }); events.onEvent({ type: "dismissed" });
    expect(f.done).toHaveBeenCalledTimes(1); expect(f.done).toHaveBeenCalledWith("rewarded");
    expect(f.offLoad).toHaveBeenCalledOnce(); expect(f.offShow).toHaveBeenCalledOnce();
  });
  it("does not unlock after early dismissal or a late reward", () => {
    const f = fixture(); f.load.mock.calls[0][0].onEvent({ type: "loaded" });
    f.load.mock.calls[0][0].onError(Error("stale load callback"));
    expect(f.done).not.toHaveBeenCalled();
    const events = f.show.mock.calls[0][0]; events.onEvent({ type: "dismissed" }); events.onEvent({ type: "userEarnedReward" });
    expect(f.done).toHaveBeenCalledTimes(1); expect(f.done).toHaveBeenCalledWith("dismissed");
  });
  it("falls back for no-fill and show failures without treating them as earned rewards", () => {
    const f = fixture(); f.load.mock.calls[0][0].onError(Error("no fill"));
    expect(f.done).toHaveBeenCalledTimes(1); expect(f.done).toHaveBeenCalledWith("error"); expect(f.show).not.toHaveBeenCalled();
    const g = fixture(); g.load.mock.calls[0][0].onEvent({ type: "loaded" });
    g.show.mock.calls[0][0].onEvent({ type: "failedToShow" });
    expect(g.done).toHaveBeenCalledTimes(1); expect(g.done).toHaveBeenCalledWith("error");
  });
  it("bounds hung loading and show startup but never times out a visible video", async () => {
    vi.useFakeTimers();
    const f = fixture(); await vi.advanceTimersByTimeAsync(12_000);
    expect(f.done).toHaveBeenCalledTimes(1); expect(f.done).toHaveBeenCalledWith("error");
    f.load.mock.calls[0][0].onEvent({ type: "loaded" }); expect(f.show).not.toHaveBeenCalled();
    const g = fixture(); g.load.mock.calls[0][0].onEvent({ type: "loaded" });
    await vi.advanceTimersByTimeAsync(12_000); expect(g.done).toHaveBeenCalledTimes(1); expect(g.done).toHaveBeenCalledWith("error");
    const h = fixture(); h.load.mock.calls[0][0].onEvent({ type: "loaded" });
    h.show.mock.calls[0][0].onEvent({ type: "show" }); await vi.advanceTimersByTimeAsync(180_000);
    expect(h.done).not.toHaveBeenCalled(); h.dispose(); expect(vi.getTimerCount()).toBe(0);
  });
  it("ignores events after navigation and cleans synchronous callbacks and exceptions", () => {
    const f = fixture(); f.dispose(); f.load.mock.calls[0][0].onEvent({ type: "loaded" });
    expect(f.show).not.toHaveBeenCalled(); expect(f.done).not.toHaveBeenCalled();
    const done = vi.fn(), off = vi.fn();
    startAnalysisReward({ load: args => { args.onEvent({ type: "loaded" }); return off; }, show: args => { args.onEvent({ type: "userEarnedReward" }); return off; } }, "id", done);
    expect(done).toHaveBeenCalledTimes(1); expect(done).toHaveBeenCalledWith("rewarded"); expect(off).toHaveBeenCalledTimes(2);
    const failed = vi.fn();
    startAnalysisReward({ load: () => { throw Error(); }, show: vi.fn() }, "id", failed);
    expect(failed).toHaveBeenCalledTimes(1); expect(failed).toHaveBeenCalledWith("error");
  });
});
