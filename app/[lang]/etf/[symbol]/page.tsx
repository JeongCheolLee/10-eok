import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, articleLd, pageBreadcrumbLd } from "@/components/JsonLd";
import { TICKERS, tickerName, tickerCurrency } from "@/lib/tickers";
import type { PxBundle, FxBundle } from "@/lib/backtest/compose";
import { calculateWebPlan, composeWebRows, defaultWebPlan } from "@/lib/web-calculator";
import { resultCopy } from "@/components/calculator/result-copy";
import { etfArticleCopy } from "@/lib/i18n/etf-article";
import { getEtfContent } from "@/lib/etfContent";
import { getMarket, type Market } from "@/lib/i18n/markets";
import { getFormatter } from "@/lib/i18n/format";
import { getDict } from "@/lib/i18n/dict";
import { langAlternates, localeHref } from "@/lib/i18n/seo";
import type { Locale } from "@/lib/i18n/locales";
import { SOURCES } from "@/lib/sources";

// 한국어 ETF별 관련 가이드. 설명 원문은 getEtfContent에서 가져온다.
type KoBlurb = { guides: { href: string; label: string }[] };
const BLURB_KO: Record<string, KoBlurb> = {
  QLD: {
    guides: [
      { href: "/guides/qld", label: "QLD란 무엇인가" },
      { href: "/guides/leverage-etf-risk", label: "레버리지 ETF의 위험" },
    ],
  },
  TQQQ: {
    guides: [
      { href: "/guides/leverage-etf-risk", label: "레버리지 ETF의 위험" },
      { href: "/guides/qld", label: "QLD·레버리지 기초" },
    ],
  },
  QQQ: {
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/dca", label: "적립식 투자의 원리" },
    ],
  },
  SPY: {
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/dca-vs-lumpsum", label: "적립식 vs 거치식" },
    ],
  },
  VOO: {
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/nasdaq100-vs-sp500", label: "나스닥100 vs S&P 500" },
    ],
  },
  SCHD: {
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/overseas-tax", label: "해외주식 세금" },
    ],
  },
  VT: {
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/fx-impact", label: "환율의 영향" },
    ],
  },
  "069500.KS": {
    guides: [
      { href: "/guides/etf-basics", label: "ETF가 뭔가요?" },
      { href: "/guides/dca", label: "적립식 투자의 원리" },
    ],
  },
};
function koBlurb(sym: string): KoBlurb {
  return BLURB_KO[sym] ?? { guides: [{ href: "/guides", label: "투자 가이드" }] };
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
  // 미니앱 전용(webHidden) 종목은 웹 상세 페이지가 없다.
  return TICKERS.find((t) => !t.webHidden && t.symbol.toLowerCase() === symbolParam.toLowerCase()) ?? null;
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
  const rows = composeWebRows(symbol, px, isNative ? null : fx);
  const plan = { ...defaultWebPlan(market.locale), holdings: [{ ticker: symbol, amount: monthly }] };
  const calculation = calculateWebPlan({ [symbol]: rows }, plan, market.locale);
  return { calculation, fxSource: isNative ? null : fx?.source.split(" ")[0] };
}

/** 관련 설명에 사용하는 시작월 표기. */
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
  const ogImg = `/api/og?preview=brand&l=${locale}&g=${market.goal.default}`;
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
  const { calculation, fxSource } = await compute(info.symbol, market);
  const r = calculation.result;
  const t = resultCopy[locale];
  const c = etfArticleCopy[locale];
  const endDate = r.series.at(-1)!.date;
  const sym = info.symbol;
  const lc = sym.toLowerCase();
  const label = tickerLabel(sym);
  const content = getEtfContent(sym, locale);
  const monthlyStr = fmt.unitAmount(market.monthly.default, market.monthly.unitLabel);
  const goalStr = fmt.milestone(market.goal.default * market.goal.unit);
  const startYm = startYmLabel(r.series[0]?.date, locale, fmt);
  const appHref = `${localeHref(locale, "/")}?t=${sym}&m=${market.monthly.default}&d=1&g=${market.goal.default}`;
  const title = d.etf.pageTitle(label);
  const leadFallback = d.etf.fallbackBlurb(label);
  const articleDesc = content?.lead ?? leadFallback;
  const guides = locale === "ko" ? koBlurb(sym).guides : relatedGuides(sym, locale);
  const issuerUrl: Record<string, string> = {
    QLD: SOURCES.prosharesQld.href,
    TQQQ: SOURCES.prosharesTqqq.href,
    VOO: SOURCES.vanguardVoo.href,
    SCHD: SOURCES.schwabSchd.href,
    VT: SOURCES.vanguardVt.href,
    QQQ: "https://www.invesco.com/qqq-etf/en/about.html",
    SPY: "https://www.ssga.com/us/en/individual/etfs/state-street-spdr-sp-500-etf-trust-spy",
    SOXX: "https://www.ishares.com/us/products/239705/ishares-phlx-semiconductor-etf",
    VGT: "https://investor.vanguard.com/investment-products/etfs/profile/vgt",
    VNQ: "https://advisors.vanguard.com/investments/products/vnq/vanguard-real-estate-etf",
    GLD: "https://www.spdrgoldshares.com/usa/",
    TLT: "https://www.ishares.com/us/products/239454/ishares-20-year-treasury-bond-etf",
    AGG: "https://www.ishares.com/us/products/239458/ishares-core-total-us-bond-market-etf",
    JEPI: "https://am.jpmorgan.com/content/dam/jpm-am-aem/americas/us/en/literature/fact-sheet/etfs/FS-JEPI.pdf",
    JEPQ: "https://am.jpmorgan.com/content/dam/jpm-am-aem/americas/us/en/literature/fact-sheet/etfs/FS-JEPQ.pdf",
    "069500.KS": "https://www.samsungfund.com/etf/product/view.do?id=2ETF01",
  };

  return (
    <ContentShell title={title} desc={d.etf.pageDesc(monthlyStr, goalStr)} crumb={d.etf.crumb(label)}>
      <JsonLd data={articleLd({ path: localeHref(locale, `/etf/${lc}`), title, description: articleDesc, lang: locale, dateModified: "2026-10-26" })} />
      <JsonLd data={pageBreadcrumbLd(label, localeHref(locale, `/etf/${lc}`))} />

      <p className="sub">{c.updated}</p>
      <p>{content?.lead ?? leadFallback}</p>

      <div className="callout etf-example" data-testid="etf-example">
        <p className="sub">{c.example}</p>
        <p>{c.condition(monthlyStr)}</p>
        {calculation.reach ? (
          <>
            <strong>{t.first(goalStr)} {r.years}{t.years} {r.monthsRem}{t.months}</strong>
            <p>{t.period(fmt.ym(calculation.calculationStart), fmt.ymd(calculation.reach.date))}</p>
          </>
        ) : (
          <>
            <strong>{t.missed(goalStr)}</strong>
            <p>{c.period(fmt.ymd(calculation.calculationStart), fmt.ymd(endDate))}</p>
          </>
        )}
        <p>{calculation.reach ? t.continued : t.end} <b>{fmt.money(r.value)}</b></p>
        <p className="sub">{t.date(fmt.ymd(endDate))}{calculation.reach && r.value < market.goal.default * market.goal.unit ? ` · ${t.below(goalStr)}` : ""}</p>
        <p className="sub">{t.principal} {fmt.money(r.principal)}</p>
        <p className="sub">{c.assumptions}</p>
        <p className="sub">{t.basisText}</p>
      </div>

      <p style={{ marginTop: 16 }}>
        <Link href={appHref} className="btn-inline" data-testid="etf-calculator-link">
          {c.cta}
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
      <p>{c.edit}</p>

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

      <aside className="sources" aria-label={c.sources}>
        <p className="sources-label">{c.sources}</p>
        <ul>
          <li><a href={`https://finance.yahoo.com/quote/${sym}/history/`} target="_blank" rel="noopener">{c.prices} · {sym}</a></li>
          {fxSource && <li><a href={`https://fred.stlouisfed.org/series/${fxSource}`} target="_blank" rel="noopener">{c.fx} · {market.currency} · {fxSource}</a></li>}
          {issuerUrl[sym] && <li><a href={issuerUrl[sym]} target="_blank" rel="noopener">{c.issuer} · {sym}</a></li>}
        </ul>
      </aside>

      <p className="note">{c.disclaimer}</p>
    </ContentShell>
  );
}
