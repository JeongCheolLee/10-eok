import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";

export const metadata: Metadata = {
  title: "투자 가이드 · 10-eok",
  description: "QLD, 적립식 투자, 레버리지 ETF의 위험, 환율이 수익률에 미치는 영향을 쉽게 정리했어요.",
};

const GUIDES = [
  { slug: "qld", t: "QLD란 무엇인가", d: "나스닥100을 하루 2배로 추종하는 레버리지 ETF, QLD를 기초부터 정리합니다." },
  { slug: "dca", t: "적립식 투자(DCA)의 원리", d: "매달 일정 금액을 꾸준히 사는 방식이 왜 마음 편한 투자인지 설명합니다." },
  { slug: "leverage-etf-risk", t: "레버리지 ETF의 위험", d: "2배의 수익만큼 2배의 손실, 그리고 '변동성 끌림'이라는 숨은 함정." },
  { slug: "fx-impact", t: "환율이 수익률에 미치는 영향", d: "원화로 달러 자산을 살 때, 환율이 어떻게 수익을 더하거나 깎는지." },
];

export default function GuidesIndex() {
  return (
    <ContentShell title="투자 가이드" desc="10-eok의 백테스트를 더 잘 이해하기 위한 배경 지식이에요." crumb="가이드">
      <div className="cardlinks">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="cardlink">
            <div className="t">{g.t}</div>
            <div className="d">{g.d}</div>
          </Link>
        ))}
      </div>
      <p className="note">이 글들은 일반적인 정보 제공을 위한 것이며 투자 권유나 자문이 아닙니다.</p>
    </ContentShell>
  );
}
