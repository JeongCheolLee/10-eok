import Link from "next/link";
import { AppLogo } from "@/components/AppLogo";

// 전 페이지 공통 상단 네비게이션. 홈(계산기)에서도 가이드·계산방법·소개로 가는
// 크롤 가능한 내부 링크 경로를 제공한다. (이전에는 footer 한 곳에만 nav가 있었음)
const LINKS = [
  { href: "/compare", label: "종목 비교" },
  { href: "/guides", label: "투자 가이드" },
  { href: "/how-it-works", label: "계산 방법" },
  { href: "/about", label: "소개" },
  { href: "/contact", label: "문의" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="inner">
        <Link href="/" className="brand-link" aria-label="10-eok 홈">
          <AppLogo />
          <span>10-eok</span>
        </Link>
        <nav aria-label="사이트 메뉴">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
