import { tickerInfo, tickerCurrency } from "@/lib/tickers";

/** 상장 전 구간을 비슷한 ETF·지수로 이어 붙인 종목(레지스트리 splice)의 '실제 가격 첫날'.
 *  px 번들 메타에 상장일이 없어서 표로 둔다. 값은 px 데이터에서 실제 종가(소수 셋째 자리 이내·원 단위 정수)가
 *  처음 나오는 날로 검증했다(dataInfo.test.ts). JEPI는 5/20 상장이지만 Yahoo 첫 종가가 5/21이다. */
export const REAL_START: Record<string, string> = {
  QQQM: "2020-10-13",
  JEPI: "2020-05-21",
  "360750.KS": "2020-08-07",
  "458730.KS": "2023-06-20",
};

/** 상장이 늦어 이력이 짧은 종목(레지스트리 shortHistory)의 데이터 첫날. px 번들 meta.start와 같다. */
export const DATA_START: Record<string, string> = {
  JEPQ: "2022-05-04",
};

/** 추정치가 끝나고 실제 가격이 시작되는 날. 접합 종목이 아니거나 표에 없으면 null. */
export function realStartOf(ticker: string): string | null {
  const key = ticker.toUpperCase();
  return tickerInfo(key).splice ? REAL_START[key] ?? null : null;
}

/** 기본 계산·저장 결과는 실제 거래 이력만 쓴다. 새 접합 종목의 경계가 빠지면 추정치를 쓰는 대신 실패한다. */
export function actualHistoryRows<T extends { date: string }>(ticker: string, rows: T[]): T[] {
  const key = ticker.toUpperCase();
  const start = realStartOf(key);
  if (tickerInfo(key).splice && !start) throw new Error(`Missing actual history boundary: ${key}`);
  const actual = start ? rows.filter((row) => row.date >= start) : rows;
  if (!actual.length) throw new Error(`No actual trading history: ${key}`);
  return actual;
}

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
