import { runToToday, runBacktest, requiredMonthly, timingRange, monthsBetween } from "@/lib/backtest/simulate";
import { US_TAX_RULE, KR_FOREIGN_TAX_RULE, type Row, type BacktestResult, type BacktestInput, type BuySchedule, type TaxRule } from "@/lib/backtest/types";
import { tickerTax, TICKERS } from "@/lib/tickers";
import { runPortfolio, portfolioToToday, portfolioRequired, type Holding, type PortfolioOpts, type PortfolioResult } from "./portfolio";

export type { Holding } from "./portfolio";

export const TARGET = 1_000_000_000; // 10억 고정(미니앱 1차)
const MAN = 10_000;

export type Freq = "monthly" | "weekly" | "daily";
export type Weekday = 1 | 2 | 3 | 4 | 5;

export const MAX_HOLDINGS = 5;

export type Plan = {
  /** 분산 매수 종목(1~5). 화면·저장·공유의 기준값 */
  holdings: Holding[];
  /** = holdings[0].ticker. 단일 종목 코드 호환용 파생값 — 직접 바꾸지 말고 withHoldings로 */
  ticker: string;
  mode: "time" | "amount";
  /** = holdings[0].amount(만원). 단일 종목 코드 호환용 파생값. 합계는 totalAmount() */
  amount: number;
  years: number; // 금액 모드 목표 기간
  lump: number; // 만원
  freq: Freq;
  buyDay: number; // monthly: 1~28, 29 = 말일
  weekday: Weekday; // weekly: 1=월 … 5=금
  /** 실제 적립 트래커: 켜면 startDate부터 실제로 모은 것으로 계산 */
  tracking: boolean;
  startDate: string; // "YYYY-MM-DD" | ""
  reinvest: boolean;
  tax: boolean;
};

export const DEFAULT_PLAN: Plan = {
  holdings: [{ ticker: "QLD", amount: 100 }],
  ticker: "QLD", mode: "time", amount: 100, years: 10, lump: 0,
  freq: "monthly", buyDay: 1, weekday: 1, tracking: false, startDate: "",
  reinvest: true, tax: false,
};

/** 주기별 프리셋 칩(만원) */
export const AMOUNT_CHIPS: Record<Freq, number[]> = { monthly: [10, 50, 100, 200, 500], weekly: [5, 10, 25, 50, 100], daily: [1, 2, 5, 10, 20] };
export const AMOUNT_MIN: Record<Freq, number> = { monthly: 10, weekly: 1, daily: 1 };
export const AMOUNT_STEP: Record<Freq, number> = { monthly: 10, weekly: 5, daily: 1 };

/** holdings를 바꾸고 파생값(ticker·amount)을 맞춘다. 빈 배열이면 그대로 둔다. */
export function withHoldings(p: Plan, holdings: Holding[]): Plan {
  if (holdings.length === 0) return p;
  return { ...p, holdings, ticker: holdings[0].ticker, amount: holdings[0].amount };
}
/** 1회 적립액 합계(만원) */
export function totalAmount(p: Plan): number { return p.holdings.reduce((s, h) => s + h.amount, 0); }
export function isMulti(p: Plan): boolean { return p.holdings.length > 1; }
/** 같은 조건, 종목 하나·금액 amount(만원)인 플랜 */
export function singlePlan(p: Plan, ticker: string, amount: number): Plan {
  return withHoldings(p, [{ ticker, amount }]);
}

const VALID = new Set(TICKERS.map((t) => t.symbol));
/** 유효 티커만, 중복 제거, 금액 1 이상, 최대 5개 */
export function cleanHoldings(hs: { ticker?: unknown; amount?: unknown }[]): Holding[] {
  const out: Holding[] = [];
  for (const h of hs) {
    const t = String(h.ticker ?? "").toUpperCase();
    const a = Math.round(Number(h.amount));
    if (!VALID.has(t) || out.some((x) => x.ticker === t) || !(a >= 1)) continue;
    out.push({ ticker: t, amount: a });
    if (out.length >= MAX_HOLDINGS) break;
  }
  return out;
}
/** 저장본·옛 형식(holdings 없음, v1)을 현재 Plan으로. holdings가 없거나 비면 ticker·amount로 만든다. */
export function normalizePlan(raw: Partial<Plan>): Plan {
  const base = { ...DEFAULT_PLAN, ...raw };
  let hs = Array.isArray(raw.holdings) ? cleanHoldings(raw.holdings) : [];
  if (hs.length === 0) hs = cleanHoldings([{ ticker: base.ticker, amount: base.amount }]);
  if (hs.length === 0) hs = DEFAULT_PLAN.holdings;
  return withHoldings(base, hs);
}

export function scheduleOf(p: Plan): BuySchedule {
  if (p.freq === "daily") return { kind: "daily" };
  if (p.freq === "weekly") return { kind: "weekly", weekday: p.weekday };
  return { kind: "monthly", day: p.buyDay };
}
export function isTracking(p: Plan): boolean { return p.tracking && /^\d{4}-\d{2}-\d{2}$/.test(p.startDate); }

/** monthlyWon = 1회 적립액 합계(원). portfolio는 종목 2개 이상일 때만(합계 결과·종목별 내역). */
export type Calc = { result: BacktestResult; reqMonthly: number | null; yearsUsed: number; monthlyWon: number; tracking: boolean; portfolio: PortfolioResult | null };

/** 종목 → Row[]. 단일 종목이면 키 하나. */
export type RowsBy = Record<string, Row[]>;

function startMonthsAgo(endIso: string, months: number): string {
  const [y, m] = endIso.split("-").map(Number);
  const total = y * 12 + (m - 1) - months;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}-01`;
}

function portOpts(p: Plan, target = TARGET): PortfolioOpts {
  return { lump: p.lump, schedule: scheduleOf(p), buyDay: p.buyDay, reinvest: p.reinvest, tax: p.tax, target };
}

/** 모든 종목에 데이터가 있는 마지막 날(종목별 마지막 날 중 가장 이른 날) */
export function commonEnd(rowsBy: RowsBy, p: Plan): string {
  return p.holdings.map((h) => rowsOf(rowsBy, h.ticker)).map((r) => r[r.length - 1].date).sort()[0];
}
function rowsOf(rowsBy: RowsBy, ticker: string): Row[] {
  const r = rowsBy[ticker];
  if (!r || r.length === 0) throw new Error(`rows missing: ${ticker}`);
  return r;
}

function baseOpts(p: Plan): Omit<BacktestInput, "monthly"> {
  return { initial: p.lump * MAN, buyDay: p.buyDay, schedule: scheduleOf(p), target: TARGET, reinvestDividends: p.reinvest, taxRule: taxRuleOf(p) };
}

/** 세금 켜짐일 때 종목 규칙: 미국 상장 22%(250만 공제) · 국내 상장 해외형 15.4%(공제 없음) · 국내형 없음. */
function taxRuleOf(p: Plan): TaxRule | undefined {
  if (!p.tax) return undefined;
  const kind = tickerTax(p.ticker);
  return kind === "us" ? US_TAX_RULE : kind === "kr-foreign" ? KR_FOREIGN_TAX_RULE : undefined;
}

export function maxYearsOf(rows: Row[]): number {
  return Math.max(1, Math.floor(monthsBetween(rows[0].date, rows[rows.length - 1].date) / 12));
}

/** 입력 플랜 → 결과. 트래커: 실제 시작일부터 오늘까지. 기간 모드: 오늘 기준 역산. 금액 모드: 고정 기간에 필요한 1회 적립액.
 *  종목 2개 이상이면 portfolio.ts로 합산(단일 경로는 그대로). */
export function calcPlan(rowsBy: RowsBy, p: Plan): Calc {
  if (isMulti(p)) return calcPortfolio(rowsBy, p);
  const rows = rowsOf(rowsBy, p.ticker);
  const opts = baseOpts(p);
  const yearsUsed = Math.min(p.years, maxYearsOf(rows));
  if (isTracking(p)) {
    const monthlyWon = p.amount * MAN;
    const start = p.startDate < rows[0].date ? rows[0].date : p.startDate;
    return { result: runBacktest(rows, { monthly: monthlyWon, ...opts, startDate: start, target: Number.MAX_SAFE_INTEGER }), reqMonthly: null, yearsUsed, monthlyWon, tracking: true, portfolio: null };
  }
  if (p.mode === "time") {
    const monthlyWon = p.amount * MAN;
    return { result: runToToday(rows, { monthly: monthlyWon, ...opts }), reqMonthly: null, yearsUsed, monthlyWon, tracking: false, portfolio: null };
  }
  const end = rows[rows.length - 1].date;
  const { monthly, result } = requiredMonthly(rows, { monthly: 0, startDate: startMonthsAgo(end, yearsUsed * 12), ...opts });
  return { result, reqMonthly: monthly, yearsUsed, monthlyWon: monthly, tracking: false, portfolio: null };
}

function calcPortfolio(rowsBy: RowsBy, p: Plan): Calc {
  const hs = p.holdings;
  const yearsUsed = Math.min(p.years, ...hs.map((h) => maxYearsOf(rowsOf(rowsBy, h.ticker))));
  const monthlyWon = totalAmount(p) * MAN;
  if (isTracking(p)) {
    const r = runPortfolio(rowsBy, hs, portOpts(p, Number.MAX_SAFE_INTEGER), p.startDate);
    return { result: r, reqMonthly: null, yearsUsed, monthlyWon, tracking: true, portfolio: r };
  }
  if (p.mode === "time") {
    const r = portfolioToToday(rowsBy, hs, portOpts(p));
    return { result: r, reqMonthly: null, yearsUsed, monthlyWon, tracking: false, portfolio: r };
  }
  // 화면에서는 종목 1개일 때만 금액 모드를 열지만, 딥링크·저장본 대비로 계약대로 계산한다.
  const { amountsWon, result } = portfolioRequired(rowsBy, hs, portOpts(p), yearsUsed);
  const req = amountsWon.reduce((s, v) => s + v, 0);
  return { result, reqMonthly: req, yearsUsed, monthlyWon: req, tracking: false, portfolio: result };
}

export type Timing = ReturnType<typeof timingRange>;
/** 단일 종목 전용(분산 매수는 시작 시점 분석을 아직 지원하지 않는다). */
export function calcTiming(rows: Row[], p: Plan, monthlyWon: number, durationMonths: number): Timing {
  return timingRange(rows, { monthly: monthlyWon, ...baseOpts(p) }, durationMonths);
}

export type ClockStats = {
  today: string; yesterday: string; startDate: string;
  months: number; years: number; monthsRem: number;
  principal: number; value: number; cagr: number; reached: boolean;
  valueYesterday: number; delta: number; deltaPct: number;
  /** 목표 초과분을 연평균으로 환산한 '앞당겨진 일수' 추정(오늘·어제). 미달·역성장·트래커 모드면 null */
  daysAheadToday: number | null; daysAheadYesterday: number | null;
  progress: number; // 0~1
  monthlyWon: number;
  tracking: boolean;
};

function daysAhead(value: number, cagr: number): number | null {
  if (!(value > 0) || !(cagr > 0)) return null;
  return (Math.log(value / TARGET) / Math.log(1 + cagr)) * 365;
}

/** 내 10억 시계: 같은 시작일·같은 규칙으로 오늘까지와 어제까지 돌린 차이 = 하루 변화(어제 이후 납입분 포함). */
export function clockStats(rowsBy: RowsBy, p: Plan): ClockStats {
  const c = calcPlan(rowsBy, p);
  const monthlyWon = c.monthlyWon;
  const tracking = c.tracking;
  let r: BacktestResult, ry: BacktestResult, startDate: string, today: string, yesterday: string;
  if (isMulti(p)) {
    // 금액 모드였다면 역산된 종목별 금액으로 기간 모드를 다시 돌린다
    const hs: Holding[] = tracking || p.mode === "time" ? p.holdings : (c.portfolio?.holdings ?? []).map((h) => ({ ticker: h.ticker, amount: h.amountWon / MAN }));
    const pr = tracking || p.mode === "time" ? c.portfolio! : portfolioToToday(rowsBy, hs, portOpts(p));
    r = pr;
    startDate = pr.startDate || (pr.series[0]?.date ?? "");
    today = commonEnd(rowsBy, p);
    const ref = rowsOf(rowsBy, hs[0]?.ticker ?? p.ticker);
    const prev = ref.filter((x) => x.date < today);
    yesterday = prev[prev.length - 1]?.date ?? today;
    ry = runPortfolio(rowsBy, hs, portOpts(p, Number.MAX_SAFE_INTEGER), startDate, yesterday);
  } else {
    const rows = rowsOf(rowsBy, p.ticker);
    const opts = baseOpts(p);
    r = tracking || p.mode === "time" ? c.result : runToToday(rows, { monthly: monthlyWon, ...opts });
    startDate = r.series[0]?.date ?? rows[0].date;
    today = rows[rows.length - 1].date;
    yesterday = rows[rows.length - 2]?.date ?? today;
    ry = runBacktest(rows, { monthly: monthlyWon, ...opts, startDate, endDate: yesterday, target: Number.MAX_SAFE_INTEGER });
  }
  const delta = r.value - ry.value;
  return {
    today, yesterday, startDate,
    months: r.months, years: r.years, monthsRem: r.monthsRem,
    principal: r.principal, value: r.value, cagr: r.cagr, reached: tracking ? r.value >= TARGET : r.reached,
    valueYesterday: ry.value, delta, deltaPct: ry.value > 0 ? delta / ry.value : 0,
    daysAheadToday: tracking ? null : daysAhead(r.value, r.cagr), daysAheadYesterday: tracking ? null : daysAhead(ry.value, ry.cagr),
    progress: Math.min(1, r.value / TARGET),
    monthlyWon,
    tracking,
  };
}
