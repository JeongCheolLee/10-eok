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
      start ??= p.date;
    } else close(p.date, true);
  }
  close(scope[scope.length - 1].date, false);
  const low = worst as Point | null;
  const checkpoints: { label: string; point: Point; added: number; pnlChange: number }[] = [];
  if (low) {
    const add = (label: string, p: Point | undefined) => {
      if (!p || p.date <= low.date || checkpoints.some(c => c.point.date === p.date)) return;
      checkpoints.push({ label, point: p, added: p.principal - low.principal,
        pnlChange: (p.value - p.principal) - (low.value - low.principal) });
    };
    for (const years of [1, 3]) {
      const date = new Date(`${low.date}T00:00:00Z`);
      date.setUTCFullYear(date.getUTCFullYear() + years);
      const target = date.toISOString().slice(0, 10);
      add(`${years}년 뒤`, series.find(p => p.date >= target));
    }
    add("마지막 자료", series[series.length - 1]);
  }
  return { start: scope[0].date, end: scope[scope.length - 1].date, worst: low,
    loss: low ? low.principal - low.value : 0,
    lossRate: low ? (low.principal - low.value) / low.principal : 0,
    longest: longest as UnderwaterPeriod | null, checkpoints };
}
