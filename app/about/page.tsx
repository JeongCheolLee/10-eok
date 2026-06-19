import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";

export const metadata: Metadata = {
  title: "소개 · 10-eok",
  description: "10-eok은 '과거에 매달 모았다면 10억까지 얼마나 걸렸을까'를 실제 데이터로 보여주는 백테스트 서비스입니다.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return (
    <ContentShell title="소개" desc="10-eok이 무엇이고, 무엇을 위해 만들어졌는지" crumb="소개">
      <p>
        <strong>10-eok</strong>은 "과거에 매달 일정 금액을 모았다면, 10억 원까지 얼마나 걸렸을까?"라는
        궁금증을 <strong>실제 과거 데이터</strong>로 답해 주는 백테스트 서비스입니다.
      </p>

      <h2>무엇이 다른가</h2>
      <ul>
        <li><strong>역방향 질문.</strong> 대부분의 계산기는 "얼마가 될까"를 묻지만, 10-eok은 "내 목표(10억)까지 얼마나 걸리나"를 묻습니다.</li>
        <li><strong>한국인의 현실 반영.</strong> 달러 자산을 원화로 사는 상황에서 빠지기 쉬운 환율 효과를, 매수·평가 시점의 실제 일별 환율로 반영합니다.</li>
        <li><strong>진짜 데이터.</strong> 가정된 고정 수익률이 아니라 실제 일별 종가로 계산합니다.</li>
      </ul>

      <h2>어떻게 쓰나</h2>
      <p>
        종목과 매달 적립 금액, 매수일을 고르면 끝입니다. 그러면 10억에 도달하기까지 걸린 기간과 자산이
        불어난 과정을 그래프로 보여줍니다. 금액이나 날짜를 바꾸면 즉시 다시 계산됩니다.
      </p>

      <h2>앞으로</h2>
      <p>
        지금은 QLD 한 종목으로 시작하지만, 종목을 점차 늘리고 종목 간 비교, 물가 상승률을 반영한 적립
        등도 더해 갈 예정입니다. 계산 방식은 <a href="/how-it-works">계산 방법</a> 페이지에서 투명하게
        공개합니다.
      </p>

      <p className="note">
        10-eok은 정보 제공 도구이며 투자 권유나 자문이 아닙니다. 문의는 <a href="/contact">문의 페이지</a>를
        통해 주세요.
      </p>
    </ContentShell>
  );
}
