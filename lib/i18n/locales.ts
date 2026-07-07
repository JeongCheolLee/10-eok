// 로케일 레지스트리. 시장 추가 시 여기(+ markets.ts)만 늘리면 라우팅·정적 생성이 따라온다.
// ko는 URL 프리픽스 없는 기본 로케일(루트) — middleware가 /를 내부적으로 /ko로 rewrite.
export const LOCALES = ["ko"] as const; // P3: "en", P4: "ja", P5: "de" 추가 예정
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE = "ko" satisfies Locale;

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/** URL 프리픽스를 쓰는 로케일 목록 (기본 로케일 제외). middleware 통과 판정용. */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);
