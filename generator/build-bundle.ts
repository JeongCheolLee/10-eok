// EC2 cron이 하루 한 번 실행하는 데이터 파이프라인 (서버 아님, 배치 스크립트).
// 1) Yahoo 차트에서 종목 일별 수정주가  2) FRED DEXKOUS 일별 USD/KRW
// 3) align.ts(공유)로 거래일 정렬+forward-fill+검증  4) public/data/<ticker>.json 파생 번들 생성
// 가격 소스는 PRICE_SOURCE로 추상화 — 추후 교체 용이(Stooq가 봇 차단되어 Yahoo 채택).
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { alignSeries, type PricePoint, type FxPoint } from "../lib/backtest/align";
import type { Bundle } from "../lib/backtest/types";
import { TICKERS } from "../lib/tickers";

// TICKER env 지정 시 그 종목만, 없으면 레지스트리 전체.
const ONLY = process.env.TICKER;
const UA = "Mozilla/5.0 (compatible; 10-eok-bot/0.1)";

async function fetchPrices(ticker: string): Promise<PricePoint[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=0&period2=9999999999&interval=1d&events=div%2Csplit`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Yahoo ${ticker} HTTP ${res.status}`);
  const json: any = await res.json();
  const r = json?.chart?.result?.[0];
  const ts: number[] | undefined = r?.timestamp;
  const adj: (number | null)[] | undefined = r?.indicators?.adjclose?.[0]?.adjclose;
  if (!ts || !adj) throw new Error(`Yahoo ${ticker}: adjclose 없음`);
  const out: PricePoint[] = [];
  for (let i = 0; i < ts.length; i++) {
    const v = adj[i];
    if (v == null || !Number.isFinite(v)) continue;
    out.push({ date: isoUTC(ts[i]), price: round(v, 4) });
  }
  return out;
}

async function fetchFx(): Promise<FxPoint[]> {
  const url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DEXKOUS";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`FRED DEXKOUS HTTP ${res.status}`);
  const text = await res.text();
  const out: FxPoint[] = [];
  for (const line of text.split("\n").slice(1)) {
    const [date, val] = line.split(",");
    if (!date || val == null) continue;
    const rate = Number(val.trim());
    if (!Number.isFinite(rate) || rate <= 0) continue; // FRED 결측은 "."
    out.push({ date: date.trim(), rate: round(rate, 2) });
  }
  return out;
}

function isoUTC(epochSec: number): string {
  return new Date(epochSec * 1000).toISOString().slice(0, 10);
}
function round(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

async function main() {
  const symbols = ONLY ? [ONLY] : TICKERS.map((t) => t.symbol);
  console.log(`[build-bundle] 환율(FRED) 수집…`);
  const fx = await fetchFx();
  console.log(`  fx=${fx.length}`);

  const dir = join(process.cwd(), "public", "data");
  mkdirSync(dir, { recursive: true });

  for (const ticker of symbols) {
    const prices = await fetchPrices(ticker);
    const rows = alignSeries(prices, fx); // 정렬+forward-fill+검증 (이상 시 throw → 빌드 실패)
    const bundle: Bundle = {
      ticker,
      currencyTarget: "KRW",
      start: rows[0].date,
      generatedAt: new Date().toISOString(),
      rows: rows.map((r) => [r.date, r.price, r.fx]),
    };
    const file = join(dir, `${ticker.toLowerCase()}.json`);
    writeFileSync(file, JSON.stringify(bundle));
    console.log(`  ${ticker}: ${rows.length}행, ${bundle.start} ~ ${rows[rows.length - 1].date}`);
  }
}

main().catch((e) => {
  console.error("[build-bundle] 실패:", e.message);
  process.exit(1); // 나쁜 번들 push 차단
});
