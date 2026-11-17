import type { Locale } from "./i18n/locales";

// 사이트 canonical 기준 URL. 2026-11-17 도메인 이전.
// fefelabs.dev 루트는 비워 두고 서비스마다 서브도메인을 쓴다(사용자 결정). 10억 계산기는 10-eok.
export const SITE_URL = "https://10-eok.fefelabs.dev";

// 이전 도메인. 페이지 요청만 새 주소로 보낸다(middleware).
// /data·/api·/og·/miniapp은 middleware matcher 밖이라 이전 주소에서 그대로 응답한다.
// 이미 출시된 미니앱 번들이 이전 주소의 /data를 교차 출처로 읽고, 리다이렉트 응답에는 CORS 헤더가 없어 fetch가 실패하기 때문이다.
export const LEGACY_HOSTS = ["jeongcheol.cloud", "www.jeongcheol.cloud", "10-eok.jeongcheol.cloud"];

/** 이전 도메인으로 온 요청이면 새 주소의 같은 경로·쿼리를, 아니면 null을 돌려준다. */
export function legacyRedirectUrl(host: string | null | undefined, pathname: string, search = ""): string | null {
  const name = host?.trim().toLowerCase().replace(/:\d+$/, "");
  if (!name || !LEGACY_HOSTS.includes(name)) return null;
  return `${SITE_URL}${pathname}${search}`;
}

// 운영자/작성자 신뢰 정보 (E-E-A-T). 금융(YMYL) 사이트라 운영자 이름과 연락처를 명시한다.
// 공개 화면에는 운영자 이름(페페랩스)과 운영자용 문의 주소만 쓴다. 개인 이름·개인 이메일은 넣지 않는다.
export const AUTHOR = "페페랩스";
export const AUTHOR_LATIN = "Fefe Labs";
export const AUTHOR_ROLE = "개발자 · 개인 투자자";
export const CONTACT_EMAIL = "fefelabss@gmail.com";
// 콘텐츠 최종 점검일. 글을 손보면 갱신. (시장 데이터 자체는 매일 자동 갱신됨)
export const LAST_UPDATED = "2026-06-29";

/** ko는 한글 이름, 그 외 로케일은 로마자 표기. */
export function authorName(locale: Locale): string {
  return locale === "ko" ? AUTHOR : AUTHOR_LATIN;
}
export function authorRole(locale: Locale): string {
  return locale === "ko" ? AUTHOR_ROLE : "Developer · Individual investor";
}
