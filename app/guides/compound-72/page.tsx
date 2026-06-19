import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, guideLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "복리와 72의 법칙 · 10-eok",
  description: "돈이 돈을 버는 복리의 원리와, 자산이 두 배가 되는 기간을 암산하는 '72의 법칙'을 쉬운 예시로 정리했어요.",
  alternates: { canonical: "/guides/compound-72" },
};

export default function Page() {
  return (
    <ContentShell title="복리와 72의 법칙" desc="돈이 돈을 버는 원리, 그리고 두 배 되는 기간 암산법" crumb="가이드 · 복리">
      <JsonLd
        data={guideLd({
          path: "/guides/compound-72",
          title: "복리와 72의 법칙",
          description: "돈이 돈을 버는 복리의 원리와, 자산이 두 배가 되는 기간을 암산하는 '72의 법칙'을 쉬운 예시로 정리했어요.",
          name: "복리와 72의 법칙",
        })}
      />

      <p>
        복리(複利)는 원금이 만든 수익이 다시 원금에 더해져, 그 다음부터는 <strong>수익이 또 수익을 낳는</strong> 구조입니다.
        단리(원금에만 이자가 붙는 방식)와 달리, 시간이 길어질수록 단리와의 차이가 기하급수적으로 벌어집니다. 적립식 장기 투자가
        강력한 이유가 바로 여기에 있습니다.
      </p>

      <h2>단리 vs 복리, 한 줄 비교</h2>
      <ul>
        <li><strong>단리:</strong> 매년 원금 100만원에만 10% → 매년 +10만원으로 일정.</li>
        <li><strong>복리:</strong> 1년 뒤 110만원, 2년 뒤 121만원, 3년 뒤 133.1만원 … 늘어나는 폭 자체가 매년 커집니다.</li>
      </ul>

      <h2>72의 법칙</h2>
      <p>
        "내 돈이 두 배가 되려면 몇 년 걸릴까?"를 암산하는 간단한 공식이 <strong>72의 법칙</strong>입니다.
        <strong> 72 ÷ 연 수익률(%) ≈ 두 배가 되는 햇수</strong>입니다.
      </p>
      <ul>
        <li>연 6% → 72 ÷ 6 = <strong>약 12년</strong>에 두 배</li>
        <li>연 8% → 72 ÷ 8 = <strong>약 9년</strong></li>
        <li>연 12% → 72 ÷ 12 = <strong>약 6년</strong></li>
      </ul>
      <p>
        반대로 두 배 되는 기간을 알면 수익률도 거꾸로 추정할 수 있습니다. 정확한 값은 아니지만, 복리의 위력을 직관적으로
        가늠하는 데 충분히 쓸 만한 어림셈입니다.
      </p>

      <h2>적립식에서 더 중요한 것</h2>
      <p>
        한 번 넣고 두는 거치식과 달리, 적립식은 <strong>원금이 매달 늘어나는 동시에</strong> 먼저 넣은 돈에는 복리가 쌓입니다.
        그래서 초반에는 원금 비중이 크지만, 시간이 지날수록 <strong>수익이 차지하는 비중</strong>이 커지며 곡선이 가팔라집니다.
        10-eok의 결과 화면에서 '원금'과 '최종 금액'의 차이가 뒤로 갈수록 벌어지는 것이 바로 이 효과입니다.
      </p>

      <p className="note">
        복리는 시간이 핵심 변수입니다. 다만 높은 수익률에는 그만큼 큰 변동·손실 위험이 따른다는 점도 함께 보셔야 해요.
        관련해서 <Link href="/guides/dca">적립식 투자의 원리</Link>와 <Link href="/guides/leverage-etf-risk">레버리지 ETF의 위험</Link>도 읽어보세요.
        본 내용은 정보 제공이며 투자 권유가 아닙니다.
      </p>
    </ContentShell>
  );
}
