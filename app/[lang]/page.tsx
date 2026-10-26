import type { Metadata } from "next";
import { BacktestApp } from "@/components/BacktestApp";
import { HomeContent } from "@/components/HomeContent";
import { JsonLd, webSiteLd, softwareAppLd } from "@/components/JsonLd";
import { parseWebPlan } from "@/lib/web-calculator";
import type { Locale } from "@/lib/i18n/locales";
import { getFormatter } from "@/lib/i18n/format";
import { getMarket } from "@/lib/i18n/markets";
import { langAlternates } from "@/lib/i18n/seo";
import { resultCopy } from "@/components/calculator/result-copy";
type SP = Record<string, string | string[] | undefined>;
const queryOf = (sp: SP) =>
  new URLSearchParams(
    Object.entries(sp).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const [{ lang }, sp] = await Promise.all([params, searchParams]),
    locale = lang as Locale;
  const plan = parseWebPlan(queryOf(sp), locale);
  if (!plan) return { alternates: langAlternates(locale, "/") };
  const t = resultCopy[locale],
    fmt = getFormatter(locale),
    symbols = plan.holdings.map((h) => h.ticker).join(" · ");
  const title = `${symbols} — ${plan.mode === "amount" ? t.amountLead : t.condition(t[plan.freq], fmt.amount(plan.holdings.reduce((s, h) => s + h.amount, 0)), plan.holdings.length > 1)} · ${fmt.milestone(plan.target)}`;
  const image = `/api/og?preview=brand&l=${locale}&g=${plan.target / getMarket(locale).goal.unit}`;
  return {
    title,
    alternates: langAlternates(locale, "/"),
    openGraph: { title, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}
export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SP>;
}) {
  const [{ lang }, sp] = await Promise.all([params, searchParams]);
  return (
    <>
      <JsonLd data={webSiteLd()} />
      <JsonLd data={softwareAppLd()} />
      <BacktestApp
        initialQuery={queryOf(sp).toString()}
        locale={lang as Locale}
      />
      <HomeContent locale={lang as Locale} />
    </>
  );
}
