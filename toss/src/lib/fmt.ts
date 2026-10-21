import { getFormatter } from "@/lib/i18n/format";

export const fmt = getFormatter("ko");

/** 부호 있는 원화 변화량. |v|<1억 → "+1,234만원", 그 외 "−1.23억" */
export function signedWon(v: number): string {
  const sign = v < 0 ? "−" : "+";
  const a = Math.abs(v);
  if (a >= 1e8) return `${sign}${(a / 1e8).toFixed(2)}억`;
  return `${sign}${Math.round(a / 1e4).toLocaleString("ko-KR")}만원`;
}
export function signedPct(frac: number): string {
  const v = frac * 100;
  return `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(1)}%`;
}
/** 만원 단위 입력값 표기. 100 → "100만원", 10000 → "1억원" */
export function manLabel(man: number): string {
  if (man >= 10_000 && man % 10_000 === 0) return `${man / 10_000}억원`;
  if (man >= 10_000) return `${(man / 10_000).toFixed(1)}억원`;
  return `${man.toLocaleString("ko-KR")}만원`;
}
export function ymKo(iso: string): string { return fmt.ym(iso); }
export function ymdKo(iso: string): string { return fmt.ymd(iso); }
export function mdKo(iso: string): string { const [, m, d] = iso.split("-").map(Number); return `${m}월 ${d}일`; }
export function durKo(years: number, monthsRem: number): string {
  return years > 0 ? `${years}년 ${monthsRem}개월` : `${monthsRem}개월`;
}

const WD = ["일", "월", "화", "수", "목", "금", "토"];
/** 매수 주기 라벨: "매달 1일" · "매달 말일" · "매주 월요일" · "매일" */
export function freqLabel(p: { freq: "monthly" | "weekly" | "daily"; buyDay: number; weekday: number }): string {
  if (p.freq === "daily") return "매일";
  if (p.freq === "weekly") return `매주 ${WD[p.weekday] ?? "월"}요일`;
  return p.buyDay >= 29 ? "매달 말일" : `매달 ${p.buyDay}일`;
}
/** "매달 1일에" / "매주 월요일에" / "매일" — 문장 속 부사구 */
export function freqAdverb(p: { freq: "monthly" | "weekly" | "daily"; buyDay: number; weekday: number }): string {
  return p.freq === "daily" ? "매일" : `${freqLabel(p)}에`;
}
/** "매달 넣을 돈" 류 라벨의 앞말 */
export function freqWord(freq: "monthly" | "weekly" | "daily"): string {
  return freq === "daily" ? "매일" : freq === "weekly" ? "매주" : "매달";
}
