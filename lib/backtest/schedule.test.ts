// 매수 주기(daily/weekly/monthly) 골든 테스트. 가격·환율 고정으로 매수 횟수·원금이 결정되게 한다.
import { describe, it, expect } from "vitest";
import { runBacktest, addDays, nextWeekday } from "./simulate";
import type { Row } from "./types";

/** 2024-01-01(월)~2024-02-29 평일 거래일, 1/15(월)·2/19(월) 휴장. 가격 1, 환율 1. */
function rows(): Row[] {
  const out: Row[] = [];
  const holidays = new Set(["2024-01-15", "2024-02-19"]);
  for (let d = "2024-01-01"; d <= "2024-02-29"; d = addDays(d, 1)) {
    const wd = new Date(d + "T00:00:00Z").getUTCDay();
    if (wd === 0 || wd === 6 || holidays.has(d)) continue;
    out.push({ date: d, price: 1, fx: 1, raw: 1 });
  }
  return out;
}

describe("helpers", () => {
  it("addDays·nextWeekday", () => {
    expect(addDays("2024-01-31", 1)).toBe("2024-02-01");
    expect(nextWeekday("2024-01-01", 1)).toBe("2024-01-01"); // 월요일 당일
    expect(nextWeekday("2024-01-02", 1)).toBe("2024-01-08");
    expect(nextWeekday("2024-01-03", 5)).toBe("2024-01-05");
  });
});

describe("runBacktest — 매수 주기", () => {
  it("daily: 거래일마다 1회, 원금 = 거래일 수 × 금액", () => {
    const r = rows();
    const res = runBacktest(r, { monthly: 10_000, buyDay: 1, schedule: { kind: "daily" }, target: Number.MAX_SAFE_INTEGER });
    expect(res.principal).toBe(r.length * 10_000);
    expect(res.series.length).toBe(r.length);
  });

  it("weekly(월요일): 9주 → 9회, 휴장 월요일은 화요일로 롤", () => {
    const r = rows();
    const res = runBacktest(r, { monthly: 100_000, buyDay: 1, schedule: { kind: "weekly", weekday: 1 }, target: Number.MAX_SAFE_INTEGER });
    // 1/1, 1/8, 1/15→1/16, 1/22, 1/29, 2/5, 2/12, 2/19→2/20, 2/26 = 9회
    expect(res.principal).toBe(9 * 100_000);
    const buys = res.series.filter((p, i, a) => i === 0 || p.principal !== a[i - 1].principal).map((p) => p.date);
    expect(buys).toContain("2024-01-16");
    expect(buys).toContain("2024-02-20");
    expect(buys).not.toContain("2024-01-15");
  });

  it("weekly: 시작일이 수요일이면 첫 매수는 그 주 금요일(weekday 5)", () => {
    const r = rows();
    const res = runBacktest(r, { monthly: 1, buyDay: 1, schedule: { kind: "weekly", weekday: 5 }, startDate: "2024-01-03", target: Number.MAX_SAFE_INTEGER });
    expect(res.series[0].date).toBe("2024-01-05");
  });

  it("monthly 기본값은 schedule 생략과 동일 (웹 회귀 없음)", () => {
    const r = rows();
    const a = runBacktest(r, { monthly: 50_000, buyDay: 1, target: Number.MAX_SAFE_INTEGER });
    const b = runBacktest(r, { monthly: 50_000, buyDay: 1, schedule: { kind: "monthly", day: 1 }, target: Number.MAX_SAFE_INTEGER });
    expect(a).toEqual(b);
    expect(a.principal).toBe(2 * 50_000); // 1/1, 2/1
  });

  it("endDate 창 안에서만 매수한다 (weekly)", () => {
    const r = rows();
    const res = runBacktest(r, { monthly: 1, buyDay: 1, schedule: { kind: "weekly", weekday: 1 }, endDate: "2024-01-20", target: Number.MAX_SAFE_INTEGER });
    expect(res.principal).toBe(3); // 1/1, 1/8, 1/16
  });
});
