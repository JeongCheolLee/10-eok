import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { TICKERS, tickerCurrency } from "@/lib/tickers";
import { actualHistoryRows } from "@/lib/tickerHistory";
import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import { cleanHoldings, calcPlan, DEFAULT_PLAN, singlePlan, shareQueryOf } from "./plan";
import { TOSS_DISPLAY_TICKERS, taxInfo } from "./groups";
const stocks = TICKERS.filter(t => t.kind === "stock");
const read = (name: string) => JSON.parse(readFileSync(`public/data/${name}.json`,"utf8"));
const fx: FxBundle = read("fx/krw");
describe("개별주 실제 데이터와 기존 계산 흐름", () => {
  it("한국 8개와 미국 8개를 중복 없이 선택하며 웹 ETF 목록에는 노출하지 않는다", () => {
    expect(stocks.filter(t=>t.currency === "KRW")).toHaveLength(8);
    expect(stocks.filter(t=>t.currency !== "KRW")).toHaveLength(8);
    expect(stocks.every(t=>t.webHidden && !t.splice)).toBe(true);
    expect(new Set(TOSS_DISPLAY_TICKERS.map(t=>t.symbol)).size).toBe(41);
    expect(taxInfo(["005930.KS"]).desc).not.toContain("ETF");
  });
  it.each(stocks)("$symbol의 데이터, 계산, 공유 조건을 검증한다", (info) => {
    const px: PxBundle = read(`px/${info.symbol.toLowerCase()}`);
    expect(px.currency).toBe(tickerCurrency(info.symbol));
    expect(px.rows.length).toBeGreaterThan(200);
    for (let i=0;i<px.rows.length;i++) {
      expect(px.rows[i][1]).toBeGreaterThan(0);
      expect(px.rows[i][2]).toBeGreaterThan(0);
      if(i) expect(px.rows[i][0] > px.rows[i-1][0]).toBe(true);
    }
    if (info.historyStart) expect(px.rows[0][0] >= info.historyStart).toBe(true);
    const actual = actualHistoryRows(info.symbol,composeRows(px,px.currency === "KRW" ? null : fx));
    const plan = singlePlan(DEFAULT_PLAN,info.symbol,100);
    expect(cleanHoldings(plan.holdings)).toEqual(plan.holdings);
    const calc = calcPlan({[info.symbol]:actual},plan);
    expect(Number.isFinite(calc.result.value)).toBe(true);
    expect(calc.result.principal).toBeGreaterThan(0);
    expect(calc.result.series.at(-1)?.date).toBe(actual.at(-1)?.date);
    expect(new URLSearchParams(shareQueryOf(plan)).get("t")).toBe(info.symbol);
  });
  it("최근 액면분할 전후의 가격에 분할 배수만큼 단절이 없다", () => {
    for (const [symbol, before, after] of [["NVDA","2024-06-07","2024-06-10"],["TSLA","2022-08-24","2022-08-25"],["005930.KS","2018-04-27","2018-05-04"],["AAPL","2020-08-28","2020-08-31"]]) {
      const px: PxBundle = read(`px/${symbol.toLowerCase()}`);
      const left = px.rows.find(r=>r[0]===before)!;
      const right = px.rows.find(r=>r[0]===after)!;
      expect(left, symbol).toBeDefined(); expect(right,symbol).toBeDefined();
      expect(right[1]/left[1],symbol).toBeGreaterThan(.7);
      expect(right[1]/left[1],symbol).toBeLessThan(1.3);
    }
  });
  it("오래된 캐시에 합병 전 값이 있어도 현재 회사의 계산에 쓰지 않는다", () => {
    expect(actualHistoryRows("035720.KS",[{date:"2000-01-04"},{date:"2014-10-14"}])).toEqual([{date:"2014-10-14"}]);
    expect(actualHistoryRows("105560.KS",[{date:"2001-01-04"},{date:"2008-10-10"}])).toEqual([{date:"2008-10-10"}]);
  });
});
