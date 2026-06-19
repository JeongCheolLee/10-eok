import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, guideLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "레버리지 ETF의 위험 · 10-eok",
  description: "2배의 수익만큼 2배의 손실, 그리고 '변동성 끌림(volatility decay)'이라는 숨은 위험을 쉽게 설명합니다.",
  alternates: { canonical: "/guides/leverage-etf-risk" },
};

export default function Page() {
  return (
    <ContentShell title="레버리지 ETF의 위험" desc="2배는 수익에도, 손실에도 적용됩니다" crumb="가이드 · 위험">
      <JsonLd data={guideLd({ path: "/guides/leverage-etf-risk", title: "레버리지 ETF의 위험", description: "2배의 수익만큼 2배의 손실, 그리고 '변동성 끌림(volatility decay)'이라는 숨은 위험을 쉽게 설명합니다.", name: "레버리지 ETF의 위험" })} />
      <p>
        QLD 같은 2배 레버리지 ETF는 상승장에서 빛나지만, 그만큼 위험도 큽니다. 백테스트의 좋은
        결과만 보고 들어가기 전에 아래 위험을 꼭 이해해야 합니다.
      </p>

      <h2>1. 손실도 2배</h2>
      <p>
        가장 직관적인 위험입니다. 기초 지수가 하루 3% 빠지면 레버리지 상품은 약 6% 빠집니다. 큰 하락장이
        오면 손실 폭이 일반 지수의 두 배로 커지고, 회복에도 더 오래 걸립니다.
      </p>

      <h2>2. 변동성 끌림 (volatility decay)</h2>
      <p>
        레버리지 ETF는 <strong>하루 단위</strong>로 배율을 맞추기 때문에, 시장이 오르내림을 반복하면
        수익률이 조금씩 깎입니다. 예를 들어 지수가 하루 +10%, 다음 날 −10%면 이틀 뒤 원래의 99%로
        돌아오지만, 2배 상품은 +20%, −20%를 겪어 96%로 더 많이 줄어듭니다. 방향 없이 출렁이는
        구간이 길수록 이 손실이 쌓입니다.
      </p>

      <h2>3. 장기 보유 가정의 주의점</h2>
      <p>
        위 두 가지 때문에, 레버리지 ETF는 본래 단기·전술적 용도로 설계되었다는 견해가 많습니다.
        과거 미국 기술주가 장기간 강하게 올랐기에 QLD의 장기 적립 결과가 좋아 보이지만, 이는
        <strong>특정 과거 구간</strong>의 결과일 뿐입니다. 같은 전략이 횡보장이나 장기 하락장에서
        반복되면 결과는 크게 달라질 수 있습니다.
      </p>

      <h2>10-eok 결과를 읽는 법</h2>
      <ul>
        <li>"10억까지 N년"은 <strong>과거에 그랬다면</strong>의 결과이지, 미래 예측이 아닙니다.</li>
        <li>도달이 빨랐던 구간일수록 그만큼 큰 변동(중간의 깊은 하락)을 견뎌야 했습니다.</li>
        <li>실제 투자에서는 세금·매매 수수료·심리적 흔들림이 추가로 작용합니다.</li>
      </ul>

      <p className="note">
        레버리지 상품은 원금 손실 위험이 큽니다. 본 내용은 정보 제공이며 투자 권유나 자문이 아닙니다.
        투자 결정과 결과의 책임은 이용자 본인에게 있습니다.
      </p>
    </ContentShell>
  );
}
