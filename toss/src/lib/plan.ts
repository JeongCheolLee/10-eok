import { runToToday, runBacktest, requiredMonthly, timingRange, monthsBetween } from "@/lib/backtest/simulate";
import type { Row, BacktestResult, BacktestInput, BuySchedule } from "@/lib/backtest/types";
import { tickerCurrency } from "@/lib/tickers";

export const TARGET = 1_000_000_000; // 10억 고정(미니앱 1차)
const MAN = 10_000;

export type Freq = "monthly" | "weekly" | "daily";
export type Weekday = 1 | 2 | 3 | 4 | 5;

export type Plan = {
  ticker: string;
  mode: "time" | "amount";
  amount: number; // 1회 적립액(만원): 매달/매주/매일 넣는 돈
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
  ticker: "QLD", mode: "time", amount: 100, years: 10, lump: 0,
  freq: "monthly", buyDay: 1, weekday: 1, tracking: false, startDate: "",
  reinvest: true, tax: false,
};

/** 주기별 프리셋 칩(만원) */
export const AMOUNT_CHIPS: Record<Freq, number[]> = { monthly: [10, 50, 100, 200, 500], weekly: [5, 10, 25, 50, 100], daily: [1, 2, 5, 10, 20] };
export const AMOUNT_MIN: Record<Freq, number> = { monthly: 10, weekly: 1, daily: 1 };
export const AMOUNT_STEP: Record<Freq, number> = { monthly: 10, weekly: 5, daily: 1 };

export function scheduleOf(p: Plan): BuySchedule {
  if (p.freq === "daily") return { kind: "daily" };
  if (p.freq === "weekly") return { kind: "weekly", weekday: p.weekday };
  return { kind: "monthly", day: p.buyDay };
}
export function isTracking(p: Plan): boolean { return p.tracking && /^\d{4}-\d{2}-\d{2}$/.test(p.startDate); }

export type Calc = { result: BacktestResult; reqMonthly: number | null; yearsUsed: number; monthlyWon: number; tracking: boolean };

function startMonthsAgo(endIso: string, months: number): string {
  const [y, m] = endIso.split("-").map(Number);
  const total = y * 12 + (m - 1) - months;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}-01`;
}

function baseOpts(p: Plan): Omit<BacktestInput, "monthly"> {
  return { initial: p.lump * MAN, buyDay: p.buyDay, schedule: scheduleOf(p), target: TARGET, reinvestDividends: p.reinvest, taxMode: p.tax && tickerCurrency(p.ticker) === "USD" };
}

export function maxYearsOf(rows: Row[]): number {
  return Math.max(1, Math.floor(monthsBetween(rows[0].date, rows[rows.length - 1].date) / 12));
}

/** 입력 플랜 → 결과. 트래커: 실제 시작일부터 오늘까지. 기간 모드: 오늘 기준 역산. 금액 모드: 고정 기간에 필요한 1회 적립액. */
export function calcPlan(rows: Row[], p: Plan): Calc {
  const opts = baseOpts(p);
  const yearsUsed = Math.min(p.years, maxYearsOf(rows));
  if (isTracking(p)) {
    const monthlyWon = p.amount * MAN;
    const start = p.startDate < rows[0].date ? rows[0].date : p.startDate;
    return { result: runBacktest(rows, { monthly: monthlyWon, ...opts, startDate: start, target: Number.MAX_SAFE_INTEGER }), reqMonthly: null, yearsUsed, monthlyWon, tracking: true };
  }
  if (p.mode === "time") {
    const monthlyWon = p.amount * MAN;
    return { result: runToToday(rows, { monthly: monthlyWon, ...opts }), reqMonthly: null, yearsUsed, monthlyWon, tracking: false };
  }
  const end = rows[rows.length - 1].date;
  const { monthly, result } = requiredMonthly(rows, { monthly: 0, startDate: startMonthsAgo(end, yearsUsed * 12), ...opts });
  return { result, reqMonthly: monthly, yearsUsed, monthlyWon: monthly, tracking: false };
}

export type Timing = ReturnType<typeof timingRange>;
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
export function clockStats(rows: Row[], p: Plan): ClockStats {
  const c = calcPlan(rows, p);
  const monthlyWon = c.monthlyWon;
  const opts = baseOpts(p);
  const tracking = c.tracking;
  const r = tracking || p.mode === "time" ? c.result : runToToday(rows, { monthly: monthlyWon, ...opts });
  const startDate = r.series[0]?.date ?? rows[0].date;
  const today = rows[rows.length - 1].date;
  const yesterday = rows[rows.length - 2]?.date ?? today;
  const ry = runBacktest(rows, { monthly: monthlyWon, ...opts, startDate, endDate: yesterday, target: Number.MAX_SAFE_INTEGER });
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
