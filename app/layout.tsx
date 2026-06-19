import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "10-eok · 과거에 매달 모았다면 10억까지 얼마나",
  description: "고른 미국 ETF·주식을 매달 일정 금액씩 샀다고 가정하고, 실제 과거 가격과 그날 환율로 10억까지 걸린 시간을 계산해 드려요.",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
