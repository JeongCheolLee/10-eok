import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, guideLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "환율이 수익률에 미치는 영향 · 10-eok",
  description: "원화로 달러 자산(QLD)을 살 때 환율이 수익을 어떻게 더하거나 깎는지, 10-eok이 이를 어떻게 반영하는지 설명합니다.",
  alternates: { canonical: "/guides/fx-impact" },
};

export default function Page() {
  return (
    <ContentShell title="환율이 수익률에 미치는 영향" desc="원화로 달러 자산을 살 때 생기는 또 하나의 변수" crumb="가이드 · 환율">
      <JsonLd data={guideLd({ path: "/guides/fx-impact", title: "환율이 수익률에 미치는 영향", description: "원화로 달러 자산(QLD)을 살 때 환율이 수익을 어떻게 더하거나 깎는지, 10-eok이 이를 어떻게 반영하는지 설명합니다.", name: "환율이 수익률에 미치는 영향" })} />
      <p>
        QLD는 <strong>달러로 거래되는</strong> 미국 ETF입니다. 그런데 우리가 적립하는 돈은 원화이고,
        목표인 "10억"도 원화입니다. 그래서 한국 투자자의 실제 수익은 <strong>주가 변동</strong>과
        <strong>환율 변동</strong> 두 가지가 함께 만듭니다.
      </p>

      <h2>두 번의 환전이 일어납니다</h2>
      <ul>
        <li><strong>살 때:</strong> 매달 원화를 그날 환율로 달러로 바꿔 QLD를 삽니다. 원/달러가 높으면(원화 약세) 같은 원화로 살 수 있는 주식 수가 줄어듭니다.</li>
        <li><strong>평가할 때:</strong> 보유한 달러 자산의 가치를 다시 그날 환율로 원화로 환산합니다. 원/달러가 높아지면 같은 달러라도 원화 평가액이 커집니다.</li>
      </ul>

      <h2>환율은 수익을 더할 수도, 깎을 수도</h2>
      <p>
        주가가 그대로여도 원/달러가 1,100원에서 1,300원으로 오르면(원화 약세) 원화 평가액은 늘어납니다.
        반대로 원화가 강세가 되면 달러 수익의 일부가 환율에서 깎입니다. 즉 한국 투자자에게는 환율이
        "숨은 수익률"처럼 작동합니다.
      </p>

      <h2>10-eok이 환율을 다루는 방식</h2>
      <p>
        많은 해외 백테스트 도구는 달러 기준이라 이 환율 효과를 무시합니다. 10-eok은 매수한 그날과 평가하는
        그날의 <strong>실제 일별 원/달러 환율</strong>을 모두 반영합니다. 환율 데이터는 미국 세인트루이스
        연방준비은행이 공개하는 일별 원/달러(DEXKOUS) 시계열을 사용합니다. 덕분에 "한국에서 원화로 샀다면"의
        현실에 더 가깝게 계산됩니다.
      </p>

      <p className="note">
        환율은 예측하기 어렵고, 과거의 환율 흐름이 미래에 반복된다는 보장은 없습니다. 본 내용은 정보
        제공이며 투자 권유나 자문이 아닙니다.
      </p>
    </ContentShell>
  );
}
