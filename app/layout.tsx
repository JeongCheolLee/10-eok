import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";

const ADSENSE_CLIENT = "ca-pub-4501300749862789";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "10-eok · 과거에 매달 모았다면 10억까지 얼마나",
  description: "고른 미국 ETF·주식을 매달 일정 금액씩 샀다고 가정하고, 실제 과거 가격과 그날 환율로 10억까지 걸린 시간을 계산해 드려요.",
  alternates: { canonical: "/" },
  other: { "google-adsense-account": ADSENSE_CLIENT },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === "production" && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
