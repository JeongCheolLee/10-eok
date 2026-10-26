import { AMOUNT_MIN, type Freq, type Holding } from "./plan";

export type FrequencyAmounts = Partial<Record<Freq, Record<string, number>>>;

/** A frequency change must not silently reset every ETF to the same preset. */
export function holdingsForFrequency(holdings: Holding[], frequency: Freq, remembered: FrequencyAmounts): Holding[] {
  return holdings.map((holding) => ({
    ...holding,
    amount: Math.max(AMOUNT_MIN[frequency], remembered[frequency]?.[holding.ticker] ?? holding.amount),
  }));
}

export function startDateError(value: string, today: string): string | null {
  if (!value) return "시작한 날을 입력해 주세요";
  const date = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return "날짜를 다시 확인해 주세요";
  if (value > today) return "오늘까지의 날짜로 골라 주세요";
  if (value < "1990-01-01") return "1990년 이후의 날짜로 골라 주세요";
  return null;
}
