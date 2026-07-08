// 시장(로케일×통화) 설정. 시장 추가 = 여기 1엔트리 + fx/cpi 파일 + 사전 + 콘텐츠 번역.
// 엔진·UI는 이 설정만 참조하므로 KRW 하드코딩이 사라진다.
import type { Locale } from "./locales";

/** 금액 입력(StepInput) 스펙 — count 단위로 스테핑하고 통화값 = count × unit. */
export type AmountInput = {
  /** 기본 count (unit 배수) */
  default: number;
  min: number;
  max: number;
  step: number;
  /** count 1당 통화 금액. ko 억=1e8, 만원=1e4 */
  unit: number;
  /** 입력칩 접미사(한국·일본식) 또는 통화기호(서양식은 prefix로 렌더) */
  unitLabel: string;
};

export type Market = {
  locale: Locale;
  /** <html hreflang> 값 (uk는 en-GB 등) */
  hreflang: string;
  /** OpenGraph locale (ko_KR 등) */
  ogLocale: string;
  currency: "KRW" | "USD" | "JPY" | "EUR";
  /** 환율 파일 경로(USD 1단위당 통화). USD 시장은 null(환전 불필요). */
  fxFile: string | null;
  /** 물가연동 CPI 파일. null이면 물가 토글 숨김. */
  cpiFile: string | null;
  /** getFormatter가 고르는 포맷 방식 */
  numFmt: "koEok" | "jaOku" | "usdCompact" | "eurCompact";
  /** 목표 금액 입력 스펙 (통화값 = count × unit) */
  goal: AmountInput;
  /** 매달 적립액 입력 스펙 */
  monthly: AmountInput;
  /** 초기 목돈 입력 스펙 */
  lump: AmountInput;
  /** 월별 기록 카드의 이정표 사다리(통화값, 목표 미만만 "돌파" 배지) */
  milestones: number[];
  /** 이 시장에서 고를 수 있는 종목 (KODEX는 ko 전용) */
  tickers: string[];
  /** 양도세 규칙(있으면 UI에 토글 노출·엔진 반영). 현재 ko만. */
  tax: { rate: number; exemption: number } | null;
};

const USD_TICKERS = ["QLD", "TQQQ", "QQQ", "SPY", "VOO", "SCHD", "VT", "SOXX", "VGT", "VNQ", "GLD", "TLT", "AGG", "JEPI", "JEPQ"];

export const MARKETS: Record<Locale, Market> = {
  ko: {
    locale: "ko",
    hreflang: "ko",
    ogLocale: "ko_KR",
    currency: "KRW",
    fxFile: "fx/krw.json",
    cpiFile: "cpi/kr.json",
    numFmt: "koEok",
    // 목표 10억(1~100억, 1억 step), 매달 100만원(10~10만만원… 실제 10~100000만원 step10), 목돈 0~100만만원
    goal: { default: 10, min: 1, max: 100, step: 1, unit: 100_000_000, unitLabel: "억" },
    monthly: { default: 100, min: 10, max: 100_000, step: 10, unit: 10_000, unitLabel: "만원" },
    lump: { default: 0, min: 0, max: 1_000_000, step: 100, unit: 10_000, unitLabel: "만원" },
    milestones: [1, 5, 10, 50, 100, 500].map((n) => n * 100_000_000),
    tickers: [...USD_TICKERS, "069500.KS"],
    tax: { rate: 0.22, exemption: 2_500_000 },
  },
  // ── 이하 P3+에서 locales.ts LOCALES에 추가될 때 활성화. 데이터는 확정, 미세 조정은 각 단계에서. ──
  en: {
    locale: "en",
    hreflang: "en",
    ogLocale: "en_US",
    currency: "USD",
    fxFile: null, // 원자산이 USD → 환전 불필요
    cpiFile: "cpi/us.json", // FRED CPIAUCSL (현행)
    numFmt: "usdCompact",
    // 목표 $1M ($100K~$10M, $100K step), 매달 $700 ($100~$100K step $100), 목돈 $0~$10M
    goal: { default: 10, min: 1, max: 100, step: 1, unit: 100_000, unitLabel: "$" },
    monthly: { default: 700, min: 100, max: 100_000, step: 100, unit: 1, unitLabel: "$" },
    lump: { default: 0, min: 0, max: 10_000_000, step: 1_000, unit: 1, unitLabel: "$" },
    milestones: [100_000, 250_000, 500_000, 1_000_000, 2_500_000, 5_000_000],
    tickers: USD_TICKERS,
    tax: null,
  },
  ja: {
    locale: "ja",
    hreflang: "ja",
    ogLocale: "ja_JP",
    currency: "JPY",
    fxFile: "fx/jpy.json", // FRED DEXJPUS (JPY/USD)
    cpiFile: "cpi/jp.json",
    numFmt: "jaOku",
    // 目標 1億円(1~100億, 1億 step 단위=1e6? 아니오 — 億=1e8), 毎月 10万円, 元金 0~
    // 억엔 체계: 목표 count 1 = 1億円(1e8엔). 기본 1억엔.
    goal: { default: 1, min: 1, max: 100, step: 1, unit: 100_000_000, unitLabel: "億円" },
    monthly: { default: 10, min: 1, max: 1_000, step: 1, unit: 10_000, unitLabel: "万円" },
    lump: { default: 0, min: 0, max: 100_000, step: 10, unit: 10_000, unitLabel: "万円" },
    milestones: [10_000_000, 50_000_000, 100_000_000, 500_000_000, 1_000_000_000],
    tickers: USD_TICKERS,
    tax: null,
  },
  de: {
    locale: "de",
    hreflang: "de",
    ogLocale: "de_DE",
    currency: "EUR",
    fxFile: "fx/eur.json", // FRED DEXUSEU (USD/EUR) → 역수 필요, 생성기에서 처리
    cpiFile: "cpi/ea.json", // Eurostat HICP
    numFmt: "eurCompact",
    // Ziel 1 Mio. € (€100K~€10M, €100K step), monatlich €600, Startkapital €0~
    goal: { default: 10, min: 1, max: 100, step: 1, unit: 100_000, unitLabel: "€" },
    monthly: { default: 600, min: 100, max: 100_000, step: 100, unit: 1, unitLabel: "€" },
    lump: { default: 0, min: 0, max: 10_000_000, step: 1_000, unit: 1, unitLabel: "€" },
    milestones: [100_000, 250_000, 500_000, 1_000_000, 2_500_000, 5_000_000],
    tickers: USD_TICKERS,
    tax: null,
  },
};

export function getMarket(locale: Locale): Market {
  return MARKETS[locale];
}
