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

/** ISO "2021-05-03" → "2021년 5월 3일" */
export function ymd(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

/** 금액 압축표기: 1억 이상 "1.63억"(10억↑ 한 자리), 미만 "205만". 월별 표·스크럽용. */
export function won(v: number): string {
  if (v >= 1e8) {
    const x = v / 1e8;
    return (x >= 10 ? x.toFixed(1) : x.toFixed(2)) + "억";
  }
  return Math.round(v / 1e4).toLocaleString("ko-KR") + "만";
}

/** 원금 대비 증감: 원금 0이면 "". 2배 이상은 "6.2배", 그 미만은 "+21%"/"-8%". */
export function growth(principal: number, value: number): string {
  if (principal <= 0) return "";
  const ratio = value / principal;
  if (ratio >= 2) return ratio.toFixed(1) + "배";
  const r = Math.round((ratio - 1) * 100);
  return (r >= 0 ? "+" : "") + r + "%";
}
