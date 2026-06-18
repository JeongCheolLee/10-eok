import { describe, it, expect } from "vitest";
import { runBacktest, monthsBetween, lowerBound, clampBuyDay } from "./simulate";
import type { Row } from "./types";

function row(date: string, price: number, fx: number): Row {
  return { date, price, fx };
}

describe("runBacktest — GOLDEN (환율 변동, 손계산 대조)", () => {
  // price=1 USD 고정, fx 1000→1250→2000, 매달 100만원, 매수일 1일.
  // m1: usd=1e6/1000=1000, shares=1000, value=1000*1*1000=1,000,000
  // m2: usd=1e6/1250=800,  shares=1800, value=1800*1*1250=2,250,000
  // m3: usd=1e6/2000=500,  shares=2300, value=2300*1*2000=4,600,000
  const rows = [
    row("2020-01-01", 1, 1000),
    row("2020-02-01", 1, 1250),
    row("2020-03-01", 1, 2000),
  ];
  const res = runBacktest(rows, { monthlyKRW: 1_000_000, buyDay: 1, targetKRW: 1_000_000_000 });

  it("이중 환율(KRW→USD→KRW) 경로가 정확하다", () => {
    expect(res.principalKRW).toBe(3_000_000);
    expect(res.valueKRW).toBeCloseTo(4_600_000, 6);
    expect(res.series.map((s) => Math.round(s.valueKRW))).toEqual([1_000_000, 2_250_000, 4_600_000]);
  });
  it("목표 미달이면 reached=false", () => {
    expect(res.reached).toBe(false);
    expect(res.reachedDate).toBeNull();
  });
});

describe("runBacktest — 목표 도달 검출", () => {
  // price=1, fx=1000 고정, 매달 100만원 → 매달 shares+=1000, value=shares*1000.
  // 목표 1천만 → shares>=10000 → 10번째 매수에서 도달.
  const rows: Row[] = [];
  for (let m = 1; m <= 12; m++) rows.push(row(`2020-${String(m).padStart(2, "0")}-01`, 1, 1000));
  const res = runBacktest(rows, { monthlyKRW: 1_000_000, buyDay: 1, targetKRW: 10_000_000 });

  it("정확한 도달 거래일을 찾는다", () => {
    expect(res.reached).toBe(true);
    expect(res.reachedDate).toBe("2020-10-01");
    expect(res.valueKRW).toBeCloseTo(10_000_000, 6);
  });
  it("경과 개월 = 9 (1월→10월)", () => {
    expect(res.months).toBe(9);
    expect(res.years).toBe(0);
    expect(res.monthsRem).toBe(9);
  });
});

describe("runBacktest — 비거래일 매수일 롤", () => {
  // 매수일 1일인데 2월 1일 거래일 없음 → 다음 거래일 2/3로 롤.
  const rows = [
    row("2020-01-01", 1, 1000),
    row("2020-02-03", 1, 1000),
    row("2020-03-02", 1, 1000),
  ];
  const res = runBacktest(rows, { monthlyKRW: 1_000_000, buyDay: 1, targetKRW: 1_000_000_000 });
  it("매수가 다음 거래일로 굴러간다", () => {
    expect(res.series.map((s) => s.date)).toEqual(["2020-01-01", "2020-02-03", "2020-03-02"]);
    expect(res.principalKRW).toBe(3_000_000);
  });
});

describe("helpers", () => {
  it("monthsBetween 일자 보정", () => {
    expect(monthsBetween("2020-01-01", "2020-10-01")).toBe(9);
    expect(monthsBetween("2006-06-21", "2020-01-15")).toBe(162); // 13년 6.x개월
    expect(monthsBetween("2020-01-15", "2020-02-10")).toBe(0); // 일자 미달
  });
  it("lowerBound", () => {
    const rows = [row("2020-01-01", 1, 1), row("2020-01-05", 1, 1)];
    expect(lowerBound(rows, "2020-01-03")).toBe(1);
    expect(lowerBound(rows, "2020-01-01")).toBe(0);
    expect(lowerBound(rows, "2020-02-01")).toBe(-1);
  });
  it("clampBuyDay 1~28", () => {
    expect(clampBuyDay(0)).toBe(1);
    expect(clampBuyDay(31)).toBe(28);
    expect(clampBuyDay(15)).toBe(15);
  });
});
