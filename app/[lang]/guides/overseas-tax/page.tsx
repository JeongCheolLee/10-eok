import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, guideLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates } from "@/lib/i18n/seo";

// ko 전용 가이드(한국 세금). en/ja/de에서는 404 — hreflang도 ko만.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "해외주식·ETF 세금 기초 · 10-eok",
    description: "해외주식·ETF의 양도소득세·배당소득세와 국내 상장 종목과의 과세 차이를 기초부터 정리해요.",
    alternates: langAlternates(lang as Locale, "/guides/overseas-tax", ["ko"]),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ko") notFound();
  return (
    <ContentShell title="해외주식·ETF 세금 기초" desc="양도세·배당세, 무엇이 어떻게 다른가" crumb="가이드 · 세금">
      <JsonLd data={guideLd({ dateModified: "2026-10-26", path: "/guides/overseas-tax", title: "해외주식·ETF 세금 기초", description: "해외주식·ETF의 양도소득세·배당소득세와 국내 상장 종목과의 과세 차이를 기초부터 정리해요.", name: "해외주식·ETF 세금 기초" })} />
      <p>아래는 2026년 10월 26일 확인한 안내를 바탕으로, 한국 거주 개인이 일반 과세 계좌에서 ETF를 보유하는 경우를 설명해요. 같은 지수를 따라가도 상장 시장과 기초자산에 따라 과세 방식이 달라요. ISA·연금계좌와 비거주자 등에는 별도 조건이 적용될 수 있어요.</p>
      <h2>미국 상장 ETF의 매매차익</h2>
      <p>일반적인 미국 상장 ETF 매매차익은 국외주식 양도소득으로 다뤄요. 연간 과세 대상 손익을 합산하고 기본공제를 적용한 뒤 세금을 계산해요. 일반적인 세율은 소득세 20%에 지방소득세를 더한 22%예요. 주식을 들고 있는 동안의 미실현 평가이익과 팔아 확정한 이익은 구분해요.</p>
      <p>주식 양도소득 기본공제는 과세 대상 국내·국외주식을 합쳐 연 250만원이에요. ETF나 증권사 계좌마다 250만원씩 공제하는 방식이 아니에요. 손익통산 대상과 비용을 따진 뒤 신고해야 하며, 국외주식은 일반적으로 양도한 다음 해 5월에 확정신고해요.</p>
      <p>다른 과세 대상 손익이 없고 공제를 아직 쓰지 않았다는 가상 예시에서, 연간 차익이 500만원이면 250만원을 뺀 금액에 22%를 적용해 55만원이에요. 이 예시는 실제 신고서를 대신하지 않아요. 달러 자산도 과세 차익은 원화로 계산하므로 환율이 영향을 줘요.</p>
      <h2>분배금은 매매차익과 별도로 다뤄요</h2>
      <p>미국 상장 ETF의 분배금은 지급 성격·조세조약·거주자 서류와 외국 납부세액 처리에 따라 실제 원천징수가 달라질 수 있어요. 모든 ETF 분배금에 국내 세율 15.4%를 일률적으로 더하거나, 현지에서 낸 세금에 같은 세율을 다시 곱하는 방식은 정확하지 않아요.</p>
      <p>이자·배당소득에는 금융소득 종합과세가 관련될 수 있어요. 양도소득과 금융소득은 서로 다른 과세 체계이므로 미국 ETF 매도차익을 여러 해로 나눴다는 사실만으로 금융소득 종합과세가 줄어든다고 설명할 수는 없어요. 실제 분배금 과세는 증권사의 지급·세금 명세와 국세청 안내로 확인할 수 있어요.</p>
      <h2>국내 상장 ETF도 종류를 나눠요</h2>
      <p>KODEX 200 같은 국내 주식형 ETF는 일반적인 개인의 장내 매매차익을 비과세로 다루고 분배금은 별도로 과세해요. 국내에 상장됐다는 이유로 채권·원자재·해외주식형 ETF까지 모두 같은 규칙을 적용하지는 않아요.</p>
      <p>국내 상장 해외주식형 등 기타 ETF는 일반적으로 매매차익과 과표기준가 상승분 중 작은 금액을 기준으로 배당소득세를 원천징수하는 보유기간 과세를 적용해요. 대표적인 세율은 지방소득세를 포함해 15.4%예요. 외국 납부세액 조정과 계좌 유형에 따라 실제 금액이 달라질 수 있어요.</p>
      <h2>10-eok의 세금 옵션은 무엇을 계산하나요?</h2>
      <p>세금 반영을 켜면 해당 평가 시점에 보유 자산을 전부 팔았다는 가정의 금액으로 계산해요. 미국 상장 종목의 합산 차익에 250만원 공제를 한 번 적용하고 초과분에 22%를 적용해요. 매년 공제를 반복하거나 다른 계좌의 거래를 합산하는 세금 신고 모형은 아니에요.</p>
      <p>국내 주식형은 매매차익 세금을 0으로, 국내 상장 해외형은 양의 차익에 15.4%를 적용해 단순화해요. 실제 과표기준가·외국 납부세액·분배금 과세·금융소득 종합과세는 재현하지 않아요. 특히 국내 상장 해외형은 실제 보유기간 과세와 차이가 날 수 있어요.</p>
      <p>배당 재투자를 켠 가격 계산도 개인별 배당세를 차감해 실제로 재매수한 현금흐름은 아니에요. 그래서 표시된 금액을 모든 세금을 정산한 실수령액으로 읽을 수는 없어요. 적용 조건은 <Link href="/">계산기</Link>의 계산 기준과 함께 확인할 수 있어요.</p>
      <p className="note">세법과 적용 요건은 바뀔 수 있어요. 실제 신고는 해당 연도 국세청 안내와 거래 명세를 기준으로 확인할 필요가 있어요.</p>
      <p>과세 기준: <a href="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=8800&amp;mi=12274" target="_blank" rel="noopener">국세청 주식 양도소득세 계산 안내</a>, <a href="https://g.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7711&amp;mi=2312" target="_blank" rel="noopener">국세청 세율 안내</a>, <a href="https://www.samsungfund.com/etf/product/view.do?id=2ETF01" target="_blank" rel="noopener">KODEX 200 과세 안내</a>, <a href="https://www.samsungfund.com/upload/kodex/newsroom/20251020144727705.pdf" target="_blank" rel="noopener">KODEX ETF 과세 자료</a>에서 확인했어요.</p>
      <p className="note">과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    </ContentShell>
  );
}
