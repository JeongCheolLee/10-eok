import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { Sources } from "@/components/Sources";
import { JsonLd, guideLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates } from "@/lib/i18n/seo";

// ko 전용 가이드(원화 관점 환율). en/ja/de에서는 404 — hreflang도 ko만.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "환율이 수익률에 미치는 영향 · 10-eok",
    description: "원화로 달러 자산(미국 ETF)을 살 때, 환율이 수익을 어떻게 더하거나 깎는지 가상 예시로 설명해요.",
    alternates: langAlternates(lang as Locale, "/guides/fx-impact", ["ko"]),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ko") notFound();
  return (
    <ContentShell title="환율이 수익률에 미치는 영향" desc="원화로 달러 자산을 살 때 생기는 또 하나의 변수" crumb="가이드 · 환율">
      <JsonLd data={guideLd({ dateModified: "2026-10-26", path: "/guides/fx-impact", title: "환율이 수익률에 미치는 영향", description: "원화로 달러 자산(미국 ETF)을 살 때, 환율이 수익을 어떻게 더하거나 깎는지 가상 예시로 설명해요.", name: "환율이 수익률에 미치는 영향" })} />
      <p>미국 ETF를 원화로 평가하면 ETF의 달러 가격과 원·달러 환율이 함께 작용해요. 달러 기준 수익이 양수여도 원화 결과는 손실일 수 있어요. 매수 때 환전하는 것과 평가액을 원화로 표시하는 것도 구분해야 해요. 평가를 위해 원화로 환산한다고 매번 실제 환전을 하는 것은 아니에요.</p>
      <h2>매수 환율과 평가 환율의 역할</h2>
      <p>매수일 환율이 달러당 1,200원이라면 120만원은 비용 차감 전 1,000달러예요. 환율이 1,500원이라면 같은 120만원은 800달러예요. ETF의 달러 가격이 같아도 환율에 따라 같은 원화로 살 수 있는 수량이 달라져요.</p>
      <p>매수 뒤에는 보유 수량 × 달러 가격 × 평가일 환율로 원화 평가액을 계산해요. 실제 매도·환전까지 한다면 수수료와 적용 환율 때문에 이 평가액과 수령액이 달라질 수 있어요. 증권사의 환전 우대율이 기준 환율 자체를 바꾸는 것도 아니에요.</p>
      <h2>수익률은 더하기보다 곱하기예요</h2>
      <p>비용·세금·배당을 제외한 가상 예시예요. 환율이 1,200원일 때 120만원으로 산 자산의 달러 가치가 1,000달러에서 1,100달러로 10% 올랐다고 볼게요.</p>
      <ul><li>환율도 1,320원으로 10% 올랐다면 평가액은 145만2,000원, 원화 수익률은 +21%예요.</li><li>환율이 1,080원으로 10% 내렸다면 평가액은 118만8,000원, 원화 수익률은 −1%예요.</li></ul>
      <p>계산식은 <strong>원화 수익률 = (1 + 달러 자산 수익률) × (평가 환율 ÷ 매수 환율) − 1</strong>이에요. +10%와 −10%를 더해 0%라고 보면 교차 효과를 놓쳐요. 적립식은 매수 건마다 환율과 가격이 달라 각 매수 수량을 먼저 구해야 해요.</p>
      <h2>환헤지와 거래 통화는 다른 개념이에요</h2>
      <p>환헤지는 선물환 등으로 특정 통화의 변동 영향을 줄이는 전략이에요. 헤지 비율·비용·계약 변경 때문에 환율 영향을 완전히 없애는 것은 아니에요. 달러로 거래하는 ETF를 한국 투자자가 산다고 자동으로 원화 헤지가 생기지는 않아요.</p>
      <p>반대로 국내 상장 ETF를 원화로 사더라도 해외 자산을 담고 환헤지를 하지 않으면 외화 노출이 남아요. VT처럼 여러 국가의 주식을 담은 미국 ETF는 거래 통화가 달러여도 기초자산에는 여러 통화가 영향을 줘요. 상품의 상장 국가·거래 통화·기초자산 통화를 나눠 볼 필요가 있어요.</p>
      <h2>KODEX 200은 별도 환산을 하지 않아요</h2>
      <p>KODEX 200은 국내 주식형 ETF여서 이 계산에서는 매수·평가 가격을 원화 그대로 사용해요. 미국 ETF처럼 달러 가격을 원화로 바꾸는 계산 단계가 없다는 뜻이에요. 국내 기업 주가가 환율과 무관하다는 뜻은 아니에요.</p>
      <p>수출 매출·수입 원재료 비용·외국인 자금 흐름은 환율 변화의 영향을 받을 수 있어요. 그 영향이 기업 실적과 원화 주가에 들어가므로 원화 거래만으로 모든 환율 영향을 제거했다고 볼 수 없어요.</p>
      <h2>10-eok의 환율 자료와 한계</h2>
      <p>한국어 계산은 미국 ETF의 일별 달러 가격과 FRED의 원·달러 환율 자료를 연결해요. 매수 수량과 평가액에 각각 해당 시점의 환율을 사용해요. 휴일 등으로 날짜가 맞지 않을 때 연결한 자료는 증권사에서 체결한 실제 환전 내역과 같지 않아요. 투자자별 환전 수수료도 포함하지 않아요.</p>
      <p>결과의 계산 기준에서 가격과 환율 기준일을 함께 볼 수 있어요. ETF 비교는 같은 기간과 납입액을 고정하지만, 자산별 환율 노출을 지운 비교는 아니에요. 환율이 과세 차익에 들어가는 방식은 <Link href="/guides/overseas-tax">해외주식·ETF 세금 기초</Link>에서 이어서 볼 수 있어요.</p>
      <Sources ids={["fredFx", "yahoo"]} />
      <p className="note">과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </ContentShell>
  );
}
