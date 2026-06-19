import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";

export const metadata: Metadata = {
  title: "적립식 투자(DCA)의 원리 · 10-eok",
  description: "매달 일정 금액을 꾸준히 사는 적립식 투자가 왜 마음 편한 방법인지, 장점과 한계를 정리했어요.",
};

export default function Page() {
  return (
    <ContentShell title="적립식 투자(DCA)의 원리" desc="매달 같은 금액을 꾸준히" crumb="가이드 · 적립식">
      <p>
        적립식 투자(영어로 Dollar-Cost Averaging, 줄여서 DCA)는 <strong>가격이 오르든 내리든 매달 같은
        금액을 정해진 날에 사는</strong> 방식입니다. 한 번에 목돈을 넣는 거치식과 달리, 시점을 나눠
        조금씩 사 모읍니다.
      </p>

      <h2>왜 마음이 편한가</h2>
      <ul>
        <li><strong>매수 시점 고민을 없애 줍니다.</strong> "지금 사도 될까"를 매번 판단하지 않아도 됩니다.</li>
        <li><strong>평균 단가가 자연스럽게 분산됩니다.</strong> 같은 금액으로 비쌀 때는 적게, 쌀 때는 많이 사게 됩니다.</li>
        <li><strong>꾸준함이 습관이 됩니다.</strong> 급여처럼 매달 자동으로 투자가 이어집니다.</li>
      </ul>

      <h2>10-eok이 계산하는 방식</h2>
      <p>
        10-eok은 선택한 종목을 <strong>매달 지정한 날</strong>(휴장일이면 다음 거래일)에 <strong>지정한
        금액</strong>만큼 그날 실제 종가와 환율로 사 모았다고 가정합니다. 그렇게 모인 평가액이 처음으로
        10억 원을 넘는 날을 찾아 "며칠 걸렸는지"를 보여줍니다.
      </p>

      <h2>한계도 분명합니다</h2>
      <p>
        적립식이 항상 거치식보다 낫지는 않습니다. 시장이 장기간 우상향한 구간에서는, 일찍 목돈을 넣은
        거치식이 더 높은 수익을 내는 경우가 많습니다. 적립식의 가치는 "최고의 수익"이 아니라 "심리적
        부담을 줄이고 꾸준히 참여하게 만드는 것"에 가깝습니다. 또한 과거에 잘 통한 방식이 미래에도
        반드시 통한다는 보장은 없습니다.
      </p>

      <p className="note">본 내용은 일반적인 정보 제공이며 투자 권유나 자문이 아닙니다.</p>
    </ContentShell>
  );
}
