// 표시용 포맷 (DESIGN.md 쉬운 말 원칙: 전문용어 ❌, 애기말 ❌, 일반 워딩 ✅)

/** KRW → "1.63억" */
export function eok(krw: number): string {
  return (krw / 1e8).toFixed(2) + "억";
}

/** KRW → "6.2억" (한 자리) */
export function eok1(krw: number): string {
  return (krw / 1e8).toFixed(1) + "억";
}

/** 0.21 → "+21%" */
export function pct(frac: number): string {
  const v = Math.round(frac * 100);
  return (v >= 0 ? "+" : "") + v + "%";
}

/** ISO "2020-01-15" → "2020년 1월" */
export function ym(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return `${y}년 ${m}월`;
}
