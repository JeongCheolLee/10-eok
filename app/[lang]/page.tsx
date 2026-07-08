import type { Metadata } from "next";
import { BacktestApp } from "@/components/BacktestApp";
import { HomeContent } from "@/components/HomeContent";
import { JsonLd, webSiteLd, softwareAppLd } from "@/components/JsonLd";
import { TICKERS, tickerName } from "@/lib/tickers";
import type { Locale } from "@/lib/i18n/locales";

type SP = Record<string, string | string[] | undefined>;

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

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const init = parseInitial(await searchParams);
  if (!init) return { alternates: { canonical: "/" } };
  const common = `${init.lump > 0 ? `&i=${init.lump}` : ""}&d=${init.buyDay}&g=${init.target}`;
  const q = init.mode === "amount" ? `t=${init.ticker}&mode=amt&y=${init.years}${common}` : `t=${init.ticker}&m=${init.amount}${common}`;
  const title = init.mode === "amount"
    ? `${tickerName(init.ticker)}(${init.ticker})로 ${init.years}년 안에 ${init.target}억 모으려면 매달 얼마?`
    : `${tickerName(init.ticker)}(${init.ticker})에${init.lump > 0 ? ` ${init.lump}만원으로 시작해` : ""} 매달 ${init.amount}만원 모았다면 — ${init.target}억까지?`;
  const img = `/api/og?${q}`;
  return {
    title,
    alternates: { canonical: "/" },
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
