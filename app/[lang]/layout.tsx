import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";
import { LOCALES, isLocale } from "@/lib/i18n/locales";
import { getMarket } from "@/lib/i18n/markets";

const ADSENSE_CLIENT = "ca-pub-4501300749862789";

const SITE_DESC = "고른 ETF를 매달 일정 금액씩 샀다고 가정하고, 실제 과거 가격과 그날 환율로 10억까지 걸린 시간을 계산해 드려요.";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const ogLocale = isLocale(lang) ? getMarket(lang).ogLocale : "ko_KR";
  return {
    metadataBase: new URL(SITE_URL),
    title: "10-eok · 과거에 매달 모았다면 10억까지 얼마나",
    description: SITE_DESC,
    // 주의: 여기에 canonical 을 두면 모든 하위 페이지가 "/" 를 상속해 중복 처리됨. 페이지별로 설정.
    openGraph: {
      type: "website",
      siteName: "10-eok",
      locale: ogLocale,
      title: "10-eok · 과거에 매달 모았다면 10억까지 얼마나",
      description: SITE_DESC,
      images: [{ url: "/api/og", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: "10-eok", description: SITE_DESC, images: ["/api/og"] },
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
        <SiteHeader locale={lang} />
        {children}
        <SiteFooter locale={lang} />
      </body>
    </html>
  );
}
