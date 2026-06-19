import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";

export const metadata: Metadata = {
  title: "ETF가 뭔가요? 초보자 가이드 · 10-eok",
  description: "ETF(상장지수펀드)의 개념, 펀드·개별주식과의 차이, 장단점을 처음 접하는 사람도 알기 쉽게 정리했어요.",
};

export default function Page() {
  return (
    <ContentShell title="ETF가 뭔가요?" desc="상장지수펀드를 처음부터" crumb="가이드 · ETF 기초">
      <p>
        ETF는 영어 Exchange Traded Fund의 약자로, 우리말로는 <strong>상장지수펀드</strong>입니다.
        이름이 어렵지만 핵심은 간단합니다. <strong>여러 종목을 한 바구니에 담아 두고, 그 바구니
        자체를 주식처럼 사고팔 수 있게 만든 상품</strong>입니다.
      </p>

      <h2>펀드인데 주식처럼 거래된다</h2>
      <p>
        일반 펀드는 하루 한 번 정해진 가격으로 거래되고 환매에 시간이 걸립니다. ETF는 거래소에
        <strong>상장</strong>되어 있어, 장중에 실시간 가격으로 주식처럼 즉시 사고팔 수 있습니다.
        그래서 "펀드의 분산 + 주식의 편리함"을 합친 상품이라고 부릅니다.
      </p>

      <h2>개별주식 vs ETF</h2>
      <ul>
        <li><strong>개별주식</strong>(예: 애플)은 한 회사에 집중 투자합니다. 잘되면 크게 벌고, 그 회사가 흔들리면 크게 잃습니다.</li>
        <li><strong>ETF</strong>(예: 나스닥100을 담은 QQQ)는 수십~수백 개 종목에 한 번에 분산합니다. 한 회사가 망해도 충격이 작습니다.</li>
      </ul>

      <h2>지수형 vs 레버리지</h2>
      <p>
        가장 흔한 건 <strong>지수를 그대로 추종</strong>하는 ETF입니다(QQQ=나스닥100, SPY=S&P 500).
        반면 <strong>레버리지 ETF</strong>(QLD=2배, TQQQ=3배)는 지수의 하루 등락을 배수로 따라가
        수익도 손실도 커집니다. 초보자라면 지수형부터 이해하는 것을 권합니다. 레버리지의 위험은
        <a href="/guides/leverage-etf-risk">레버리지 ETF의 위험</a>에서 자세히 다룹니다.
      </p>

      <h2>장점과 한계</h2>
      <ul>
        <li>장점: 적은 돈으로 분산, 낮은 비용, 실시간 거래, 투명한 구성.</li>
        <li>한계: 분산돼 있어도 시장 전체가 빠지면 같이 빠집니다. 운용보수(소액)가 매년 듭니다.</li>
      </ul>

      <p className="note">본 글은 일반적인 정보 제공이며 특정 상품 투자 권유나 자문이 아닙니다.</p>
    </ContentShell>
  );
}
