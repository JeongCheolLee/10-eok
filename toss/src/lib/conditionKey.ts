import { normalizePlan, type Plan } from "./plan";

/** 종목 표시 순서나 사용하지 않는 입력값만 다르면 같은 조건으로 본다. */
export function conditionKey(plan: Plan): string {
  const p = normalizePlan(plan);
  const amountMode = p.mode === "amount" && !p.tracking;
  return JSON.stringify({
    holdings: p.holdings.map((h) => [h.ticker, amountMode ? null : h.amount]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
    mode: p.tracking ? "tracking" : p.mode, years: amountMode ? p.years : null,
    startDate: p.tracking ? p.startDate : null, lump: p.lump, freq: p.freq,
    day: p.freq === "monthly" ? p.buyDay : p.freq === "weekly" ? p.weekday : null,
    reinvest: p.reinvest,
  });
}
