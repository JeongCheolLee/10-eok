import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, articleLd, pageBreadcrumbLd } from "@/components/JsonLd";
import { TICKERS, tickerName, tickerCurrency } from "@/lib/tickers";
import { bundleToRows, type Bundle } from "@/lib/backtest/types";
import { runToToday } from "@/lib/backtest/simulate";
import { eok, pct } from "@/lib/format";
import { ETF_CONTENT } from "@/lib/etfContent";
import { Sources } from "@/components/Sources";
import type { SourceId } from "@/lib/sources";

// 기본 시나리오: 매달 100만원, 1일, 목표 10억
const M = 100;
const D = 1;
const G = 10;

type Blurb = { line: string; guides: { href: string; label: string }[] };
const BLURB: Record<string, Blurb> = {
  QLD: {
    line: "QLD는 미국 나스닥100 지수의 하루 수익률을 2배로 추종하는 레버리지 ETF입니다. 변동이 큰 만큼 적립식 효과도, 위험도 함께 커집니다.",
    guides: [
      { href: "/guides/qld", label: "QLD란 무엇인가" },
      { href: "/guides/leverage-etf-risk", label: "레버리지 ETF의 위험" },
    ],
  },
  TQQQ: {
    line: "TQQQ는 나스닥100을 하루 3배로 추종하는 초고변동 레버리지 ETF입니다. 상승장에선 폭발적이지만 하락·횡보장에서는 손실과 변동성 끌림이 매우 큽니다.",
    guides: [
      { href: "/guides/leverage-etf-risk", label: "레버리지 ETF의 위험" },
      { href: "/guides/qld", label: "QLD·레버리지 기초" },
    ],
  },
  QQQ: {
    line: "QQQ는 미국 기술주 중심의 나스닥100 지수를 1배로 추종하는 대표 ETF입니다. 레버리지 없이 지수를 그대로 담는 방식입니다.",
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/dca", label: "적립식 투자의 원리" },
    ],
  },
  SPY: {
    line: "SPY는 미국 대형주 500개로 구성된 S&P 500 지수를 추종하는, 세계에서 가장 오래되고 큰 ETF 중 하나입니다.",
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/dca-vs-lumpsum", label: "적립식 vs 거치식" },
    ],
  },
  VOO: {
    line: "VOO는 SPY와 같은 S&P 500 지수를 1배로 추종하는 뱅가드 ETF입니다. 담는 지수는 같고 운용사·보수가 다릅니다.",
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/nasdaq100-vs-sp500", label: "나스닥100 vs S&P 500" },
    ],
  },
  SCHD: {
    line: "SCHD는 배당을 꾸준히 잘 주는 미국 우량 기업 약 100곳을 담은 배당성장 ETF입니다. 성장주 지수와 성격이 다릅니다.",
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/overseas-tax", label: "해외주식 세금" },
    ],
  },
  VT: {
    line: "VT는 미국을 포함한 전 세계 주식 수천 종목을 한 번에 담는 뱅가드 ETF입니다. 분산의 폭이 가장 넓습니다.",
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/fx-impact", label: "환율의 영향" },
    ],
  },
  "069500.KS": {
    line: "KODEX 200은 한국 코스피200 지수를 추종하는 대표 국내 ETF입니다. 원화 자산이라 환율의 영향을 받지 않습니다.",
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/dca", label: "적립식 투자의 원리" },
    ],
  },
};

export function generateStaticParams() {
  return TICKERS.map((t) => ({ symbol: t.symbol.toLowerCase() }));
}

function resolve(symbolParam: string) {
  return TICKERS.find((t) => t.symbol.toLowerCase() === symbolParam.toLowerCase()) ?? null;
}

async function compute(symbol: string) {
  const file = path.join(process.cwd(), "public", "data", `${symbol.toLowerCase()}.json`);
  const b = JSON.parse(await fs.readFile(file, "utf8")) as Bundle;
  return runToToday(bundleToRows(b), { monthly: M * 10000, buyDay: D, target: G * 100_000_000 });
}

function display(symbol: string) {
  return tickerCurrency(symbol) === "KRW" ? `${tickerName(symbol)}(${symbol})` : `${symbol}(${tickerName(symbol)})`;
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;
  const info = resolve(symbol);
  if (!info) return {};
  const label = tickerCurrency(info.symbol) === "KRW" ? tickerName(info.symbol) : info.symbol;
  const title = `${label} 적립식 백테스트 — 매달 ${M}만원이면 10억까지? · 10-eok`;
  const description = `${display(info.symbol)}에 매달 ${M}만원씩 적립했다면 10억까지 얼마나 걸렸을지, 실제 과거 가격으로 계산한 결과와 직접 계산하는 도구를 제공합니다.`;
  return {
    title,
    description,
    alternates: { canonical: `/etf/${info.symbol.toLowerCase()}` },
    openGraph: { title, description, type: "article", images: [{ url: `/api/og?t=${info.symbol}&m=${M}&d=${D}&g=${G}`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [`/api/og?t=${info.symbol}&m=${M}&d=${D}&g=${G}`] },
  };
}

export default async function EtfPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const info = resolve(symbol);
  if (!info) notFound();

  const r = await compute(info.symbol);
  const sym = info.symbol;
  const lc = sym.toLowerCase();
  const label = tickerCurrency(sym) === "KRW" ? tickerName(sym) : sym;
  const blurb = BLURB[sym] ?? { line: `${tickerName(sym)} 적립식 백테스트 결과입니다.`, guides: [{ href: "/guides", label: "투자 가이드" }] };
  const content = ETF_CONTENT[sym];
  const startYm = r.series[0] ? r.series[0].date.slice(0, 7).replace("-", "년 ") + "월" : "";
  const appHref = `/?t=${sym}&m=${M}&d=${D}&g=${G}`;
  const title = `${label} 적립식 백테스트`;
  const sourceIds: SourceId[] = tickerCurrency(sym) === "USD" ? ["yahoo", "fredFx"] : ["yahoo"];
  if (sym === "QLD") sourceIds.push("prosharesQld");
  if (sym === "TQQQ") sourceIds.push("prosharesTqqq");
  if (sym === "VOO") sourceIds.push("vanguardVoo");
  if (sym === "SCHD") sourceIds.push("schwabSchd");
  if (sym === "VT") sourceIds.push("vanguardVt");

  return (
    <ContentShell title={title} desc={`매달 ${M}만원씩 모았다면 10억까지 얼마나 걸렸을까`} crumb={`종목 · ${label}`}>
      <JsonLd data={articleLd({ path: `/etf/${lc}`, title, description: blurb.line })} />
      <JsonLd data={pageBreadcrumbLd(label, `/etf/${lc}`)} />

      <p>{content?.lead ?? blurb.line}</p>

      <div className="callout">
        {r.reached ? (
          <>
            <strong>매달 {M}만원씩이면 약 {r.years}년 {r.monthsRem}개월 만에 10억</strong>
            <br />
            {startYm}부터 모았다면 지금 약 {eok(r.value)} · 원금 {eok(r.principal)} · 연평균 {pct(r.cagr)}
          </>
        ) : (
          <>
            <strong>아직 10억까지는 더 걸려요</strong>
            <br />
            전 구간 모아도 지금 약 {eok(r.value)} · 원금 {eok(r.principal)} · 연평균 {pct(r.cagr)}
          </>
        )}
        <div className="sub">
          ※ 매수일 {D}일 · 목표 10억 · 실제 과거 {tickerCurrency(sym) === "USD" ? "가격과 그날 환율" : "가격"} 기준. 과거 수익률은 미래를 보장하지 않습니다.
        </div>
      </div>

      <p style={{ marginTop: 16 }}>
        <Link href={appHref} className="btn-inline">
          내 조건으로 직접 계산해보기 →
        </Link>
      </p>

      {content ? (
        content.sections.map((s, i) => (
          <section key={i}>
            <h2>{s.h}</h2>
            {s.paras.map((para, j) => (
              <p key={j}>{para}</p>
            ))}
          </section>
        ))
      ) : (
        <>
          <h2>이 결과를 어떻게 읽어야 하나</h2>
          <p>
            위 숫자는 {startYm ? `${startYm}부터 ` : ""}매달 같은 날 같은 금액을 적립했다고 가정한 <strong>과거 시뮬레이션</strong>입니다.
            실제로는 매수 타이밍·세금·수수료·심리적 요인이 모두 다르게 작용합니다. 특히 레버리지 상품은 같은 구간이라도 시작 시점에 따라 결과가 크게 달라집니다.
          </p>
        </>
      )}
      <p>금액·매수일·목표 금액을 바꿔 보고 싶다면 위 버튼으로 직접 계산해 보세요.</p>

      <h2>함께 읽어보세요</h2>
      <ul>
        {blurb.guides.map((g) => (
          <li key={g.href}><Link href={g.href}>{g.label}</Link></li>
        ))}
        <li><Link href="/compare">{TICKERS.length}개 ETF 비교</Link></li>
        <li><Link href="/how-it-works">계산 방법 &amp; 자주 묻는 질문</Link></li>
      </ul>

      <Sources ids={sourceIds} />

      <p className="note">본 내용은 정보 제공이며 투자 권유나 자문이 아닙니다. 투자 결정은 스스로 판단하셔야 합니다.</p>
    </ContentShell>
  );
}
