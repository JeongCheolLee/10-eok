import type { Metadata } from "next";
import { BacktestApp } from "@/components/BacktestApp";
import { HomeContent } from "@/components/HomeContent";
import { JsonLd, webSiteLd, softwareAppLd } from "@/components/JsonLd";
import { TICKERS, tickerName } from "@/lib/tickers";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { getMarket } from "@/lib/i18n/markets";
import { getFormatter } from "@/lib/i18n/format";
import { langAlternates } from "@/lib/i18n/seo";

type SP = Record<string, string | string[] | undefined>;

// 공유 딥링크(파라미터 있는 홈)의 제목 — 로케일별. ko는 기존 문자열과 바이트 동일.
type HomeTitle = {
  amount: (ref: string, years: number, goal: string) => string;
  time: (ref: string, monthly: string, lumpAmt: string, goal: string) => string;
};
const HOME_TITLE: Record<Locale, HomeTitle> = {
  ko: {
    amount: (ref, years, goal) => `${ref}로 ${years}년 안에 ${goal} 모으려면 매달 얼마?`,
    time: (ref, monthly, lumpAmt, goal) => `${ref}에${lumpAmt ? ` ${lumpAmt}으로 시작해` : ""} 매달 ${monthly} 모았다면 — ${goal}까지?`,
  },
  en: {
    amount: (ref, years, goal) => `${ref}: how much per month to reach ${goal} in ${years} years?`,
    time: (ref, monthly, lumpAmt, goal) => `${ref}: ${monthly}/month${lumpAmt ? ` (from ${lumpAmt})` : ""} — how long to ${goal}?`,
  },
  ja: {
    amount: (ref, years, goal) => `${ref}で${years}年以内に${goal}を貯めるには毎月いくら?`,
    time: (ref, monthly, lumpAmt, goal) => `${ref}に${lumpAmt ? `${lumpAmt}で始めて` : ""}毎月${monthly}積み立てたら — ${goal}まで何年?`,
  },
  de: {
    amount: (ref, years, goal) => `${ref}: wie viel pro Monat für ${goal} in ${years} Jahren?`,
    time: (ref, monthly, lumpAmt, goal) => `${ref}: ${monthly}/Monat${lumpAmt ? ` (Start ${lumpAmt})` : ""} — wie lange bis ${goal}?`,
  },
};

function parseInitial(sp: SP) {
  const t = typeof sp.t === "string" ? sp.t.toUpperCase() : "";
  const d = typeof sp.d === "string" ? parseInt(sp.d, 10) : NaN;
  if (!TICKERS.some((x) => x.symbol === t)) return null;
  if (!Number.isFinite(d) || d < 1 || d > 31) return null;
  let g = typeof sp.g === "string" ? parseInt(sp.g, 10) : 10;
  if (!Number.isFinite(g) || g < 1 || g > 100) g = 10;
  let lump = typeof sp.i === "string" ? parseInt(sp.i, 10) : 0;
  if (!Number.isFinite(lump) || lump < 0) lump = 0;
  const infl = sp.infl === "1" || sp.infl === "true";
  const reinvest = sp.div !== "0";
  const tax = sp.tax === "1" || sp.tax === "true";
  const mode: "time" | "amount" = sp.mode === "amt" ? "amount" : "time";
  if (mode === "amount") {
    let y = typeof sp.y === "string" ? parseInt(sp.y, 10) : 10;
    if (!Number.isFinite(y) || y < 1) y = 10;
    return { ticker: t, mode, amount: 100, years: y, lump, buyDay: d, target: g, infl, reinvest, tax };
  }
  const m = typeof sp.m === "string" ? parseInt(sp.m, 10) : NaN;
  if (!Number.isFinite(m) || m < 10) return null;
  return { ticker: t, mode, amount: m, years: 10, lump, buyDay: d, target: g, infl, reinvest, tax };
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<SP> }): Promise<Metadata> {
  const [{ lang }, sp] = await Promise.all([params, searchParams]);
  const locale = lang as Locale;
  const init = parseInitial(sp);
  if (!init) return { alternates: langAlternates(locale, "/") };
  const market = getMarket(locale);
  const fmt = getFormatter(locale);
  const ref = locale === "ko" ? `${tickerName(init.ticker)}(${init.ticker})` : init.ticker;
  const goal = fmt.milestone(init.target * market.goal.unit);
  const monthly = fmt.unitAmount(init.amount, market.monthly.unitLabel);
  const lumpAmt = init.lump > 0 ? fmt.unitAmount(init.lump, market.lump.unitLabel) : "";
  const tt = HOME_TITLE[locale] ?? HOME_TITLE.ko;
  const title = init.mode === "amount" ? tt.amount(ref, init.years, goal) : tt.time(ref, monthly, lumpAmt, goal);
  const common = `${init.lump > 0 ? `&i=${init.lump}` : ""}&d=${init.buyDay}&g=${init.target}`;
  const q = init.mode === "amount" ? `t=${init.ticker}&mode=amt&y=${init.years}${common}` : `t=${init.ticker}&m=${init.amount}${common}`;
  const img = `/api/og?${locale === DEFAULT_LOCALE ? "" : `l=${locale}&`}${q}`;
  return {
    title,
    alternates: langAlternates(locale, "/"),
    openGraph: { title, images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [img] },
  };
}

export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<SP> }) {
  const [{ lang }, sp] = await Promise.all([params, searchParams]);
  return (
    <>
      <JsonLd data={webSiteLd()} />
      <JsonLd data={softwareAppLd()} />
      <BacktestApp initial={parseInitial(sp)} locale={lang as Locale} />
      <HomeContent locale={lang as Locale} />
    </>
  );
}
