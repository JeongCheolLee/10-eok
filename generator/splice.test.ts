// 프록시 이력 소실 시(2026-09-16~ Yahoo ^BXM) 직전 번들 합성 구간 재사용 로직의 골든 테스트.
import { describe, it, expect } from "vitest";
import { spliceFromPrev, proxyToKrw } from "./build-bundle";
import type { PxBundle } from "../lib/backtest/compose";
import type { PricePoint } from "../lib/backtest/align";

const prev: PxBundle = {
  ticker: "JEPI",
  currency: "USD",
  start: "2020-05-19",
  generatedAt: "2026-09-15T00:00:00.000Z",
  rows: [
    ["2020-05-19", 10, 20], // 합성(프록시 스케일) 구간
    ["2020-05-20", 11, 22],
    ["2020-05-21", 20, 50], // 실제 첫날(접합일)
    ["2020-05-22", 21, 51],
  ],
};

describe("spliceFromPrev", () => {
  it("접합일 가격 비율로 합성 구간을 재스케일해 새 실제 데이터 앞에 붙인다", () => {
    // 배당 재조정으로 adjclose가 절반이 된 상황(20→10). raw(미수정)는 그대로(50→50).
    const real: PricePoint[] = [
      { date: "2020-05-21", price: 10, raw: 50 },
      { date: "2020-05-22", price: 10.5, raw: 51 },
    ];
    const out = spliceFromPrev(real, prev)!;
    expect(out.map((r) => r.date)).toEqual(["2020-05-19", "2020-05-20", "2020-05-21", "2020-05-22"]);
    expect(out[0]).toEqual({ date: "2020-05-19", price: 5, raw: 20 }); // price×0.5, raw×1
    expect(out[1]).toEqual({ date: "2020-05-20", price: 5.5, raw: 22 });
    expect(out[2]).toEqual(real[0]); // 실제 구간은 손대지 않음
    expect(out[3]).toEqual(real[1]);
  });

  it("접합점이 연속이다: 합성 마지막 행 ÷ 접합일 비율이 기존 번들과 같다", () => {
    const real: PricePoint[] = [{ date: "2020-05-21", price: 40, raw: 50 }];
    const out = spliceFromPrev(real, prev)!;
    const prevRatio = 11 / 20; // 기존 번들: 05-20 ÷ 05-21
    const newRatio = out[1].price / out[2].price;
    expect(newRatio).toBeCloseTo(prevRatio, 6);
  });

  it("raw가 없는 실제 데이터는 price를 raw로 간주한다", () => {
    const real: PricePoint[] = [{ date: "2020-05-21", price: 25 }];
    const out = spliceFromPrev(real, prev)!;
    expect(out[0].raw).toBeCloseTo(20 * (25 / 50), 6);
  });

  it("기존 번들에 접합일 행이 없으면 null (스케일 기준을 못 잡음)", () => {
    const real: PricePoint[] = [{ date: "2020-05-23", price: 10, raw: 50 }];
    expect(spliceFromPrev(real, prev)).toBeNull();
  });

  it("기존 번들에 합성 구간이 없으면 null", () => {
    const real: PricePoint[] = [{ date: "2020-05-19", price: 10, raw: 20 }];
    expect(spliceFromPrev(real, prev)).toBeNull();
  });

  it("실제 데이터가 비면 null", () => {
    expect(spliceFromPrev([], prev)).toBeNull();
  });
});

describe("proxyToKrw", () => {
  const fx = [
    { date: "2020-01-02", rate: 1000 },
    { date: "2020-01-06", rate: 1200 },
  ];
  it("그날 이하 최근 환율을 곱하고(forward-fill), 환율 이전 날짜는 버린다", () => {
    const out = proxyToKrw(
      [
        { date: "2020-01-01", price: 1, raw: 2 },
        { date: "2020-01-03", price: 10, raw: 20 },
        { date: "2020-01-07", price: 10, raw: 20 },
      ],
      fx,
    );
    expect(out).toEqual([
      { date: "2020-01-03", price: 10_000, raw: 20_000 },
      { date: "2020-01-07", price: 12_000, raw: 24_000 },
    ]);
  });
});
