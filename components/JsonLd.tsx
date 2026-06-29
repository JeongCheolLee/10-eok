import { SITE_URL, AUTHOR, LAST_UPDATED } from "@/lib/site";

// schema.org JSON-LD 를 <script> 로 렌더. 서버 컴포넌트에서 사용.
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

const ORG = { "@type": "Organization", name: "10-eok", url: SITE_URL };
// YMYL(금융) 신뢰 신호: 글의 author 는 실명 개인. 운영 주체(publisher)는 Organization 유지.
const PERSON = { "@type": "Person", name: AUTHOR, url: `${SITE_URL}/about` };

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "10-eok",
    url: SITE_URL,
    inLanguage: "ko",
  };
}

export function softwareAppLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "10-eok",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "ko",
    description:
      "과거에 매달 일정 금액을 ETF에 투자했다면 10억까지 얼마나 걸렸을지 실제 가격과 환율로 계산하는 백테스트 서비스.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  };
}

function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function faqLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// 가이드용: Article + BreadcrumbList 를 한 그래프로.
export function guideLd({ path, title, description, name, dateModified = LAST_UPDATED }: { path: string; title: string; description: string; name: string; dateModified?: string }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description,
        inLanguage: "ko",
        mainEntityOfPage: `${SITE_URL}${path}`,
        author: PERSON,
        publisher: ORG,
        dateModified,
      },
      breadcrumbLd([
        { name: "홈", path: "/" },
        { name: "가이드", path: "/guides" },
        { name, path },
      ]),
    ],
  };
}

// 일반 페이지용 BreadcrumbList (홈 › 현재)
export function pageBreadcrumbLd(name: string, path: string) {
  return { "@context": "https://schema.org", ...breadcrumbLd([{ name: "홈", path: "/" }, { name, path }]) };
}

// 범용 Article
export function articleLd({ path, title, description, dateModified = LAST_UPDATED }: { path: string; title: string; description: string; dateModified?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "ko",
    mainEntityOfPage: `${SITE_URL}${path}`,
    author: PERSON,
    publisher: ORG,
    dateModified,
  };
}
