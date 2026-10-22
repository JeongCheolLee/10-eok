import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import { runBacktest, runToToday, requiredMonthly } from "@/lib/backtest/simulate";
import type { Row, BacktestInput } from "@/lib/backtest/types";
import { tickerCurrency } from "@/lib/tickers";
import { runPortfolio, portfolioToToday, portfolioRequired, type PortfolioOpts } from "./portfolio";

// 골든 데이터: 실제 번들(public/data/px, fx)로 합성한 Row[]
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

const MAN = 10_000;
const TARGET = 1_000_000_000;
const OPTS: PortfolioOpts = { lump: 0, schedule: { kind: "monthly", day: 1 }, buyDay: 1, reinvest: true, tax: false, target: TARGET };
const single = (t: string, amount: number, o: PortfolioOpts): BacktestInput => ({
  monthly: amount * MAN, initial: o.lump * MAN, schedule: o.schedule, buyDay: o.buyDay,
  reinvestDividends: o.reinvest, taxMode: o.tax && tickerCurrency(t) === "USD", target: o.target,
});
const rel = (a: number, b: number) => Math.abs(a - b) / Math.max(1, Math.abs(b));

describe("종목 1개 = 기존 엔진", () => {
  for (const tax of [false, true]) {
    it(`runPortfolio == runBacktest (tax=${tax})`, () => {
      const o = { ...OPTS, tax };
      const p = runPortfolio(rowsBy, [{ ticker: "QQQ", amount: 300 }], o, "2010-01-01");
      const s = runBacktest(rowsOf("QQQ"), { ...single("QQQ", 300, o), startDate: "2010-01-01" });
      expect(p.value).toBe(s.value);
      expect(p.principal).toBe(s.principal);
      expect(p.reachedDate).toBe(s.reachedDate);
      expect(p.months).toBe(s.months);
      expect(p.cagr).toBe(s.cagr);
      expect(p.series).toEqual(s.series);
      expect(p.limitedBy).toBeNull();
    });
  }

  for (const lump of [0, 3000]) {
    for (const schedule of [{ kind: "monthly", day: 1 }, { kind: "weekly", weekday: 3 }] as const) {
      it(`portfolioToToday == runToToday (lump=${lump}, ${schedule.kind})`, () => {
        const o = { ...OPTS, lump, schedule };
        const p = portfolioToToday(rowsBy, [{ ticker: "QLD", amount: 100 }], o);
        const s = runToToday(rowsOf("QLD"), single("QLD", 100, o));
        expect(p.value).toBe(s.value);
        expect(p.principal).toBe(s.principal);
        expect(p.reached).toBe(s.reached);
        expect(p.reachedDate).toBe(s.reachedDate);
        expect(p.months).toBe(s.months);
        expect(p.series[0].date).toBe(s.series[0].date);
      });
    }
  }

  it("portfolioToToday 세금 on == runToToday taxMode", () => {
    const o = { ...OPTS, tax: true, lump: 1000 };
    const p = portfolioToToday(rowsBy, [{ ticker: "QQQ", amount: 200 }], o);
    const s = runToToday(rowsOf("QQQ"), single("QQQ", 200, o));
    expect(p.value).toBe(s.value);
    expect(p.months).toBe(s.months);
  });

  for (const lump of [0, 5000]) {
    it(`portfolioRequired == requiredMonthly (lump=${lump})`, () => {
      const o = { ...OPTS, lump };
      const end = rowsOf("SPY")[rowsOf("SPY").length - 1].date;
      const [y, m] = end.split("-").map(Number);
      const total = y * 12 + (m - 1) - 15 * 12;
      const start = `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}-01`;
      const p = portfolioRequired(rowsBy, [{ ticker: "SPY", amount: 100 }], o, 15);
      const s = requiredMonthly(rowsOf("SPY"), { ...single("SPY", 0, o), startDate: start });
      expect(rel(p.amountsWon[0], s.monthly)).toBeLessThan(1e-9);
      expect(rel(p.result.value, s.result.value)).toBeLessThan(1e-9);
      expect(rel(p.result.principal, s.result.principal)).toBeLessThan(1e-9);
      expect(p.result.reachedDate).toBe(s.result.reachedDate);
      expect(p.result.months).toBe(s.result.months);
    });
  }
});

describe("같은 종목 50/50 분할 = 합친 1개 (세금 off)", () => {
  const split = [{ ticker: "VOO", amount: 50 }, { ticker: "VOO", amount: 50 }];
  const one = [{ ticker: "VOO", amount: 100 }];
  it("runPortfolio", () => {
    const o = { ...OPTS, lump: 2000 };
    const a = runPortfolio(rowsBy, split, o, "2012-03-01");
    const b = runPortfolio(rowsBy, one, o, "2012-03-01");
    expect(rel(a.value, b.value)).toBeLessThan(1e-12);
    expect(rel(a.principal, b.principal)).toBeLessThan(1e-12);
    expect(a.reachedDate).toBe(b.reachedDate);
    expect(a.months).toBe(b.months);
    expect(a.cagr).toBeCloseTo(b.cagr, 12);
    expect(a.series.length).toBe(b.series.length);
  });
  it("portfolioToToday / portfolioRequired", () => {
    const a = portfolioToToday(rowsBy, split, OPTS), b = portfolioToToday(rowsBy, one, OPTS);
    expect(a.series[0].date).toBe(b.series[0].date);
    expect(rel(a.value, b.value)).toBeLessThan(1e-12);
    const ra = portfolioRequired(rowsBy, split, OPTS, 10), rb = portfolioRequired(rowsBy, one, OPTS, 10);
    expect(rel(ra.amountsWon[0] + ra.amountsWon[1], rb.amountsWon[0])).toBeLessThan(1e-9);
  });
});

describe("세금: USD 차익 합계에 1회", () => {
  it("USD 2종목: taxWon = 0.22×max(0, 합산 차익−250만) ≥ 종목별 공제 합", () => {
    const o = { ...OPTS, tax: true, target: Number.MAX_SAFE_INTEGER };
    const p = runPortfolio(rowsBy, [{ ticker: "QQQ", amount: 100 }, { ticker: "SCHD", amount: 100 }], o, "2015-01-01");
    const gain = p.holdings.reduce((a, h) => a + h.value - h.principal, 0);
    expect(p.taxWon).toBeCloseTo(0.22 * Math.max(0, gain - 2_500_000), 4);
    const perHolding = p.holdings.reduce((a, h) => a + 0.22 * Math.max(0, h.value - h.principal - 2_500_000), 0);
    expect(p.taxWon).toBeGreaterThanOrEqual(perHolding - 1e-6);
    expect(p.taxWon).toBeGreaterThan(0);
    const pre = p.series[p.series.length - 1].value;
    expect(p.value).toBeCloseTo(pre - p.taxWon, 4);
  });
  it("KRW 종목 차익은 제외", () => {
    const o = { ...OPTS, tax: true, target: Number.MAX_SAFE_INTEGER };
    const p = runPortfolio(rowsBy, [{ ticker: "QQQ", amount: 100 }, { ticker: "069500.KS", amount: 100 }], o, "2015-01-01");
    const usd = p.holdings[0];
    expect(p.taxWon).toBeCloseTo(0.22 * Math.max(0, usd.value - usd.principal - 2_500_000), 4);
    const krw = runPortfolio(rowsBy, [{ ticker: "069500.KS", amount: 100 }], o, "2015-01-01");
    expect(krw.taxWon).toBe(0);
  });
  it("portfolioRequired 세금 on: 세후 합계 = target, 세금 off보다 금액이 크다", () => {
    const h = [{ ticker: "QQQ", amount: 60 }, { ticker: "SPY", amount: 40 }];
    const on = portfolioRequired(rowsBy, h, { ...OPTS, tax: true, lump: 1000 }, 12);
    const off = portfolioRequired(rowsBy, h, { ...OPTS, lump: 1000 }, 12);
    // result는 target으로 돌려 도달일 값이 나오므로, 끝까지 평가한 세후 최종값으로 확인
    const scaled = h.map((x) => ({ ...x, amount: x.amount * on.scale }));
    const fin = runPortfolio(rowsBy, scaled, { ...OPTS, tax: true, lump: 1000, target: Number.MAX_SAFE_INTEGER }, on.result.startDate);
    expect(rel(fin.value, TARGET)).toBeLessThan(1e-6);
    expect(fin.taxWon).toBeGreaterThan(0);
    expect(on.scale).toBeGreaterThan(off.scale);
    expect(on.amountsWon[0] / on.amountsWon[1]).toBeCloseTo(1.5, 10);
  });
});

describe("limitedBy·혼합 시장", () => {
  it("QQQ+JEPQ: JEPQ가 시작을 제한", () => {
    const p = runPortfolio(rowsBy, [{ ticker: "QQQ", amount: 100 }, { ticker: "JEPQ", amount: 100 }], OPTS, "2010-01-01");
    expect(p.limitedBy).toBe("JEPQ");
    expect(p.startDate).toBe(rowsOf("JEPQ")[0].date);
    const t = portfolioToToday(rowsBy, [{ ticker: "QQQ", amount: 100 }, { ticker: "JEPQ", amount: 100 }], OPTS);
    expect(t.series[0].date >= rowsOf("JEPQ")[0].date).toBe(true);
    const late = runPortfolio(rowsBy, [{ ticker: "QQQ", amount: 100 }, { ticker: "JEPQ", amount: 100 }], OPTS, "2024-01-01");
    expect(late.limitedBy).toBeNull();
  });

  it("QQQ + 069500.KS: 날짜 정렬·중복 없음, forward-fill로 끊기지 않음", () => {
    const p = runPortfolio(rowsBy, [{ ticker: "QQQ", amount: 100 }, { ticker: "069500.KS", amount: 100 }], { ...OPTS, target: Number.MAX_SAFE_INTEGER }, "2012-01-01");
    const us = new Set(rowsOf("QQQ").map((r) => r.date)), kr = new Set(rowsOf("069500.KS").map((r) => r.date));
    let onlyUs = 0, onlyKr = 0;
    for (let i = 1; i < p.series.length; i++) {
      expect(p.series[i].date > p.series[i - 1].date).toBe(true);
      expect(p.series[i].principal).toBeGreaterThanOrEqual(p.series[i - 1].principal);
      // 한쪽 시장만 열린 날에도 다른 종목 값이 0으로 빠지지 않는다(급락 없음)
      expect(p.series[i].value).toBeGreaterThan(p.series[i - 1].value * 0.85);
      const d = p.series[i].date;
      if (us.has(d) && !kr.has(d)) onlyUs++;
      if (kr.has(d) && !us.has(d)) onlyKr++;
    }
    expect(onlyUs).toBeGreaterThan(0);
    expect(onlyKr).toBeGreaterThan(0);
    const last = p.series[p.series.length - 1];
    expect(rel(last.value, p.holdings[0].value + p.holdings[1].value)).toBeLessThan(1e-12);
    expect(rel(last.principal, p.holdings[0].principal + p.holdings[1].principal)).toBeLessThan(1e-12);
  });
});

describe("성능", () => {
  it("portfolioToToday 5종목 (목돈 있음 = 전수 스캔)", () => {
    const h = ["QQQ", "SPY", "SCHD", "GLD", "069500.KS"].map((ticker) => ({ ticker, amount: 40 }));
    h.forEach((x) => rowsOf(x.ticker));
    for (const lump of [0, 5000]) {
      const t0 = performance.now();
      const r = portfolioToToday(rowsBy, h, { ...OPTS, lump });
      const ms = performance.now() - t0;
      console.log(`portfolioToToday 5종목 lump=${lump}: ${ms.toFixed(1)}ms, reached=${r.reached}, months=${r.months}`);
      expect(ms).toBeLessThan(5000);
    }
    // 최악: 목돈 있음 + 도달 불가 → 후보 시작월 전부 스캔
    const t0 = performance.now();
    const r = portfolioToToday(rowsBy, h, { ...OPTS, lump: 5000, target: 1e13 });
    const ms = performance.now() - t0;
    console.log(`portfolioToToday 5종목 lump=5000 미달(전수): ${ms.toFixed(1)}ms`);
    expect(r.reached).toBe(false);
    expect(r.limitedBy).toBe("SCHD");
    expect(ms).toBeLessThan(10000);
  });
});
