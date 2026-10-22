import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import type { Row } from "@/lib/backtest/types";
import { tickerCurrency } from "@/lib/tickers";
import { DATA_BASE } from "./platform";
import { actualHistoryRows, type LoadedDataInfo } from "./dataInfo";

const rowsCache = new Map<string, Promise<Row[]>>();
const infoCache = new Map<string, LoadedDataInfo>();
let fxPromise: Promise<FxBundle> | null = null;

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${DATA_BASE}/${path}`);
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json() as Promise<T>;
}

/** 실제 거래 이력만 제공한다. 웹용 번들의 상장 전 추정치는 이 경계에서 제거한다. */
export function loadRows(ticker: string): Promise<Row[]> {
  const key = ticker.toUpperCase();
  let p = rowsCache.get(key);
  if (!p) {
    p = (async () => {
      const px = await getJson<PxBundle>(`px/${key.toLowerCase()}.json`);
      const fx = tickerCurrency(key) === "KRW" ? null : await (fxPromise ??= getJson<FxBundle>("fx/krw.json"));
      const rows = actualHistoryRows(key, composeRows(px, fx));
      const priceAsOf = rows[rows.length - 1].date;
      const fxAsOf = fx?.rows.reduce<string | null>((last, [date, rate]) => (
        date <= priceAsOf && Number.isFinite(rate) && rate > 0 && (!last || date > last) ? date : last
      ), null) ?? null;
      infoCache.set(key, { ticker: key, actualStart: rows[0].date, priceAsOf, fxAsOf });
      return rows;
    })();
    p.catch(() => { rowsCache.delete(key); fxPromise = null; });
    rowsCache.set(key, p);
  }
  return p;
}

/** loadRows가 끝난 종목의 계산 기준. 데이터가 아직 없으면 null. */
export function getLoadedDataInfo(ticker: string): LoadedDataInfo | null {
  return infoCache.get(ticker.toUpperCase()) ?? null;
}

export async function loadDataInfo(ticker: string): Promise<LoadedDataInfo> {
  await loadRows(ticker);
  return getLoadedDataInfo(ticker)!;
}

/** 여러 종목을 한 번에(Promise.all). 하나라도 실패하면 reject. */
export async function loadRowsBy(tickers: string[]): Promise<Record<string, Row[]>> {
  const list = await Promise.all(tickers.map((t) => loadRows(t)));
  return Object.fromEntries(tickers.map((t, i) => [t.toUpperCase(), list[i]]));
}
