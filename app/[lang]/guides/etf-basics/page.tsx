import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { Sources } from "@/components/Sources";
import { JsonLd, guideLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates, localeHref } from "@/lib/i18n/seo";
import { ETF_BASICS_EN } from "@/lib/content/pages/en";
import { ETF_BASICS_JA } from "@/lib/content/pages/ja";
import { ETF_BASICS_DE } from "@/lib/content/pages/de";

const KO = {
  metaTitle: "ETF가 뭔가요?",
  metaDescription: "ETF의 구조와 지수형·액티브 차이, 운용보수 외 비용과 분산의 한계를 설명해요.",
  head: { title: "ETF가 뭔가요?", desc: "주식처럼 사고파는 '여러 종목 한 바구니', ETF를 처음부터 이해하기", crumb: "가이드 · ETF 기초" },
};
const LOCALES_DATA: Record<Locale, { metaTitle: string; metaDescription: string; head: { title: string; desc: string; crumb: string } }> = {
  ko: KO, en: ETF_BASICS_EN, ja: ETF_BASICS_JA, de: ETF_BASICS_DE,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in LOCALES_DATA ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  return { title: `${d.metaTitle} · 10-eok`, description: d.metaDescription, alternates: langAlternates(locale, "/guides/etf-basics") };
}

function KoBody() {
  return (
    <>
      <p>ETF는 거래소에서 주식처럼 사고파는 펀드예요. 한 주 안에 담긴 자산과 운용 규칙에 따라 위험과 수익 구조가 달라져요. ETF라는 이름만으로 시장 전체에 분산하거나 지수를 1배로 따라간다고 볼 수는 없어요.</p>
      <h2>주식을 직접 사는 것과 무엇이 다른가요?</h2>
      <p>개별 주식을 사면 그 기업의 이익과 위험에 직접 노출돼요. ETF를 사면 펀드가 보유한 자산의 묶음에 투자해요. 기업 하나가 부진한 영향을 다른 보유 자산이 일부 상쇄할 수 있지만, 자산들이 함께 하락하면 ETF도 손실을 볼 수 있어요.</p>
      <p>예를 들어 SPY는 미국 대형주, SOXX는 반도체 업종, TLT는 장기 미국 국채에 노출돼요. 모두 ETF여도 비교해야 할 위험은 달라요. 담긴 종목 수가 많다는 사실보다 국가·업종·상위 자산 비중이 중요할 수 있어요.</p>
      <h2>지수형과 액티브 ETF를 구분해요</h2>
      <p>지수형 ETF는 정해진 기준 지수와 비슷한 성과를 목표로 해요. S&amp;P 500처럼 편입 기준과 비중 산정 규칙이 있는 지수를 따라가요. 모든 자산을 같은 비중으로 담는 것은 아니며, 현물을 보유하거나 일부 표본·파생상품을 이용하는 등 구현 방식도 다를 수 있어요.</p>
      <p>액티브 ETF는 운용사의 종목 선택과 거래 판단을 활용해요. JEPI·JEPQ처럼 옵션 전략을 함께 쓰는 상품도 있어요. 레버리지 ETF는 하루 수익률의 배수를 목표로 하므로, 여러 날 수익률까지 같은 배수를 따르지는 않아요. 자세한 차이는 <Link href="/guides/leverage-etf-risk">레버리지 ETF의 위험</Link>에서 볼 수 있어요.</p>
      <h2>운용보수 외에도 비용이 있어요</h2>
      <p>운용보수는 펀드 자산에서 차감돼 가격에 반영돼요. 보수율·총비용 지표는 포함하는 비용 범위가 다를 수 있어 상품 설명서의 정의를 확인할 필요가 있어요. 가상으로 자산이 1,000만원에서 일정하고 연 비용이 0.1%라면 1년 비용은 1만원이에요. 실제 비용은 변하는 자산 규모와 보유 기간에 따라 달라져요.</p>
      <p>투자자에게는 거래 수수료·환전 비용·매수와 매도 호가의 차이도 생겨요. 같은 지수를 따르는 상품의 보수가 낮아도 거래 가격과 세금이 다르면 최종 결과는 달라질 수 있어요. 이 사이트는 펀드 가격에 반영된 비용을 다시 차감하지 않으며, 투자자별 거래·환전 수수료를 재현하지 않아요.</p>
      <h2>시장 가격과 자산 가치는 다를 수 있어요</h2>
      <p>순자산가치는 펀드 자산에서 부채 등을 뺀 가치를 주당으로 나눈 값이에요. 거래소에서 사고파는 시장 가격과의 차이를 괴리라고 해요. 기초 시장의 휴장이나 가격 산정 시차, 수급 변화가 있을 때 차이가 커질 수 있어요.</p>
      <p>거래량만으로 거래 비용을 단정할 수도 없어요. 기초자산의 유동성과 호가 공급 조건도 영향을 줘요. 지수와의 수익률 차이는 추적 차이, 그 차이의 변동 정도는 추적 오차로 구분해요. 비용·분배금 처리·표본 구성 등이 원인이 될 수 있어요.</p>
      <h2>계산 결과에 들어가는 조건</h2>
      <p>10-eok은 선택한 ETF의 과거 가격과 해당 시장의 환율로 정액 매수를 계산해요. 매달·매주·거래일마다 사는 일정과 처음 넣는 목돈을 설정할 수 있어요. 정액 매수에서 같은 돈으로 사는 수량은 매수일마다 달라져요.</p>
      <p>ETF 설명은 상품 구조를, <Link href="/">계산기</Link>는 입력 조건의 과거 결과를 보여줘요. 높은 과거 평가액만으로 상품이 더 안전하거나 개인의 목적에 더 맞는다고 판단할 수는 없어요.</p>
      <Sources ids={["yahoo", "fredFx"]} />
      <p>구조와 용어 참고: <a href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24" target="_blank" rel="noopener">SEC ETF 구조·거래 비용 안내</a></p>
      <p className="note">과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </>
  );
}

const BODIES: Record<Locale, () => React.ReactElement> = { ko: KoBody, en: ETF_BASICS_EN.Body, ja: ETF_BASICS_JA.Body, de: ETF_BASICS_DE.Body };

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in BODIES ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  const Body = BODIES[locale];
  return (
    <ContentShell title={d.head.title} desc={d.head.desc} crumb={d.head.crumb}>
      <JsonLd data={guideLd({ lang: locale, dateModified: "2026-10-26", path: localeHref(locale, "/guides/etf-basics"), title: d.head.title, description: d.metaDescription, name: d.head.title })} />
      <Body />
    </ContentShell>
  );
}
