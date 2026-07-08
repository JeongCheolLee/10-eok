// 로케일 레지스트리.
//  ALL_LOCALES: 시장/포맷 설정을 보유한 전체 로케일 (markets.ts와 1:1).
//  LOCALES: "지금 공개된" 활성 로케일 — 라우팅·정적 생성·hreflang에 쓰인다.
// 새 시장 출시 = markets.ts 엔트리 준비 후, 그 로케일을 LOCALES로 승격.
export const ALL_LOCALES = ["ko", "en", "ja", "de"] as const;
export type Locale = (typeof ALL_LOCALES)[number];

// P3-c 완료: en·ja·de 동시 공개(2026-07-09). ko는 루트 URL·콘텐츠 불변 + hreflang 상호참조만 추가.
export const LOCALES: readonly Locale[] = ["ko", "en", "ja", "de"];
export const DEFAULT_LOCALE: Locale = "ko";

export function isAllLocale(v: string): v is Locale {
  return (ALL_LOCALES as readonly string[]).includes(v);
}
/** 공개(활성) 로케일 여부 — 라우팅 방어에 사용. */
export function isLocale(v: string): v is Locale {
  return LOCALES.includes(v as Locale);
}

/** URL 프리픽스를 쓰는 활성 로케일 (기본 로케일 제외). middleware 통과 판정용. */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);
