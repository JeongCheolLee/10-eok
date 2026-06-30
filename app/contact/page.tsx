import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { AUTHOR, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "문의 · 10-eok",
  description: "10-eok에 대한 문의, 오류 제보, 종목 추가 요청은 이메일로 보내주세요.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <ContentShell title="문의" desc="궁금한 점, 오류 제보, 종목 추가 요청 환영합니다" crumb="문의">
      <p>
        안녕하세요, 10-eok을 만들고 운영하는 <strong>{AUTHOR}</strong>입니다. 금융사나 자문업체가 아니라
        <strong> 개발자이자 개인 투자자</strong>로, 평소 "과거에 이렇게 모았으면 어땠을까"가 궁금해 실제
        데이터로 직접 확인해 보려고 이 도구를 만들었어요.
      </p>
      <p>
        궁금한 점이나 오류 제보, 종목 추가 요청은 아래 이메일로 편하게 보내주세요. 보통 영업일 기준 며칠 안에
        답변드립니다.
      </p>
      <p>
        <strong>이메일:</strong>{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
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
