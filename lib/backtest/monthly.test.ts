import { describe, it, expect } from "vitest";
import { monthlySnapshots, milestoneMonths } from "./monthly";

const S = (date: string, valueKRW: number, principalKRW: number) => ({ date, valueKRW, principalKRW });

describe("monthlySnapshots", () => {
  it("각 달의 마지막 거래일을 스냅샷으로 뽑는다", () => {
    const series = [
      S("2020-01-02", 100, 100),
      S("2020-01-31", 120, 100), // 1월 말일 → 이게 1월 스냅샷
      S("2020-02-03", 130, 200),
      S("2020-02-27", 150, 200), // 2월 말일
    ];
    const snaps = monthlySnapshots(series);
    expect(snaps.map((s) => s.ym)).toEqual(["2020-01", "2020-02"]);
    expect(snaps.map((s) => s.date)).toEqual(["2020-01-31", "2020-02-27"]);
    expect(snaps.map((s) => s.valueKRW)).toEqual([120, 150]);
    expect(snaps.map((s) => s.principalKRW)).toEqual([100, 200]);
  });

  it("빈 series는 빈 배열", () => {
    expect(monthlySnapshots([])).toEqual([]);
  });

  it("한 달에 하루만 있어도 그 하루가 스냅샷", () => {
    const snaps = monthlySnapshots([S("2021-05-14", 500, 300)]);
    expect(snaps).toHaveLength(1);
    expect(snaps[0]).toMatchObject({ ym: "2021-05", date: "2021-05-14", valueKRW: 500, principalKRW: 300 });
  });
});

describe("milestoneMonths", () => {
  const months = [
    S("2020-01-31", 50_000_000, 40_000_000),
    S("2020-06-30", 110_000_000, 60_000_000), // 1억 최초 돌파
    S("2021-06-30", 300_000_000, 120_000_000),
    S("2022-06-30", 520_000_000, 180_000_000), // 5억 최초 돌파
  ].map((m) => ({ ...m, ym: m.date.slice(0, 7) }));

  it("각 이정표를 월말 평가액 기준 처음 넘은 달에 매핑", () => {
    const map = milestoneMonths(months, [1e8, 5e8]);
    expect(map.get("2020-06")).toBe(1e8);
    expect(map.get("2022-06")).toBe(5e8);
    expect(map.size).toBe(2);
  });

  it("도달하지 못한 이정표는 매핑하지 않는다", () => {
    const map = milestoneMonths(months, [1e8, 5e8, 10e8]);
    expect(map.has("2022-06")).toBe(true);
    expect([...map.values()]).not.toContain(10e8);
  });

  it("한 달에 여러 이정표를 동시에 넘으면 최고액만 남긴다", () => {
    const jump = [
      { date: "2020-01-31", valueKRW: 10_000_000, principalKRW: 10_000_000 },
      { date: "2020-02-28", valueKRW: 600_000_000, principalKRW: 20_000_000 }, // 1억·5억 동시 돌파
    ].map((m) => ({ ...m, ym: m.date.slice(0, 7) }));
    const map = milestoneMonths(jump, [1e8, 5e8]);
    expect(map.get("2020-02")).toBe(5e8);
    expect(map.size).toBe(1);
  });
});
