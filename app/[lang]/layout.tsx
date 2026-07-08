import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LocaleBanner } from "@/components/LocaleBanner";
import { SITE_URL } from "@/lib/site";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/locales";
import { getMarket } from "@/lib/i18n/markets";

const ADSENSE_CLIENT = "ca-pub-4501300749862789";

// 사이트 전역 기본 title·description(로케일별). 페이지가 자체 metadata를 안 주면 이 값이 폴백.
const META: Record<Locale, { title: string; desc: string }> = {
  ko: {
    title: "10-eok · 과거에 매달 모았다면 10억까지 얼마나",
    desc: "고른 ETF를 매달 일정 금액씩 샀다고 가정하고, 실제 과거 가격과 그날 환율로 10억까지 걸린 시간을 계산해 드려요.",
  },
  en: {
    title: "10-eok · How long to $1M with monthly investing?",
    desc: "Assuming you bought a chosen ETF every month, 10-eok computes how long it took to reach $1M — from real historical prices.",
  },
  ja: {
    title: "10-eok · 毎月積み立てて1億円まで何年?",
    desc: "選んだETFを毎月一定額で買ったと仮定し、実際の過去の価格で1億円までにかかった期間を計算します。",
  },
  de: {
    title: "10-eok · Wie lange bis 1 Mio. € mit einem Sparplan?",
    desc: "10-eok berechnet mit echten historischen Kursen, wie lange ein monatlicher ETF-Sparplan bis 1 Mio. € gebraucht hätte.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const ogLocale = getMarket(locale).ogLocale;
  const m = META[locale];
  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.desc,
    // 주의: 여기에 canonical 을 두면 모든 하위 페이지가 "/" 를 상속해 중복 처리됨. 페이지별로 설정.
    openGraph: {
      type: "website",
      siteName: "10-eok",
      locale: ogLocale,
      title: m.title,
      description: m.desc,
      images: [{ url: `/api/og?l=${lang}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: "10-eok", description: m.desc, images: [`/api/og?l=${lang}`] },
    other: { "google-adsense-account": ADSENSE_CLIENT },
  };
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // middleware가 허용 로케일만 통과시키지만, 직접 렌더 경로 대비 이중 방어
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang}>
      <head>
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        <LocaleBanner />
        <SiteHeader locale={lang} />
        {children}
        <SiteFooter locale={lang} />
      </body>
    </html>
  );
}
