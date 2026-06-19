import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, guideLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "적립식 vs 거치식, 뭐가 나을까 · 10-eok",
  description: "목돈을 한 번에 넣는 거치식과 매달 나눠 넣는 적립식, 둘의 차이와 상황별 선택 기준을 정리했어요.",
  alternates: { canonical: "/guides/dca-vs-lumpsum" },
};

export default function Page() {
  return (
    <ContentShell title="적립식 vs 거치식" desc="한 번에 넣을까, 나눠 넣을까" crumb="가이드 · 적립 vs 거치">
      <JsonLd data={guideLd({ path: "/guides/dca-vs-lumpsum", title: "적립식 vs 거치식, 뭐가 나을까", description: "목돈을 한 번에 넣는 거치식과 매달 나눠 넣는 적립식, 둘의 차이와 상황별 선택 기준을 정리했어요.", name: "적립식 vs 거치식" })} />
      <p>
        같은 돈을 투자해도 <strong>방법</strong>이 다릅니다. <strong>거치식</strong>은 목돈을 한 번에
        넣는 방식, <strong>적립식</strong>은 매달 나눠 넣는 방식입니다. 어느 쪽이 정답일까요?
        결론부터 말하면 "상황에 따라 다르다"입니다.
      </p>

      <h2>수익만 보면 거치식이 유리한 경우가 많다</h2>
      <p>
        시장은 장기적으로 우상향한 구간이 많았습니다. 그런 구간에서는 <strong>일찍 전부 넣은
        거치식</strong>이 더 오래 시장에 노출돼 수익이 더 큰 경우가 많습니다. 즉 "들어갈 돈이 이미
        있고, 장기 우상향을 믿는다면" 거치식이 기대수익은 높습니다.
      </p>

      <h2>그런데 현실은 적립식인 이유</h2>
      <ul>
        <li><strong>목돈이 없다.</strong> 대부분은 매달 월급에서 떼어 투자합니다. 그러면 자연히 적립식입니다.</li>
        <li><strong>심리적 부담이 작다.</strong> 한 번에 넣은 직후 폭락하면 견디기 어렵습니다. 나눠 넣으면 고점에 전부 물릴 위험이 줄어듭니다.</li>
        <li><strong>꾸준함이 쉽다.</strong> 매수 시점을 고민하지 않고 기계적으로 이어갈 수 있습니다.</li>
      </ul>

      <h2>둘을 가르는 핵심 질문</h2>
      <ul>
        <li>지금 투자할 <strong>목돈이 이미 있는가</strong>? → 있으면 거치식도 후보.</li>
        <li>큰 하락을 <strong>심리적으로 버틸 수 있는가</strong>? → 자신 없으면 적립식이 편하다.</li>
        <li>변동이 큰 상품(레버리지 등)인가? → 변동이 클수록 적립식의 시점 분산 효과가 체감된다.</li>
      </ul>

      <p>
        10-eok은 <strong>적립식</strong>(매달 일정액)을 기준으로 계산합니다. 적립식의 원리는
        <a href="/guides/dca">적립식 투자(DCA)의 원리</a>에서 더 볼 수 있어요.
      </p>

      <p className="note">과거 어떤 방식이 유리했다고 미래에도 그렇다는 보장은 없습니다. 정보 제공이며 투자 권유가 아닙니다.</p>
    </ContentShell>
  );
}
