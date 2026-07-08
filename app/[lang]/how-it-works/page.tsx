import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, faqLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n/locales";
import { getDict } from "@/lib/i18n/dict";
import { langAlternates } from "@/lib/i18n/seo";
import { HOW_IT_WORKS_EN } from "@/lib/content/pages/en";
import { HOW_IT_WORKS_JA } from "@/lib/content/pages/ja";
import { HOW_IT_WORKS_DE } from "@/lib/content/pages/de";

const FAQ_KO = [
  { q: "결과가 미래 수익을 보장하나요?", a: "아니요. 모든 결과는 '과거에 그렇게 했다면'의 기록일 뿐이며, 과거 수익률은 미래를 보장하지 않습니다." },
  { q: "왜 QLD부터인가요?", a: "데이터가 길고(2006년~) 변동이 커서 적립식 효과를 보여주기 좋기 때문입니다. 종목은 점차 늘릴 예정입니다." },
  { q: "'연평균'은 무슨 뜻인가요?", a: "보유 구간 동안 자산 가치가 1년에 평균 몇 %씩 늘었는지를 나타낸 값(연복리 수익률)입니다." },
  { q: "배당 재투자 ON/OFF는 뭐가 다른가요?", a: "ON(기본)은 배당을 다시 사 모은 총수익(수정주가) 기준, OFF는 배당을 뺀 주가만(가격수익)입니다. 배당이 큰 종목일수록 차이가 큽니다." },
  { q: "물가만큼 매년 인상은 뭔가요?", a: "매달 같은 금액 대신 적립액을 한국 소비자물가지수(CPI)만큼 매년 올려 적립한 시나리오입니다. 소득이 물가만큼 오른다고 가정할 때 더 현실적입니다." },
  { q: "양도세 반영은 어떻게 계산하나요?", a: "해외주식(미국)만 적용합니다. 끝 시점에 전부 판다고 가정해 차익에 22%(연 250만원 공제 1회 단순화)를 매겨 세후 금액으로 보여줍니다. 국내주식은 비과세이며, 배당소득세(15.4%)는 반영하지 않습니다." },
  { q: "실제로 이대로 투자하면 되나요?", a: "본 서비스는 정보 제공 도구이며 투자 권유나 자문이 아닙니다. 레버리지 상품의 위험을 충분히 이해하고 투자 결정은 스스로 판단하셔야 합니다." },
];

function KoBody() {
  return (
    <>
      <h2>한눈에 보는 계산 절차</h2>
      <ol>
        <li>선택한 종목의 <strong>일별 수정주가</strong>와 <strong>일별 원/달러 환율</strong>을 가져옵니다.</li>
        <li>매달 지정한 <strong>매수일</strong>(휴장일이면 다음 거래일)에, 지정한 <strong>원화 금액</strong>을 그날 환율로 달러로 바꿔 종목을 삽니다.</li>
        <li>거래일마다 보유 수량 × 그날 주가 × 그날 환율로 <strong>원화 평가액</strong>을 계산합니다.</li>
        <li>평가액이 처음으로 <strong>10억 원</strong>을 넘는 날을 찾아 "며칠 걸렸는지"를 보여줍니다.</li>
      </ol>

      <h2>데이터 출처</h2>
      <ul>
        <li><strong>가격:</strong> <a href="https://finance.yahoo.com" target="_blank" rel="noopener">Yahoo Finance</a>의 일별 수정주가(adjusted close). 배당 재투자와 액면분할, 운용보수가 이미 반영된 값입니다.</li>
        <li><strong>환율:</strong> <a href="https://fred.stlouisfed.org/series/DEXKOUS" target="_blank" rel="noopener">미국 세인트루이스 연방준비은행(FRED)의 일별 원/달러(DEXKOUS)</a> 시계열.</li>
        <li><strong>물가지수:</strong> <a href="https://fred.stlouisfed.org/series/KORCPIALLMINMEI" target="_blank" rel="noopener">한국 소비자물가지수(FRED, KORCPIALLMINMEI)</a>. &lsquo;물가만큼 매년 인상&rsquo; 옵션에 사용합니다.</li>
        <li>데이터는 매일 한 번 자동으로 갱신됩니다.</li>
      </ul>

      <h2>전제와 단순화</h2>
      <ul>
        <li>배당은 <strong>재투자</strong>한 것으로 봅니다(수정주가 사용).</li>
        <li><strong>세금</strong>은 기본적으로 넣지 않습니다(평가액 기준, 아직 팔지 않은 미실현 상태). 다만 <strong>&lsquo;양도세 반영&rsquo;</strong>을 켜면 해외주식(미국)에 한해 끝 시점에 전부 판다고 가정하고 차익에 22%(연 250만원 공제 1회 단순화)를 매겨 세후 금액으로 보여줍니다. 배당소득세(15.4%)는 반영하지 않습니다.</li>
        <li>매매 수수료·스프레드는 단순화를 위해 제외했습니다.</li>
        <li>주식을 소수점 단위로 살 수 있다고 가정합니다(모델 단순화).</li>
      </ul>

      <h2>자주 묻는 질문</h2>
      <h3>결과가 미래 수익을 보장하나요?</h3>
      <p>아니요. 모든 결과는 "과거에 그렇게 했다면"의 기록일 뿐입니다. 과거 수익률은 미래를 보장하지 않습니다.</p>
      <h3>왜 QLD부터인가요?</h3>
      <p>데이터가 길고(2006년~) 변동이 커서 적립식 효과를 보여주기 좋기 때문입니다. 종목은 점차 늘릴 예정입니다.</p>
      <h3>"연평균"은 무슨 뜻인가요?</h3>
      <p>보유 구간 동안 자산 가치가 1년에 평균 몇 %씩 늘었는지를 나타낸 값(연복리 수익률)입니다.</p>
      <h3>배당 재투자 ON/OFF는 뭐가 다른가요?</h3>
      <p>ON(기본)은 배당을 다시 사 모은 <strong>총수익(수정주가)</strong> 기준, OFF는 배당을 뺀 <strong>주가만(가격수익)</strong>입니다. OFF는 배당이 빠져 실제보다 낮게 나오며, 배당이 큰 종목일수록 둘의 차이가 큽니다.</p>
      <h3>물가만큼 매년 인상은 뭔가요?</h3>
      <p>매달 같은 금액 대신, 적립액을 한국 소비자물가지수(CPI)만큼 매년 올려 적립한 시나리오입니다. 실제 소득이 물가만큼 오른다고 가정할 때 더 현실적입니다.</p>
      <h3>양도세 반영은 어떻게 계산하나요?</h3>
      <p>해외주식(미국)만 적용합니다. 끝 시점에 전부 판다고 가정해 차익에 <strong>22%</strong>(연 250만원 공제 1회 단순화)를 매겨 세후 금액으로 보여줍니다. 국내주식은 일반투자자 양도세가 비과세라 0으로 둡니다. 배당소득세(15.4%)는 별도이며 반영하지 않습니다.</p>
      <h3>실제로 이대로 투자하면 되나요?</h3>
      <p>본 서비스는 정보 제공 도구이며 투자 권유나 자문이 아닙니다. 레버리지 상품의 위험을 충분히 이해하고, 투자 결정은 스스로 판단하셔야 합니다.</p>

      <p className="note">
        계산 로직의 자세한 동작은 <a href="/guides">가이드</a>에서 더 읽어볼 수 있어요.
      </p>
    </>
  );
}

type Entry = {
  metaTitle: string;
  metaDescription: string;
  head: { title: string; desc: string };
  // FAQPage 구조화 데이터용(있을 때만 emit). ja/de는 본문에 FAQ가 있으나 배열 미노출 → JSON-LD 생략.
  faq?: { q: string; a: string }[];
  Body: () => ReactNode;
};
const DATA: Record<Locale, Entry> = {
  ko: {
    metaTitle: "계산 방법 & 자주 묻는 질문 · 10-eok",
    metaDescription: "10-eok이 실제 과거 가격과 환율로 어떻게 백테스트를 계산하는지, 그리고 자주 묻는 질문을 정리했어요.",
    head: { title: "계산 방법 & 자주 묻는 질문", desc: "10-eok이 결과를 어떻게 만들어내는지" },
    faq: FAQ_KO,
    Body: KoBody,
  },
  en: HOW_IT_WORKS_EN,
  ja: HOW_IT_WORKS_JA,
  de: HOW_IT_WORKS_DE,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in DATA ? (lang as Locale) : "ko";
  const d = DATA[locale];
  return { title: d.metaTitle, description: d.metaDescription, alternates: langAlternates(locale, "/how-it-works") };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in DATA ? (lang as Locale) : "ko";
  const d = DATA[locale];
  const Body = d.Body;
  return (
    <ContentShell title={d.head.title} desc={d.head.desc} crumb={getDict(locale).nav.howItWorks}>
      {d.faq && <JsonLd data={faqLd(d.faq)} />}
      <Body />
    </ContentShell>
  );
}
