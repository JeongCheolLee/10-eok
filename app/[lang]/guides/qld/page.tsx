import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { Sources } from "@/components/Sources";
import { JsonLd, guideLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates, localeHref } from "@/lib/i18n/seo";
import { QLD_GUIDE_EN } from "@/lib/content/pages/en";
import { QLD_GUIDE_JA } from "@/lib/content/pages/ja";
import { QLD_GUIDE_DE } from "@/lib/content/pages/de";

const KO = {
  metaTitle: "QLD란 무엇인가",
  metaDescription: "나스닥100 일일 2배 목표와 보유 기간 수익률의 차이, 적립해도 남는 위험을 설명해요.",
  head: { title: "QLD란 무엇인가", desc: "나스닥100을 하루 2배로 추종하는 레버리지 ETF", crumb: "가이드 · QLD" },
};
const LOCALES_DATA: Record<Locale, { metaTitle: string; metaDescription: string; head: { title: string; desc: string; crumb: string } }> = {
  ko: KO, en: QLD_GUIDE_EN, ja: QLD_GUIDE_JA, de: QLD_GUIDE_DE,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in LOCALES_DATA ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  return { title: `${d.metaTitle} · 10-eok`, description: d.metaDescription, alternates: langAlternates(locale, "/guides/qld") };
}

function KoBody() {
  return (
    <>
      <p>QLD는 ProShares Ultra QQQ의 티커예요. 나스닥100 지수의 하루 수익률을 비용 차감 전 기준 2배 따라가는 것을 목표로 해요. 여러 달 뒤 지수 수익률의 2배를 지급하는 계약은 아니에요. 이 차이가 QQQ와 QLD를 구분하는 출발점이에요.</p>
      <h2>어떤 지수에 노출되나요?</h2>
      <p>나스닥100은 나스닥에 상장된 비금융 대형 기업으로 구성돼요. 미국 기업만으로 한정된 전체 시장 지수가 아니며, 정보기술 업종 이외 기업도 들어갈 수 있어요. 금융업을 포함한 미국 대형주를 담는 S&amp;P 500과는 편입 규칙이 달라요.</p>
      <p>QLD는 이 지수 노출을 확대하기 위해 주식과 스왑 등 파생상품을 활용해요. 기업 하나에 집중하는 위험은 나뉘어도 지수 전체의 하락은 증폭돼요. 파생상품 거래 상대방과 자금 조달·운용 비용도 상품 구조의 일부예요.</p>
      <h2>왜 하루 2배가 한 달 2배는 아닌가요?</h2>
      <p>운용사는 자산과 지수 움직임에 맞춰 일일 노출을 다시 조정해요. 하루마다 달라진 평가액에 다음 날 수익률이 곱해지므로 보유 기간 수익률은 각 날의 움직임에 따라 달라져요. 아래는 비용·추적 오차를 제외한 가상 계산이에요.</p>
      <ul><li>지수 +10%, −10%: 100 → 110 → 99로 −1%예요.</li><li>일일 2배 상품 +20%, −20%: 100 → 120 → 96으로 −4%예요.</li><li>지수 +10%, +10%: 누적 +21%예요. 일일 2배 상품은 +44%로, 단순 2배인 +42%보다 높아요.</li></ul>
      <p>일일 복리는 한 방향 상승에서 단순 배수보다 높은 결과를 만들 수도 있고, 등락을 반복하면 불리하게 작용할 수도 있어요. 변동성에 따른 복리 효과는 1배 자산에도 있지만 레버리지로 확대돼요. 이런 효과를 QLD에만 생기는 비용처럼 이해하면 정확하지 않아요.</p>
      <h2>큰 손실 뒤에는 더 큰 회복이 필요해요</h2>
      <p>50% 손실을 본 자산은 100% 올라야 이전 금액으로 돌아와요. 이는 QLD에만 해당하는 계산은 아니지만 레버리지가 손실을 확대하면 회복에 필요한 상승률도 커져요. 지수가 이전 고점으로 돌아왔다고 QLD도 반드시 함께 회복하는 것은 아니에요.</p>
      <p>매일 목표 배율을 맞추는 것과 투자자가 보유 기간에 원하는 수익률을 얻는 것은 다른 문제예요. 운용사의 일일 목표 자체도 비용과 추적 오차를 반영하기 전 기준이에요. 실제 거래 결과는 목표와 차이가 날 수 있어요.</p>
      <h2>적립하면 무엇이 바뀌고 무엇이 남나요?</h2>
      <p>정액 적립은 낮은 가격에 더 많은 수량을 사게 해요. 그러나 이미 보유한 QLD의 일일 노출이나 파생상품 구조를 바꾸지는 않아요. 하락이 이어지면 새로 산 수량에도 손실이 나며, 추가로 넣은 돈 때문에 평가액이 늘어나는 것과 투자 수익을 구분해야 해요.</p>
      <p>자세한 수치 비교와 손실 구조는 <Link href="/guides/leverage-etf-risk">레버리지 ETF의 위험</Link>에서 볼 수 있어요. 적립 자체를 레버리지 위험을 낮추는 장치로 볼 수는 없어요.</p>
      <h2>과거 도달 기간과 같은 기간 비교</h2>
      <p>계산기는 실제 거래 이력에서 한 번이라도 목표를 넘긴 가장 최근 시작월을 선택해요. 표시된 기간은 그때부터 첫 도달일까지이며 가능한 모든 시작월 중 최단 기간은 아니에요. 첫 도달 이후의 마지막 평가액은 별도로 보여줘요.</p>
      <p>QQQ와의 차이를 보려면 결과에서 같은 기간·일정·납입액을 쓰는 ETF 비교를 열 수 있어요. 각 종목을 따로 계산한 도달 기간은 시작월이 달라질 수 있어요. <Link href="/">계산기</Link>의 결과를 미래 도달 일정이나 QLD의 적합성 판정으로 읽지는 않아야 해요.</p>
      <Sources ids={["prosharesQld", "yahoo", "fredFx"]} />
      <p className="note">과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </>
  );
}

const BODIES: Record<Locale, () => React.ReactElement> = { ko: KoBody, en: QLD_GUIDE_EN.Body, ja: QLD_GUIDE_JA.Body, de: QLD_GUIDE_DE.Body };

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in BODIES ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  const Body = BODIES[locale];
  return (
    <ContentShell title={d.head.title} desc={d.head.desc} crumb={d.head.crumb}>
      <JsonLd data={guideLd({ lang: locale, dateModified: "2026-10-26", path: localeHref(locale, "/guides/qld"), title: d.head.title, description: d.metaDescription, name: d.head.title })} />
      <Body />
    </ContentShell>
  );
}
