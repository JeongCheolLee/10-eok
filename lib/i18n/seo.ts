// 로케일 인지 URL·hreflang 헬퍼. 공개 URL 규칙: ko=루트(프리픽스 없음), 그 외 /{locale}.
import { LOCALES, DEFAULT_LOCALE, type Locale } from "./locales";
import { getMarket } from "./markets";

/** 로케일별 공개 경로. path는 "/"로 시작하는 루트 상대 경로. ko는 프리픽스 없음. */
export function localeHref(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * 페이지 metadata.alternates 생성 (canonical + hreflang).
 * 활성 로케일이 하나뿐이면(현재 ko) hreflang을 emit하지 않아 기존 HTML과 동일하게 유지.
 * availableLocales: 그 페이지가 실제 존재하는 로케일(예: overseas-tax는 ko 전용). 생략 시 전체 활성.
 */
export function langAlternates(
  locale: Locale,
  path: string,
  availableLocales: readonly Locale[] = LOCALES,
): { canonical: string; languages?: Record<string, string> } {
  const canonical = localeHref(locale, path);
  const avail = availableLocales.filter((l) => LOCALES.includes(l));
  if (avail.length <= 1) return { canonical };
  const languages: Record<string, string> = {};
  for (const l of avail) languages[getMarket(l).hreflang] = localeHref(l, path);
  // x-default: en이 있으면 en, 없으면 기본 로케일
  const xd = avail.includes("en" as Locale) ? ("en" as Locale) : DEFAULT_LOCALE;
  languages["x-default"] = localeHref(xd, path);
  return { canonical, languages };
}
