import type { Locale } from "./locales";
import { tickerName } from "@/lib/tickers";

// 종목의 짧은 카테고리 설명(표·비교 부제용)의 로케일 번역.
// ko는 tickers.ts의 한국어 name을 그대로 사용(불변); en/ja/de는 아래 번역을 쓰고, 없으면 ko name으로 폴백.
// KODEX 200(069500.KS)은 ko 전용 종목이라 여기 없음.
const DESC: Record<string, Partial<Record<Exclude<Locale, "ko">, string>>> = {
  QLD: { en: "Nasdaq-100 2x", ja: "ナスダック100 2倍", de: "Nasdaq 100 (2-fach)" },
  TQQQ: { en: "Nasdaq-100 3x", ja: "ナスダック100 3倍", de: "Nasdaq 100 (3-fach)" },
  QQQ: { en: "Nasdaq-100", ja: "ナスダック100", de: "Nasdaq 100" },
  SPY: { en: "S&P 500", ja: "S&P 500", de: "S&P 500" },
  VOO: { en: "S&P 500 (Vanguard)", ja: "S&P 500(バンガード)", de: "S&P 500 (Vanguard)" },
  SCHD: { en: "US dividend growth", ja: "米国 増配株", de: "US-Dividendenwachstum" },
  VT: { en: "Global stocks", ja: "全世界株式", de: "Weltweite Aktien" },
  SOXX: { en: "US semiconductors", ja: "米国 半導体", de: "US-Halbleiter" },
  VGT: { en: "US technology", ja: "米国 テクノロジー", de: "US-Technologie" },
  VNQ: { en: "US REITs", ja: "米国 REIT", de: "US-REITs" },
  GLD: { en: "Gold", ja: "金", de: "Gold" },
  TLT: { en: "US long-term Treasuries", ja: "米国 長期国債", de: "US-Staatsanleihen (lang)" },
  AGG: { en: "US aggregate bonds", ja: "米国 総合債券", de: "US-Anleihen (gesamt)" },
  JEPI: { en: "US covered call", ja: "米国 カバードコール", de: "US-Covered-Call" },
  JEPQ: { en: "Nasdaq covered call", ja: "ナスダック カバードコール", de: "Nasdaq-Covered-Call" },
};

/** 종목의 짧은 카테고리 설명. ko는 한국어 name과 바이트 동일, 그 외는 번역(없으면 ko name 폴백). */
export function tickerDesc(symbol: string, locale: Locale): string {
  if (locale === "ko") return tickerName(symbol);
  return DESC[symbol]?.[locale] ?? tickerName(symbol);
}
