import type { Metadata } from "next";
import { BacktestApp } from "@/components/BacktestApp";
import { TICKERS, tickerName } from "@/lib/tickers";

const DAYS = [1, 5, 10, 15, 25];

type SP = Record<string, string | string[] | undefined>;

function parseInitial(sp: SP) {
  const t = typeof sp.t === "string" ? sp.t.toUpperCase() : "";
  const m = typeof sp.m === "string" ? parseInt(sp.m, 10) : NaN;
  const d = typeof sp.d === "string" ? parseInt(sp.d, 10) : NaN;
  if (!TICKERS.some((x) => x.symbol === t)) return null;
  if (!Number.isFinite(m) || m < 10) return null;
  if (!DAYS.includes(d)) return null;
  return { ticker: t, amount: m, buyDay: d };
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const init = parseInitial(await searchParams);
  if (!init) return {};
  const q = `t=${init.ticker}&m=${init.amount}&d=${init.buyDay}`;
  const title = `${tickerName(init.ticker)}(${init.ticker})에 매달 ${init.amount}만원 모았다면 — 10억까지?`;
  const img = `/api/og?${q}`;
  return {
    title,
    openGraph: { title, images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [img] },
  };
}

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return <BacktestApp initial={parseInitial(sp)} />;
}
