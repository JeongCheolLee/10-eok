import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import type { Row } from "@/lib/backtest/types";
import { tickerCurrency, tickerInfo } from "@/lib/tickers";
import { DATA_BASE } from "./platform";
import { actualHistoryRows, realStartOf, type LoadedDataInfo } from "./dataInfo";

const rowsCache = new Map<string, Promise<{ actual: Row[]; full: Row[] }>>();
const infoCache = new Map<string, LoadedDataInfo>();
let fxPromise: Promise<FxBundle> | null = null;

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${DATA_BASE}/${path}`);
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json() as Promise<T>;
}

function loadHistory(ticker: string): Promise<{ actual: Row[]; full: Row[] }> {
  const key = ticker.toUpperCase();
  let p = rowsCache.get(key);
  if (!p) {
    p = (async () => {
      const px = await getJson<PxBundle>(`px/${key.toLowerCase()}.json`);
      const fx = tickerCurrency(key) === "KRW" ? null : await (fxPromise ??= getJson<FxBundle>("fx/krw.json"));
      const full = composeRows(px, fx);
      const rows = actualHistoryRows(key, full);
      const priceAsOf = rows[rows.length - 1].date;
      const fxAsOf = fx?.rows.reduce<string | null>((last, [date, rate]) => (
        date <= priceAsOf && Number.isFinite(rate) && rate > 0 && (!last || date > last) ? date : last
      ), null) ?? null;
      infoCache.set(key, { ticker: key, actualStart: rows[0].date, priceAsOf, fxAsOf });
      return { actual: rows, full };
    })();
    p.catch(() => { rowsCache.delete(key); fxPromise = null; });
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
  await loadRows(ticker);
  return getLoadedDataInfo(ticker)!;
}

/** 여러 종목을 한 번에(Promise.all). 하나라도 실패하면 reject. */
export async function loadRowsBy(tickers: string[]): Promise<Record<string, Row[]>> {
  const list = await Promise.all(tickers.map((t) => loadRows(t)));
  return Object.fromEntries(tickers.map((t, i) => [t.toUpperCase(), list[i]]));
}
