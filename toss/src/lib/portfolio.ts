// 분산 매수(여러 종목) 계산. 공용 엔진(lib/backtest)은 종목 하나씩 돌리고, 여기서 날짜별로 합산한다.
// ── 계약(2026-10-22): 화면 쪽은 아래 타입·함수 시그니처만 의존한다. 구현 2026-10-22. ──
import type { BacktestResult, BuySchedule, Row } from "@/lib/backtest/types";
import { runBacktest, monthsBetween, lowerBound } from "@/lib/backtest/simulate";
import { tickerCurrency } from "@/lib/tickers";

/** 보유 종목 1개. amount = 1회 적립액(만원). */
export type Holding = { ticker: string; amount: number };

/** 종목 공통 조건. lump(만원)는 holdings 금액 비율로 나눠 투입. */
export type PortfolioOpts = {
  lump: number;
  schedule: BuySchedule;
  buyDay: number;
  reinvest: boolean;
  /** 해외주식 양도세 반영. 종목별이 아니라 USD 종목 차익 합계에 1회(22%·기본공제 250만). */
  tax: boolean;
  target: number;
};

export type HoldingResult = {
  ticker: string;
  /** 이 종목의 1회 적립액(원) — 금액 모드에서는 역산된 값 */
  amountWon: number;
  value: number;
  principal: number;
  cagr: number;
  dataStart: string;
  dataEnd: string;
};

/** 합산 결과. BacktestResult 필드는 합계 기준(series도 합계). */
export type PortfolioResult = BacktestResult & {
  holdings: HoldingResult[];
  /** 실제 계산 시작일(모든 종목 데이터가 있는 가장 이른 날 이후) */
  startDate: string;
  /** 시작일을 늦춘 종목(데이터가 가장 늦게 시작). 없으면 null */
  limitedBy: string | null;
  /** 세금 반영액(원, 0 이상) */
  taxWon: number;
};

/** 고정 시작일부터 endDate(생략 시 데이터 끝)까지. target 도달 여부·도달일 포함. */
export function runPortfolio(rowsBy: Record<string, Row[]>, holdings: Holding[], opts: PortfolioOpts, startDate: string, endDate?: string): PortfolioResult {
  return runWeighted(rowsBy, holdings, weightsOf(holdings), opts, startDate, endDate, opts.target);
}

/** 기간 모드: 오늘(데이터 끝)에 target을 넘기는 가장 늦은 시작월을 찾는다(runToToday와 같은 규칙). */
export function portfolioToToday(rowsBy: Record<string, Row[]>, holdings: Holding[], opts: PortfolioOpts): PortfolioResult {
  const rows = rowsOf(rowsBy, holdings);
  const weights = weightsOf(holdings);
  const { start: commonStart } = commonStartOf(holdings, rows, "0000-01-01");
  const endDate = lastDateOf(rows);

  // 후보 시작월(1일): 공통 데이터 시작월 ~ 마지막월. runToToday와 같다(시작월 1일이 데이터 전이면 공통 시작으로 클램프).
  const [y0, m0] = ymOf(commonStart);
  const [yT, mT] = ymOf(endDate);
  const starts: string[] = [];
  for (let y = y0, m = m0; y < yT || (y === yT && m <= mT); ) {
    starts.push(`${y}-${pad(m)}-01`);
    m++;
    if (m > 12) { m = 1; y++; }
  }

  // 그 시작일로 끝까지 적립했을 때 합계 최종 평가액(세금 on이면 차감 후). 탐색용이라 합산 series는 만들지 않는다.
  const sim = (s: string) => {
    const eff = maxDate(s, commonStart);
    const parts = holdings.map((h, i) => runBacktest(rows[i], inputOf(h, weights[i], opts, eff, undefined)));
    const value = parts.reduce((a, r) => a + r.value, 0);
    return value - (opts.tax ? taxOn(holdings, parts.map((r) => r.value), parts.map((r) => r.principal)) : 0);
  };

  // runToToday와 같은 규칙: 목돈 없으면 시작이 늦을수록 단조 감소 → 이분 탐색, 목돈 있으면 늦은 쪽부터 전수 스캔.
  let ans = -1;
  if (opts.lump > 0) {
    for (let i = starts.length - 1; i >= 0; i--) {
      if (sim(starts[i]) >= opts.target) { ans = i; break; }
    }
  } else {
    let lo = 0, hi = starts.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sim(starts[mid]) >= opts.target) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
  }

  const chosen = ans >= 0 ? starts[ans] : starts[0];
  const r = runWeighted(rowsBy, holdings, weights, opts, chosen, undefined, Number.MAX_SAFE_INTEGER);
  const startBuy = r.series.length ? r.series[0].date : chosen;
  const months = monthsBetween(startBuy, endDate);
  return {
    ...r,
    reached: ans >= 0,
    reachedDate: ans >= 0 ? endDate : null,
    months,
    years: Math.floor(months / 12),
    monthsRem: months % 12,
  };
}

/** 금액 모드: years년 전부터 오늘까지 target에 닿으려면 필요한 금액. holdings 비율을 고정하고 스케일만 찾는다. */
export function portfolioRequired(rowsBy: Record<string, Row[]>, holdings: Holding[], opts: PortfolioOpts, years: number): { scale: number; amountsWon: number[]; result: PortfolioResult } {
  const rows = rowsOf(rowsBy, holdings);
  const weights = weightsOf(holdings);
  const end = lastDateOf(rows);
  const reqStart = startMonthsAgo(end, Math.round(years * 12));
  const { start } = commonStartOf(holdings, rows, reqStart);

  // 종목별 최종값은 스케일 s에 선형: value_i(s) = s·A_i + B_i, principal_i(s) = s·P_i + L_i
  // (A·P = 원래 적립액·목돈 0, B·L = 적립 0·목돈만). 세금 off면 바로 풀고(requiredMonthly와 같은 방식),
  // on이면 이 선형식 위에서 세후 값을 이분 탐색한다(추가 시뮬 없음).
  const unit = holdings.map((h, i) => runBacktest(rows[i], inputOf(h, weights[i], { ...opts, lump: 0 }, start, undefined)));
  const lumpOnly = holdings.map((h, i) =>
    opts.lump > 0 ? runBacktest(rows[i], inputOf({ ...h, amount: 0 }, weights[i], opts, start, undefined)) : null);
  const A = unit.map((r) => r.value), P = unit.map((r) => r.principal);
  const B = lumpOnly.map((r) => r?.value ?? 0), L = lumpOnly.map((r) => r?.principal ?? 0);
  const sumA = A.reduce((a, b) => a + b, 0), sumB = B.reduce((a, b) => a + b, 0);
  const valueAt = (s: number) => {
    const vs = A.map((a, i) => s * a + B[i]);
    const ps = P.map((p, i) => s * p + L[i]);
    const v = vs.reduce((a, b) => a + b, 0);
    return v - (opts.tax ? taxOn(holdings, vs, ps) : 0);
  };

  let scale = sumA > 0 ? Math.max(0, (opts.target - sumB) / sumA) : 0;
  if (opts.tax) {
    if (sumA <= 0 || valueAt(0) >= opts.target) scale = 0;
    else {
      // 세후 값은 s에 단조 증가(평가액·원금이 함께 늘고 세율 < 1). 세전 해에서 상한을 키워 가며 이분 탐색.
      let lo = 0, hi = Math.max(scale, 1e-9);
      while (valueAt(hi) < opts.target && hi < 1e12) hi *= 2;
      for (let k = 0; k < 200 && hi - lo > hi * 1e-12; k++) {
        const mid = (lo + hi) / 2;
        if (valueAt(mid) >= opts.target) hi = mid; else lo = mid;
      }
      scale = hi;
    }
  }

  const scaled = holdings.map((h) => ({ ...h, amount: h.amount * scale }));
  const result = runWeighted(rowsBy, scaled, weights, opts, reqStart, undefined, opts.target);
  return { scale, amountsWon: holdings.map((h) => h.amount * MAN * scale), result };
}

// ---- private ----
const MAN = 10_000;
const TAX_RATE = 0.22;
const TAX_ALLOWANCE = 2_500_000;

/** 목돈 배분 비율 = 적립액 비율(합이 0이면 균등). 스케일을 바꿔도 비율이 유지되도록 원래 holdings에서 계산해 넘긴다. */
function weightsOf(holdings: Holding[]): number[] {
  const sum = holdings.reduce((a, h) => a + Math.max(0, h.amount), 0);
  return holdings.map((h) => (sum > 0 ? Math.max(0, h.amount) / sum : 1 / holdings.length));
}

function rowsOf(rowsBy: Record<string, Row[]>, holdings: Holding[]): Row[][] {
  if (holdings.length === 0) throw new Error("holdings가 비어있음");
  return holdings.map((h) => {
    const r = rowsBy[h.ticker];
    if (!r || r.length === 0) throw new Error(`rows가 비어있음: ${h.ticker}`);
    return r;
  });
}

/** 공통 시작일 = max(요청 시작, 종목별 데이터 시작). 데이터 시작이 가장 늦은 종목이 요청보다 늦으면 limitedBy. */
function commonStartOf(holdings: Holding[], rows: Row[][], requested: string): { start: string; limitedBy: string | null } {
  let latest = 0;
  rows.forEach((r, i) => { if (r[0].date > rows[latest][0].date) latest = i; });
  const dataStart = rows[latest][0].date;
  return dataStart > requested ? { start: dataStart, limitedBy: holdings[latest].ticker } : { start: requested, limitedBy: null };
}

function lastDateOf(rows: Row[][]): string {
  return rows.reduce((d, r) => maxDate(d, r[r.length - 1].date), "");
}

function inputOf(h: Holding, weight: number, opts: PortfolioOpts, startDate: string, endDate: string | undefined) {
  return {
    monthly: h.amount * MAN,
    initial: opts.lump * MAN * weight,
    schedule: opts.schedule,
    buyDay: opts.buyDay,
    reinvestDividends: opts.reinvest,
    taxMode: false, // 세금은 종목별이 아니라 합산 후 USD 종목 차익 합계에 1회
    startDate,
    endDate,
    target: Number.MAX_SAFE_INTEGER,
  };
}

/** 해외주식 양도세: USD 종목 (평가액−원금) 합계에 22%, 기본공제 250만(1인 합산). KRW 종목 차익은 제외. */
function taxOn(holdings: Holding[], values: number[], principals: number[]): number {
  let gain = 0;
  holdings.forEach((h, i) => { if (tickerCurrency(h.ticker) !== "KRW") gain += values[i] - principals[i]; });
  return TAX_RATE * Math.max(0, gain - TAX_ALLOWANCE);
}

function runWeighted(
  rowsBy: Record<string, Row[]>, holdings: Holding[], weights: number[], opts: PortfolioOpts,
  startDate: string, endDate: string | undefined, target: number,
): PortfolioResult {
  const rows = rowsOf(rowsBy, holdings);
  const { start, limitedBy } = commonStartOf(holdings, rows, startDate);
  const parts = holdings.map((h, i) => runBacktest(rows[i], inputOf(h, weights[i], opts, start, endDate)));

  // 합계 series: 날짜 합집합(미국·한국 거래일이 다름), 종목별 직전 값 forward-fill(그 종목 첫 날 전은 0).
  const dates = [...new Set(parts.flatMap((r) => r.series.map((p) => p.date)))].sort();
  const ptr = parts.map(() => -1);
  const series: BacktestResult["series"] = [];
  let reachIdx = -1;
  for (const d of dates) {
    let value = 0, principal = 0;
    parts.forEach((r, i) => {
      while (ptr[i] + 1 < r.series.length && r.series[ptr[i] + 1].date <= d) ptr[i]++;
      if (ptr[i] >= 0) { value += r.series[ptr[i]].value; principal += r.series[ptr[i]].principal; }
    });
    series.push({ date: d, value, principal });
    if (reachIdx < 0 && value >= target) reachIdx = series.length - 1;
  }

  // 종목별 값은 창 끝(endDate 또는 데이터 끝) 기준, 세전.
  const holdingResults: HoldingResult[] = holdings.map((h, i) => ({
    ticker: h.ticker,
    amountWon: h.amount * MAN,
    value: parts[i].value,
    principal: parts[i].principal,
    cagr: parts[i].cagr,
    dataStart: rows[i][0].date,
    dataEnd: rows[i][rows[i].length - 1].date,
  }));

  if (series.length === 0) {
    return {
      reached: false, reachedDate: null, months: 0, years: 0, monthsRem: 0, series: [], principal: 0, value: 0, cagr: 0,
      holdings: holdingResults, startDate: start, limitedBy, taxWon: 0,
    };
  }

  // 세금 판정 방식: 단일 엔진 runBacktest와 같게, 도달은 매일 "세전" 합계로 판정하고
  // 세금은 평가 시점(도달일, 미달이면 마지막일) 값에만 1회 차감한다.
  // 원금도 단일 엔진처럼 창 끝까지의 누적 원금(도달 후 납입 포함)을 쓴다 — 종목 1개일 때 결과가 같도록.
  const evalIdx = reachIdx >= 0 ? reachIdx : series.length - 1;
  const evalDate = series[evalIdx].date;
  const principal = series[series.length - 1].principal;
  const valuesAtEval = parts.map((r) => valueOnOrBefore(r.series, evalDate));
  const taxWon = opts.tax ? taxOn(holdings, valuesAtEval, parts.map((r) => r.principal)) : 0;
  const value = series[evalIdx].value - taxWon;

  const months = monthsBetween(series[0].date, evalDate);
  const cagr = basketCagr(rows, parts, weights, opts.reinvest, evalDate, months);

  return {
    reached: reachIdx >= 0,
    reachedDate: reachIdx >= 0 ? evalDate : null,
    months,
    years: Math.floor(months / 12),
    monthsRem: months % 12,
    series,
    principal,
    value,
    cagr,
    holdings: holdingResults,
    startDate: start,
    limitedBy,
    taxWon,
  };
}

/**
 * 합계 연복리: 단일 엔진과 같은 정의(첫 매수일~평가일 자산 (가격×환율) 성장률의 연환산)를
 * 적립 비율로 묶은 바스켓에 적용. 바스켓 성장 = Σ w_i·(a1_i/a0_i) (첫 매수일에 비율대로 사서 보유).
 * 종목 1개면 runBacktest.cagr와 정확히 같다.
 */
function basketCagr(rows: Row[][], parts: BacktestResult[], weights: number[], reinvest: boolean, evalDate: string, months: number): number {
  const px = (r: Row) => (reinvest === false ? r.raw ?? r.price : r.price);
  let growth = 0, wsum = 0;
  parts.forEach((p, i) => {
    if (p.series.length === 0) return;
    const i0 = lowerBound(rows[i], p.series[0].date);
    const i1 = lastIdxOnOrBefore(rows[i], evalDate);
    if (i0 < 0 || i1 < i0) return;
    const a0 = px(rows[i][i0]) * rows[i][i0].fx;
    const a1 = px(rows[i][i1]) * rows[i][i1].fx;
    if (!(a0 > 0)) return;
    growth += weights[i] * (a1 / a0);
    wsum += weights[i];
  });
  const yrs = months / 12;
  return yrs > 0 && wsum > 0 ? Math.pow(growth / wsum, 1 / yrs) - 1 : 0;
}

/** series에서 date 이하 마지막 값(forward-fill). 없으면 0. */
function valueOnOrBefore(series: BacktestResult["series"], date: string): number {
  let lo = 0, hi = series.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (series[mid].date <= date) lo = mid + 1; else hi = mid;
  }
  return lo > 0 ? series[lo - 1].value : 0;
}

function lastIdxOnOrBefore(rows: Row[], target: string): number {
  let lo = 0, hi = rows.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (rows[mid].date <= target) lo = mid + 1; else hi = mid;
  }
  return lo - 1;
}

/** plan.ts startMonthsAgo와 동일: 끝월에서 months개월 전 1일. */
function startMonthsAgo(endIso: string, months: number): string {
  const [y, m] = endIso.split("-").map(Number);
  const total = y * 12 + (m - 1) - months;
  return `${Math.floor(total / 12)}-${pad((total % 12) + 1)}-01`;
}

function ymOf(iso: string): [number, number] {
  const [y, m] = iso.split("-").map(Number);
  return [y, m];
}
function pad(n: number): string { return n < 10 ? "0" + n : String(n); }
function maxDate(a: string, b: string): string { return a >= b ? a : b; }
