import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { getMarket } from "@/lib/i18n/markets";
import { localePaths, pathLocales } from "@/lib/i18n/pages";

// 경로+로케일 → 절대 URL (loc과 동일 규칙). 홈("")은 트레일링 슬래시 없음.
// ⚠️ sitemap의 hreflang(xhtml:link href)은 절대 URL이어야 유효(상대경로면 GSC "잘못된 URL").
//    페이지 <head>는 Next가 metadataBase로 절대화하지만 sitemap 출력엔 적용 안 되므로 여기서 직접 절대화한다.
function absUrl(loc: Locale, p: string): string {
  const suffix = loc === DEFAULT_LOCALE ? p : `/${loc}${p}`;
  return `${BASE}${suffix}`;
}

// 로케일×경로 매트릭스. 각 로케일에 "실제 존재하는" 경로만(ko 전용 가이드·KODEX는 en/ja/de 제외),
// hreflang alternates도 그 경로가 존재하는(그리고 공개된) 로케일만 가리킨다.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const out: MetadataRoute.Sitemap = [];
  for (const loc of LOCALES) {
    for (const p of localePaths(loc)) {
      const avail = pathLocales(p).filter((l) => LOCALES.includes(l));
      let languages: Record<string, string> | undefined;
      if (avail.length > 1) {
        languages = {};
        for (const l of avail) languages[getMarket(l).hreflang] = absUrl(l, p);
        const xd: Locale = avail.includes("en" as Locale) ? "en" : DEFAULT_LOCALE;
        languages["x-default"] = absUrl(xd, p);
      }
      out.push({
        url: absUrl(loc, p),
        lastModified,
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.7,
        ...(languages ? { alternates: { languages } } : {}),
      });
    }
  }
  return out;
}
