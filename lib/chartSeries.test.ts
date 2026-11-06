import { describe, expect, it } from "vitest";
import { chartIndices, type ChartPoint } from "./chartSeries";

const daily = (count: number): ChartPoint[] => Array.from({ length: count }, (_, i) => ({
  date: new Date(Date.UTC(2020, 0, i + 1)).toISOString().slice(0, 10),
  value: 100 + i, principal: 100 + Math.floor(i / 30),
}));

describe("chart display preserves observed extrema and milestones", () => {
  it("does not drop a one-day target crossing between uniform samples", () => {
    const series = daily(1600);
    series[1450].value = 1_003_523_828;
    const old = Array.from({ length: 120 }, (_, i) => Math.round(i * 1599 / 119));
    expect(old).not.toContain(1450);
    const indices = chartIndices(series, 120, [series[1450].date]);
    expect(indices).toContain(1450);
    expect(Math.max(...indices.map((i) => series[i].value))).toBe(1_003_523_828);
  });

  it("keeps a milestone even when a different day in the same bucket is the maximum", () => {
    const series = daily(1600);
    series[1451].value = 1e9;
    series[1452].value = 1.2e9;
    const indices = chartIndices(series, 120, [series[1451].date]);
    expect(indices).toEqual(expect.arrayContaining([0, 1451, 1452, 1599]));
    // Coordinates use source indices, not ordinal positions among selected points.
    expect(indices[indices.indexOf(1451) + 1] - 1451).toBe(1);
  });

  it("preserves both value and principal extremes, with sorted unique source indices", () => {
    const series = daily(1600);
    series[600].value = -90;
    series[601].value = 9000;
    series[602].principal = 0;
    series[603].principal = 10000;
    const indices = chartIndices(series, 120, [series[601].date, series[601].date, "missing"]);
    expect(indices).toEqual(expect.arrayContaining([600, 601, 602, 603]));
    expect(indices.length).toBeLessThanOrEqual(120);
    expect(indices).toEqual([...new Set(indices)].sort((a, b) => a - b));
    expect(series[600].value).toBe(-90);
  });

  it.each([0, 1, 2, 120])("retains every point in a short series of %i observations", (length) => {
    expect(chartIndices(daily(length))).toEqual(Array.from({ length }, (_, i) => i));
  });
});
