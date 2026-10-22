import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import type { Row } from "@/lib/backtest/types";
import { tickerCurrency } from "@/lib/tickers";
import { DATA_BASE } from "./platform";

const rowsCache = new Map<string, Promise<Row[]>>();
let fxPromise: Promise<FxBundle> | null = null;

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${DATA_BASE}/${path}`);
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json() as Promise<T>;
}

/** 종목 가격 + (달러 종목이면) 환율을 받아 정렬된 Row[]로. 종목별 1회 캐시, 환율은 1파일 공유. */
export function loadRows(ticker: string): Promise<Row[]> {
  const key = ticker.toUpperCase();
  let p = rowsCache.get(key);
  if (!p) {
    p = (async () => {
      const px = await getJson<PxBundle>(`px/${key.toLowerCase()}.json`);
      const fx = tickerCurrency(key) === "KRW" ? null : await (fxPromise ??= getJson<FxBundle>("fx/krw.json"));
      return composeRows(px, fx);
    })();
    p.catch(() => { rowsCache.delete(key); fxPromise = null; });
    rowsCache.set(key, p);
  }
  return p;
}

/** 여러 종목을 한 번에(Promise.all). 하나라도 실패하면 reject. */
export async function loadRowsBy(tickers: string[]): Promise<Record<string, Row[]>> {
  const list = await Promise.all(tickers.map((t) => loadRows(t)));
  return Object.fromEntries(tickers.map((t, i) => [t.toUpperCase(), list[i]]));
}
