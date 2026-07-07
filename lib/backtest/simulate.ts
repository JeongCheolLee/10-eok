// 적립식 백테스트 엔진 (순수 함수). 독립 오라클이 없으므로 단위/golden 테스트가 유일한 안전망.
import type { Row, BacktestInput, BacktestResult } from "./types";

const DEFAULT_TARGET = 1_000_000_000; // 10억

export function runBacktest(rows: Row[], input: BacktestInput): BacktestResult {
  if (rows.length === 0) throw new Error("rows가 비어있음");
  const target = input.target ?? DEFAULT_TARGET;
  const buyDay = clampBuyDay(input.buyDay);
  const monthEnd = buyDay >= 29; // 29일 이상 = 그 달 '말일'(마지막 거래일)에 매수
  const startDate = input.startDate ?? rows[0].date;
  const dataEnd = rows[rows.length - 1].date;
  const endDate = input.endDate && input.endDate < dataEnd ? input.endDate : dataEnd;

  // 매수 실행일 → 그날 투입 KRW (같은 거래일에 겹치면 합산)
  const buyKRWByIndex = new Map<number, number>();
  let [y, m] = ymOf(maxDate(startDate, rows[0].date));
  const baseIdx = input.cpi ? cpiIndexAt(input.cpi, `${y}-${pad(m)}`) : 1; // 물가연동 base = 시작월
  while (true) {
    if (calDate(y, m, 1) > endDate) break; // 이 달 시작이 이미 창(끝)을 벗어나면 종료
    // 이 달의 매수 실행 거래일: 말일 모드=그 달 마지막 거래일, 아니면 지정일 이상의 첫 거래일(다음 거래일 롤)
    const idx = monthEnd
      ? lastIdxOnOrBefore(rows, calDate(y, m, daysInMonth(y, m)))
      : lowerBound(rows, calDate(y, m, buyDay));
    if (idx !== -1 && rows[idx].date >= startDate && rows[idx].date <= endDate) {
      const amt = input.cpi ? input.monthly * (cpiIndexAt(input.cpi, `${y}-${pad(m)}`) / baseIdx) : input.monthly;
      buyKRWByIndex.set(idx, (buyKRWByIndex.get(idx) ?? 0) + amt);
    }
    m++;
    if (m > 12) { m = 1; y++; }
  }

  const series: { date: string; value: number; principal: number }[] = [];
  let shares = 0;
  let principal = 0;
  let reachedDate: string | null = null;
  let reachIdx = -1;
  let valueAtReach = 0;

  if (buyKRWByIndex.size === 0) {
    return emptyResult();
  }
  const firstBuyIdx = Math.min(...buyKRWByIndex.keys());

  // 최초 납입금(목돈): 첫 매수일에 1회 합산 투입
  if (input.initial && input.initial > 0) {
    buyKRWByIndex.set(firstBuyIdx, (buyKRWByIndex.get(firstBuyIdx) ?? 0) + input.initial);
  }

  // 배당 재투자 OFF면 미수정 종가(가격수익)로 평가/매수
  const px = (r: Row) => (input.reinvestDividends === false ? r.raw ?? r.price : r.price);
  const endLimit = lastIdxOnOrBefore(rows, endDate); // 평가 종료 인덱스 (window 끝)
  for (let i = firstBuyIdx; i <= endLimit; i++) {
    const r = rows[i];
    const invest = buyKRWByIndex.get(i);
    if (invest) {
      const usd = invest / r.fx;
      shares += usd / px(r);
      principal += invest;
    }
    const value = shares * px(r) * r.fx;
    series.push({ date: r.date, value, principal: principal });
    if (reachedDate === null && value >= target) {
      reachedDate = r.date;
      reachIdx = i;
      valueAtReach = value;
    }
  }

  const firstDate = rows[firstBuyIdx].date;
  const endIdx = reachIdx >= 0 ? reachIdx : endLimit;
  const months = monthsBetween(firstDate, rows[endIdx].date);
  let value = reachedDate ? valueAtReach : series[series.length - 1].value;
  // 양도세(해외주식 22%, 연 250만 공제 1회 단순화). taxMode일 때만, 통화 분기는 호출부에서.
  if (input.taxMode) value -= 0.22 * Math.max(0, value - principal - 2_500_000);

  // 자산 연복리 수익률: 첫 매수일 ~ 도달(또는 마지막) 구간의 (price*fx) 성장률.
  const a0 = px(rows[firstBuyIdx]) * rows[firstBuyIdx].fx;
  const a1 = px(rows[endIdx]) * rows[endIdx].fx;
  const yrs = months / 12;
  const cagr = yrs > 0 && a0 > 0 ? Math.pow(a1 / a0, 1 / yrs) - 1 : 0;

  return {
    reached: reachedDate !== null,
    reachedDate,
    months,
    years: Math.floor(months / 12),
    monthsRem: months % 12,
    series,
    principal: principal,
    value,
    cagr,
  };

  function emptyResult(): BacktestResult {
    return {
      reached: false, reachedDate: null, months: 0, years: 0, monthsRem: 0,
      series: [], principal: 0, value: 0, cagr: 0,
    };
  }
}

/**
 * 오늘(최신 데이터일) 기준 역산: "지금 10억이 되려면 언제부터 모았어야 했나".
 * 끝(to)을 마지막 거래일로 고정하고, target에 도달하는 가장 늦은 시작월(=최단 기간)을 찾는다.
 * months = 그 시작일부터 오늘까지의 기간. 미달이면 데이터 시작부터 모아도 부족한 경우.
 */
export function runToToday(rows: Row[], input: BacktestInput): BacktestResult {
  if (rows.length === 0) throw new Error("rows가 비어있음");
  const target = input.target ?? DEFAULT_TARGET;
  const buyDay = clampBuyDay(input.buyDay);
  const endDate = rows[rows.length - 1].date;

  // 후보 시작월(1일) 목록: 데이터 시작월 ~ 마지막월
  const [y0, m0] = ymOf(rows[0].date);
  const [yT, mT] = ymOf(endDate);
  const starts: string[] = [];
  for (let y = y0, m = m0; y < yT || (y === yT && m <= mT); ) {
    starts.push(calDate(y, m, 1));
    m++;
    if (m > 12) { m = 1; y++; }
  }

  // 그 시작일로 끝까지 적립했을 때 마지막날 평가액 (시작이 늦을수록 단조 감소)
  // ...input 으로 cpi/reinvestDividends/taxMode 등 모든 옵션을 내부 시뮬에 전달
  const sim = (startDate: string) =>
    runBacktest(rows, { ...input, buyDay, startDate, target: Number.MAX_SAFE_INTEGER });

  // target에 도달하는 "가장 늦은 시작"(=최단 기간)을 찾는다.
  // 목돈(initial)이 없으면 시작이 늦을수록 최종 평가액이 단조 감소하므로 이분 탐색으로 충분.
  // 목돈이 있으면 폭락 바닥에 늦게 시작할수록 목돈이 싸게 사들여 최종액이 되레 커질 수 있어
  // 단조성이 깨진다 → 이분 탐색은 도달 가능한 늦은 시작을 놓칠 수 있다(false negative).
  // 이 경우 후보 시작월(보통 수백 개, sim은 저렴)을 늦은 쪽부터 전수 스캔해 정확히 고른다.
  let ans = -1;
  if (input.initial && input.initial > 0) {
    for (let i = starts.length - 1; i >= 0; i--) {
      if (sim(starts[i]).value >= target) { ans = i; break; }
    }
  } else {
    let lo = 0, hi = starts.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sim(starts[mid]).value >= target) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
  }

  const chosen = ans >= 0 ? starts[ans] : starts[0];
  const r = sim(chosen);
  const startBuy = r.series.length ? r.series[0].date : chosen;
  const months = monthsBetween(startBuy, endDate);
  return {
    reached: ans >= 0,
    reachedDate: ans >= 0 ? endDate : null,
    months,
    years: Math.floor(months / 12),
    monthsRem: months % 12,
    series: r.series,
    principal: r.principal,
    value: r.value,
    cagr: r.cagr,
  };
}

/**
 * 역산: 고정 기간(startDate~마지막 거래일) 동안 target에 도달하려면 매달 얼마를 적립해야 하나.
 * 평가액 = 월적립액×A + 초기금×B (둘 다 path 상수)로 적립액·초기금에 선형이므로,
 * 단위 적립/단위 초기금 시뮬 2회로 정확히 푼다. (taxMode는 비선형이라 무시; 현재 기본 off)
 * 반환 monthly는 0 이상으로 클램프, result는 그 적립액으로 실제 시뮬한 결과(차트·원금용).
 */
export function requiredMonthly(rows: Row[], input: BacktestInput): { monthly: number; result: BacktestResult } {
  if (rows.length === 0) throw new Error("rows가 비어있음");
  const target = input.target ?? DEFAULT_TARGET;
  const UNIT = 1_000_000; // 1원 단위는 부동소수 오차 → 100만원 단위로 풀고 나눔
  const base = { ...input, target: Number.MAX_SAFE_INTEGER };

  // 월 1원당 최종 평가액 (초기금 0)
  const vPerMonthlyUnit = runBacktest(rows, { ...base, monthly: UNIT, initial: 0 }).value / UNIT;
  // 실제 초기금이 만드는 최종 평가액
  const vInitial = input.initial ? runBacktest(rows, { ...base, monthly: 0 }).value : 0;

  let monthly = vPerMonthlyUnit > 0 ? (target - vInitial) / vPerMonthlyUnit : 0;
  monthly = Math.max(0, monthly);
  const result = runBacktest(rows, { ...input, monthly, target: target });
  return { monthly, result };
}

/**
 * 타이밍 리스크: 같은 플랜(적립액·초기금·옵션)을 같은 기간(durationMonths)으로,
 * 시작월만 데이터 전 구간에 슬라이딩해 window 끝 평가액 분포를 구한다.
 * "언제 시작했느냐"에 따른 운의 폭(최악~최선, 중앙값)을 보여주는 용도. 표본 부족 시 null.
 */
export function timingRange(
  rows: Row[],
  input: BacktestInput,
  durationMonths: number,
): { min: number; median: number; max: number; minStart: string; maxStart: string; samples: number } | null {
  if (rows.length === 0 || durationMonths < 1) return null;
  const [y0, m0] = ymOf(rows[0].date);
  const dataEnd = rows[rows.length - 1].date;
  const vals: { start: string; v: number }[] = [];
  for (let y = y0, m = m0; ; ) {
    const start = calDate(y, m, 1);
    if (addMonths(start, durationMonths) > dataEnd) break;
    const v = runBacktest(rows, { ...input, startDate: start, endDate: addMonths(start, durationMonths), target: Number.MAX_SAFE_INTEGER }).value;
    vals.push({ start, v });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  if (vals.length < 2) return null;
  const sorted = [...vals].sort((a, b) => a.v - b.v);
  const lo = sorted[0], hi = sorted[sorted.length - 1];
  return {
    min: lo.v, max: hi.v,
    median: sorted[Math.floor(sorted.length / 2)].v,
    minStart: lo.start, maxStart: hi.start, samples: vals.length,
  };
}

/** ym("YYYY-MM") 이하의 마지막 CPI 값 (오름차순 가정, 없으면 첫 값). 데이터 끝 이후는 마지막값 유지. */
export function cpiIndexAt(cpi: { ym: string; idx: number }[], ym: string): number {
  let lo = 0, hi = cpi.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cpi[mid].ym <= ym) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return cpi[ans >= 0 ? ans : 0]?.idx ?? 1;
}

// ---- helpers ----
export function clampBuyDay(d: number): number {
  if (!Number.isFinite(d)) return 1;
  return Math.min(31, Math.max(1, Math.round(d))); // 29~31은 '말일' 모드로 해석 (runBacktest)
}

/** (y, m)월의 마지막 날짜 (윤년 반영). 2월=28/29. */
function daysInMonth(y: number, m: number): number {
  if (m === 2) return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28;
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
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

/** "YYYY-MM-DD"에 n개월 더한 달의 1일 (YYYY-MM-01). */
function addMonths(iso: string, n: number): string {
  let [y, m] = iso.split("-").map(Number);
  m += n;
  while (m > 12) { m -= 12; y += 1; }
  while (m < 1) { m += 12; y -= 1; }
  return `${y}-${pad(m)}-01`;
}

/** rows[i].date <= target 인 마지막 i (이분 탐색). 없으면 -1. */
function lastIdxOnOrBefore(rows: Row[], target: string): number {
  let lo = 0, hi = rows.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (rows[mid].date <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo - 1;
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
