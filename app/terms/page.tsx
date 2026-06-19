import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";

export const metadata: Metadata = {
  title: "이용약관 · 10-eok",
  description: "10-eok 서비스 이용에 관한 약관과 면책 조항입니다.",
};

export default function Page() {
  return (
    <ContentShell title="이용약관" desc="최종 업데이트: 2026-06-19" crumb="이용약관">
      <h2>1. 서비스의 성격</h2>
      <p>
        10-eok(이하 "서비스")은 실제 과거 시장 데이터를 이용한 백테스트 결과를 보여주는 <strong>정보
        제공 서비스</strong>입니다. 서비스의 어떤 내용도 특정 금융상품의 매매를 권유하거나, 투자 자문 또는
        금융 자문을 제공하는 것이 아닙니다.
      </p>

      <h2>2. 투자 책임 (면책)</h2>
      <ul>
        <li><strong>과거 수익률은 미래 수익을 보장하지 않습니다.</strong> 모든 결과는 "과거에 그렇게 했다면"의 가정에 따른 것입니다.</li>
        <li>레버리지 ETF 등은 원금 손실 위험이 크며, 실제 투자에는 세금·수수료·환전 비용·심리적 요인이 추가됩니다.</li>
        <li>서비스를 참고해 내린 투자 결정과 그 결과에 대한 책임은 전적으로 이용자 본인에게 있습니다.</li>
      </ul>

      <h2>3. 데이터의 정확성</h2>
      <p>
        서비스는 신뢰할 수 있는 외부 출처(Yahoo Finance, FRED)의 데이터를 사용하지만, 데이터의 정확성·
        완전성·실시간성을 보증하지 않습니다. 계산은 명시된 전제와 단순화(<a href="/how-it-works">계산 방법</a>
        참고)에 기반합니다.
      </p>

      <h2>4. 책임의 한계</h2>
      <p>
        서비스 제공자는 서비스 이용 또는 이용 불가, 데이터 오류, 계산 결과의 해석으로 발생한 어떤 직접적·
        간접적 손해에 대해서도 법이 허용하는 범위에서 책임을 지지 않습니다.
      </p>

      <h2>5. 약관 변경</h2>
      <p>본 약관은 변경될 수 있으며, 변경 시 본 페이지에 게시합니다. 변경 후 서비스를 계속 이용하면 변경에 동의한 것으로 봅니다.</p>

      <p className="note">
        문의: <a href="mailto:jclee7503@gmail.com">jclee7503@gmail.com</a>
      </p>
    </ContentShell>
  );
}
