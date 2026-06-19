// 거래일 정렬 + 환율 forward-fill + 검증. 생성기(EC2)와 프론트가 공유하는 단일 소스.
import type { Row } from "./types";

export type PricePoint = { date: string; price: number; raw?: number };
export type FxPoint = { date: string; rate: number };

/**
 * 가격 거래일을 기준 달력으로 삼아, 각 거래일에 그날(또는 직전) 환율을 forward-fill.
 * - 가격이 0/음수/NaN인 날은 제외.
 * - 환율 이력이 시작되기 전(직전값 없음)의 가격일은 제외.
 * 결과는 날짜 오름차순, 검증 통과한 Row[].
 */
export function alignSeries(prices: PricePoint[], fx: FxPoint[]): Row[] {
  const ps = [...prices].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const fxs = [...fx].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const rows: Row[] = [];
  let fi = 0;
  let lastFx = NaN;
  for (const p of ps) {
    if (!Number.isFinite(p.price) || p.price <= 0) continue;
    // p.date 이하의 마지막 유효 환율을 lastFx로 (forward-fill). fi는 단조 증가.
    while (fi < fxs.length && fxs[fi].date <= p.date) {
      const r = fxs[fi].rate;
      if (Number.isFinite(r) && r > 0) lastFx = r;
      fi++;
    }
    if (!Number.isFinite(lastFx)) continue; // 환율 이력 시작 전 → 제외
    rows.push({ date: p.date, price: p.price, fx: lastFx, raw: p.raw });
  }
  validateRows(rows);
  return rows;
}

/** 나쁜 번들이 배포되지 않도록 빌드 시 검증. 문제가 있으면 throw. */
export function validateRows(rows: Row[]): void {
  if (rows.length === 0) throw new Error("정렬 후 행이 0개입니다 (데이터 소스 확인 필요)");
  let prev = "";
  for (const r of rows) {
    if (!(r.date > prev)) throw new Error(`날짜가 단조 증가하지 않음: ${r.date} (이전 ${prev})`);
    if (!(r.price > 0)) throw new Error(`가격 이상치: ${r.date} → ${r.price}`);
    if (!(r.fx > 0)) throw new Error(`환율 이상치: ${r.date} → ${r.fx}`);
    prev = r.date;
  }
}
