import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { Sources } from "@/components/Sources";
import { JsonLd, guideLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates, localeHref } from "@/lib/i18n/seo";
import { NASDAQ100_VS_SP500_EN } from "@/lib/content/pages/en";
import { NASDAQ100_VS_SP500_JA } from "@/lib/content/pages/ja";
import { NASDAQ100_VS_SP500_DE } from "@/lib/content/pages/de";

const KO = {
  metaTitle: "나스닥100 vs S&P 500",
  metaDescription: "나스닥100과 S&P 500의 편입 기준·중복 보유·업종 범위와 같은 조건으로 비교하는 법을 설명해요.",
  head: { title: "나스닥100 vs S&P 500", desc: "미국 대표 두 지수, 무엇이 다른가", crumb: "가이드 · 지수 비교" },
};
const LOCALES_DATA: Record<Locale, { metaTitle: string; metaDescription: string; head: { title: string; desc: string; crumb: string } }> = {
  ko: KO, en: NASDAQ100_VS_SP500_EN, ja: NASDAQ100_VS_SP500_JA, de: NASDAQ100_VS_SP500_DE,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in LOCALES_DATA ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  return { title: `${d.metaTitle} · 10-eok`, description: d.metaDescription, alternates: langAlternates(locale, "/guides/nasdaq100-vs-sp500") };
}

function KoBody() {
  return (
    <>
      <p>나스닥100과 S&amp;P 500은 모두 대형 기업의 영향을 많이 받지만 편입 기준이 달라요. QQQ는 나스닥100을, SPY·VOO는 S&amp;P 500을 따라가요. 어떤 ETF의 과거 평가액이 높았는지와 어떤 시장을 담는지는 나눠서 볼 필요가 있어요.</p>
      <h2>거래소 조건과 기업 범위가 달라요</h2>
      <p>나스닥100은 나스닥에 상장된 비금융 대형 기업을 대상으로 해요. 미국 기업 외의 기업도 포함할 수 있고, 금융업은 제외해요. 정보기술 외의 업종도 들어가므로 순수한 정보기술 업종 지수와는 달라요.</p>
      <p>S&amp;P 500은 미국 대형 기업을 대상으로 하며 금융을 포함한 여러 업종을 담아요. 나스닥 상장만으로 한정하지 않아요. 다만 미국 중소형주와 미국 외 시장까지 포괄하는 지수는 아니에요. 두 지수 모두 기업 수만으로 분산 정도를 설명할 수는 없어요.</p>
      <h2>비중과 보유 기업의 중복</h2>
      <p>두 지수 모두 시가총액을 바탕으로 비중을 정하되 각 지수의 조정 규칙을 적용해요. 따라서 기업 규모가 같아도 두 지수에서 차지하는 비중이 다를 수 있어요. 상위 기업과 업종 비중은 시점마다 바뀌어요.</p>
      <p>같은 대형 기업이 두 지수에 포함될 수 있어요. QQQ와 SPY를 함께 보유하면 완전히 다른 두 시장에 투자하는 것이 아니라 겹치는 기업의 비중을 조정하는 효과도 생겨요. ETF 수를 늘린 것과 중복 위험을 줄인 것은 같은 말이 아니에요.</p>
      <h2>업종 분산과 가격 변동</h2>
      <p>금융업 제외와 성장 기업 비중 차이 때문에 금리 변화·실적 전망·업종 순환이 두 지수에 다르게 작용할 수 있어요. 특정 성장 업종이 주도한 기간의 우위를 모든 시장 환경에 적용할 수는 없어요.</p>
      <p>업종 범위가 넓어도 시장 전체가 하락하면 함께 손실을 볼 수 있어요. 나스닥100이 모든 기간에 더 크게 움직이거나 S&amp;P 500이 언제나 손실을 덜 본다고 정해져 있지는 않아요. 변동성과 최대 하락 폭은 각각 기간을 명시한 자료로 확인해야 하는 수치예요.</p>
      <h2>대표 ETF의 상품 차이도 남아요</h2>
      <p>QQQ와 SPY는 지수 범위가 다르고, SPY와 VOO는 같은 지수를 구현하는 상품이에요. 지수 선택과 상품 선택을 구분하면 보수·거래 비용·추적 차이를 비교하기 쉬워요. 지수 이름이 같아도 실제 ETF의 가격 수익률은 완전히 일치하지 않을 수 있어요.</p>
      <p>원화로 미국 ETF를 적립하면 환율도 결과에 영향을 줘요. 받은 배당을 재투자했는지와 매수 일정도 맞춰야 해요. 별도로 계산한 각 ETF의 도달 기간은 시작월과 넣은 돈이 달라질 수 있어 지수 수익률 비교와는 달라요.</p>
      <h2>같은 조건 비교가 답하는 질문</h2>
      <p>10-eok 결과에서 ETF 비교를 열면 원래 계산의 기간·매수 일정·납입액을 고정해요. 이 조건에서 QQQ 대신 SPY를 샀다면 얼마였는지 볼 수 있어요. 자료가 비교 기간을 채우지 못하면 계산을 하지 않거나, 근거가 있는 추정 구간을 별도로 표시해요.</p>
      <p>나스닥100의 QLD·TQQQ는 하루 2배·3배 상품이어서 단순히 QQQ의 장기 수익률을 곱한 결과와 달라요. <Link href="/guides/leverage-etf-risk">레버리지 구조</Link>를 구분한 뒤 <Link href="/">계산기</Link>에서 과거 결과를 읽을 수 있어요.</p>
      <Sources ids={["yahoo", "fredFx"]} />
      <p>구조와 용어 참고: <a href="https://indexes.nasdaqomx.com/Index/overview/NDX" target="_blank" rel="noopener">Nasdaq 나스닥100 편입 범위</a>, <a href="https://www.spglobal.com/spdji/en/indices/equity/sp-500/" target="_blank" rel="noopener">S&amp;P DJI S&amp;P 500 지수 안내</a></p>
      <p className="note">과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </>
  );
}

const BODIES: Record<Locale, () => React.ReactElement> = { ko: KoBody, en: NASDAQ100_VS_SP500_EN.Body, ja: NASDAQ100_VS_SP500_JA.Body, de: NASDAQ100_VS_SP500_DE.Body };

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in BODIES ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  const Body = BODIES[locale];
  return (
    <ContentShell title={d.head.title} desc={d.head.desc} crumb={d.head.crumb}>
      <JsonLd data={guideLd({ lang: locale, dateModified: "2026-10-26", path: localeHref(locale, "/guides/nasdaq100-vs-sp500"), title: d.head.title, description: d.metaDescription, name: d.head.title })} />
      <Body />
    </ContentShell>
  );
}
