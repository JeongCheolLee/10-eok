import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";
import { TICKERS } from "@/lib/tickers";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { langAlternates } from "@/lib/i18n/seo";

// 로케일×경로 매트릭스. 활성 로케일이 ko뿐이면 기존과 동일한 루트 URL만 나온다
// (기본 로케일 홈은 트레일링 슬래시 없이 유지). en 등 추가 시 각 엔트리에
// hreflang alternates가 자동으로 붙고 /en… URL이 함께 생성된다.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/compare",
    "/about",
    "/how-it-works",
    "/contact",
    "/privacy",
    "/terms",
    "/guides",
    "/guides/etf-basics",
    "/guides/qld",
    "/guides/dca",
    "/guides/dca-vs-lumpsum",
    "/guides/leverage-etf-risk",
    "/guides/fx-impact",
    "/guides/overseas-tax",
    "/guides/compound-72",
    "/guides/nasdaq100-vs-sp500",
    ...TICKERS.map((t) => `/etf/${t.symbol.toLowerCase()}`),
  ];
  const lastModified = new Date();
  const out: MetadataRoute.Sitemap = [];
  for (const p of paths) {
    const { languages } = langAlternates(DEFAULT_LOCALE, p === "" ? "/" : p);
    for (const loc of LOCALES) {
      const suffix = loc === DEFAULT_LOCALE ? p : `/${loc}${p}`;
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
