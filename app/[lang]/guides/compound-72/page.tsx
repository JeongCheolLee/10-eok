import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, guideLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates, localeHref } from "@/lib/i18n/seo";
import { COMPOUND_72_EN } from "@/lib/content/pages/en";
import { COMPOUND_72_JA } from "@/lib/content/pages/ja";
import { COMPOUND_72_DE } from "@/lib/content/pages/de";

const KO = {
  metaTitle: "복리와 72의 법칙",
  metaDescription: "단리·복리와 72의 법칙을 가상 예시로 설명하고, 적립식·변동 수익률에 적용할 때의 한계를 짚어요.",
  head: { title: "복리와 72의 법칙", desc: "돈이 돈을 버는 원리와 암산법", crumb: "가이드 · 복리" },
};
const LOCALES_DATA: Record<Locale, { metaTitle: string; metaDescription: string; head: { title: string; desc: string; crumb: string } }> = {
  ko: KO, en: COMPOUND_72_EN, ja: COMPOUND_72_JA, de: COMPOUND_72_DE,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in LOCALES_DATA ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  return { title: `${d.metaTitle} · 10-eok`, description: d.metaDescription, alternates: langAlternates(locale, "/guides/compound-72") };
}

function KoBody() {
  return (
    <>
      <p>복리는 이전까지 쌓인 금액에 다음 수익률이 적용되는 구조예요. 예금 이자가 다시 이자를 만들거나, 받은 분배금으로 자산을 더 사는 경우에 볼 수 있어요. 다만 ETF 가격은 매년 일정하게 오르지 않아서 복리 공식에 넣는 고정 수익률과 실제 투자 결과는 구분해야 해요.</p>
      <h2>단리와 복리를 같은 조건으로 비교해요</h2>
      <p>세금과 비용을 제외한 가상 예시예요. 100만원에 매년 10%가 붙는다고 볼게요. 단리는 처음 금액에만 이자를 계산해서 매년 10만원이 더해져요. 10년 뒤에는 200만원이에요.</p>
      <p>연 1회 복리라면 첫해 110만원, 둘째 해 121만원이 돼요. 계산식은 100만원 × 1.1의 10제곱이며, 10년 뒤 약 259만원이에요. 같은 10%라도 늘어난 금액이 다음 계산에 포함되는지가 차이를 만들어요. 이 예시는 실제 ETF 수익률이 아니에요.</p>
      <h2>72의 법칙은 언제 쓰나요?</h2>
      <p>목돈이 일정한 연복리 수익률로 두 배 되는 기간을 어림할 때 72를 수익률의 퍼센트 숫자로 나눠요. 연 6%라면 약 12년, 8%라면 약 9년, 12%라면 약 6년이에요. 매년 같은 양의 수익률을 적용하고 추가 납입이 없다는 조건의 암산법이에요.</p>
      <p>정확한 두 배 기간은 ln 2 ÷ ln(1 + r)로 구해요. r은 8%일 때 0.08을 넣어요. 연 8%의 정확한 기간은 약 9.01년이어서 암산과 가까워요. 수익률이 매우 높거나 낮아지면 오차도 달라지고, 0%나 음수 수익률에는 이 방식으로 두 배 기간을 구할 수 없어요.</p>
      <h2>평균 수익률과 복리 수익률은 달라요</h2>
      <p>가상 자산이 첫해 20% 오르고 다음 해 20% 내리면 단순 평균은 0%예요. 하지만 100만원 × 1.2 × 0.8은 96만원이라 누적 손실은 4%예요. 같은 출발 금액과 마지막 금액을 연결하는 연복리 수익률은 약 −2.02%예요.</p>
      <p>따라서 연 수익률을 더해 평균한 숫자를 그대로 72의 법칙에 넣으면 실제 누적 성과와 어긋날 수 있어요. 복리는 상승만 확대하는 장치가 아니며 손실에도 적용돼요. 50% 하락을 회복하려면 100% 상승이 필요하다는 계산도 이 비대칭을 보여줘요.</p>
      <h2>적립식 평가액에는 새로 넣은 돈이 있어요</h2>
      <p>목돈의 두 배 기간과 적립 계좌가 커지는 기간은 다른 질문이에요. 정액 적립에서는 매수일마다 투입한 돈과 보유 기간이 달라요. 먼저 넣은 돈이 항상 더 큰 수익을 내는 것도 아니에요. 오래 보유한 구간에 하락이 많았다면 나중에 넣은 돈의 결과가 더 나을 수도 있어요.</p>
      <p>평가액이 1억원에서 2억원으로 늘어도 그사이 8,000만원을 더 넣었다면 투자 수익만으로 두 배가 된 것은 아니에요. 적립 계산에서는 평가액과 <strong>넣은 돈</strong>을 나눠 읽어야 해요. 매수 수량 계산은 <Link href="/guides/dca">적립식 투자</Link>에서 설명해요.</p>
      <h2>10-eok은 고정 연수익률로 계산하지 않아요</h2>
      <p>계산기는 실제 과거 가격과 시장별 환율을 사용해 매수 수량과 평가액을 계산해요. 기본 도달 기간은 과거에 목표를 넘은 가장 최근 시작월부터 첫 도달일까지예요. 72의 법칙으로 미래의 목표 일정을 계산한 값은 아니에요.</p>
      <p>배당 재투자 여부에 따라 가격에 반영되는 수익 범위가 달라져요. 물가 옵션은 과거 소비자물가 변화에 맞춰 매회 납입액을 조정해요. 목표액을 미래 구매력으로 환산하는 옵션은 아니에요. 세금 옵션은 매도 시점을 단순화해 반영해요. <Link href="/">계산기</Link>에서 조건과 기준일을 함께 확인하면 같은 평가액이라도 의미가 달라지는 이유를 볼 수 있어요.</p>
      <p className="note">과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </>
  );
}

const BODIES: Record<Locale, () => React.ReactElement> = { ko: KoBody, en: COMPOUND_72_EN.Body, ja: COMPOUND_72_JA.Body, de: COMPOUND_72_DE.Body };

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in BODIES ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  const Body = BODIES[locale];
  return (
    <ContentShell title={d.head.title} desc={d.head.desc} crumb={d.head.crumb}>
      <JsonLd data={guideLd({ lang: locale, dateModified: "2026-10-26", path: localeHref(locale, "/guides/compound-72"), title: d.head.title, description: d.metaDescription, name: d.head.title })} />
      <Body />
    </ContentShell>
  );
}
