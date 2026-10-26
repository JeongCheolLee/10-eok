import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { Sources } from "@/components/Sources";
import { JsonLd, guideLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates, localeHref } from "@/lib/i18n/seo";
import { LEVERAGE_ETF_RISK_EN } from "@/lib/content/pages/en";
import { LEVERAGE_ETF_RISK_JA } from "@/lib/content/pages/ja";
import { LEVERAGE_ETF_RISK_DE } from "@/lib/content/pages/de";

const KO = {
  metaTitle: "레버리지 ETF의 위험",
  metaDescription: "일일 목표와 보유 기간 수익률의 차이, 복리와 손실 회복률을 가상 예시로 설명해요.",
  head: { title: "레버리지 ETF의 위험", desc: "하루 목표와 보유 기간 수익률을 구분해요", crumb: "가이드 · 위험" },
};
const LOCALES_DATA: Record<Locale, { metaTitle: string; metaDescription: string; head: { title: string; desc: string; crumb: string } }> = {
  ko: KO, en: LEVERAGE_ETF_RISK_EN, ja: LEVERAGE_ETF_RISK_JA, de: LEVERAGE_ETF_RISK_DE,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in LOCALES_DATA ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  return { title: `${d.metaTitle} · 10-eok`, description: d.metaDescription, alternates: langAlternates(locale, "/guides/leverage-etf-risk") };
}

function KoBody() {
  return (
    <>
      <p>레버리지 ETF는 기준 지수의 하루 움직임을 2배·3배 등으로 확대하는 상품이에요. 큰 상승만큼 큰 하락에 노출되고, 하루를 넘겨 보유하면 복리 때문에 단순한 배수와 달라져요. 목표 도달 기간 하나로 이 위험을 표현할 수는 없어요.</p>
      <h2>일일 목표를 보유 기간 목표와 구분해요</h2>
      <p>QLD는 나스닥100 일일 2배, TQQQ는 일일 3배 성과를 비용 차감 전 기준으로 추구해요. 운용사가 노출을 다시 맞추기 때문에 지수가 한 달 10% 올랐다고 각각 20%·30%가 되는 것은 아니에요. 하루 결과도 비용과 추적 오차 때문에 목표와 다를 수 있어요.</p>
      <p>하루보다 긴 결과는 일별 수익률을 곱해서 만들어져요. 같은 시작·종료 지수라도 중간 움직임이 다르면 레버리지 결과가 달라질 수 있어요. 일정한 매수가 없는 단순 보유라면 같은 일별 수익률을 순서만 바꾸는 것 자체가 곱셈 결과를 바꾸지는 않아요. 적립식에서는 매수 시점이 끼므로 등락의 순서도 각 납입금의 성과에 영향을 줘요.</p>
      <h2>가상 숫자로 보는 변동성 효과</h2>
      <p>비용과 추적 오차를 제외하고 지수가 하루 10% 오른 뒤 다음 날 10% 내렸다고 볼게요.</p>
      <ul><li>1배: 100 → 110 → 99, 누적 −1%예요.</li><li>일일 2배: 100 → 120 → 96, 누적 −4%예요.</li><li>일일 3배: 100 → 130 → 91, 누적 −9%예요.</li></ul>
      <p>1배에도 같은 비율로 오르고 내린 뒤 손실이 남아요. 레버리지는 이 복리 효과를 더 크게 만들어요. 다만 일일 복리 전체가 언제나 손실을 뜻하는 것은 아니에요. 지수가 이틀 연속 10% 오르면 2배 상품은 44% 올라 지수 누적 상승률 21%의 단순 2배보다 높아져요.</p>
      <h2>하락 뒤 회복률은 대칭이 아니에요</h2>
      <p>20% 하락 뒤에는 25%, 50% 하락 뒤에는 100%, 80% 하락 뒤에는 400% 상승이 필요해요. 하락이 깊어질수록 이전 평가액으로 돌아오는 조건이 더 커져요. 레버리지 ETF는 기초 지수의 큰 하락이 손실을 확대할 수 있어요.</p>
      <p>지수가 원래 수준으로 돌아온 날과 ETF가 원래 가격으로 돌아온 날도 다를 수 있어요. 여기에 원화 투자자는 환율 변화를 함께 겪어요. 도달 전후의 한 시점 숫자만 보면 그 사이 필요한 유동성과 겪은 손실을 놓칠 수 있어요.</p>
      <h2>적립식이 구조를 바꾸지는 않아요</h2>
      <p>같은 돈으로 낮은 가격에서 더 많이 사는 것은 매수 수량의 변화예요. 이미 보유한 자산의 배율·파생상품 위험·일일 재조정은 남아요. 하락 후 회복을 미리 전제해야 적립의 수익이 좋아지는 예시는 그 전제가 깨졌을 때도 함께 봐야 해요.</p>
      <p>잔고가 커질수록 매회 새로 넣는 돈보다 기존 잔고의 가격 변화가 더 큰 영향을 줄 수 있어요. 납입을 늘려 평가액을 회복한 경우도 이전 자금의 손실이 없어진 것과는 달라요. <Link href="/guides/dca">적립식의 수량 계산</Link>과 보유 자산의 위험을 구분할 필요가 있어요.</p>
      <h2>이 사이트의 결과가 답하는 범위</h2>
      <p>기본 결과는 실제 거래 자료에서 목표를 한 번이라도 넘은 가장 최근 시작월과 첫 도달 기간을 보여줘요. 가장 짧은 기간이나 모든 시작월의 결과 범위를 뜻하지 않아요. 첫 도달 뒤 평가액이 내려갈 수도 있어 마지막 평가액을 별도로 표시해요.</p>
      <p>ETF 비교는 원래 계산의 기간·매수 일정·납입액을 고정해요. 추정 자료가 필요한 종목은 실제 자료 결과와 구분해요. <Link href="/">계산기</Link>는 미래 손실 확률이나 개인이 감당할 수 있는 투자 비중을 산출하지 않아요.</p>
      <Sources ids={["prosharesQld", "prosharesTqqq"]} />
      <p>구조와 용어 참고: <a href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/sec" target="_blank" rel="noopener">SEC 레버리지 ETF 투자자 안내</a></p>
      <p className="note">과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </>
  );
}

const BODIES: Record<Locale, () => React.ReactElement> = { ko: KoBody, en: LEVERAGE_ETF_RISK_EN.Body, ja: LEVERAGE_ETF_RISK_JA.Body, de: LEVERAGE_ETF_RISK_DE.Body };

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in BODIES ? (lang as Locale) : "ko";
  const d = LOCALES_DATA[locale];
  const Body = BODIES[locale];
  return (
    <ContentShell title={d.head.title} desc={d.head.desc} crumb={d.head.crumb}>
      <JsonLd data={guideLd({ lang: locale, dateModified: "2026-10-26", path: localeHref(locale, "/guides/leverage-etf-risk"), title: d.head.title, description: d.metaDescription, name: d.head.title })} />
      <Body />
    </ContentShell>
  );
}
