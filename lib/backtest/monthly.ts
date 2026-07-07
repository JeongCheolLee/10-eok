// 월별 결과 파생: 일별 series → 각 달의 스냅샷, 이정표(1억·5억…) 최초 돌파월. 순수 함수.
import type { BacktestResult } from "./types";

export type MonthPoint = {
  /** "2013-01" */
  ym: string;
  /** 그 달의 마지막 거래일 (스냅샷 기준일) */
  date: string;
  /** 그 달 말 평가액 (KRW) */
  valueKRW: number;
  /** 그 달 말까지 누적 납입원금 (KRW) */
  principalKRW: number;
};

/** 일별 series → 각 달의 마지막 거래일 스냅샷 (오름차순). */
export function monthlySnapshots(series: BacktestResult["series"]): MonthPoint[] {
  const byYm = new Map<string, MonthPoint>();
  for (const p of series) {
    const ym = p.date.slice(0, 7);
    // series는 오름차순 → 같은 달은 뒤 값(더 늦은 거래일)으로 계속 덮어써 마지막이 월말 스냅샷.
    byYm.set(ym, { ym, date: p.date, valueKRW: p.valueKRW, principalKRW: p.principalKRW });
  }
  return [...byYm.values()];
}

/**
 * 각 이정표 금액을 '월말 평가액 기준 처음 넘은 달(ym)'에 매핑.
 * 한 달에 여러 이정표를 동시에 넘으면 그 달엔 가장 큰 금액만 남긴다.
 * months는 오름차순 가정.
 */
export function milestoneMonths(months: MonthPoint[], thresholds: number[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const t of thresholds) {
    const hit = months.find((m) => m.valueKRW >= t);
    if (hit) out.set(hit.ym, Math.max(out.get(hit.ym) ?? 0, t));
  }
  return out;
}
