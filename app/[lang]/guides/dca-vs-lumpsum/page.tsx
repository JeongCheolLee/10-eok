import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { Sources } from "@/components/Sources";
import { JsonLd, guideLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates, localeHref } from "@/lib/i18n/seo";
import { DCA_VS_LUMPSUM_EN } from "@/lib/content/pages/en";
import { DCA_VS_LUMPSUM_JA } from "@/lib/content/pages/ja";
import { DCA_VS_LUMPSUM_DE } from "@/lib/content/pages/de";

const KO = {
  metaTitle: "적립식 vs 거치식",
  metaDescription: "같은 예산의 가상 예시로 적립식과 거치식을 비교하고 대기 현금과 계산 조건의 차이를 짚어요.",
  head: { title: "적립식 vs 거치식", desc: "한 번에 넣을까, 나눠 넣을까", crumb: "가이드 · 적립 vs 거치" },
};
const LOCALES_DATA: Record<Locale, { metaTitle: string; metaDescription: string; head: { title: string; desc: string; crumb: string } }> = {
  ko: KO, en: DCA_VS_LUMPSUM_EN, ja: DCA_VS_LUMPSUM_JA, de: DCA_VS_LUMPSUM_DE,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in LOCALES_DATA ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  return { title: `${d.metaTitle} · 10-eok`, description: d.metaDescription, alternates: langAlternates(locale, "/guides/dca-vs-lumpsum") };
}

function KoBody() {
  return (
    <>
      <p>거치식은 가진 목돈을 한 번에 투자하고, 적립식은 돈을 여러 시점에 나눠 투자해요. 두 방식을 비교하려면 먼저 같은 날 같은 돈을 갖고 있었는지 확인해야 해요. 매달 새로 생긴 소득을 투자한 결과와 이미 있던 목돈을 첫날 투자한 결과는 출발 조건이 달라요.</p>
      <h2>먼저 같은 예산으로 비교해요</h2>
      <p>아래는 비용과 현금 이자를 제외한 가상 예시예요. 첫날에 30만원이 있고, 세 달 동안 주가가 1만원 → 5,000원 → 1만원으로 움직였다고 볼게요.</p>
      <ul><li>거치식: 첫날 30주를 사요. 마지막 평가액은 30만원이에요.</li><li>분할 매수: 매달 10만원으로 10주·20주·10주를 사요. 마지막 40주의 평가액은 40만원이에요.</li></ul>
      <p>중간에 크게 하락했다가 돌아왔기 때문에 이 경로에서는 나눠 산 결과가 높아요. 반대로 주가가 1만원 → 1만2,000원 → 1만5,000원으로 올랐다면 첫날 30주의 평가액은 45만원이에요. 매달 10만원씩 산 수량은 25주여서 37만5,000원이 돼요. 같은 예산이어도 가격 경로에 따라 우위가 바뀌어요.</p>
      <h2>대기 현금도 비교의 일부예요</h2>
      <p>목돈을 나눠 넣으면 아직 투자하지 않은 현금이 남아요. 현금에서 이자를 받았다면 전체 결과에 포함해야 해요. 반대로 거래 횟수가 늘면서 비용이 늘어날 수도 있어요. ETF 평가액만 비교하면 이 부분을 놓칠 수 있어요.</p>
      <p>전액을 처음 넣으면 가격 상승에 참여하는 금액도 크지만, 직후 하락에 노출되는 금액도 커요. 나눠 넣으면 초반 노출은 적어져도 이후 매수가 끝난 자산은 같은 시장 위험을 받아요. 투자 완료 뒤에도 영구적으로 손실이 줄어드는 구조는 아니에요.</p>
      <h2>매달 소득이 생기는 경우</h2>
      <p>매달 10만원의 새 소득이 생긴다면 첫날 30만원 투자와 비교하는 것은 동일 예산 비교가 아니에요. 목돈을 먼저 빌려 투자한다면 차입 비용과 상환 위험이라는 별도 조건이 생겨요. 이 글의 가상 비교는 차입을 포함하지 않아요.</p>
      <p>매달 투자하는 규칙은 반복 결정을 줄이는 데 도움이 될 수 있어요. 다만 심리적 부담과 실제 손실은 같은 개념이 아니에요. 규칙을 지킨 경우에도 자산 가격이 계속 내리면 손실은 커질 수 있어요.</p>
      <h2>10-eok에서 목돈 조건을 볼 때</h2>
      <p>계산기의 처음 넣는 목돈은 계산 시작 시점에 한 번 투입한 금액이에요. 지금까지의 계좌 잔고나 기존 보유 수량을 뜻하지 않아요. 정기 납입액에 목돈을 더한 조건으로 과거 결과를 계산해요.</p>
      <p>목돈과 납입액을 바꿔 새 계산을 하면 목표에 도달한 가장 최근 시작월도 바뀔 수 있어요. 그러므로 별도로 계산한 두 도달 기간은 같은 기간의 거치식·적립식 실험이 아니에요. 이 사이트는 대기 현금 이자까지 합친 동일 예산의 두 전략 비교를 별도 제공하지 않아요.</p>
      <h2>종목 차이를 보려면 기간을 고정해요</h2>
      <p>결과에서 여는 ETF 비교는 원래 기간과 매수 일정, 넣은 돈을 고정해요. 이 비교가 답하는 질문은 같은 조건에서 다른 ETF였다면 얼마였는지예요. 어떤 매수 방식이 미래에 더 유리한지를 정하는 결과는 아니에요.</p>
      <p>매수 시점별 수량이 달라지는 원리는 <Link href="/guides/dca">적립식 투자</Link>, 입력 조건의 과거 결과는 <Link href="/">계산기</Link>에서 이어서 볼 수 있어요.</p>
      <p>구조와 용어 참고: <a href="https://syndication.finra.org/content/benefits-and-limitations-dollar-cost-averaging" target="_blank" rel="noopener">FINRA 정액 적립의 장점과 한계</a></p>
      <p className="note">과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </>
  );
}

const BODIES: Record<Locale, () => React.ReactElement> = { ko: KoBody, en: DCA_VS_LUMPSUM_EN.Body, ja: DCA_VS_LUMPSUM_JA.Body, de: DCA_VS_LUMPSUM_DE.Body };

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in BODIES ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  const Body = BODIES[locale];
  return (
    <ContentShell title={d.head.title} desc={d.head.desc} crumb={d.head.crumb}>
      <JsonLd data={guideLd({ lang: locale, dateModified: "2026-10-26", path: localeHref(locale, "/guides/dca-vs-lumpsum"), title: d.head.title, description: d.metaDescription, name: d.head.title })} />
      <Body />
    </ContentShell>
  );
}
