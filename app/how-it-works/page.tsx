import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";

export const metadata: Metadata = {
  title: "계산 방법 & 자주 묻는 질문 · 10-eok",
  description: "10-eok이 실제 과거 가격과 환율로 어떻게 백테스트를 계산하는지, 그리고 자주 묻는 질문을 정리했어요.",
};

export default function Page() {
  return (
    <ContentShell title="계산 방법 & 자주 묻는 질문" desc="10-eok이 결과를 어떻게 만들어내는지" crumb="계산 방법">
      <h2>한눈에 보는 계산 절차</h2>
      <ol>
        <li>선택한 종목(현재 QLD)의 <strong>일별 수정주가</strong>와 <strong>일별 원/달러 환율</strong>을 가져옵니다.</li>
        <li>매달 지정한 <strong>매수일</strong>(휴장일이면 다음 거래일)에, 지정한 <strong>원화 금액</strong>을 그날 환율로 달러로 바꿔 종목을 삽니다.</li>
        <li>거래일마다 보유 수량 × 그날 주가 × 그날 환율로 <strong>원화 평가액</strong>을 계산합니다.</li>
        <li>평가액이 처음으로 <strong>10억 원</strong>을 넘는 날을 찾아 "며칠 걸렸는지"를 보여줍니다.</li>
      </ol>

      <h2>데이터 출처</h2>
      <ul>
        <li><strong>가격:</strong> Yahoo Finance의 일별 수정주가(adjusted close). 배당 재투자와 액면분할, 운용보수가 이미 반영된 값입니다.</li>
        <li><strong>환율:</strong> 미국 세인트루이스 연방준비은행(FRED)의 일별 원/달러(DEXKOUS) 시계열.</li>
        <li>데이터는 매일 한 번 자동으로 갱신됩니다.</li>
      </ul>

      <h2>전제와 단순화</h2>
      <ul>
        <li>배당은 <strong>재투자</strong>한 것으로 봅니다(수정주가 사용).</li>
        <li><strong>세금</strong>은 계산에 넣지 않습니다. 목표는 평가액이며 아직 팔지 않은 미실현 상태로 보기 때문입니다.</li>
        <li>매매 수수료·스프레드는 단순화를 위해 제외했습니다.</li>
        <li>주식을 소수점 단위로 살 수 있다고 가정합니다(모델 단순화).</li>
      </ul>

      <h2>자주 묻는 질문</h2>
      <h3>결과가 미래 수익을 보장하나요?</h3>
      <p>아니요. 모든 결과는 "과거에 그렇게 했다면"의 기록일 뿐입니다. 과거 수익률은 미래를 보장하지 않습니다.</p>
      <h3>왜 QLD부터인가요?</h3>
      <p>데이터가 길고(2006년~) 변동이 커서 적립식 효과를 보여주기 좋기 때문입니다. 종목은 점차 늘릴 예정입니다.</p>
      <h3>"연평균"은 무슨 뜻인가요?</h3>
      <p>보유 구간 동안 자산 가치가 1년에 평균 몇 %씩 늘었는지를 나타낸 값(연복리 수익률)입니다.</p>
      <h3>실제로 이대로 투자하면 되나요?</h3>
      <p>본 서비스는 정보 제공 도구이며 투자 권유나 자문이 아닙니다. 레버리지 상품의 위험을 충분히 이해하고, 투자 결정은 스스로 판단하셔야 합니다.</p>

      <p className="note">
        계산 로직의 자세한 동작은 <a href="/guides">가이드</a>에서 더 읽어볼 수 있어요.
      </p>
    </ContentShell>
  );
}
