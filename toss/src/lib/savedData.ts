import type { LoadedDataInfo } from "./dataInfo";

export type SavedDataDates = Record<string, { price: string; fx: string | null }>;
const date = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
export function readDataDates(raw: unknown, tickers: string[]): SavedDataDates | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const result: SavedDataDates = {};
  for (const ticker of tickers) {
    const value = (raw as Record<string, unknown>)[ticker] as { price?: unknown; fx?: unknown } | undefined;
    if (!value || !date(value.price) || !(value.fx === null || date(value.fx))) return undefined;
    result[ticker] = { price: value.price, fx: value.fx };
  }
  return result;
}
export function dataDatesOf(infos: LoadedDataInfo[]): SavedDataDates {
  return Object.fromEntries(infos.map((info) => [info.ticker, { price: info.priceAsOf, fx: info.fxAsOf }]));
}
/** Only label verified newer dates; legacy saves and fetch errors are not evidence of updates. */
export function hasNewSavedData(saved: SavedDataDates | undefined, current: SavedDataDates): boolean {
  return !!saved && Object.entries(saved).some(([ticker, previous]) => {
    const next = current[ticker];
    return !!next && (next.price > previous.price || (!!next.fx && !!previous.fx && next.fx > previous.fx));
  });
}
