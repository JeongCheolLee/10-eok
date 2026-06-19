import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";

export const metadata: Metadata = {
  title: "개인정보처리방침 · 10-eok",
  description: "10-eok의 개인정보 수집·이용, 쿠키, 광고(Google AdSense) 관련 처리방침입니다.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <ContentShell title="개인정보처리방침" desc="최종 업데이트: 2026-06-19" crumb="개인정보처리방침">
      <p>
        10-eok(이하 "서비스")은 이용자의 개인정보를 중요하게 생각합니다. 본 방침은 서비스가 어떤 정보를
        어떻게 다루는지 설명합니다.
      </p>

      <h2>1. 수집하는 정보</h2>
      <p>
        서비스는 회원가입이 없으며, 이름·연락처 같은 개인을 직접 식별하는 정보를 직접 수집하지 않습니다.
        백테스트에 입력하는 금액·매수일 등은 브라우저 안에서 계산에 쓰일 뿐 서버에 저장되지 않습니다.
      </p>

      <h2>2. 쿠키 및 자동 수집 정보</h2>
      <p>
        서비스는 접속 통계와 광고 제공을 위해 쿠키 및 유사 기술을 사용할 수 있습니다. 이 과정에서 브라우저
        종류, 방문 페이지, 접속 시각 등 식별되지 않는 일반 정보가 수집될 수 있습니다.
      </p>

      <h2>3. 광고 (Google AdSense)</h2>
      <ul>
        <li>본 서비스는 제3자 광고 제공업체인 Google을 이용해 광고를 게재할 수 있습니다.</li>
        <li>Google을 포함한 제3자 공급업체는 쿠키를 사용해 이용자의 이전 방문 기록을 바탕으로 광고를 제공합니다.</li>
        <li>이용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google 광고 설정</a>에서 맞춤 광고를 끌 수 있으며, <a href="https://www.aboutads.info" target="_blank" rel="noopener">www.aboutads.info</a>에서 제3자 쿠키 사용을 거부할 수 있습니다.</li>
      </ul>

      <h2>4. 외부 데이터</h2>
      <p>
        가격 데이터는 Yahoo Finance, 환율 데이터는 미국 세인트루이스 연방준비은행(FRED)에서 가져옵니다.
        이는 공개된 시장 데이터이며 이용자 개인정보와 무관합니다.
      </p>

      <h2>5. 정보 보관 및 보호</h2>
      <p>
        서비스는 개인을 식별하는 정보를 서버에 저장하지 않습니다. 통계·광고 목적의 데이터는 해당
        제공업체의 정책에 따라 처리·보관됩니다.
      </p>

      <h2>6. 방침 변경</h2>
      <p>본 방침은 법령이나 서비스 변경에 따라 수정될 수 있으며, 변경 시 본 페이지에 게시합니다.</p>

      <h2>7. 문의</h2>
      <p>
        개인정보 관련 문의는 <a href="mailto:jclee7503@gmail.com">jclee7503@gmail.com</a>으로
        보내주세요.
      </p>
    </ContentShell>
  );
}
