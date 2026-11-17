import type { TickerReturns } from "@/lib/tickerReturns";
import bundledReturns from "@/public/data/summary/returns.json";
import { DATA_BASE } from "./platform";
import { requestJson } from "./request";
let cache: { at: number; promise: Promise<TickerReturns> } | undefined;
const snapshot = bundledReturns as TickerReturns;
function hasAnnualMeans(data: TickerReturns): boolean {
  return data?.version === 1 && data.annualMethod === "arithmetic-mean"
    && /^\d{4}-\d{2}-\d{2}$/.test(data.asOf) && !!data.rows && typeof data.rows === "object"
    && Object.values(data.rows).length > 0
    && Object.values(data.rows).every((periods) => periods && [1, 3, 5].every((years) => {
      const period = periods[years as 1 | 3 | 5];
      return period === null || !!period && Number.isFinite(period.meanAnnualReturn)
        && Array.isArray(period.annualReturns) && period.annualReturns.length === years
        && period.annualReturns.every((annual) => Number.isFinite(annual.rate));
    }));
}
export function loadTickerReturns(): Promise<TickerReturns> {
  if (!cache || Date.now() - cache.at > 300_000) {
    const promise = requestJson<TickerReturns>(`${DATA_BASE}/summary/returns.json`).then((data) => {
      // 앱 심사와 자료 서버 배포 시점이 달라도 구 CAGR을 산술평균으로 표시하지 않는다.
      return hasAnnualMeans(data) && data.asOf >= snapshot.asOf ? data : snapshot;
    }).catch(() => snapshot);
    cache = { at: Date.now(), promise };
    void promise.catch(() => { if (cache?.promise === promise) cache = undefined; });
  }
  return cache.promise;
}
