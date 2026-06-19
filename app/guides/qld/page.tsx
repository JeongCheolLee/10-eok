import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, guideLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "QLD란 무엇인가 · 10-eok",
  description: "QLD는 나스닥100 지수의 하루 수익률을 2배로 추종하는 레버리지 ETF입니다. 구조와 특징을 쉽게 정리했어요.",
  alternates: { canonical: "/guides/qld" },
};

export default function Page() {
  return (
    <ContentShell title="QLD란 무엇인가" desc="나스닥100을 하루 2배로 추종하는 레버리지 ETF" crumb="가이드 · QLD">
      <JsonLd data={guideLd({ path: "/guides/qld", title: "QLD란 무엇인가", description: "QLD는 나스닥100 지수의 하루 수익률을 2배로 추종하는 레버리지 ETF입니다. 구조와 특징을 쉽게 정리했어요.", name: "QLD란 무엇인가" })} />
      <p>
        QLD는 미국 운용사 ProShares가 만든 상장지수펀드(ETF)로, 정식 이름은 ProShares Ultra
        QQQ입니다. 미국 기술주 중심의 <strong>나스닥100 지수</strong>의 <strong>하루 수익률을 2배</strong>로
        따라가는 것을 목표로 합니다. 2006년 6월 21일에 상장되어 비교적 긴 데이터를 가지고 있어,
        장기 적립을 가정한 백테스트에 자주 쓰입니다.
      </p>

      <h2>"하루 2배"가 핵심</h2>
      <p>
        많은 사람이 QLD를 "나스닥100을 2배로 오래 추종하는 상품"으로 오해합니다. 정확히는 <strong>하루
        단위</strong>로 2배입니다. 나스닥100이 하루에 1% 오르면 QLD는 약 2% 오르고, 1% 내리면 약 2%
        내립니다. 이 하루 단위 추종이 여러 날 누적되면, 며칠·몇 달 단위의 수익률은 단순히 지수의 2배가
        되지 않습니다. 이를 이해하는 것이 레버리지 ETF의 출발점입니다.
      </p>

      <h2>비용</h2>
      <p>
        QLD는 운용보수(연 약 0.95% 수준)가 일반 지수 ETF보다 높습니다. 다만 10-eok의 백테스트는
        <strong>수정주가(adjusted close)</strong>를 사용하는데, 이 가격에는 운용보수와 배당 재투자가
        이미 반영되어 있습니다. 따라서 따로 비용을 빼지 않아도 결과에 녹아 있습니다.
      </p>

      <h2>왜 변동이 큰가</h2>
      <ul>
        <li>기초 지수인 나스닥100 자체가 기술주 비중이 커 변동이 큽니다.</li>
        <li>거기에 2배 레버리지가 더해져 오르내림이 모두 증폭됩니다.</li>
        <li>2008년 금융위기, 2022년 하락장처럼 시장이 빠질 때는 손실도 2배로 커집니다.</li>
      </ul>

      <p className="note">
        QLD 같은 레버리지 상품은 변동이 매우 큽니다. 자세한 위험은 <a href="/guides/leverage-etf-risk">레버리지 ETF의 위험</a>
        글을 함께 읽어보세요. 본 내용은 정보 제공이며 투자 권유가 아닙니다.
      </p>
    </ContentShell>
  );
}
