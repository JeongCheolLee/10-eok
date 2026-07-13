// 로케일 라우팅: 공개 URL은 ko=루트(프리픽스 없음), 타 로케일=/en 등 프리픽스.
// 내부 라우트는 전부 app/[lang]/* — 프리픽스 없는 요청을 /ko/*로 rewrite해 연결한다.
// (rewrite는 프리렌더된 SSG 출력을 그대로 서빙. 쿼리스트링은 nextUrl.clone으로 보존)
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, PREFIXED_LOCALES } from "./lib/i18n/locales";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 내부 경로 /ko/*가 공개 중복 URL이 되지 않게 프리픽스 제거로 308
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  // 프리픽스 로케일(/en 등)은 그대로 통과
  if (PREFIXED_LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }

  // 그 외 전부 한국어: URL·쿼리 불변, 내부적으로만 /ko 프리픽스
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // 확장자 범용 제외(.*\..*)는 금지 — /etf/069500.ks 같은 점 포함 페이지가 404 된다.
    // /debates·/leaderboard(410 핸들러)·정적 자산·메타데이터 라우트는 명시적으로 제외.
    "/((?!api|_next/static|_next/image|data/|fonts/|debates|leaderboard|favicon.ico|sitemap.xml|robots.txt|ads.txt|icon.svg|.well-known).*)",
  ],
};
