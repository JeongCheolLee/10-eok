import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, articleLd, pageBreadcrumbLd } from "@/components/JsonLd";
import { TICKERS, tickerName, tickerCurrency } from "@/lib/tickers";
import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import { runToToday } from "@/lib/backtest/simulate";
import { getEtfContent } from "@/lib/etfContent";
import { getMarket, type Market } from "@/lib/i18n/markets";
import { getFormatter } from "@/lib/i18n/format";
import { getDict } from "@/lib/i18n/dict";
import { langAlternates, localeHref } from "@/lib/i18n/seo";
import type { Locale } from "@/lib/i18n/locales";
import { Sources } from "@/components/Sources";
import type { SourceId } from "@/lib/sources";

// ko 전용(불변) — 현재 렌더 문구·순서·구조를 그대로 보존. 새 로케일은 RELATED_SLUGS/GUIDE_LABEL 사용.
type KoBlurb = { line: string; guides: { href: string; label: string }[] };
const BLURB_KO: Record<string, KoBlurb> = {
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
function koBlurb(sym: string): KoBlurb {
  return BLURB_KO[sym] ?? { line: `${tickerName(sym)} 적립식 백테스트 결과입니다.`, guides: [{ href: "/guides", label: "투자 가이드" }] };
}

// en/ja/de(신규 로케일) 관련 가이드 — 가이드 7편 중 번역이 끝난 6편만 사용(overseas-tax·fx-impact는 ko 전용).
const RELATED_SLUGS: Record<string, string[]> = {
  QLD: ["qld", "leverage-etf-risk"],
  TQQQ: ["leverage-etf-risk", "qld"],
  QQQ: ["etf-basics", "dca"],
  SPY: ["etf-basics", "dca-vs-lumpsum"],
  VOO: ["etf-basics", "nasdaq100-vs-sp500"],
  SCHD: ["etf-basics", "dca-vs-lumpsum"],
  VT: ["etf-basics", "dca"],
  SOXX: ["etf-basics", "dca"],
  VGT: ["etf-basics", "dca"],
  VNQ: ["etf-basics", "dca-vs-lumpsum"],
  GLD: ["etf-basics", "dca"],
  TLT: ["etf-basics", "dca"],
  AGG: ["etf-basics", "dca"],
  JEPI: ["etf-basics", "dca-vs-lumpsum"],
  JEPQ: ["etf-basics", "dca-vs-lumpsum"],
};
const GUIDE_LABEL: Record<string, Record<Locale, string>> = {
  qld: { ko: "QLD란 무엇인가", en: "What Is QLD?", ja: "QLDとは何か", de: "Was ist QLD?" },
  "leverage-etf-risk": { ko: "레버리지 ETF의 위험", en: "The Risks of Leveraged ETFs", ja: "レバレッジETFのリスク", de: "Das Risiko von Hebel-ETFs" },
  "etf-basics": { ko: "ETF가 뭔가요?", en: "What Is an ETF?", ja: "ETFって何?", de: "Was ist ein ETF?" },
  dca: { ko: "적립식 투자의 원리", en: "The Logic of DCA", ja: "積立投資(DCA)の仕組み", de: "Das Prinzip des Sparplans (DCA)" },
  "dca-vs-lumpsum": { ko: "적립식 vs 거치식", en: "DCA vs. Lump Sum", ja: "積立投資 vs 一括投資", de: "Sparplan vs. Einmalanlage" },
  "nasdaq100-vs-sp500": { ko: "나스닥100 vs S&P 500", en: "Nasdaq-100 vs. S&P 500", ja: "ナスダック100 vs S&P 500", de: "Nasdaq 100 vs. S&P 500" },
};
function relatedGuides(sym: string, locale: Locale): { href: string; label: string }[] {
  const slugs = RELATED_SLUGS[sym] ?? ["etf-basics", "dca"];
  return slugs.map((slug) => ({ href: localeHref(locale, `/guides/${slug}`), label: GUIDE_LABEL[slug][locale] }));
}

export function generateStaticParams({ params }: { params: { lang: string } }) {
  const market = getMarket(params.lang as Locale);
  return market.tickers.map((symbol) => ({ symbol: symbol.toLowerCase() }));
}

function resolve(symbolParam: string) {
  return TICKERS.find((t) => t.symbol.toLowerCase() === symbolParam.toLowerCase()) ?? null;
}

/** 미국 대표 티커는 원어 그대로(sym), KRW 종목(KODEX)만 한국어 이름 사용 — locale과 무관, 자산의 원 통화 기준. */
function tickerLabel(symbol: string): string {
  return tickerCurrency(symbol) === "KRW" ? tickerName(symbol) : symbol;
}

async function compute(symbol: string, market: Market) {
  const dataDir = path.join(process.cwd(), "public", "data");
  const fx = market.fxFile ? (JSON.parse(await fs.readFile(path.join(dataDir, market.fxFile), "utf8")) as FxBundle) : null;
  const px = JSON.parse(await fs.readFile(path.join(dataDir, "px", `${symbol.toLowerCase()}.json`), "utf8")) as PxBundle;
  const isNative = tickerCurrency(symbol) === market.currency;
  const monthly = market.monthly.default * market.monthly.unit;
  const target = market.goal.default * market.goal.unit;
  const r = runToToday(composeRows(px, isNative ? null : fx), { monthly, buyDay: 1, target });
  return { r, isNative };
}

/** ko는 기존 문자열 슬라이스 그대로(불변, 앞자리 0 유지: "2002년 01월"). 신규 로케일은 공용 포맷터. */
function startYmLabel(dateIso: string | undefined, locale: Locale, fmt: ReturnType<typeof getFormatter>): string {
  if (!dateIso) return "";
  if (locale === "ko") return dateIso.slice(0, 7).replace("-", "년 ") + "월";
  return fmt.ym(dateIso);
}

function display(symbol: string): string {
  return tickerCurrency(symbol) === "KRW" ? `${tickerName(symbol)}(${symbol})` : `${symbol}(${tickerName(symbol)})`;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; symbol: string }> }): Promise<Metadata> {
  const { lang, symbol } = await params;
  const locale = lang as Locale;
  const info = resolve(symbol);
  const market = getMarket(locale);
  if (!info || !market.tickers.includes(info.symbol)) return {};
  const fmt = getFormatter(locale);
  const d = getDict(locale);
  const label = tickerLabel(info.symbol);
  const monthlyStr = fmt.unitAmount(market.monthly.default, market.monthly.unitLabel);
  const goalStr = fmt.milestone(market.goal.default * market.goal.unit);
  const title = d.etf.metaTitle(label, monthlyStr, goalStr);
  const description = d.etf.metaDesc(display(info.symbol), monthlyStr, goalStr);
  const ogImg = `/api/og?l=${locale}&t=${info.symbol}&m=${market.monthly.default}&d=1&g=${market.goal.default}`;
  return {
    title,
    description,
    alternates: langAlternates(locale, `/etf/${info.symbol.toLowerCase()}`),
    openGraph: { title, description, type: "article", images: [{ url: ogImg, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [ogImg] },
  };
}

export default async function EtfPage({ params }: { params: Promise<{ lang: string; symbol: string }> }) {
  const { lang, symbol } = await params;
  const locale = lang as Locale;
  const info = resolve(symbol);
  if (!info) notFound();
  const market = getMarket(locale);
  if (!market.tickers.includes(info.symbol)) notFound();

  const fmt = getFormatter(locale);
  const d = getDict(locale);
  const { r, isNative } = await compute(info.symbol, market);
  const sym = info.symbol;
  const lc = sym.toLowerCase();
  const label = tickerLabel(sym);
  const content = getEtfContent(sym, locale);
  const monthlyStr = fmt.unitAmount(market.monthly.default, market.monthly.unitLabel);
  const goalStr = fmt.milestone(market.goal.default * market.goal.unit);
  const startYm = startYmLabel(r.series[0]?.date, locale, fmt);
  const appHref = `${localeHref(locale, "/")}?t=${sym}&m=${market.monthly.default}&d=1&g=${market.goal.default}`;
  const title = d.etf.pageTitle(label);
  const leadFallback = locale === "ko" ? koBlurb(sym).line : d.etf.fallbackBlurb(label);
  const articleDesc = locale === "ko" ? koBlurb(sym).line : (content?.lead ?? d.etf.fallbackBlurb(label));
  const guides = locale === "ko" ? koBlurb(sym).guides : relatedGuides(sym, locale);
  const sourceIds: SourceId[] = isNative ? ["yahoo"] : ["yahoo", "fredFx"];
  if (sym === "QLD") sourceIds.push("prosharesQld");
  if (sym === "TQQQ") sourceIds.push("prosharesTqqq");
  if (sym === "VOO") sourceIds.push("vanguardVoo");
  if (sym === "SCHD") sourceIds.push("schwabSchd");
  if (sym === "VT") sourceIds.push("vanguardVt");

  return (
    <ContentShell title={title} desc={d.etf.pageDesc(monthlyStr, goalStr)} crumb={d.etf.crumb(label)}>
      <JsonLd data={articleLd({ path: `/etf/${lc}`, title, description: articleDesc })} />
      <JsonLd data={pageBreadcrumbLd(label, `/etf/${lc}`)} />

      <p>{content?.lead ?? leadFallback}</p>

      <div className="callout">
        {r.reached ? (
          <>
            <strong>{d.etf.reachedHeadline(monthlyStr, r.years, r.monthsRem, goalStr)}</strong>
            <br />
            {d.etf.reachedDetail(startYm, fmt.money(r.value), fmt.money(r.principal), fmt.pct(r.cagr))}
          </>
        ) : (
          <>
            <strong>{d.etf.notReachedHeadline(goalStr)}</strong>
            <br />
            {d.etf.notReachedDetail(fmt.money(r.value), fmt.money(r.principal), fmt.pct(r.cagr))}
          </>
        )}
        <div className="sub">{d.etf.note(d.calc.day.nth(1), goalStr, isNative ? d.etf.priceBasisPlain : d.etf.priceBasisFx)}</div>
      </div>

      <p style={{ marginTop: 16 }}>
        <Link href={appHref} className="btn-inline">
          {d.etf.cta}
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
          <h2>{d.etf.fallbackHeading}</h2>
          <p>{d.etf.fallbackBody(startYm)}</p>
        </>
      )}
      <p>{d.etf.editHint}</p>

      <h2>{d.etf.relatedHeading}</h2>
      <ul>
        {guides.map((g) => (
          <li key={g.href}>
            <Link href={g.href}>{g.label}</Link>
          </li>
        ))}
        <li>
          <Link href={localeHref(locale, "/compare")}>{d.etf.compareLink(market.tickers.length)}</Link>
        </li>
        <li>
          <Link href={localeHref(locale, "/how-it-works")}>{d.etf.howItWorksLink}</Link>
        </li>
      </ul>

      <Sources ids={sourceIds} />

      <p className="note">{d.etf.legalNote}</p>
    </ContentShell>
  );
}
