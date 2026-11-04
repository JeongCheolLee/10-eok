import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import type { Row } from "@/lib/backtest/types";
import { tickerCurrency, tickerInfo } from "@/lib/tickers";
import { requestJson } from "./request";
import { DATA_BASE } from "./platform";
import { actualHistoryRows, realStartOf, type LoadedDataInfo } from "./dataInfo";

const rowsCache = new Map<string, Promise<{ actual: Row[]; full: Row[]; info: LoadedDataInfo }>>();
const infoCache = new Map<string, LoadedDataInfo>();
let fxPromise: Promise<FxBundle> | null = null;

const CACHE_MS = 5 * 60_000;
let cacheAt = Date.now();
let generation = 0;
function refreshExpiredCache() {
  if (Date.now() - cacheAt < CACHE_MS) return;
  generation += 1;
  cacheAt = Date.now();
  rowsCache.clear(); infoCache.clear(); fxPromise = null;
}
const getJson = <T>(path: string) => requestJson<T>(`${DATA_BASE}/${path}`);

function loadHistory(ticker: string): Promise<{ actual: Row[]; full: Row[]; info: LoadedDataInfo }> {
  refreshExpiredCache();
  const requestGeneration = generation;
  const key = ticker.toUpperCase();
  let p = rowsCache.get(key);
  if (!p) {
    p = (async () => {
      const [px, fx] = await Promise.all([
        getJson<PxBundle>(`px/${key.toLowerCase()}.json`),
        tickerCurrency(key) === "KRW" ? null : (fxPromise ??= getJson<FxBundle>("fx/krw.json")),
      ]);
      const full = composeRows(px, fx);
      const rows = actualHistoryRows(key, full);
      const priceAsOf = rows[rows.length - 1].date;
      const fxAsOf = fx?.rows.reduce<string | null>((last, [date, rate]) => (
        date <= priceAsOf && Number.isFinite(rate) && rate > 0 && (!last || date > last) ? date : last
      ), null) ?? null;
      const info = { ticker: key, actualStart: rows[0].date, priceAsOf, fxAsOf };
      if (requestGeneration === generation) infoCache.set(key, info);
      return { actual: rows, full, info };
    })();
    p.catch(() => { if (requestGeneration === generation) { rowsCache.delete(key); fxPromise = null; } });
    rowsCache.set(key, p);
  }
  return p;
}

/** 기본 결과·저장·공유에는 실제 거래 자료만 전달한다. */
export async function loadRows(ticker: string): Promise<Row[]> {
  return (await loadHistory(ticker)).actual;
}

export type ComparisonEstimate = { proxy: string; actualStart: string; convertedToKrw: boolean };
/** 비교 화면에서만 명시적으로 추정 구간을 요청한다. 실제 이력 캐시와 섞지 않는다. */
export async function loadComparisonHistory(ticker: string): Promise<{ rows: Row[]; estimate?: ComparisonEstimate }> {
  const key = ticker.toUpperCase();
  const history = await loadHistory(key);
  const splice = tickerInfo(key).splice;
  const actualStart = realStartOf(key);
  if (!splice || !actualStart || history.full[0].date >= actualStart) return { rows: history.actual };
  return { rows: history.full, estimate: { proxy: splice.proxy, actualStart, convertedToKrw: tickerCurrency(key) === "KRW" } };
}

/** loadRows가 끝난 종목의 계산 기준. 데이터가 아직 없으면 null. */
export function getLoadedDataInfo(ticker: string): LoadedDataInfo | null {
  return infoCache.get(ticker.toUpperCase()) ?? null;
}

export async function loadDataInfo(ticker: string): Promise<LoadedDataInfo> {
  return (await loadHistory(ticker)).info;
}

/** 여러 종목을 한 번에(Promise.all). 하나라도 실패하면 reject. */
export async function loadRowsBy(tickers: string[]): Promise<Record<string, Row[]>> {
  const list = await Promise.all(tickers.map((t) => loadRows(t)));
  return Object.fromEntries(tickers.map((t, i) => [t.toUpperCase(), list[i]]));
}
