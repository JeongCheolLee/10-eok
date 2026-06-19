import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";
import { TICKERS } from "@/lib/tickers";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
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
  return paths.map((p) => ({ url: `${BASE}${p}`, lastModified, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}
