import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { AUTHOR, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개 · 10-eok",
  description: "10-eok은 '과거에 매달 모았다면 10억까지 얼마나 걸렸을까'를 실제 데이터로 보여주는 백테스트 서비스입니다. 만든 사람과 운영 방식을 소개합니다.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return (
    <ContentShell title="소개" desc="10-eok이 무엇이고, 누가 무엇을 위해 만들었는지" crumb="소개">
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

      <h2>누가 만들었나</h2>
      <p>
        10-eok은 개발자이자 개인 투자자인 <strong>{AUTHOR}</strong>의 개인 프로젝트입니다. 금융사나
        자문업체가 아니라, "과거에 이렇게 모았으면 어땠을까?"가 직접 궁금해서 실제 데이터로 검증해 보려고
        만들었습니다. 그래서 결과를 부풀리기보다, 가정과 한계, 환율·세금 같은 현실 요소를 최대한 솔직하게
        드러내는 데 초점을 뒀습니다. 저는 금융 자격을 가진 전문가가 아니며, 이 사이트는 특정 상품을 권유하지
        않습니다.
      </p>
      <p>
        계산 로직은 공개된 순수 함수로 작성하고 단위·골든 테스트로 검증합니다. 가격은{" "}
        <a href="https://finance.yahoo.com" target="_blank" rel="noopener">Yahoo Finance</a>, 환율은{" "}
        <a href="https://fred.stlouisfed.org/series/DEXKOUS" target="_blank" rel="noopener">미국 연방준비제도(FRED)</a>의 공개 데이터를 매일 자동으로 받아 반영합니다. 계산 방식의 전제와 단순화는{" "}
        <a href="/how-it-works">계산 방법 &amp; FAQ</a>에서 투명하게 공개합니다.
      </p>

      <h2>앞으로</h2>
      <p>
        현재 QLD·TQQQ·QQQ·SPY·KODEX 200(코스피200) 다섯 종목을 지원하며, 종목 간 비교, 물가 상승률을 반영한
        적립, 목표 기간을 정하면 필요한 월 적립액을 역산하는 기능 등을 더해 가고 있습니다. 오류 제보나 추가
        종목 요청은 언제든 환영합니다.
      </p>

      <p className="note">
        10-eok은 교육·정보 제공 도구이며 투자 권유나 자문이 아닙니다. 문의는{" "}
        <a href="/contact">문의 페이지</a> 또는{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>로 주세요.
      </p>
    </ContentShell>
  );
}
