import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { TICKERS, tickerCurrency } from "@/lib/tickers";
import { REAL_START, DATA_START, estimatedSpans, estLastMonth, needsFx, realStartOf } from "./dataInfo";

type Px = { start: string; rows: [string, number, number][] };
const px = (t: string): Px => JSON.parse(readFileSync(fileURLToPath(new URL(`../../../public/data/px/${t.toLowerCase()}.json`, import.meta.url)), "utf8"));
/** 실제 종가는 USD 소수 셋째 자리·KRW 정수까지. 접합(스케일)한 추정치는 그보다 자릿수가 길다. */
const isRealQuote = (v: number, krw: boolean) => (krw ? Number.isInteger(v) : Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-6);

describe("상장 전 추정 구간", () => {
  it("레지스트리 splice 종목은 모두 실제 가격 첫날이 있다", () => {
    for (const t of TICKERS.filter((x) => x.splice)) expect(REAL_START[t.symbol], t.symbol).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it.each(Object.entries(REAL_START))("%s: 그날부터 실제 종가, 전날은 추정치", (t, d) => {
    const rows = px(t).rows;
    const i = rows.findIndex((r) => r[0] === d);
    expect(i).toBeGreaterThan(0);
    const krw = tickerCurrency(t) === "KRW";
    expect(isRealQuote(rows[i][2], krw)).toBe(true);
    expect(isRealQuote(rows[i + 1][2], krw)).toBe(true);
    expect(isRealQuote(rows[i - 1][2], krw)).toBe(false);
  });
  it("계산 시작일이 실제 가격 첫날보다 이르면 추정 구간이 있다", () => {
    expect(estimatedSpans(["QQQM"], "2015-01-02")).toEqual([{ ticker: "QQQM", until: "2020-10-13" }]);
    expect(estimatedSpans(["QQQM"], "2020-10-13")).toEqual([]);
    expect(estimatedSpans(["QQQ", "JEPI"], "2019-01-02")).toEqual([{ ticker: "JEPI", until: "2020-05-21" }]);
    expect(realStartOf("QQQ")).toBeNull();
  });
  it("추정 구간의 마지막 달", () => {
    expect(estLastMonth("2020-10-13")).toBe("2020-10-01");
    expect(estLastMonth("2021-01-01")).toBe("2020-12-01");
  });
  it("환율 안내는 달러 종목이 있을 때만", () => {
    expect(needsFx(["360750.KS"])).toBe(false);
    expect(needsFx(["360750.KS", "QQQ"])).toBe(true);
  });
});

describe("이력이 짧은 종목", () => {
  it("shortHistory 종목의 데이터 첫날 = px meta.start", () => {
    for (const t of TICKERS.filter((x) => x.shortHistory)) expect(DATA_START[t.symbol], t.symbol).toBe(px(t.symbol).start);
  });
});
