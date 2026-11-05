import type { BacktestResult } from "@/lib/backtest/types";

type Point = BacktestResult["series"][number];
export type UnderwaterPeriod = { start: string; end: string; days: number; recovered: boolean };
const day = (date: string) => Date.parse(`${date}T00:00:00Z`) / 86_400_000;
// Ignore sub-won floating point noise at contribution dates.
const underwater = (p: Point) => p.principal > 0 && p.principal - p.value >= 1;

/** Loss is relative to cumulative contributions, NOT drawdown from a market peak.
 * Reach results analyze only the journey to first reach; later observations are follow-up.
 * Durations are calendar days between observed closing prices, not trading-day counts.
 */
export function analyzeResilience(series: readonly Point[], reachedDate: string | null = null) {
  if (!series.length) throw new Error("Empty analysis series");
  const scope = reachedDate ? series.filter(p => p.date <= reachedDate) : series;
  if (!scope.length) throw new Error("Empty analysis period");
  let worst: Point | null = null;
  let worstRate: Point | null = null;
  let longest: UnderwaterPeriod | null = null;
  let start: string | null = null;
  const close = (end: string, recovered: boolean) => {
    if (start === null) return;
    const period = { start, end, days: day(end) - day(start), recovered };
    if (!longest || period.days > longest.days) longest = period;
    start = null;
  };
  for (const p of scope) {
    if (underwater(p)) {
      if (!worst || p.principal - p.value > worst.principal - worst.value) worst = p;
      if (!worstRate || (p.principal - p.value) / p.principal > (worstRate.principal - worstRate.value) / worstRate.principal) worstRate = p;
      start ??= p.date;
    } else close(p.date, true);
  }
  close(scope[scope.length - 1].date, false);
  const low = worst as Point | null;
  const checkpoints: { label: string; point: Point; added: number; pnl: number }[] = [];
  if (low) {
    const add = (label: string, p: Point | undefined) => {
      if (!p || p.date <= low.date || checkpoints.some(c => c.point.date === p.date)) return;
      checkpoints.push({ label, point: p, added: p.principal - low.principal,
        pnl: p.value - p.principal });
    };
    const last = series[series.length - 1];
    const yearSpan = Number(last.date.slice(0, 4)) - Number(low.date.slice(0, 4));
    const horizons = [1, 3];
    for (let years = 5; years <= yearSpan; years += 5) horizons.push(years);
    for (const years of horizons) {
      const date = new Date(`${low.date}T00:00:00Z`);
      date.setUTCFullYear(date.getUTCFullYear() + years);
      const target = date.toISOString().slice(0, 10);
      add(`${years}년 뒤`, series.find(p => p.date >= target));
    }
    const existing = checkpoints.find(c => c.point.date === last.date);
    if (existing) existing.label += ", 마지막 평가일";
    else add("마지막 평가일", last);
  }
  return { start: scope[0].date, end: scope[scope.length - 1].date, worst: low, worstRate,
    maxLossRate: worstRate ? (worstRate.principal - worstRate.value) / worstRate.principal : 0,
    loss: low ? low.principal - low.value : 0,
    lossRate: low ? (low.principal - low.value) / low.principal : 0,
    longest: longest as UnderwaterPeriod | null, checkpoints };
}
