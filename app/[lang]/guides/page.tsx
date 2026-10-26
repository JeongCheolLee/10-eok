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

// 한국어에는 원화 환율·한국 과세 가이드도 포함해요.
const KO_GUIDES: Guide[] = [
  { slug: "etf-basics", t: "ETF가 뭔가요?", d: "지수형·액티브 구조, 비용과 분산의 한계를 설명해요." },
  { slug: "qld", t: "QLD란 무엇인가", d: "일일 2배 목표와 보유 기간 수익률의 차이를 짚어요." },
  { slug: "dca", t: "적립식 투자(DCA)의 원리", d: "매수 수량과 평균 단가를 계산하고 적립의 한계를 살펴봐요." },
  { slug: "dca-vs-lumpsum", t: "적립식 vs 거치식", d: "같은 예산의 가상 예시로 비교하고 대기 현금과 조건 차이를 짚어요." },
  { slug: "leverage-etf-risk", t: "레버리지 ETF의 위험", d: "일일 복리와 손실 회복률, 적립해도 남는 위험을 설명해요." },
  { slug: "fx-impact", t: "환율이 수익률에 미치는 영향", d: "매수·평가 환율과 원화 수익률을 가상 예시로 계산해요." },
  { slug: "overseas-tax", t: "해외주식·ETF 세금 기초", d: "상장 시장·기초자산별 과세와 계산기 세금 모형의 한계를 짚어요." },
  { slug: "compound-72", t: "복리와 72의 법칙", d: "고정 수익률의 암산법과 적립식에 그대로 적용할 수 없는 이유예요." },
  { slug: "nasdaq100-vs-sp500", t: "나스닥100 vs S&P 500", d: "편입 기준과 중복 보유, 같은 조건으로 비교하는 법을 설명해요." },
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
    etfCard: (label) => ({ t: `${label} 적립식 백테스트`, d: "상품별 구조와 위험, 과거 적립 결과를 함께 살펴봐요." }),
    note: "과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.",
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
