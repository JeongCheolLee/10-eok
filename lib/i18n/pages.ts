import { ALL_LOCALES, type Locale } from "./locales";
import { getMarket } from "./markets";

// 어떤 경로가 어떤 로케일에 존재하는지 한 곳에서 관리 — sitemap·hreflang·가이드 인덱스·404 게이트가 공유.
// (ko 전용 가이드·KODEX 종목이 en/ja/de에서 404가 되도록, 그리고 hreflang/sitemap이 존재하는 로케일만 가리키도록.)

/** 전 로케일 공통 가이드 slug (등장 순서 = 인덱스 카드 순서). */
export const COMMON_GUIDES = [
  "etf-basics",
  "qld",
  "dca",
  "dca-vs-lumpsum",
  "leverage-etf-risk",
  "compound-72",
  "nasdaq100-vs-sp500",
] as const;

/** ko 전용 가이드(한국 세금·원화 환율 관점). en/ja/de는 아직 미제공 → 404. */
export const KO_ONLY_GUIDES = ["fx-impact", "overseas-tax"] as const;

/** 전 로케일 공통 정적 페이지. */
const COMMON_PAGES = ["", "/compare", "/about", "/how-it-works", "/contact", "/privacy", "/terms", "/guides"];

/** 해당 가이드 slug이 ko 전용인지. */
export function isKoOnlyGuide(slug: string): boolean {
  return (KO_ONLY_GUIDES as readonly string[]).includes(slug);
}

/** 해당 로케일에 실제 존재하는 모든 경로(sitemap·인덱스 도출용). */
export function localePaths(locale: Locale): string[] {
  const guides = [...COMMON_GUIDES, ...(locale === "ko" ? KO_ONLY_GUIDES : [])].map((s) => `/guides/${s}`);
  const etfs = getMarket(locale).tickers.map((sym) => `/etf/${sym.toLowerCase()}`);
  return [...COMMON_PAGES, ...guides, ...etfs];
}

/** 특정 경로가 존재하는 로케일들(hreflang의 availableLocales용). */
export function pathLocales(path: string): Locale[] {
  return ALL_LOCALES.filter((l) => localePaths(l).includes(path));
}
