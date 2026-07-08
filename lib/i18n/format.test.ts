import { describe, it, expect } from "vitest";
import { getFormatter } from "./format";
import { MARKETS, getMarket } from "./markets";
import { ALL_LOCALES } from "./locales";

// ── ko 골든: 리팩터 전 lib/format.ts 원본 로직을 여기 복제해 두고, 새 포맷터와 대조.
// (원본이 바뀌면 이 참조도 의도적으로 같이 봐야 하는 안전장치)
const refEok = (v: number) => (v / 1e8).toFixed(2) + "억";
const refEok1 = (v: number) => (v / 1e8).toFixed(1) + "억";
const refPct = (frac: number) => { const v = Math.round(frac * 100); return (v >= 0 ? "+" : "") + v + "%"; };
const refYm = (iso: string) => { const [y, m] = iso.split("-").map(Number); return `${y}년 ${m}월`; };
const refYmd = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return `${y}년 ${m}월 ${d}일`; };
const refWon = (v: number) => {
  if (v >= 1e8) { const x = v / 1e8; return (x >= 10 ? x.toFixed(1) : x.toFixed(2)) + "억"; }
  return Math.round(v / 1e4).toLocaleString("ko-KR") + "만";
};
const refGrowth = (principal: number, value: number) => {
  if (principal <= 0) return "";
  const ratio = value / principal;
  if (ratio >= 2) return ratio.toFixed(1) + "배";
  const r = Math.round((ratio - 1) * 100);
  return (r >= 0 ? "+" : "") + r + "%";
};
const refManwonParts = (won: number) =>
  won >= 100_000_000
    ? { n: (Math.round(won / 10_000_000) / 10).toString(), u: "억" }
    : { n: Math.round(won / 10_000).toLocaleString(), u: "만원" };

describe("ko 포맷터 골든 동일성 (구 lib/format.ts 대비)", () => {
  const ko = getFormatter("ko");
  // 원·억 경계, 반올림 경계 등 넓게 스윕
  const vals = [0, 1234, 9_999, 10_000, 205_000, 9_531_0000, 99_999_999, 100_000_000,
    163_000_000, 620_000_000, 1_010_285_129, 5_000_000_000, 12_340_000_000];
  it("money=eok / compact=won / rough=eok1", () => {
    for (const v of vals) {
      expect(ko.money(v)).toBe(refEok(v));
      expect(ko.compact(v)).toBe(refWon(v));
      expect(ko.rough(v)).toBe(refEok1(v));
    }
  });
  it("amountParts=manwonParts", () => {
    for (const v of vals) expect(ko.amountParts(v)).toEqual(refManwonParts(v));
  });
  it("pct / growth", () => {
    for (const f of [-0.08, 0, 0.21, 0.235, 1.5, 5.16]) expect(ko.pct(f)).toBe(refPct(f));
    const pairs: [number, number][] = [[0, 100], [1e8, 1.5e8], [1e8, 2e8], [164_000_000, 1_010_285_129]];
    for (const [p, v] of pairs) expect(ko.growth(p, v)).toBe(refGrowth(p, v));
  });
  it("ym / ymd", () => {
    for (const iso of ["2012-12-03", "2020-01-15", "2026-07-06"]) {
      expect(ko.ym(iso)).toBe(refYm(iso));
      expect(ko.ymd(iso)).toBe(refYmd(iso));
    }
  });
  it("axisMonth / yearLabel / monthLabel / unitAmount / approx (신규 — GrowthChart·MonthlyLog·칩 라벨)", () => {
    expect(ko.axisMonth(2025, 7, true)).toBe("7월");
    expect(ko.axisMonth(2025, 7, false)).toBe("2025.7");
    expect(ko.yearLabel(2025)).toBe("2025년");
    expect(ko.monthLabel(3)).toBe("3월");
    // unitAmount: 입력 카운트 그대로 + 단위. 억 롤오버·콤마 없이 원문(`${n}만원`)과 바이트 동일해야.
    expect(ko.unitAmount(100, "만원")).toBe("100만원");
    expect(ko.unitAmount(10, "억")).toBe("10억");
    expect(ko.unitAmount(100000, "만원")).toBe("100000만원");
    // approx: 타이밍 중앙값 medRough — 1억↑는 "약 N억", 미만은 money(2자리)
    expect(ko.approx(50_000_000)).toBe("0.50억");
    expect(ko.approx(163_000_000)).toBe("약 2억");
    expect(ko.approx(1_010_285_129)).toBe("약 10억");
  });
});

describe("en/ja/de 포맷터 스모크 (크래시 없음 + 통화기호)", () => {
  it("en USD compact", () => {
    const en = getFormatter("en");
    expect(en.money(1_010_000)).toMatch(/^\$/);
    expect(en.growth(1e5, 6.2e5)).toBe("6.2x");
    expect(en.pct(0.21)).toBe("+21%");
    expect(en.ym("2020-01-15")).toMatch(/2020/);
    expect(en.monthLabel(7)).toBe("Jul");
    expect(en.yearLabel(2025)).toBe("2025");
    expect(en.axisMonth(2025, 7, true)).toBe("Jul");
    expect(en.axisMonth(2025, 7, false)).toBe("Jul ’25");
    expect(en.unitAmount(700, "$")).toBe("$700");
    expect(en.unitAmount(50_000, "$")).toBe("$50,000");
    expect(en.approx(1_010_000)).toMatch(/^~\$/);
  });
  it("ja 億円", () => {
    const ja = getFormatter("ja");
    expect(ja.money(101_000_000)).toBe("1.01億円");
    expect(ja.compact(100_000)).toBe("10万円");
    expect(ja.growth(1e7, 6.2e7)).toBe("6.2倍");
    expect(ja.ym("2020-01-15")).toBe("2020年1月");
  });
  it("de EUR", () => {
    const de = getFormatter("de");
    expect(de.money(1_010_000)).toMatch(/€$/);
    expect(de.growth(1e5, 6.2e5)).toBe("6.2x");
    expect(de.unitAmount(600, "€")).toBe("600 €");
  });
});

describe("markets 설정 정합성", () => {
  it("전 로케일 엔트리 존재 + 필드 유효", () => {
    for (const loc of ALL_LOCALES) {
      const m = getMarket(loc);
      expect(m.locale).toBe(loc);
      expect(m.milestones.length).toBeGreaterThan(0);
      expect(m.milestones).toEqual([...m.milestones].sort((a, b) => a - b)); // 오름차순
      expect(m.tickers.length).toBeGreaterThan(0);
      expect(m.goal.unit).toBeGreaterThan(0);
    }
  });
  it("ko만 KODEX·세금 포함, 나머진 USD 종목만", () => {
    expect(MARKETS.ko.tickers).toContain("069500.KS");
    expect(MARKETS.ko.tax).not.toBeNull();
    for (const loc of ["en", "ja", "de"] as const) {
      expect(MARKETS[loc].tickers).not.toContain("069500.KS");
      expect(MARKETS[loc].tax).toBeNull();
    }
  });
});
