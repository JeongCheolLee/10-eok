import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { getDict } from "@/lib/i18n/dict";
import { localeHref } from "@/lib/i18n/seo";

export function SiteFooter({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const links = [
    { href: "/", label: d.nav.home },
    { href: "/guides", label: d.nav.guides },
    { href: "/how-it-works", label: d.nav.howItWorks },
    { href: "/about", label: d.nav.about },
    { href: "/contact", label: d.nav.contact },
    { href: "/privacy", label: d.nav.privacy },
    { href: "/terms", label: d.nav.terms },
  ];
  return (
    <footer className="site-footer">
      <div className="inner">
        <nav>
          {links.map((l) => (
            <Link key={l.href} href={localeHref(locale, l.href)}>{l.label}</Link>
          ))}
        </nav>
        <p className="disc">{d.footerDisclaimer}</p>
      </div>
    </footer>
  );
}
