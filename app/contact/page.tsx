import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";

export const metadata: Metadata = {
  title: "문의 · 10-eok",
  description: "10-eok에 대한 문의, 오류 제보, 종목 추가 요청은 이메일로 보내주세요.",
};

export default function Page() {
  return (
    <ContentShell title="문의" desc="궁금한 점, 오류 제보, 종목 추가 요청 환영합니다" crumb="문의">
      <p>아래 이메일로 연락 주세요. 보통 영업일 기준 며칠 안에 답변드립니다.</p>
      <p>
        <strong>이메일:</strong>{" "}
        <a href="mailto:jclee7503@gmail.com">jclee7503@gmail.com</a>
      </p>

      <h2>이런 내용을 보내주시면 좋아요</h2>
      <ul>
        <li>계산 결과가 이상해 보이는 경우(입력값과 함께 알려주시면 좋습니다)</li>
        <li>추가했으면 하는 종목</li>
        <li>가이드 글에서 잘못된 정보나 오타</li>
        <li>기능 제안</li>
      </ul>

      <p className="note">
        개인 투자 상담에는 답변드리지 않습니다. 10-eok은 정보 제공 도구이며 투자 권유나 자문이 아닙니다.
      </p>
    </ContentShell>
  );
}
