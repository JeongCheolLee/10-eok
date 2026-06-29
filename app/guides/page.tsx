import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, pageBreadcrumbLd } from "@/components/JsonLd";
import { TICKERS, tickerName, tickerCurrency } from "@/lib/tickers";

export const metadata: Metadata = {
  title: "투자 가이드 · 10-eok",
  description: "QLD, 적립식 투자, 레버리지 ETF의 위험, 환율이 수익률에 미치는 영향을 쉽게 정리했어요.",
  alternates: { canonical: "/guides" },
};

const GUIDES = [
  { slug: "etf-basics", t: "ETF가 뭔가요? (초보자)", d: "상장지수펀드의 개념과 개별주식·펀드와의 차이를 처음부터 쉽게." },
  { slug: "qld", t: "QLD란 무엇인가", d: "나스닥100을 하루 2배로 추종하는 레버리지 ETF, QLD를 기초부터 정리합니다." },
  { slug: "dca", t: "적립식 투자(DCA)의 원리", d: "매달 일정 금액을 꾸준히 사는 방식이 왜 마음 편한 투자인지 설명합니다." },
  { slug: "dca-vs-lumpsum", t: "적립식 vs 거치식", d: "한 번에 넣을까 나눠 넣을까 — 둘의 차이와 상황별 선택 기준." },
  { slug: "leverage-etf-risk", t: "레버리지 ETF의 위험", d: "2배의 수익만큼 2배의 손실, 그리고 '변동성 끌림'이라는 숨은 함정." },
  { slug: "fx-impact", t: "환율이 수익률에 미치는 영향", d: "원화로 달러 자산을 살 때, 환율이 어떻게 수익을 더하거나 깎는지." },
  { slug: "overseas-tax", t: "해외주식·ETF 세금 기초", d: "양도소득세·배당소득세와 국내 상장 종목과의 차이." },
  { slug: "compound-72", t: "복리와 72의 법칙", d: "돈이 돈을 버는 복리의 원리와, 두 배 되는 기간을 암산하는 법." },
  { slug: "nasdaq100-vs-sp500", t: "나스닥100 vs S&P 500", d: "QQQ와 SPY, 구성·성격·변동성이 어떻게 다른지 비교." },
];

export default function GuidesIndex() {
  return (
    <ContentShell title="투자 가이드" desc="10-eok의 백테스트를 더 잘 이해하기 위한 배경 지식이에요." crumb="가이드" byline>
      <JsonLd data={pageBreadcrumbLd("가이드", "/guides")} />
      <div className="cardlinks">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="cardlink">
            <div className="t">{g.t}</div>
            <div className="d">{g.d}</div>
          </Link>
        ))}
      </div>

      <h2>종목별 적립식 백테스트</h2>
      <div className="cardlinks">
        {TICKERS.map((t) => {
          const label = tickerCurrency(t.symbol) === "KRW" ? tickerName(t.symbol) : t.symbol;
          return (
            <Link key={t.symbol} href={`/etf/${t.symbol.toLowerCase()}`} className="cardlink">
              <div className="t">{label} 적립식 백테스트</div>
              <div className="d">매달 100만원씩 모았다면 10억까지 얼마나 — 실제 과거 데이터로.</div>
            </Link>
          );
        })}
      </div>

      <p className="note">이 글들은 일반적인 정보 제공을 위한 것이며 투자 권유나 자문이 아닙니다.</p>
    </ContentShell>
  );
}
