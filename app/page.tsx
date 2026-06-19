import { BacktestApp } from "@/components/BacktestApp";
import { TICKERS } from "@/lib/tickers";

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

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return <BacktestApp initial={parseInitial(sp)} />;
}
