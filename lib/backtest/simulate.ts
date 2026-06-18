// 적립식 백테스트 엔진 (순수 함수). 독립 오라클이 없으므로 단위/golden 테스트가 유일한 안전망.
import type { Row, BacktestInput, BacktestResult } from "./types";

const DEFAULT_TARGET = 1_000_000_000; // 10억

export function runBacktest(rows: Row[], input: BacktestInput): BacktestResult {
  if (rows.length === 0) throw new Error("rows가 비어있음");
  const target = input.targetKRW ?? DEFAULT_TARGET;
  const buyDay = clampBuyDay(input.buyDay);
  const startDate = input.startDate ?? rows[0].date;
  const endDate = rows[rows.length - 1].date;

  // 매수 실행일 → 그날 투입 KRW (같은 거래일에 겹치면 합산)
  const buyKRWByIndex = new Map<number, number>();
  let [y, m] = ymOf(maxDate(startDate, rows[0].date));
  while (true) {
    const cal = calDate(y, m, buyDay);
    if (cal > endDate) break;
    if (cal >= startDate) {
      const idx = lowerBound(rows, cal); // cal 이상인 첫 거래일 (다음 거래일 롤)
      if (idx !== -1) buyKRWByIndex.set(idx, (buyKRWByIndex.get(idx) ?? 0) + input.monthlyKRW);
    }
    m++;
    if (m > 12) { m = 1; y++; }
  }

  const series: { date: string; valueKRW: number }[] = [];
  let shares = 0;
  let principal = 0;
  let reachedDate: string | null = null;
  let reachIdx = -1;
  let valueAtReach = 0;

  if (buyKRWByIndex.size === 0) {
    return emptyResult();
  }
  const firstBuyIdx = Math.min(...buyKRWByIndex.keys());

  for (let i = firstBuyIdx; i < rows.length; i++) {
    const r = rows[i];
    const invest = buyKRWByIndex.get(i);
    if (invest) {
      const usd = invest / r.fx;
      shares += usd / r.price;
      principal += invest;
    }
    const valueKRW = shares * r.price * r.fx;
    series.push({ date: r.date, valueKRW });
    if (reachedDate === null && valueKRW >= target) {
      reachedDate = r.date;
      reachIdx = i;
      valueAtReach = valueKRW;
    }
  }

  const firstDate = rows[firstBuyIdx].date;
  const endIdx = reachIdx >= 0 ? reachIdx : rows.length - 1;
  const months = monthsBetween(firstDate, rows[endIdx].date);
  const valueKRW = reachedDate ? valueAtReach : series[series.length - 1].valueKRW;

  // 자산 연복리 수익률: 첫 매수일 ~ 도달(또는 마지막) 구간의 (price*fx) 성장률.
  const a0 = rows[firstBuyIdx].price * rows[firstBuyIdx].fx;
  const a1 = rows[endIdx].price * rows[endIdx].fx;
  const yrs = months / 12;
  const cagr = yrs > 0 && a0 > 0 ? Math.pow(a1 / a0, 1 / yrs) - 1 : 0;

  return {
    reached: reachedDate !== null,
    reachedDate,
    months,
    years: Math.floor(months / 12),
    monthsRem: months % 12,
    series,
    principalKRW: principal,
    valueKRW,
    cagr,
  };

  function emptyResult(): BacktestResult {
    return {
      reached: false, reachedDate: null, months: 0, years: 0, monthsRem: 0,
      series: [], principalKRW: 0, valueKRW: 0, cagr: 0,
    };
  }
}

// ---- helpers ----
export function clampBuyDay(d: number): number {
  if (!Number.isFinite(d)) return 1;
  return Math.min(28, Math.max(1, Math.round(d)));
}

function ymOf(iso: string): [number, number] {
  const [y, m] = iso.split("-").map(Number);
  return [y, m];
}

function pad(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

function calDate(y: number, m: number, d: number): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function maxDate(a: string, b: string): string {
  return a >= b ? a : b;
}

/** rows[i].date >= target 인 첫 i (이분 탐색). 없으면 -1. */
export function lowerBound(rows: Row[], target: string): number {
  let lo = 0, hi = rows.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (rows[mid].date < target) lo = mid + 1;
    else hi = mid;
  }
  return lo < rows.length ? lo : -1;
}

/** 달력 기준 경과 개월 (일자 보정 포함). */
export function monthsBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  let months = (by - ay) * 12 + (bm - am);
  if (bd < ad) months -= 1;
  return Math.max(0, months);
}
