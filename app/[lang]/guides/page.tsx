import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, pageBreadcrumbLd } from "@/components/JsonLd";
import { tickerName, tickerCurrency } from "@/lib/tickers";
import type { Locale } from "@/lib/i18n/locales";
import { getMarket } from "@/lib/i18n/markets";
import { localeHref, langAlternates } from "@/lib/i18n/seo";
import { COMMON_GUIDES } from "@/lib/i18n/pages";
import { ETF_BASICS_EN, QLD_GUIDE_EN, DCA_EN, DCA_VS_LUMPSUM_EN, LEVERAGE_ETF_RISK_EN, COMPOUND_72_EN, NASDAQ100_VS_SP500_EN } from "@/lib/content/pages/en";
import { ETF_BASICS_JA, QLD_GUIDE_JA, DCA_JA, DCA_VS_LUMPSUM_JA, LEVERAGE_ETF_RISK_JA, COMPOUND_72_JA, NASDAQ100_VS_SP500_JA } from "@/lib/content/pages/ja";
import { ETF_BASICS_DE, QLD_GUIDE_DE, DCA_DE, DCA_VS_LUMPSUM_DE, LEVERAGE_ETF_RISK_DE, COMPOUND_72_DE, NASDAQ100_VS_SP500_DE } from "@/lib/content/pages/de";

type Guide = { slug: string; t: string; d: string };
type GuideContent = { head: { title: string }; metaDescription: string };

// 비-ko 가이드 카드는 각 가이드 콘텐츠의 head.title + metaDescription 재사용(새 번역 없음).
const GUIDE_CONTENT: Record<Exclude<Locale, "ko">, Record<string, GuideContent>> = {
  en: { "etf-basics": ETF_BASICS_EN, qld: QLD_GUIDE_EN, dca: DCA_EN, "dca-vs-lumpsum": DCA_VS_LUMPSUM_EN, "leverage-etf-risk": LEVERAGE_ETF_RISK_EN, "compound-72": COMPOUND_72_EN, "nasdaq100-vs-sp500": NASDAQ100_VS_SP500_EN },
  ja: { "etf-basics": ETF_BASICS_JA, qld: QLD_GUIDE_JA, dca: DCA_JA, "dca-vs-lumpsum": DCA_VS_LUMPSUM_JA, "leverage-etf-risk": LEVERAGE_ETF_RISK_JA, "compound-72": COMPOUND_72_JA, "nasdaq100-vs-sp500": NASDAQ100_VS_SP500_JA },
  de: { "etf-basics": ETF_BASICS_DE, qld: QLD_GUIDE_DE, dca: DCA_DE, "dca-vs-lumpsum": DCA_VS_LUMPSUM_DE, "leverage-etf-risk": LEVERAGE_ETF_RISK_DE, "compound-72": COMPOUND_72_DE, "nasdaq100-vs-sp500": NASDAQ100_VS_SP500_DE },
};

// ko는 기존 9종(ko 전용 가이드 포함) 하드코딩 배열 그대로 — 카드 문구 바이트 불변.
const KO_GUIDES: Guide[] = [
  { slug: "etf-basics", t: "ETF가 뭔가요? (초보자)", d: "상장지수펀드의 개념과 개별주식·펀드와의 차이를 처음부터 쉽게." },
  { slug: "qld", t: "QLD란 무엇인가", d: "나스닥100을 하루 2배로 추종하는 레버리지 ETF, QLD를 기초부터 정리합니다." },
  { slug: "dca", t: "적립식 투자(DCA)의 원리", d: "매달 일정 금액을 꾸준히 사는 방식이 왜 마음 편한 투자인지 설명합니다." },
  { slug: "dca-vs-lumpsum", t: "적립식 vs 거치식", d: "한 번에 넣을까 나눠 넣을까 — 둘의 차이와 상황별 선택 기준." },
  { slug: "leverage-etf-risk", t: "레버리지 ETF의 위험", d: "2배의 수익만큼 2배의 손실, 그리고 '변동성 끌림'이라는 숨은 함정." },
  { slug: "fx-impact", t: "환율이 수익률에 미치는 영향", d: "원화로 달러 자산을 살 때, 환율이 어떻게 수익을 더하거나 깎는지." },
  { slug: "overseas-tax", t: "해외주식·ETF 세금 기초", d: "양도소득세·배당소득세와 국내 상장 종목과의 차이." },
  { slug: "compound-72", t: "복리와 72의 법칙", d: "돈이 돈을 버는 복리의 원리와, 두 배 되는 기간을 암산하는 법." },
  { slug: "nasdaq100-vs-sp500", t: "나스닥100 vs S&P 500", d: "QQQ와 SPY, 구성·성격·변동성이 어떻게 다른지 비교." },
];

type Copy = {
  metaTitle: string;
  metaDescription: string;
  head: { title: string; desc: string; crumb: string };
  etfSection: string;
  etfCard: (label: string) => { t: string; d: string };
  note: string;
};
const COPY: Record<Locale, Copy> = {
  ko: {
    metaTitle: "투자 가이드 · 10-eok",
    metaDescription: "QLD, 적립식 투자, 레버리지 ETF의 위험, 환율이 수익률에 미치는 영향을 쉽게 정리했어요.",
    head: { title: "투자 가이드", desc: "10-eok의 백테스트를 더 잘 이해하기 위한 배경 지식이에요.", crumb: "가이드" },
    etfSection: "종목별 적립식 백테스트",
    etfCard: (label) => ({ t: `${label} 적립식 백테스트`, d: "매달 100만원씩 모았다면 10억까지 얼마나 — 실제 과거 데이터로." }),
    note: "이 글들은 일반적인 정보 제공을 위한 것이며 투자 권유나 자문이 아닙니다.",
  },
  en: {
    metaTitle: "Investing guides · 10-eok",
    metaDescription: "Clear explainers on ETFs, dollar-cost averaging, leveraged ETF risk, compound interest, and the Nasdaq-100 vs. S&P 500.",
    head: { title: "Investing guides", desc: "Background to get more out of 10-eok's backtests.", crumb: "Guides" },
    etfSection: "DCA backtests by ETF",
    etfCard: (label) => ({ t: `${label} DCA backtest`, d: "How long to $1M investing $700/month — from real historical data." }),
    note: "These articles are for general information only, not investment advice or a solicitation.",
  },
  ja: {
    metaTitle: "投資ガイド · 10-eok",
    metaDescription: "ETF・積立投資(DCA)・レバレッジETFのリスク・複利・ナスダック100 vs S&P 500 をやさしく整理。",
    head: { title: "投資ガイド", desc: "10-eokのバックテストをより深く理解するための背景知識。", crumb: "ガイド" },
    etfSection: "銘柄別の積立バックテスト",
    etfCard: (label) => ({ t: `${label} 積立バックテスト`, d: "毎月10万円で1億円まで何年 — 実際の過去データで。" }),
    note: "これらの記事は一般的な情報提供のためのものであり、投資勧誘や助言ではありません。",
  },
  de: {
    metaTitle: "Investment-Guides · 10-eok",
    metaDescription: "Verständliche Erklärungen zu ETFs, Sparplänen (DCA), Hebel-ETF-Risiko, Zinseszins und Nasdaq 100 vs. S&P 500.",
    head: { title: "Investment-Guides", desc: "Hintergrundwissen, um mehr aus den Backtests von 10-eok herauszuholen.", crumb: "Guides" },
    etfSection: "Sparplan-Backtests nach ETF",
    etfCard: (label) => ({ t: `${label} Sparplan-Backtest`, d: "Wie lange bis 1 Mio. € bei 600 €/Monat — mit echten historischen Daten." }),
    note: "Diese Artikel dienen der allgemeinen Information und sind keine Anlageberatung oder Empfehlung.",
  },
};

function guidesFor(locale: Locale): Guide[] {
  if (locale === "ko") return KO_GUIDES;
  const m = GUIDE_CONTENT[locale as Exclude<Locale, "ko">];
  return COMMON_GUIDES.map((slug) => ({ slug, t: m[slug].head.title, d: m[slug].metaDescription }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in COPY ? (lang as Locale) : "ko";
  const c = COPY[locale];
  return { title: c.metaTitle, description: c.metaDescription, alternates: langAlternates(locale, "/guides") };
}

export default async function GuidesIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in COPY ? (lang as Locale) : "ko";
  const c = COPY[locale];
  const guides = guidesFor(locale);
  const tickers = getMarket(locale).tickers;
  return (
    <ContentShell title={c.head.title} desc={c.head.desc} crumb={c.head.crumb}>
      <JsonLd data={pageBreadcrumbLd(c.head.crumb, "/guides")} />
      <div className="cardlinks">
        {guides.map((g) => (
          <Link key={g.slug} href={localeHref(locale, `/guides/${g.slug}`)} className="cardlink">
            <div className="t">{g.t}</div>
            <div className="d">{g.d}</div>
          </Link>
        ))}
      </div>

      <h2>{c.etfSection}</h2>
      <div className="cardlinks">
        {tickers.map((sym) => {
          const label = tickerCurrency(sym) === "KRW" ? tickerName(sym) : sym;
          const card = c.etfCard(label);
          return (
            <Link key={sym} href={localeHref(locale, `/etf/${sym.toLowerCase()}`)} className="cardlink">
              <div className="t">{card.t}</div>
              <div className="d">{card.d}</div>
            </Link>
          );
        })}
      </div>

      <p className="note">{c.note}</p>
    </ContentShell>
  );
}
