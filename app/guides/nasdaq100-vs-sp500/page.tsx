import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, guideLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "나스닥100 vs S&P 500 · 10-eok",
  description: "QQQ와 SPY로 대표되는 나스닥100과 S&P 500의 구성·성격·변동성 차이를 비교합니다.",
  alternates: { canonical: "/guides/nasdaq100-vs-sp500" },
};

export default function Page() {
  return (
    <ContentShell title="나스닥100 vs S&P 500" desc="미국 대표 두 지수, 무엇이 다른가" crumb="가이드 · 지수 비교" byline>
      <JsonLd
        data={guideLd({
          path: "/guides/nasdaq100-vs-sp500",
          title: "나스닥100 vs S&P 500",
          description: "QQQ와 SPY로 대표되는 나스닥100과 S&P 500의 구성·성격·변동성 차이를 비교합니다.",
          name: "나스닥100 vs S&P 500",
        })}
      />

      <p>
        미국 주식에 적립식으로 투자할 때 가장 자주 거론되는 두 지수가 <strong>나스닥100</strong>과{" "}
        <strong>S&amp;P 500</strong>입니다. 둘 다 미국 대형주를 담지만, 무엇을 얼마나 담는지가 달라
        성격과 변동성도 다릅니다. 이름은 익숙해도 차이는 헷갈리기 쉬운데, 적립식 투자자의 눈높이에서
        핵심만 정리해 봅니다.
      </p>

      <h2>무엇을 담고 있나 — 구성의 차이</h2>
      <p>
        가장 큰 차이는 담는 종목의 <strong>수와 범위</strong>입니다. 두 지수 모두 시가총액이 큰 종목일수록
        비중이 커지는 시가총액 가중 방식을 기본으로 합니다.
      </p>
      <ul>
        <li>
          <strong>S&amp;P 500:</strong> 미국을 대표하는 대형주 약 500개로 구성됩니다. 기술·금융·헬스케어·
          소비재·산업재·에너지 등 거의 모든 산업이 들어와 있어 흔히 &lsquo;미국 경제 대표 지수&rsquo;로 불립니다.
          상장 거래소(뉴욕증권거래소·나스닥)를 가리지 않고 편입됩니다.
        </li>
        <li>
          <strong>나스닥100:</strong> 나스닥 거래소에 상장된 종목 중 <strong>금융주를 뺀</strong> 시가총액 상위
          100개로 구성됩니다. 종목 수가 적고, 구조적으로 기술·성장 기업의 비중이 매우 큽니다.
        </li>
      </ul>

      <h2>섹터 집중도</h2>
      <p>
        종목 수가 100개로 적고 금융주가 빠져 있으니, 나스닥100은 자연스럽게 <strong>기술 섹터에 쏠립니다.</strong>{" "}
        대형 기술 기업 몇 곳이 지수에서 차지하는 비중이 상당히 높아, 이들 주가가 흔들리면 지수 전체가 함께
        흔들리는 경향이 있습니다. 반면 S&amp;P 500은 산업이 넓게 퍼져 있어 한 섹터의 부진을 다른 섹터가
        일부 상쇄해 줄 수 있습니다.
      </p>
      <p>
        다만 최근에는 S&amp;P 500도 시가총액 상위 대형 기술주의 비중이 커지면서, 두 지수가 담는 핵심
        종목이 상당 부분 겹친다는 점은 알아 둘 만합니다. &lsquo;완전히 다른 두 시장&rsquo;이라기보다, 같은 시장을
        다른 각도와 농도로 담은 것에 가깝습니다.
      </p>

      <h2>변동성·성장성 성향</h2>
      <p>
        분산이 덜 되고 성장주 비중이 큰 만큼, 나스닥100은 일반적으로 <strong>오를 때 더 가파르게 오르고
        빠질 때 더 깊게 빠지는</strong> 성향을 보입니다. S&amp;P 500은 산업 분산 덕에 상대적으로 변동이
        완만한 편입니다. 어느 쪽이 더 &lsquo;좋다&rsquo;고 단정할 수는 없습니다. 변동성이 크다는 것은 더 큰 상승
        잠재력과 더 큰 하락 위험을 함께 뜻하기 때문입니다.
      </p>
      <p>
        중요한 점은 <strong>과거의 수익률이 미래를 보장하지 않는다</strong>는 사실입니다. 지난 10여 년처럼
        기술주가 강했던 구간에서 나스닥100이 앞섰다고 해서, 앞으로도 항상 그러리라는 보장은 없습니다.
        두 지수의 실제 적립식 결과 수치는 <Link href="/">계산기</Link>와 홈 화면의 종목 비교표에서 직접
        확인해 보세요.
      </p>

      <h2>대표 ETF — QQQ와 SPY</h2>
      <p>
        지수 자체는 사고팔 수 없으니, 그 지수를 그대로 따라가도록 만든 펀드를 통해 투자합니다. 그게 바로
        ETF입니다(<Link href="/guides/etf-basics">ETF가 뭔가요?</Link> 글에서 기초를 정리했습니다).
      </p>
      <ul>
        <li>
          <strong>QQQ</strong> (Invesco QQQ Trust): 나스닥100을 추종하는 대표 ETF.{" "}
          <Link href="/etf/qqq">QQQ 적립식 백테스트</Link>
        </li>
        <li>
          <strong>SPY</strong> (SPDR S&amp;P 500 ETF Trust): S&amp;P 500을 추종하는, 세계에서 가장 오래되고 거래가
          많은 ETF 중 하나. <Link href="/etf/spy">SPY 적립식 백테스트</Link>
        </li>
      </ul>
      <p>
        둘 다 운용보수가 낮은 편이고, 배당을 지급합니다. 10-eok의 백테스트는 배당이 재투자되고 보수가 반영된{" "}
        <strong>수정주가</strong>를 쓰기 때문에, 이 비용과 배당이 결과에 이미 녹아 있습니다.
      </p>

      <h2>어떤 성향에 맞을까</h2>
      <p>
        정답을 정해 주는 글이 아니라, 스스로 판단할 기준을 정리합니다.
      </p>
      <ul>
        <li>
          <strong>변동을 견디기 어렵다면</strong> 산업이 넓게 분산된 S&amp;P 500 쪽이 마음 편할 수 있습니다.
          하락장에서 계좌를 매일 확인하며 흔들리는 성격이라면 더욱 그렇습니다.
        </li>
        <li>
          <strong>기술·성장에 더 집중하고 싶고</strong> 큰 출렁임을 감내할 수 있다면 나스닥100이 그 성향에
          맞습니다. 단, 하락 폭도 더 클 수 있다는 점을 받아들여야 합니다.
        </li>
        <li>
          매달 같은 금액을 사 모으는 적립식에서는 변동성이 꼭 나쁘지만은 않습니다. 가격이 빠진 달에는 같은
          돈으로 더 많은 수량을 담기 때문입니다. 다만 변동이 큰 지수일수록 <strong>시작·종료 시점에 따라 결과
          편차가 크다</strong>는 점은 기억해야 합니다.
        </li>
      </ul>

      <h2>레버리지 버전도 있다</h2>
      <p>
        나스닥100에는 하루 수익률을 2배로 따라가는 <strong>QLD</strong>, 3배로 따라가는 <strong>TQQQ</strong> 같은
        레버리지 ETF가 있습니다. &lsquo;하루&rsquo; 단위 배수라는 점이 핵심이라, 여러 날이 누적되면 단순히 지수의 2배·
        3배가 되지 않고 변동성으로 인한 손실(이른바 변동성 끌림)이 생길 수 있습니다. 손실 구간에서는 그
        손실도 배수로 커집니다. 더 자세한 내용은{" "}
        <Link href="/guides/leverage-etf-risk">레버리지 ETF의 위험</Link>을 꼭 함께 읽어보세요.
      </p>

      <p className="note">본 내용은 일반적인 정보 제공이며 투자 권유나 자문이 아닙니다.</p>
    </ContentShell>
  );
}
