import Link from "next/link";
import { AppLogo } from "@/components/AppLogo";
import type { Locale } from "@/lib/i18n/locales";
import { getDict } from "@/lib/i18n/dict";
import { localeHref } from "@/lib/i18n/seo";

// 전 페이지 공통 상단 네비게이션. 홈(계산기)에서도 가이드·계산방법·소개로 가는
// 크롤 가능한 내부 링크 경로를 제공한다. 링크는 로케일별 경로(ko는 루트).
export function SiteHeader({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const links = [
    { href: "/compare", label: d.nav.compare },
    { href: "/guides", label: d.nav.guides },
    { href: "/how-it-works", label: d.nav.howItWorks },
    { href: "/about", label: d.nav.about },
    { href: "/contact", label: d.nav.contact },
  ];
  return (
    <header className="site-header">
      <div className="inner">
        <Link href={localeHref(locale, "/")} className="brand-link" aria-label={d.a11y.brandHome}>
          <AppLogo />
          <span>10-eok</span>
        </Link>
        <nav aria-label={d.a11y.siteMenu}>
          {links.map((l) => (
            <Link key={l.href} href={localeHref(locale, l.href)}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
