import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";

export const metadata: Metadata = {
  title: "해외주식·ETF 세금 기초 · 10-eok",
  description: "미국 주식·ETF 투자 시 내는 양도소득세와 배당소득세, 국내 상장 종목과의 차이를 쉽게 정리했어요.",
};

export default function Page() {
  return (
    <ContentShell title="해외주식·ETF 세금 기초" desc="양도세·배당세, 뭐가 다른가" crumb="가이드 · 세금">
      <p>
        해외 종목(미국 ETF·주식)에 투자하면 두 가지 세금이 관계됩니다. <strong>양도소득세</strong>(팔아서
        차익이 났을 때)와 <strong>배당소득세</strong>(배당을 받을 때)입니다. 헷갈리기 쉬워 기본만 정리합니다.
      </p>

      <h2>양도소득세 (팔 때)</h2>
      <ul>
        <li>해외주식 양도차익에는 <strong>22%</strong>(지방세 포함)의 세율이 적용됩니다.</li>
        <li>연 <strong>250만원</strong>까지는 기본 공제라 그만큼은 세금이 없습니다.</li>
        <li>실제로 <strong>팔아서 이익을 실현한 해</strong>에만 과세됩니다. 들고만 있으면(미실현) 과세되지 않습니다.</li>
      </ul>

      <h2>배당소득세 (받을 때)</h2>
      <p>
        배당을 받으면 보통 <strong>15.4%</strong>(미국 원천징수 등 구조는 종목·국가별로 다름)가 떼입니다.
        금융소득이 크면 종합과세 대상이 될 수도 있습니다.
      </p>

      <h2>국내 상장 종목은 다르다</h2>
      <p>
        삼성전자 같은 <strong>국내 상장 주식</strong>은 일반 투자자(소액주주)의 <strong>양도차익이
        비과세</strong>입니다(배당소득세는 동일하게 있음). 그래서 같은 백테스트라도 해외와 국내는
        세금 처리가 다릅니다.
      </p>

      <h2>10-eok의 세금 옵션</h2>
      <p>
        10-eok은 결과 화면의 "양도세 반영" 옵션을 켜면, <strong>끝 시점에 전부 판다고 가정</strong>해
        해외주식은 22%(250만 공제 1회 단순화)를 매겨 세후로 보여줍니다. 국내주식은 0으로 둡니다.
        배당소득세는 단순화를 위해 반영하지 않습니다. 자세한 계산 가정은
        <a href="/how-it-works">계산 방법</a>을 참고하세요.
      </p>

      <p className="note">세법은 바뀔 수 있고 개인 상황(보유기간·금융소득 규모 등)에 따라 다릅니다. 본 글은 일반 정보이며 세무·투자 자문이 아닙니다. 정확한 내용은 세무 전문가나 국세청 안내를 확인하세요.</p>
    </ContentShell>
  );
}
