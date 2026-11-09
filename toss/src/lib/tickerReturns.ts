import type { TickerReturns } from "@/lib/tickerReturns";
import { DATA_BASE } from "./platform";
import { requestJson } from "./request";
let cache: { at: number; promise: Promise<TickerReturns> } | undefined;
export function loadTickerReturns(): Promise<TickerReturns> {
  if (!cache || Date.now() - cache.at > 300_000) {
    const promise = requestJson<TickerReturns>(`${DATA_BASE}/summary/returns.json`).then((data) => {
      if (data.version !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(data.asOf) || !data.rows || typeof data.rows !== "object") throw new Error("Invalid returns summary");
      return data;
    });
    cache = { at: Date.now(), promise };
    void promise.catch(() => { if (cache?.promise === promise) cache = undefined; });
  }
  return cache.promise;
}
