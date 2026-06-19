import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, guideLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "나스닥100 vs S&P 500, 뭐가 다를까 · 10-eok",
  description: "미국 대표 지수인 나스닥100(QQQ)과 S&P 500(SPY)의 구성·성격·변동성 차이를 쉽게 비교하고, 적립식 투자 관점에서 정리했어요.",
  alternates: { canonical: "/guides/nasdaq100-vs-sp500" },
};

export default function Page() {
  return (
    <ContentShell title="나스닥100 vs S&P 500" desc="미국 대표 두 지수, 무엇이 다른가" crumb="가이드 · 지수 비교">
      <JsonLd
        data={guideLd({
          path: "/guides/nasdaq100-vs-sp500",
          title: "나스닥100 vs S&P 500, 뭐가 다를까",
          description: "미국 대표 지수인 나스닥100(QQQ)과 S&P 500(SPY)의 구성·성격·변동성 차이를 쉽게 비교하고, 적립식 투자 관점에서 정리했어요.",
          name: "나스닥100 vs S&P 500",
        })}
      />

      <p>
        미국 시장을 대표하는 두 지수가 <strong>나스닥100</strong>과 <strong>S&P 500</strong>입니다.
        각각을 추종하는 대표 ETF가 <strong>QQQ</strong>와 <strong>SPY</strong>죠. 이름은 자주 들어도 차이는 헷갈리기 쉬운데, 핵심만 정리해 봅니다.
      </p>

      <h2>무엇을 담고 있나</h2>
      <ul>
        <li><strong>S&P 500:</strong> 미국 대형주 약 500개. 기술·금융·헬스케어·소비재 등 <strong>산업 전반에 분산</strong>된 '미국 경제 대표 지수'.</li>
        <li><strong>나스닥100:</strong> 나스닥 상장 비금융 대형주 100개. <strong>기술주 비중이 압도적</strong>(애플·마이크로소프트·엔비디아 등)이라 성장·기술에 집중된 성격.</li>
      </ul>

      <h2>성격과 변동성</h2>
      <p>
        나스닥100은 기술주 집중도가 높아 <strong>상승장에서 더 가파르게 오르고, 하락장에서는 더 크게 빠지는</strong> 경향이 있습니다.
        S&P 500은 산업 분산이 잘 돼 있어 상대적으로 변동이 완만합니다. 한쪽이 '정답'이라기보다, <strong>감내할 수 있는 변동성</strong>과
        투자 성향에 따라 선택이 달라집니다.
      </p>

      <h2>적립식 관점에서</h2>
      <p>
        매달 꾸준히 사 모으는 적립식에서는 변동성이 꼭 나쁜 것만은 아닙니다. 가격이 빠질 때 같은 금액으로 더 많은 수량을 담기 때문입니다.
        다만 변동이 큰 나스닥100·레버리지 상품은 <strong>시작·종료 시점에 따라 결과 편차가 크다</strong>는 점을 기억해야 합니다.
        실제 숫자가 궁금하다면 두 지수를 추종하는 ETF로 직접 비교해 보세요.
      </p>
      <ul>
        <li><Link href="/etf/qqq">QQQ 적립식 백테스트</Link> (나스닥100 1배)</li>
        <li><Link href="/etf/spy">SPY 적립식 백테스트</Link> (S&P 500)</li>
        <li><Link href="/etf/qld">QLD 적립식 백테스트</Link> (나스닥100 2배)</li>
      </ul>

      <p className="note">
        더 읽어보기: <Link href="/guides/etf-basics">ETF가 뭔가요?</Link> · <Link href="/guides/leverage-etf-risk">레버리지 ETF의 위험</Link>.
        본 내용은 정보 제공이며 투자 권유가 아닙니다.
      </p>
    </ContentShell>
  );
}
