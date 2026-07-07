// px(가격)·fx(환율) 분리 파일을 Row[]로 합성. 구 번들(fx 내장 {ticker}.json)과
// 결과가 완전히 동일해야 한다 — compose.test.ts 골든 테스트가 그 안전망.
// 다통화 확장의 기반: 시장 통화가 바뀌면 fx 파일만 갈아끼운다.
import { alignSeries, type PricePoint, type FxPoint } from "./align";
import type { Row } from "./types";

/** public/data/px/{ticker}.json — 원통화(종목 상장 통화) 가격 시계열. rows = [date, adjClose, rawClose] */
export type PxBundle = {
  ticker: string;
  /** 종목 상장 통화 (가격의 단위) */
  currency: "USD" | "KRW";
  start: string;
  generatedAt: string;
  rows: [string, number, number][];
};

/** public/data/fx/{cur}.json — USD 1단위당 해당 통화. rows = [date, rate] */
export type FxBundle = {
  /** 예: "USDKRW" */
  pair: string;
  /** FRED 시리즈 ID. 예: "DEXKOUS" */
  source: string;
  generatedAt: string;
  rows: [string, number][];
};

/**
 * 가격 + 환율 → 정렬·검증된 Row[]. fx가 null이면 자산 통화 = 타깃 통화(환율 1 고정)
 * — 구 파이프라인의 KRW 종목(fx=1 더미) 규칙과 동일.
 * raw 폴백(raw ?? price)도 구 bundleToRows와 동일 규칙.
 */
export function composeRows(px: PxBundle, fx: FxBundle | null): Row[] {
  const prices: PricePoint[] = px.rows.map(([date, price, raw]) => ({ date, price, raw }));
  const fxPts: FxPoint[] = fx
    ? fx.rows.map(([date, rate]) => ({ date, rate }))
    : [{ date: "1900-01-01", rate: 1 }];
  return alignSeries(prices, fxPts).map((r) => (r.raw == null ? { ...r, raw: r.price } : r));
}
