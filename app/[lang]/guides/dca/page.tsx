import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { Sources } from "@/components/Sources";
import { JsonLd, guideLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates, localeHref } from "@/lib/i18n/seo";
import { DCA_EN } from "@/lib/content/pages/en";
import { DCA_JA } from "@/lib/content/pages/ja";
import { DCA_DE } from "@/lib/content/pages/de";

const KO = {
  metaTitle: "적립식 투자(DCA)의 원리",
  metaDescription: "정액 적립의 수량·평균 단가를 가상 예시로 계산하고, 손실과 레버리지 위험이 남는 이유를 설명해요.",
  head: { title: "적립식 투자(DCA)의 원리", desc: "매달 같은 금액을 꾸준히", crumb: "가이드 · 적립식" },
};
const LOCALES_DATA: Record<Locale, { metaTitle: string; metaDescription: string; head: { title: string; desc: string; crumb: string } }> = {
  ko: KO, en: DCA_EN, ja: DCA_JA, de: DCA_DE,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in LOCALES_DATA ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  return {
    title: `${d.metaTitle} · 10-eok`,
    description: d.metaDescription,
    alternates: langAlternates(locale, "/guides/dca"),
  };
}

function KoBody() {
  return (
    <>
      <p>적립식 투자는 정해진 일정에 같은 금액을 나눠 투자하는 방식이에요. 영어로 Dollar-Cost Averaging, 줄여서 DCA라고 불러요. 같은 수량을 사는 방식과 달리 가격이 낮을 때 더 많은 수량을, 높을 때 적은 수량을 사게 돼요.</p>
      <h2>평균 매입단가는 어떻게 달라지나요?</h2>
      <p>거래 비용과 세금을 제외한 가상 예시예요. 세 달 동안 매달 10만원씩 사고, 주가가 1만원 → 5,000원 → 1만원으로 움직였다고 볼게요.</p>
      <ul><li>첫 달에는 10주를 사요.</li><li>둘째 달에는 20주를 사요.</li><li>셋째 달에는 10주를 사요.</li></ul>
      <p>넣은 돈 30만원으로 40주를 사서 평균 매입단가는 7,500원이에요. 세 가격의 단순 평균인 약 8,333원보다 낮아요. 낮은 가격에서 더 많은 수량을 샀기 때문이에요. 세 번째 매수 직후 주가가 1만원이면 평가액은 40만원이에요. 이후 추가 매수 없이 주가가 5,000원으로 내리면 20만원이 돼요. 낮아진 평균 단가가 수익을 보장하지 않는다는 점도 같은 예시에서 볼 수 있어요.</p>
      <h2>매수 시점을 나눠도 보유 자산은 함께 움직여요</h2>
      <p>정액 매수 규칙은 매번 저점이나 고점을 예측해야 하는 결정을 줄여요. 하지만 어떤 자산을 살지, 얼마를 넣을지, 언제 자금이 필요할지까지 대신 결정하지는 않아요. 자동 주문이 있어도 잔액과 주문 조건에 따라 실제 매수 여부는 달라질 수 있어요.</p>
      <p>적립을 오래 해 이미 쌓인 자산이 커지면 새로 넣는 돈보다 기존 자산의 가격 변화가 결과에 더 큰 영향을 줄 수 있어요. 한 달 적립액을 유지하더라도 큰 하락이 그동안의 납입액을 밑도는 평가액으로 이어질 수 있어요.</p>
      <h2>변동성이 크면 적립식에 더 유리한가요?</h2>
      <p>가격이 하락한 뒤 회복한 예시에서는 낮은 가격에서 산 수량이 회복에 기여해요. 그러나 가격이 계속 하락하거나 회복 전에 돈을 써야 하면 결론이 달라져요. 변동성이 크다는 사실만으로 정액 매수의 수익이 높아지는 것은 아니에요.</p>
      <p>QLD·TQQQ 같은 상품은 적립해도 일일 배율 조정과 큰 가격 변동이 그대로 남아요. 매수 시점 분산은 레버리지 노출을 낮추는 장치가 아니에요. <Link href="/guides/leverage-etf-risk">레버리지 ETF의 위험</Link>에서 수치 예시로 구분해 볼 수 있어요.</p>
      <h2>월급 적립과 목돈 분할은 다른 비교예요</h2>
      <p>매달 소득이 생겨 투자하는 경우에는 미래 소득을 첫날에 모두 투자할 수 없어요. 이미 가진 목돈을 나눠 넣는 경우에는 아직 투자하지 않은 현금이 남아요. 이 둘을 구분해야 적립식과 <Link href="/guides/dca-vs-lumpsum">거치식의 차이</Link>를 공정하게 비교할 수 있어요.</p>
      <p>상승 구간에서는 일찍 투입한 돈이 더 오래 상승에 참여할 수 있고, 초기 하락 구간에서는 나중에 투입한 돈이 낮은 가격에 살 수 있어요. 어느 방식이 앞서는지는 가격 흐름과 대기 자금의 수익, 비용에 따라 달라져요.</p>
      <h2>10-eok의 적립 결과를 읽는 방법</h2>
      <p>계산기에서는 매달·매주·거래일마다 사는 일정과 처음 넣을 목돈을 설정해요. 기본 결과는 실제 거래 자료의 마지막 날까지 한 번이라도 목표를 넘은 가장 최근 시작월을 찾고, 그 시작월부터 첫 도달일까지의 기간을 보여줘요. 가능한 모든 시작월 중 가장 짧은 기간이라는 뜻은 아니에요.</p>
      <p>첫 도달 뒤 계속 샀을 때의 마지막 평가액은 별도로 표시해요. ETF 비교에서는 원래 계산의 기간·일정·납입액을 고정해요. 시작월과 종료일은 <Link href="/">계산기</Link> 결과의 계산 기준에서 확인할 수 있어요.</p>
      <Sources ids={["yahoo", "fredFx"]} />
      <p>구조와 용어 참고: <a href="https://www.investor.gov/introduction-investing/investing-basics/glossary/dollar-cost-averaging" target="_blank" rel="noopener">SEC 정액 적립 정의</a></p>
      <p className="note">과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </>
  );
}

const BODIES: Record<Locale, () => React.ReactElement> = { ko: KoBody, en: DCA_EN.Body, ja: DCA_JA.Body, de: DCA_DE.Body };

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in BODIES ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  const Body = BODIES[locale];
  return (
    <ContentShell title={d.head.title} desc={d.head.desc} crumb={d.head.crumb}>
      <JsonLd data={guideLd({ lang: locale, dateModified: "2026-10-26", path: localeHref(locale, "/guides/dca"), title: d.head.title, description: d.metaDescription, name: d.head.title })} />
      <Body />
    </ContentShell>
  );
}
