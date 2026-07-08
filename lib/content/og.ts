import type { Locale } from "@/lib/i18n/locales";

// /api/og 카드 카피의 로케일 레지스트리. 숫자·통화·기간 포맷은 getFormatter(locale)에 위임하고
// 여기엔 문장 틀만 둔다. ko는 기존 route.tsx 인라인 문자열과 바이트 동일(불변).
export type OgCopy = {
  defaultLead: string;
  defaultBig: (goal: string) => string;
  defaultSub: string;
  amountLead: (years: number, goal: string) => string;
  amountBigLump: string;
  amountBig: (monthly: string) => string;
  amountSub: (ref: string, lumpLabel: string, principal: string, value: string) => string;
  timeLead: (goal: string) => string;
  timeBig: (years: number, months: number) => string;
  timeSub: (ref: string, monthly: string, lumpLabel: string, fromYm: string, value: string) => string;
  missLead: (ref: string, monthly: string, lumpLabel: string) => string;
  missBig: (goal: string) => string;
  missSub: (value: string) => string;
  /** 초기 목돈 라벨(있을 때만). lumpStr은 이미 포맷된 금액. */
  lumpLabel: (lumpStr: string) => string;
};

const KO: OgCopy = {
  defaultLead: "과거에 매달 모았다면",
  defaultBig: (goal) => `${goal}까지 얼마나?`,
  defaultSub: "실제 과거 가격 + 그날 환율로 백테스트",
  amountLead: (y, goal) => `${y}년 안에 ${goal} 모으려면`,
  amountBigLump: "초기금만으로 달성!",
  amountBig: (monthly) => `매달 ${monthly}`,
  amountSub: (ref, lump, principal, value) => `${ref} 기준${lump} · 원금 ${principal} → ${value}`,
  timeLead: (goal) => `지금 ${goal}이 되려면`,
  timeBig: (y, m) => `${y}년 ${m}개월 전부터`,
  timeSub: (ref, monthly, lump, from, value) => `${ref} · 매달 ${monthly}${lump} · ${from}부터 → 지금 ${value}`,
  missLead: (ref, monthly, lump) => `${ref} · 매달 ${monthly}${lump}`,
  missBig: (goal) => `아직 ${goal}은 멀어요`,
  missSub: (value) => `전 구간 모아도 지금 ${value}`,
  lumpLabel: (lumpStr) => ` · 초기 ${lumpStr}`,
};

const EN: OgCopy = {
  defaultLead: "If you'd saved every month",
  defaultBig: (goal) => `How long to ${goal}?`,
  defaultSub: "Backtested on real historical prices",
  amountLead: (y, goal) => `To reach ${goal} in ${y} years`,
  amountBigLump: "Done with the lump sum alone!",
  amountBig: (monthly) => `${monthly}/month`,
  amountSub: (ref, lump, principal, value) => `${ref}${lump} · invested ${principal} → ${value}`,
  timeLead: (goal) => `To have ${goal} today`,
  timeBig: (y, m) => `starting ${y}y ${m}m ago`,
  timeSub: (ref, monthly, lump, from, value) => `${ref} · ${monthly}/month${lump} · from ${from} → ${value} today`,
  missLead: (ref, monthly, lump) => `${ref} · ${monthly}/month${lump}`,
  missBig: (goal) => `${goal} is still far off`,
  missSub: (value) => `Even over the full period: ${value}`,
  lumpLabel: (lumpStr) => ` · ${lumpStr} to start`,
};

const JA: OgCopy = {
  defaultLead: "毎月積み立てていたら",
  defaultBig: (goal) => `${goal}まで何年?`,
  defaultSub: "実際の過去の価格でバックテスト",
  amountLead: (y, goal) => `${y}年で${goal}を貯めるには`,
  amountBigLump: "初期資金だけで達成!",
  amountBig: (monthly) => `毎月${monthly}`,
  amountSub: (ref, lump, principal, value) => `${ref}${lump} · 元本${principal} → ${value}`,
  timeLead: (goal) => `今${goal}になるには`,
  timeBig: (y, m) => `${y}年${m}か月前から`,
  timeSub: (ref, monthly, lump, from, value) => `${ref} · 毎月${monthly}${lump} · ${from}から → 今${value}`,
  missLead: (ref, monthly, lump) => `${ref} · 毎月${monthly}${lump}`,
  missBig: (goal) => `${goal}にはまだ遠い`,
  missSub: (value) => `全期間でも今${value}`,
  lumpLabel: (lumpStr) => ` · 初期${lumpStr}`,
};

const DE: OgCopy = {
  defaultLead: "Hättest du monatlich gespart",
  defaultBig: (goal) => `Wie lange bis ${goal}?`,
  defaultSub: "Backtest mit echten historischen Kursen",
  amountLead: (y, goal) => `Um ${goal} in ${y} Jahren zu erreichen`,
  amountBigLump: "Schon mit dem Startkapital!",
  amountBig: (monthly) => `${monthly}/Monat`,
  amountSub: (ref, lump, principal, value) => `${ref}${lump} · investiert ${principal} → ${value}`,
  timeLead: (goal) => `Um heute ${goal} zu haben`,
  timeBig: (y, m) => `vor ${y} J. ${m} M. gestartet`,
  timeSub: (ref, monthly, lump, from, value) => `${ref} · ${monthly}/Monat${lump} · ab ${from} → heute ${value}`,
  missLead: (ref, monthly, lump) => `${ref} · ${monthly}/Monat${lump}`,
  missBig: (goal) => `${goal} ist noch weit weg`,
  missSub: (value) => `Über den gesamten Zeitraum: ${value}`,
  lumpLabel: (lumpStr) => ` · ${lumpStr} zum Start`,
};

const OG_COPY: Record<Locale, OgCopy> = { ko: KO, en: EN, ja: JA, de: DE };

export function getOgCopy(locale: Locale): OgCopy {
  return OG_COPY[locale];
}
