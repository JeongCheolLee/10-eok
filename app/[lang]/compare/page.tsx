import type { Metadata } from "next";
import { BacktestApp } from "@/components/BacktestApp";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates } from "@/lib/i18n/seo";
const titles = {
  ko: "같은 기간, 다른 ETF였다면?",
  en: "Same period, different ETF?",
  ja: "同じ期間、別のETFだったら？",
  de: "Gleicher Zeitraum, anderer ETF?",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: titles[lang as Locale],
    alternates: langAlternates(lang as Locale, "/compare"),
  };
}
export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ lang }, sp] = await Promise.all([params, searchParams]);
  return (
    <BacktestApp
      locale={lang as Locale}
      initialView="compare"
      initialQuery={new URLSearchParams(
        Object.entries(sp).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string",
        ),
      ).toString()}
    />
  );
}
