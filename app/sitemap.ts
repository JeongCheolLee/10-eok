import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/about",
    "/how-it-works",
    "/contact",
    "/privacy",
    "/terms",
    "/guides",
    "/guides/qld",
    "/guides/dca",
    "/guides/leverage-etf-risk",
    "/guides/fx-impact",
  ];
  return paths.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}
