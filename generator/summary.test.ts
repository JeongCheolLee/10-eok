import { describe, it, expect } from "vitest";
import { buildSummary } from "./summary";
import { MARKETS, type Market } from "../lib/i18n/markets";
import type { PxBundle, FxBundle } from "../lib/backtest/compose";

// 합성 픽스처: 2015-01-01 ~ 2020-12-31 평일, 연 g 성장 가격.
function weekdays(from: string, to: string): string[] {
  const out: string[] = [];
  for (let t = Date.parse(from); t <= Date.parse(to); t += 86_400_000) {
    const d = new Date(t);
    const wd = d.getUTCDay();
    if (wd !== 0 && wd !== 6) out.push(d.toISOString().slice(0, 10));
  }
  return out;
}
const DATES = weekdays("2015-01-01", "2020-12-31");
const yearsSince = (date: string) => (Date.parse(date) - Date.parse(DATES[0])) / (365.25 * 86_400_000);

function px(ticker: string, g: number, currency: "USD" | "KRW" = "USD"): PxBundle {
  return {
    ticker,
    currency,
    start: DATES[0],
    generatedAt: "2021-01-01T00:00:00.000Z",
    rows: DATES.map((d) => {
      const p = Math.round(100 * (1 + g) ** yearsSince(d) * 10_000) / 10_000;
      return [d, p, p] as [string, number, number];
    }),
  };
}
// 환율이 1000 → 1200으로 선형 상승: 환율을 쓰는 종목만 원화 평가액이 불어난다.
const FX: FxBundle = {
  pair: "USDKRW",
  source: "TEST",
  generatedAt: "2021-01-01T00:00:00.000Z",
  rows: DATES.map((d, i) => [d, 1000 + Math.round((200 * i) / (DATES.length - 1))] as [string, number]),
};

// 목표 1억(6년 원금 7,200만원)이라 고성장 종목만 도달.
const market: Market = {
  ...MARKETS.ko,
  goal: { ...MARKETS.ko.goal, default: 1 },
  tickers: ["SPY", "QLD", "AGG", "TQQQ", "069500.KS", "VOO"], // VOO는 px 없음 → 건너뜀
};
const pxBySymbol: Record<string, PxBundle> = {
  SPY: px("SPY", 0),
  QLD: px("QLD", 0.3),
  AGG: px("AGG", -0.3),
  TQQQ: px("TQQQ", 0.6),
  "069500.KS": px("069500.KS", 0, "KRW"),
};
const GEN = "2021-01-02T00:00:00.000Z";

describe("buildSummary", () => {
  const s = buildSummary({ pxBySymbol, fx: FX, market, generatedAt: GEN });

  it("최상위 필드: 시장 기본 시나리오와 dataEnd", () => {
    expect(s.market).toBe("ko");
    expect(s.generatedAt).toBe(GEN);
    expect(s.monthly).toBe(1_000_000);
    expect(s.buyDay).toBe(1);
    expect(s.target).toBe(100_000_000);
    expect(s.dataEnd).toBe(DATES[DATES.length - 1]);
  });

  it("px 없는 종목은 건너뛴다", () => {
    expect(s.rows.map((r) => r.symbol)).not.toContain("VOO");
    expect(s.rows).toHaveLength(5);
  });

  it("정렬: 도달 종목 먼저(개월 오름차순), 미달 종목은 평가액 내림차순", () => {
    const syms = s.rows.map((r) => r.symbol);
    expect(syms.slice(0, 2)).toEqual(["TQQQ", "QLD"]);
    expect(s.rows[0].reached && s.rows[1].reached).toBe(true);
    expect(s.rows[0].months).toBeLessThan(s.rows[1].months);
    const rest = s.rows.slice(2);
    expect(rest.every((r) => !r.reached)).toBe(true);
    for (let i = 1; i < rest.length; i++) expect(rest[i - 1].value).toBeGreaterThanOrEqual(rest[i].value);
    // SPY(가격 0% + 환율 +20%) > 069500.KS(원화, 변동 없음) > AGG(-30%/년)
    expect(rest.map((r) => r.symbol)).toEqual(["SPY", "069500.KS", "AGG"]);
  });

  it("원화 종목은 환율을 쓰지 않는다 (가격 불변 → 평가액 = 원금)", () => {
    const kr = s.rows.find((r) => r.symbol === "069500.KS")!;
    expect(kr.value).toBe(kr.principal);
    expect(kr.cagr).toBeCloseTo(0, 6);
    const spy = s.rows.find((r) => r.symbol === "SPY")!;
    expect(spy.value).toBeGreaterThan(spy.principal * 1.05); // 환율 상승분 반영
  });

  it("행 필드 형태: 정수 금액, 숫자 cagr, 이름·기간", () => {
    for (const r of s.rows) {
      expect(Object.keys(r).sort()).toEqual(
        ["cagr", "dataEnd", "dataStart", "monthsRem", "months", "name", "principal", "reached", "symbol", "value", "years"].sort(),
      );
      expect(Number.isInteger(r.value)).toBe(true);
      expect(Number.isInteger(r.principal)).toBe(true);
      expect(typeof r.cagr).toBe("number");
      expect(r.years * 12 + r.monthsRem).toBe(r.months);
      expect(r.dataStart).toBe(DATES[0]);
      expect(r.dataEnd).toBe(DATES[DATES.length - 1]);
      expect(typeof r.name).toBe("string");
    }
    expect(s.rows.find((r) => r.symbol === "069500.KS")!.name).not.toBe("069500.KS");
  });
});
