import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { langAlternates } from "@/lib/i18n/seo";
import { localePaths, pathLocales } from "@/lib/i18n/pages";

// 로케일×경로 매트릭스. 각 로케일에 "실제 존재하는" 경로만 나열하고(ko 전용 가이드·KODEX는
// en/ja/de 제외), hreflang alternates도 그 경로가 존재하는 로케일만 가리킨다.
// 활성 로케일이 ko뿐이면 기존과 동일한 루트 URL만(hreflang 없음).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const out: MetadataRoute.Sitemap = [];
  for (const loc of LOCALES) {
    for (const p of localePaths(loc)) {
      const canonicalPath = p === "" ? "/" : p;
      const suffix = loc === DEFAULT_LOCALE ? p : `/${loc}${p}`;
      // 가용성 판정은 raw 경로(홈="")로, canonical URL 생성은 "/"로.
      const { languages } = langAlternates(DEFAULT_LOCALE, canonicalPath, pathLocales(p));
      out.push({
        url: `${BASE}${suffix}`,
        lastModified,
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.7,
        ...(languages ? { alternates: { languages } } : {}),
      });
    }
  }
  return out;
}
