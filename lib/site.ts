import type { Locale } from "./i18n/locales";

// 사이트 canonical 기준 URL. 루트(apex)를 10-eok로 쓰기로 함 (llm-arena 내림).
export const SITE_URL = "https://jeongcheol.cloud";

// 운영자/작성자 신뢰 정보 (E-E-A-T). 금융(YMYL) 사이트라 실명·연락처를 명시한다.
export const AUTHOR = "이정철";
export const AUTHOR_ROLE = "개발자 · 개인 투자자";
export const CONTACT_EMAIL = "jclee7503@gmail.com";
// 콘텐츠 최종 점검일. 글을 손보면 갱신. (시장 데이터 자체는 매일 자동 갱신됨)
export const LAST_UPDATED = "2026-06-29";

/** ko 외 로케일은 로마자 표기 병기(E-E-A-T). ko는 기존과 바이트 동일. */
export function authorName(locale: Locale): string {
  return locale === "ko" ? AUTHOR : `${AUTHOR} (Jeongcheol Lee)`;
}
export function authorRole(locale: Locale): string {
  return locale === "ko" ? AUTHOR_ROLE : "Developer · Individual investor";
}
