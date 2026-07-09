import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ConsentBanner } from "@/components/ConsentBanner";
import { SITE_URL } from "@/lib/site";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/locales";
import { getMarket } from "@/lib/i18n/markets";
import { GoogleAnalytics } from "@next/third-parties/google";

const ADSENSE_CLIENT = "ca-pub-4501300749862789";
// Google Analytics 4 측정 ID(공개값, 비밀 아님). AdSense와 동일하게 프로덕션에서만 로드.
const GA_MEASUREMENT_ID = "G-JC9GV7BZJB";

// Google Consent Mode v2 기본값 — 모든 Google 태그(AdSense·GA)보다 먼저 실행되어야 한다.
// 기본은 전부 'denied'; 이전에 '동의'한 방문자는 localStorage 기록을 즉시 반영해 update.
// ⚠️ 아래 '10eok-consent-v1' 키는 components/ConsentBanner.tsx 의 CONSENT_KEY 와 반드시 동일.
const CONSENT_DEFAULT_SCRIPT = `
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
  try{ if(localStorage.getItem('10eok-consent-v1')==='granted'){ gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'}); } }catch(e){}
})();
`;

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
        {/* Consent Mode v2 기본값(거부) — 반드시 Google 태그보다 먼저 로드 */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
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
        <ConsentBanner locale={lang} />
      </body>
      {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
