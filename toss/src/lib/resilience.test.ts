import { describe, expect, it } from "vitest";
import { analyzeResilience } from "./resilience";
const p = (date: string, value: number, principal = 100) => ({ date, value, principal });

describe("contribution-relative investment journey", () => {
  it("selects largest won loss, not largest percentage or peak drawdown", () => {
    const r = analyzeResilience([p("2020-01-01", 100), p("2020-01-02", 50), p("2020-01-03", 900, 1000)]);
    expect(r.worst?.date).toBe("2020-01-03"); expect(r.loss).toBe(100); expect(r.lossRate).toBe(.1);
    expect(r.worstRate?.date).toBe("2020-01-02"); expect(r.maxLossRate).toBe(.5);
  });
  it("splits at breakeven and measures calendar days including weekends", () => {
    const r = analyzeResilience([p("2020-01-03", 90), p("2020-01-06", 100), p("2020-02-03", 90), p("2020-02-07", 110)]);
    expect(r.longest).toEqual({ start: "2020-02-03", end: "2020-02-07", days: 4, recovered: true });
  });
  it("marks incomplete recovery and a loss starting on the last observed day", () => {
    expect(analyzeResilience([p("2020-01-01", 100), p("2020-01-02", 90)]).longest)
      .toEqual({ start: "2020-01-02", end: "2020-01-02", days: 0, recovered: false });
    const r = analyzeResilience([p("2020-01-01", 90), p("2020-01-05", 95)]);
    expect(r.longest?.days).toBe(4); expect(r.longest?.recovered).toBe(false);
  });
  it("does not invent losses for a rising series or sub-won precision noise", () => {
    const r = analyzeResilience([p("2020-01-01", 99.999999), p("2020-01-02", 130), p("2020-01-03", 110)]);
    expect(r.worstRate).toBeNull(); expect(r.maxLossRate).toBe(0);
    expect(r.worst).toBeNull(); expect(r.longest).toBeNull(); expect(r.checkpoints).toEqual([]);
  });
  it("limits the loss search to first reach, while following the journey afterwards", () => {
    const r = analyzeResilience([p("2020-01-01", 80), p("2020-02-01", 120), p("2021-01-04", 100, 200), p("2023-01-02", 420, 400)], "2020-02-01");
    expect(r.worstRate?.date).toBe("2020-01-01"); expect(r.maxLossRate).toBe(.2);
    expect(r.loss).toBe(20); expect(r.end).toBe("2020-02-01");
    expect(r.longest?.recovered).toBe(true);
    expect(r.checkpoints).toEqual([
      { label: "1년 뒤", point: p("2021-01-04", 100, 200), added: 100, pnl: -100 },
      { label: "3년 뒤 · 마지막 평가일", point: p("2023-01-02", 420, 400), added: 300, pnl: 20 },
    ]);
  });
  it("adds five-year intervals only when observed and merges the last evaluation date", () => {
    const series = [p("2000-01-03", 50), p("2001-01-03", 110), p("2003-01-03", 120),
      p("2005-01-03", 130), p("2010-01-04", 140), p("2015-01-05", 150), p("2020-01-03", 160)];
    const r = analyzeResilience(series);
    expect(r.checkpoints.map(c => c.label)).toEqual(["1년 뒤", "3년 뒤", "5년 뒤", "10년 뒤", "15년 뒤", "20년 뒤 · 마지막 평가일"]);
    const shorter = analyzeResilience([...series.slice(0, 3), p("2005-01-02", 125)]);
    expect(shorter.checkpoints.map(c => c.label)).toEqual(["1년 뒤", "3년 뒤", "마지막 평가일"]);
    expect(analyzeResilience([p("2000-01-03", 100, 0), p("2000-01-04", 90)]).maxLossRate).toBe(.1);
  });
  it("shows only observed follow-up, never projecting recovery", () => {
    const r = analyzeResilience([p("2020-01-01", 50), p("2020-04-01", 60)]);
    expect(r.checkpoints).toEqual([{ label: "마지막 평가일", point: p("2020-04-01", 60), added: 0, pnl: -40 }]);
    expect(analyzeResilience([p("2020-01-01", 50)]).checkpoints).toEqual([]);
    expect(() => analyzeResilience([])).toThrow();
  });
});
