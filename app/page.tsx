import type { Metadata } from "next";
import { BacktestApp } from "@/components/BacktestApp";
import { JsonLd, webSiteLd, softwareAppLd } from "@/components/JsonLd";
import { TICKERS, tickerName } from "@/lib/tickers";

type SP = Record<string, string | string[] | undefined>;

function parseInitial(sp: SP) {
  const t = typeof sp.t === "string" ? sp.t.toUpperCase() : "";
  const m = typeof sp.m === "string" ? parseInt(sp.m, 10) : NaN;
  const d = typeof sp.d === "string" ? parseInt(sp.d, 10) : NaN;
  if (!TICKERS.some((x) => x.symbol === t)) return null;
  if (!Number.isFinite(m) || m < 10) return null;
  if (!Number.isFinite(d) || d < 1 || d > 31) return null;
  let g = typeof sp.g === "string" ? parseInt(sp.g, 10) : 10;
  if (!Number.isFinite(g) || g < 1 || g > 100) g = 10;
  const infl = sp.infl === "1" || sp.infl === "true";
  const reinvest = sp.div !== "0";
  const tax = sp.tax === "1" || sp.tax === "true";
  return { ticker: t, amount: m, buyDay: d, target: g, infl, reinvest, tax };
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const init = parseInitial(await searchParams);
  if (!init) return { alternates: { canonical: "/" } };
  const q = `t=${init.ticker}&m=${init.amount}&d=${init.buyDay}&g=${init.target}`;
  const title = `${tickerName(init.ticker)}(${init.ticker})에 매달 ${init.amount}만원 모았다면 — ${init.target}억까지?`;
  const img = `/api/og?${q}`;
  return {
    title,
    alternates: { canonical: "/" },
    openGraph: { title, images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [img] },
  };
}

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return (
    <>
      <JsonLd data={webSiteLd()} />
      <JsonLd data={softwareAppLd()} />
      <BacktestApp initial={parseInitial(sp)} />
    </>
  );
}
