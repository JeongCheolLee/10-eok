import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import { runBacktest, runToToday, runFirstReach } from "@/lib/backtest/simulate";
import type { Row, BacktestInput } from "@/lib/backtest/types";
import { tickerCurrency } from "@/lib/tickers";
import { portfolioFirstReach, type PortfolioOpts } from "./portfolio";

const DATA = join(process.cwd(), "public", "data");
const fx = JSON.parse(readFileSync(join(DATA, "fx", "krw.json"), "utf8")) as FxBundle;
const cache: Record<string, Row[]> = {};
function rowsOf(t: string): Row[] {
  if (!cache[t]) {
    const px = JSON.parse(readFileSync(join(DATA, "px", `${t.toLowerCase()}.json`), "utf8")) as PxBundle;
    cache[t] = composeRows(px, tickerCurrency(t) === "KRW" ? null : fx);
  }
  return cache[t];
}
const rowsBy = new Proxy({} as Record<string, Row[]>, { get: (_, k: string) => rowsOf(k) });
const MAN = 10_000, TARGET = 1_000_000_000;
const input = (amount: number, lump = 0): BacktestInput => ({ monthly: amount * MAN, initial: lump * MAN, buyDay: 1, schedule: { kind: "monthly", day: 1 }, reinvestDividends: true, target: TARGET });
const OPTS: PortfolioOpts = { lump: 0, schedule: { kind: "monthly", day: 1 }, buyDay: 1, reinvest: true, tax: false, target: TARGET };

describe("runFirstReach — 한 번이라도 10억을 찍은 가장 늦은 시작", () => {
  for (const t of ["QQQ", "TQQQ", "SOXL", "SCHD", "360750.KS"]) {
    it(`${t}: 불변식`, () => {
      const rows = rowsOf(t);
      const fr = runFirstReach(rows, input(100));
      const tt = runToToday(rows, input(100));
      const last = rows[rows.length - 1].date;
      expect(fr.series[fr.series.length - 1].date).toBe(last); // 그래프는 오늘까지
      if (fr.reached) {
        expect(fr.reachValue).toBeGreaterThanOrEqual(TARGET);
        expect(fr.reachedDate! <= last).toBe(true);
        // 도달일 이전에는 한 번도 10억 미만이 아니었던 게 아니라, 도달일이 '처음' 넘은 날
        expect(fr.series.filter((p) => p.date < fr.reachedDate!).every((p) => p.value < TARGET)).toBe(true);
        // 시작은 오늘-기준보다 같거나 늦고(고점 포함이라 더 짧음), 기간도 같거나 짧다
        expect(fr.series[0].date >= tt.series[0].date).toBe(true);
        expect(fr.months).toBeLessThanOrEqual(tt.months);
        // 한 달 늦게 시작하면 한 번도 10억을 못 찍는다(가장 늦은 시작)
        const later = new Date(fr.series[0].date); later.setUTCMonth(later.getUTCMonth() + 1, 1);
        const r2 = runBacktest(rows, { ...input(100), startDate: later.toISOString().slice(0, 10) });
        expect(r2.reached).toBe(false);
      }
      // value는 오늘 평가액
      expect(fr.value).toBeCloseTo(fr.series[fr.series.length - 1].value, 0);
    });
  }
  it("목돈이 있으면 전수 스캔으로도 도달 시작을 찾는다", () => {
    const fr = runFirstReach(rowsOf("QQQ"), input(50, 5000));
    expect(fr.reached).toBe(true);
    expect(fr.reachValue).toBeGreaterThanOrEqual(TARGET);
  });
  it("분산 매수 1종목 = 단일 엔진", () => {
    const a = runFirstReach(rowsOf("QQQ"), input(100));
    const b = portfolioFirstReach(rowsBy, [{ ticker: "QQQ", amount: 100 }], OPTS);
    expect(b.reachedDate).toBe(a.reachedDate);
    expect(b.months).toBe(a.months);
    expect(Math.abs(b.value - a.value) / a.value).toBeLessThan(1e-9);
    expect(Math.abs(b.reachValue - a.reachValue) / a.reachValue).toBeLessThan(1e-9);
  });
  it("분산 매수 2종목: 합계 기준 처음 도달", () => {
    const b = portfolioFirstReach(rowsBy, [{ ticker: "QQQ", amount: 50 }, { ticker: "SCHD", amount: 30 }], OPTS);
    if (b.reached) {
      expect(b.reachValue).toBeGreaterThanOrEqual(TARGET);
      expect(b.series.filter((p) => p.date < b.reachedDate!).every((p) => p.value < TARGET)).toBe(true);
    }
    expect(b.series.length).toBeGreaterThan(100);
  });
});
