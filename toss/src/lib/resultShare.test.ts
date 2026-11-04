import { describe, it, expect } from "vitest";
import { decodeResultCard, encodeResultCard, resultCardCopy } from "@/lib/share/resultCard";
import { calcPlan, DEFAULT_PLAN, withHoldings } from "./plan";
import { makeResultCard, resultShareText } from "./resultShare";
const rows = Array.from({ length: 60 }, (_, i) => ({ date: `${2020 + Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, "0")}-01`, price: 100 + i * 4, raw: 100 + i, fx: 1300 }));
function result(plan = DEFAULT_PLAN) { return makeResultCard(plan, calcPlan(Object.fromEntries(plan.holdings.map(h => [h.ticker, rows])), plan)); }

describe("result share snapshots", () => {
  it("separates the headline, conditions and link prompt into readable blocks", () => {
    const plan = withHoldings({ ...DEFAULT_PLAN, freq: "weekly", weekday: 3, lump: 400, reinvest: false }, [{ ticker: "SPY", amount: 50 }, { ticker: "QQQ", amount: 30 }]);
    const text = resultShareText(plan, calcPlan({ SPY: rows, QQQ: rows }, plan));
    expect(text).toContain("\n\nSPY · QQQ\n매주 수요일 합계 80만원씩\n처음 목돈 400만원\n배당 재투자 안 함\n");
    expect(text).toMatch(/시작\n.*기준\n\n과거 자료로 계산한 결과예요\.\n같은 조건으로 계산해보기$/);
  });
  it("shares the solved contribution in amount mode instead of the input default", () => {
    const plan = { ...DEFAULT_PLAN, mode: "amount" as const, years: 2 };
    const calc = calcPlan({ SPY: rows }, plan);
    const text = resultShareText(plan, calc);
    expect(text).toContain("지난 2년, 10억까지 필요했던 금액\n");
    expect(text).not.toContain("매달 1일 100만원씩");
  });
  it("round-trips the displayed result without recalculating or changing conditions", () => {
    const plan = withHoldings({ ...DEFAULT_PLAN, freq: "weekly", weekday: 3, lump: 400, reinvest: false }, [{ ticker: "SPY", amount: 50 }, { ticker: "QQQ", amount: 30 }]);
    const card = result(plan);
    const restored = decodeResultCard(encodeResultCard(card));
    expect(restored).toEqual(card);
    expect(card.amount).toBe(800_000);
    expect(card.query).toContain("h=SPY:50,QQQ:30");
    expect(card.query).toContain("wd=3");
    expect(card.query).toContain("div=0");
    expect(resultCardCopy(card).condition).toContain("합계");
    expect(card.graph).toHaveLength(32);
  });
  it("distinguishes first reach from final valuation and preserves first reach date", () => {
    const plan = withHoldings({ ...DEFAULT_PLAN }, [{ ticker: "SPY", amount: 5000 }]);
    const fallingRows = rows.map((row, i) => i >= 56 ? { ...row, price: 10, raw: 10 } : row);
    const calc = calcPlan({ SPY: fallingRows }, plan);
    const card = makeResultCard(plan, calc);
    expect(card.kind).toBe("reach");
    expect(card.reached).toBe(calc.reach!.date);
    expect(card.value).toBe(calc.result.value);
    expect(card.end).toBe(rows.at(-1)!.date);
    expect(card.reached! < card.end).toBe(true);
  });
  it("uses solved amount for amount mode and never presents a tracking result as a duration", () => {
    const plan = { ...DEFAULT_PLAN, mode: "amount" as const, years: 2 };
    const calc = calcPlan({ SPY: rows }, plan);
    expect(makeResultCard(plan, calc)).toMatchObject({ kind: "amount", amount: calc.reqMonthly });
    expect(result({ ...DEFAULT_PLAN, tracking: true, startDate: "2022-01-01", lump: 100_000 }).kind).toBe("value");
  });
  it("rejects oversized, invalid, nonfinite and injected inputs", () => {
    const card = result();
    for (const change of [{ value: Infinity }, { tickers: ["<script>"] }, { end: "2026-02-30" }, { graph: Array(41).fill(0) }, { query: "t=SPY&next=evil" }, { kind: "reach", reached: null }]) {
      expect(() => encodeResultCard({ ...card, ...change } as typeof card)).toThrow();
    }
    expect(decodeResultCard("a".repeat(3501))).toBeNull();
    expect(decodeResultCard("not-a-snapshot")).toBeNull();
  });
});
