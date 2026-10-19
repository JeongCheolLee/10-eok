// 시장 기본 시나리오(ko: 매달 100만원·목표 10억)의 종목별 오늘 기준 역산 결과 요약.
// public/data/summary/ko.json으로 매일 생성 — 토스 미니앱 비교 화면이 px 16개 대신 이것 하나만 읽는다.
// 계산·정렬은 lib/etfResults.ts(웹 /compare)와 동일해야 한다.
import { composeRows, type PxBundle, type FxBundle } from "../lib/backtest/compose";
import { runToToday } from "../lib/backtest/simulate";
import type { BacktestResult, Row } from "../lib/backtest/types";
import { tickerCurrency, tickerName } from "../lib/tickers";
import type { Market } from "../lib/i18n/markets";

export type SummaryRow = {
  symbol: string;
  name: string;
  reached: boolean;
  months: number;
  years: number;
  monthsRem: number;
  cagr: number;
  value: number;
  principal: number;
  dataStart: string;
  dataEnd: string;
};

export type Summary = {
  market: Market["locale"];
  generatedAt: string;
  monthly: number;
  buyDay: number;
  target: number;
  dataEnd: string | null;
  rows: SummaryRow[];
};

export type SummaryInput = {
  pxBySymbol: Record<string, PxBundle>;
  /** 시장 통화 환율(USD 1단위당). 원통화 종목에는 쓰지 않는다. */
  fx: FxBundle | null;
  market: Market;
  /** 테스트용 고정 시각. 생략 시 현재 시각. */
  generatedAt?: string;
};

const BUY_DAY = 1;

/** 순수 함수: px 번들 + 환율 → 정렬된 요약. px가 없거나 계산에 실패한 종목은 건너뛴다(etfResults와 동일). */
export function buildSummary({ pxBySymbol, fx, market, generatedAt }: SummaryInput): Summary {
  const monthly = market.monthly.default * market.monthly.unit;
  const target = market.goal.default * market.goal.unit;
  const rows: SummaryRow[] = [];
  let dataEnd: string | null = null;
  for (const symbol of market.tickers) {
    const px = pxBySymbol[symbol];
    if (!px) continue;
    const isNative = tickerCurrency(symbol) === market.currency;
    let composed: Row[];
    let r: BacktestResult;
    try {
      composed = composeRows(px, isNative ? null : fx);
      r = runToToday(composed, { monthly, buyDay: BUY_DAY, target });
    } catch {
      continue;
    }
    const end = composed[composed.length - 1].date;
    rows.push({
      symbol,
      name: tickerName(symbol),
      reached: r.reached,
      months: r.months,
      years: r.years,
      monthsRem: r.monthsRem,
      cagr: r.cagr,
      value: Math.round(r.value),
      principal: Math.round(r.principal),
      dataStart: composed[0].date,
      dataEnd: end,
    });
    if (!dataEnd || end > dataEnd) dataEnd = end;
  }
  // lib/etfResults.ts와 동일: 도달 종목은 빠른 순, 미달 종목은 평가액 큰 순으로 뒤에
  rows.sort((a, b) => {
    if (a.reached !== b.reached) return a.reached ? -1 : 1;
    return a.reached ? a.months - b.months : b.value - a.value;
  });
  return {
    market: market.locale,
    generatedAt: generatedAt ?? new Date().toISOString(),
    monthly,
    buyDay: BUY_DAY,
    target,
    dataEnd,
    rows,
  };
}
