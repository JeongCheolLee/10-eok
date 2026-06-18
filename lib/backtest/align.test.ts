import { describe, it, expect } from "vitest";
import { alignSeries, validateRows } from "./align";

describe("alignSeries", () => {
  it("환율을 거래일에 forward-fill 한다 (환율 없는 날은 직전값)", () => {
    const prices = [
      { date: "2020-01-01", price: 10 },
      { date: "2020-01-02", price: 11 },
      { date: "2020-01-03", price: 12 },
    ];
    const fx = [
      { date: "2020-01-01", rate: 1000 },
      { date: "2020-01-03", rate: 1200 },
    ];
    const rows = alignSeries(prices, fx);
    expect(rows.map((r) => r.fx)).toEqual([1000, 1000, 1200]); // 1/2는 직전값 1000
  });

  it("환율 이력 시작 전의 가격일은 제외한다", () => {
    const prices = [
      { date: "2000-01-01", price: 5 }, // fx 이력 전
      { date: "2020-01-02", price: 11 },
    ];
    const fx = [{ date: "2020-01-01", rate: 1000 }];
    const rows = alignSeries(prices, fx);
    expect(rows.map((r) => r.date)).toEqual(["2020-01-02"]);
  });

  it("가격이 0/음수인 날은 버린다", () => {
    const prices = [
      { date: "2020-01-01", price: 0 },
      { date: "2020-01-02", price: -3 },
      { date: "2020-01-03", price: 12 },
    ];
    const fx = [{ date: "2020-01-01", rate: 1000 }];
    const rows = alignSeries(prices, fx);
    expect(rows).toHaveLength(1);
    expect(rows[0].date).toBe("2020-01-03");
  });

  it("정렬 후 행이 없으면 throw (나쁜 번들 배포 차단)", () => {
    expect(() => alignSeries([], [])).toThrow();
  });

  it("validateRows는 날짜 역행을 잡는다", () => {
    expect(() =>
      validateRows([
        { date: "2020-01-02", price: 1, fx: 1000 },
        { date: "2020-01-01", price: 1, fx: 1000 },
      ]),
    ).toThrow();
  });
});
