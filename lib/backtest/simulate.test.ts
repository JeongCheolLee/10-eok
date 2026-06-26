import { describe, it, expect } from "vitest";
import { runBacktest, runToToday, requiredMonthly, monthsBetween, lowerBound, clampBuyDay, cpiIndexAt } from "./simulate";
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

describe("runToToday — 오늘 기준 역산", () => {
  // price=1, fx=1000 고정, 매달 100만원 → 매수마다 shares+=1000, 마지막날 평가액 = (#매수) × 100만.
  // 12개월 데이터, target=500만 → #매수>=5 필요. 끝(12월)에서 역산하면 8월 시작(매수 5회)이 경계.
  const rows: Row[] = [];
  for (let m = 1; m <= 12; m++) rows.push(row(`2020-${String(m).padStart(2, "0")}-01`, 1, 1000));
  const res = runToToday(rows, { monthlyKRW: 1_000_000, buyDay: 1, targetKRW: 5_000_000 });

  it("가장 늦은 시작(최단 기간)을 찾는다", () => {
    expect(res.reached).toBe(true);
    expect(res.series[0].date).toBe("2020-08-01"); // 8월부터 = 매수 5회
    expect(res.valueKRW).toBeCloseTo(5_000_000, 6);
    expect(res.months).toBe(4); // 8월→12월
  });

  it("전 구간 모아도 부족하면 미달", () => {
    const r2 = runToToday(rows, { monthlyKRW: 1_000_000, buyDay: 1, targetKRW: 99_000_000 });
    expect(r2.reached).toBe(false);
    expect(r2.series[0].date).toBe("2020-01-01"); // 데이터 전 구간
  });
});

describe("물가연동 적립 (CPI)", () => {
  // price=1, fx=1000, 2020-01~12. CPI: 1~6월 100, 7~12월 200(2배).
  // 적립액: 1~6월 100만 ×(100/100)=100만, 7~12월 100만 ×(200/100)=200만.
  // principal = 6×100만 + 6×200만 = 1800만.
  const rows: Row[] = [];
  for (let m = 1; m <= 12; m++) rows.push(row(`2020-${String(m).padStart(2, "0")}-01`, 1, 1000));
  const cpi = [{ ym: "2020-01", idx: 100 }, { ym: "2020-07", idx: 200 }];

  it("적립액이 물가지수 비율로 인상된다", () => {
    const res = runBacktest(rows, { monthlyKRW: 1_000_000, buyDay: 1, targetKRW: 9_999_999_999, cpi });
    expect(res.principalKRW).toBeCloseTo(18_000_000, 4);
  });
  it("cpi 없으면 정액(1200만)", () => {
    const res = runBacktest(rows, { monthlyKRW: 1_000_000, buyDay: 1, targetKRW: 9_999_999_999 });
    expect(res.principalKRW).toBe(12_000_000);
  });
  it("cpiIndexAt: 이하 최신값, 경계 처리", () => {
    expect(cpiIndexAt(cpi, "2020-03")).toBe(100);
    expect(cpiIndexAt(cpi, "2020-08")).toBe(200);
    expect(cpiIndexAt(cpi, "2019-12")).toBe(100); // 첫값 이전 → 첫값
    expect(cpiIndexAt(cpi, "2099-01")).toBe(200); // 마지막 이후 → 마지막
  });
});

describe("양도세 (taxMode)", () => {
  // 3개월 매수(price1, fx1000), 마지막 fx 5000으로 점프.
  // shares: Jan 1000 + Feb 1000 + Mar(usd 1e6/5000=200) 200 = 2200, principal 300만.
  // gross = 2200 × 1 × 5000 = 1,100만. gain 800만. tax=22%×(800만−250만)=121만. 세후 979만.
  const rows = [row("2020-01-01", 1, 1000), row("2020-02-01", 1, 1000), row("2020-03-01", 1, 5000)];
  it("세후 = gross − 22%×(gain−250만)", () => {
    const t = runBacktest(rows, { monthlyKRW: 1_000_000, buyDay: 1, targetKRW: 9_999_999_999, taxMode: true });
    expect(t.valueKRW).toBeCloseTo(9_790_000, 2);
  });
  it("taxMode 없으면 세전 1,100만", () => {
    const g = runBacktest(rows, { monthlyKRW: 1_000_000, buyDay: 1, targetKRW: 9_999_999_999 });
    expect(g.valueKRW).toBeCloseTo(11_000_000, 2);
  });
});

describe("최초 납입금 (initialKRW)", () => {
  // price=1, fx=1000 고정. 목돈 500만 + 매달 100만, 3개월.
  // 첫달: 목돈 500만 + 적립 100만 = 600만 투입(shares 6000), 이후 매달 100만(+1000).
  // principal = 500만 + 3×100만 = 800만. 마지막 평가액 = 8000 shares × 1000 = 800만.
  const rows = [row("2020-01-01", 1, 1000), row("2020-02-01", 1, 1000), row("2020-03-01", 1, 1000)];
  it("목돈이 첫 매수일에 1회 합산 투입된다", () => {
    const res = runBacktest(rows, { monthlyKRW: 1_000_000, initialKRW: 5_000_000, buyDay: 1, targetKRW: 9_999_999_999 });
    expect(res.principalKRW).toBe(8_000_000);
    expect(res.series.map((s) => Math.round(s.valueKRW))).toEqual([6_000_000, 7_000_000, 8_000_000]);
  });
  it("목돈 0이면 적립만(300만)", () => {
    const res = runBacktest(rows, { monthlyKRW: 1_000_000, initialKRW: 0, buyDay: 1, targetKRW: 9_999_999_999 });
    expect(res.principalKRW).toBe(3_000_000);
  });
  it("runToToday도 목돈을 반영해 더 빨리 도달", () => {
    const rs: Row[] = [];
    for (let m = 1; m <= 12; m++) rs.push(row(`2020-${String(m).padStart(2, "0")}-01`, 1, 1000));
    // 목돈 없으면 8월 시작(매수 5회=500만). 목돈 200만이면 더 늦게 시작해도 도달.
    const res = runToToday(rs, { monthlyKRW: 1_000_000, initialKRW: 2_000_000, buyDay: 1, targetKRW: 5_000_000 });
    expect(res.reached).toBe(true);
    expect(res.series[0].date > "2020-08-01").toBe(true);
  });
});

describe("requiredMonthly — 역산(기간→필요 월 적립액)", () => {
  // price=1, fx=1000 고정, 12개월. 월 m원 적립 → 최종 평가액 = 12*m. (선형)
  const rows: Row[] = [];
  for (let m = 1; m <= 12; m++) rows.push(row(`2020-${String(m).padStart(2, "0")}-01`, 1, 1000));

  it("목표/기간으로 필요 월 적립액을 정확히 푼다", () => {
    const { monthlyKRW, result } = requiredMonthly(rows, { monthlyKRW: 0, buyDay: 1, startDate: "2020-01-01", targetKRW: 6_000_000 });
    expect(monthlyKRW).toBeCloseTo(500_000, 2);
    expect(result.valueKRW).toBeCloseTo(6_000_000, 2);
  });

  it("초기금이 있으면 그만큼 월 적립액이 줄어든다", () => {
    // 초기금 100만(첫달 투입)이 최종 100만 기여 → 나머지 500만을 12개월로
    const { monthlyKRW, result } = requiredMonthly(rows, { monthlyKRW: 0, initialKRW: 1_000_000, buyDay: 1, startDate: "2020-01-01", targetKRW: 6_000_000 });
    expect(monthlyKRW).toBeCloseTo((6_000_000 - 1_000_000) / 12, 2);
    expect(result.valueKRW).toBeCloseTo(6_000_000, 2);
  });

  it("초기금만으로 목표 초과면 월 적립액 0", () => {
    const { monthlyKRW } = requiredMonthly(rows, { monthlyKRW: 0, initialKRW: 10_000_000, buyDay: 1, startDate: "2020-01-01", targetKRW: 5_000_000 });
    expect(monthlyKRW).toBe(0);
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
