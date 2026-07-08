// 로케일별 표시 포맷터. getFormatter(locale) → 금액·날짜·증감 포맷 묶음.
// ⚠️ ko 출력은 기존 lib/format.ts와 바이트 단위로 동일해야 한다 (format.test.ts 골든).
import type { Locale } from "./locales";

export type AmountParts = { n: string; u: string };

export type Formatter = {
  /** 통계 타일용 정밀 표기. ko "1.63억"(항상 2자리) */
  money: (v: number) => string;
  /** 표·스크럽용 압축 표기. ko "1.63억"/"6.2억"(10↑)/"205만" */
  compact: (v: number) => string;
  /** 대략 표기(1자리). ko "6.2억" */
  rough: (v: number) => string;
  /** 히어로 월적립액: 숫자/단위 분리(단위는 작은 글씨로 렌더). ko {n:"1.6",u:"억"}|{n:"100",u:"만원"} */
  amountParts: (v: number) => AmountParts;
  /** amountParts를 이어붙인 문자열 (OG 등). */
  amount: (v: number) => string;
  /** 수익률: 0.21 → "+21%" */
  pct: (frac: number) => string;
  /** 원금 대비 증감: 2배↑ "6.2배"/"6.2x", 그 미만 "+21%". 원금 0이면 "". */
  growth: (principal: number, value: number) => string;
  /** 이정표/목표 라벨(정수 단위). ko "5억", ja "5億"/"1000万", en "$500K", de "500.000 €" */
  milestone: (v: number) => string;
  /** ISO → "2020년 1월" */
  ym: (iso: string) => string;
  /** ISO → "2021년 5월 3일" */
  ymd: (iso: string) => string;
};

// ── ko: 억/만 (기존 로직 그대로) ──────────────────────────────
function koGrowth(principal: number, value: number): string {
  if (principal <= 0) return "";
  const ratio = value / principal;
  if (ratio >= 2) return ratio.toFixed(1) + "배";
  const r = Math.round((ratio - 1) * 100);
  return (r >= 0 ? "+" : "") + r + "%";
}
const KO: Formatter = {
  money: (v) => (v / 1e8).toFixed(2) + "억",
  compact: (v) => {
    if (v >= 1e8) {
      const x = v / 1e8;
      return (x >= 10 ? x.toFixed(1) : x.toFixed(2)) + "억";
    }
    return Math.round(v / 1e4).toLocaleString("ko-KR") + "만";
  },
  rough: (v) => (v / 1e8).toFixed(1) + "억",
  amountParts: (v) =>
    v >= 1e8
      ? { n: (Math.round(v / 10_000_000) / 10).toString(), u: "억" }
      : { n: Math.round(v / 10_000).toLocaleString(), u: "만원" },
  amount: (v) => { const p = KO.amountParts(v); return `${p.n}${p.u}`; },
  pct: (frac) => { const v = Math.round(frac * 100); return (v >= 0 ? "+" : "") + v + "%"; },
  growth: koGrowth,
  milestone: (v) => `${v / 1e8}억`,
  ym: (iso) => { const [y, m] = iso.split("-").map(Number); return `${y}년 ${m}월`; },
  ymd: (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${y}년 ${m}월 ${d}일`; },
};

// ── ja: 億/万円 (ko와 같은 만/억 자릿수 체계, 접미사만 다름) ──
const JA: Formatter = {
  money: (v) => (v / 1e8).toFixed(2) + "億円",
  compact: (v) => {
    if (v >= 1e8) { const x = v / 1e8; return (x >= 10 ? x.toFixed(1) : x.toFixed(2)) + "億円"; }
    return Math.round(v / 1e4).toLocaleString("ja-JP") + "万円";
  },
  rough: (v) => (v / 1e8).toFixed(1) + "億円",
  amountParts: (v) =>
    v >= 1e8
      ? { n: (Math.round(v / 10_000_000) / 10).toString(), u: "億円" }
      : { n: Math.round(v / 10_000).toLocaleString("ja-JP"), u: "万円" },
  amount: (v) => { const p = JA.amountParts(v); return `${p.n}${p.u}`; },
  pct: (frac) => { const v = Math.round(frac * 100); return (v >= 0 ? "+" : "") + v + "%"; },
  growth: (principal, value) => {
    if (principal <= 0) return "";
    const ratio = value / principal;
    if (ratio >= 2) return ratio.toFixed(1) + "倍";
    const r = Math.round((ratio - 1) * 100);
    return (r >= 0 ? "+" : "") + r + "%";
  },
  milestone: (v) => (v >= 1e8 ? `${v / 1e8}億` : `${Math.round(v / 1e4).toLocaleString("ja-JP")}万`),
  ym: (iso) => { const [y, m] = iso.split("-").map(Number); return `${y}年${m}月`; },
  ymd: (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${y}年${m}月${d}日`; },
};

// ── 서양권 공통(Intl compact) ─────────────────────────────────
function westernFactory(locale: string, sym: string, symPrefix: boolean): Formatter {
  const compactFmt = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 2 });
  const roughFmt = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const plain = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const withSym = (s: string) => (symPrefix ? `${sym}${s}` : `${s} ${sym}`);
  const self: Formatter = {
    money: (v) => withSym(compactFmt.format(v)),
    compact: (v) => withSym(compactFmt.format(v)),
    rough: (v) => withSym(roughFmt.format(v)),
    // 월적립액은 자릿수가 작아 통째로 숫자+통화기호, 단위는 비움(히어로에서 기호가 곧 단위).
    amountParts: (v) => ({ n: withSym(v < 100_000 ? plain.format(v) : compactFmt.format(v)), u: "" }),
    amount: (v) => self.amountParts(v).n,
    pct: (frac) => { const v = Math.round(frac * 100); return (v >= 0 ? "+" : "") + v + "%"; },
    growth: (principal, value) => {
      if (principal <= 0) return "";
      const ratio = value / principal;
      if (ratio >= 2) return ratio.toFixed(1) + "x";
      const r = Math.round((ratio - 1) * 100);
      return (r >= 0 ? "+" : "") + r + "%";
    },
    milestone: (v) => withSym(compactFmt.format(v)),
    ym: (iso) => new Date(iso + "T00:00:00Z").toLocaleDateString(locale, { year: "numeric", month: "short", timeZone: "UTC" }),
    ymd: (iso) => new Date(iso + "T00:00:00Z").toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }),
  };
  return self;
}

const FORMATTERS: Record<Locale, Formatter> = {
  ko: KO,
  ja: JA,
  en: westernFactory("en-US", "$", true),
  de: westernFactory("de-DE", "€", false),
};

export function getFormatter(locale: Locale): Formatter {
  return FORMATTERS[locale];
}
