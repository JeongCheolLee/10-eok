import { tickerCurrency } from "@/lib/tickers";
import { realStartOf } from "@/lib/tickerHistory";
export { REAL_START, DATA_START, realStartOf, actualHistoryRows } from "@/lib/tickerHistory";

export type LoadedDataInfo = {
  ticker: string;
  /** 추정치를 제외하고 계산에 쓸 수 있는 실제 가격 첫날. */
  actualStart: string;
  /** 마지막 가격 거래일. 생성 시각이 아니다. */
  priceAsOf: string;
  /** 마지막 가격일에 적용한 환율의 관측일. 원화 종목은 null. */
  fxAsOf: string | null;
};

/** 추정 구간: from(계산 시작일)부터 until(실제 가격 첫날) 전날까지. */
export type EstSpan = { ticker: string; until: string };

/** 계산 구간(start~)에 추정 가격이 들어간 종목들. 시작일이 실제 가격 첫날보다 이르면 포함. */
export function estimatedSpans(tickers: string[], start: string): EstSpan[] {
  const out: EstSpan[] = [];
  for (const t of tickers) {
    const until = realStartOf(t);
    if (until && start < until) out.push({ ticker: t, until });
  }
  return out;
}

/** 'until' 전날이 속한 달(추정 구간의 마지막 달). "2020-10-13" → "2020-10". 1일이면 전달. */
export function estLastMonth(until: string): string {
  const [y, m, d] = until.split("-").map(Number);
  if (d > 1) return `${y}-${String(m).padStart(2, "0")}-01`;
  const total = y * 12 + (m - 1) - 1;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}-01`;
}

/** 달러 종목이 하나라도 있으면 환율 안내가 필요하다. */
export function needsFx(tickers: string[]): boolean {
  return tickers.some((t) => tickerCurrency(t) === "USD");
}
