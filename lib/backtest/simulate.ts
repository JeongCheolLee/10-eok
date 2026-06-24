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
  const baseIdx = input.cpi ? cpiIndexAt(input.cpi, `${y}-${pad(m)}`) : 1; // 물가연동 base = 시작월
  while (true) {
    const cal = calDate(y, m, buyDay);
    if (cal > endDate) break;
    if (cal >= startDate) {
      const idx = lowerBound(rows, cal); // cal 이상인 첫 거래일 (다음 거래일 롤)
      if (idx !== -1) {
        const amt = input.cpi ? input.monthlyKRW * (cpiIndexAt(input.cpi, `${y}-${pad(m)}`) / baseIdx) : input.monthlyKRW;
        buyKRWByIndex.set(idx, (buyKRWByIndex.get(idx) ?? 0) + amt);
      }
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

  // 시작 목돈(거치): 첫 매수일에 일시 투입. 같은 거래일의 매달 적립액과 합산.
  if (input.initialKRW && input.initialKRW > 0) {
    buyKRWByIndex.set(firstBuyIdx, (buyKRWByIndex.get(firstBuyIdx) ?? 0) + input.initialKRW);
  }

  // 배당 재투자 OFF면 미수정 종가(가격수익)로 평가/매수
  const px = (r: Row) => (input.reinvestDividends === false ? r.raw ?? r.price : r.price);
  for (let i = firstBuyIdx; i < rows.length; i++) {
    const r = rows[i];
    const invest = buyKRWByIndex.get(i);
    if (invest) {
      const usd = invest / r.fx;
      shares += usd / px(r);
      principal += invest;
    }
    const valueKRW = shares * px(r) * r.fx;
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
  let valueKRW = reachedDate ? valueAtReach : series[series.length - 1].valueKRW;
  // 양도세(해외주식 22%, 연 250만 공제 1회 단순화). taxMode일 때만, 통화 분기는 호출부에서.
  if (input.taxMode) valueKRW -= 0.22 * Math.max(0, valueKRW - principal - 2_500_000);

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

/**
 * 오늘(최신 데이터일) 기준 역산: "지금 10억이 되려면 언제부터 모았어야 했나".
 * 끝(to)을 마지막 거래일로 고정하고, target에 도달하는 가장 늦은 시작월(=최단 기간)을 찾는다.
 * months = 그 시작일부터 오늘까지의 기간. 미달이면 데이터 시작부터 모아도 부족한 경우.
 */
export function runToToday(rows: Row[], input: BacktestInput): BacktestResult {
  if (rows.length === 0) throw new Error("rows가 비어있음");
  const target = input.targetKRW ?? DEFAULT_TARGET;
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
    runBacktest(rows, { ...input, buyDay, startDate, targetKRW: Number.MAX_SAFE_INTEGER });

  // target 도달하는 가장 늦은 시작(=최단 기간)을 이분 탐색
  let lo = 0, hi = starts.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (sim(starts[mid]).valueKRW >= target) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
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
    principalKRW: r.principalKRW,
    valueKRW: r.valueKRW,
    cagr: r.cagr,
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
