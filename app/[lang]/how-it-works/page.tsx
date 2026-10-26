import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, faqLd } from "@/components/JsonLd";
import { isAllLocale, type Locale } from "@/lib/i18n/locales";
import { getDict } from "@/lib/i18n/dict";
import { langAlternates } from "@/lib/i18n/seo";
import { getWebMethod, WebMethodBody } from "@/lib/i18n/web-method";

function resolveLocale(lang: string): Locale {
  return isAllLocale(lang) ? lang : "ko";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const content = getWebMethod(locale);
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: langAlternates(locale, "/how-it-works"),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const content = getWebMethod(locale);
  return (
    <ContentShell
      title={content.head.title}
      desc={content.head.desc}
      crumb={getDict(locale).nav.howItWorks}
    >
      <JsonLd data={faqLd(content.faq)} />
      <WebMethodBody locale={locale} />
    </ContentShell>
  );
}
