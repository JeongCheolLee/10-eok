import fs from "node:fs/promises";
import path from "node:path";
import { TICKERS, tickerName, tickerCurrency } from "@/lib/tickers";
import type { BacktestResult } from "@/lib/backtest/types";
import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import { runToToday } from "@/lib/backtest/simulate";

// 홈 본문과 /compare 페이지가 공유하는 종목별 백테스트 계산 (서버 전용).
// 기본 시나리오: 매달 100만원, 매달 1일, 목표 10억. 오늘 시점 역산(runToToday).
export const COMPARE_MONTHLY = 100;
export const COMPARE_BUY_DAY = 1;
export const COMPARE_TARGET_EOK = 10;

export type TickerResult = {
  symbol: string;
  label: string;
  sub: string;
  isKRW: boolean;
  r: BacktestResult;
};

export async function computeTickerResults(): Promise<{ rows: TickerResult[]; dataEnd: string | null }> {
  const out: TickerResult[] = [];
  let dataEnd: string | null = null;
  const dataDir = path.join(process.cwd(), "public", "data");
  // 환율은 통화별 1파일 — 루프 밖에서 1회 로드
  const fx = JSON.parse(await fs.readFile(path.join(dataDir, "fx", "krw.json"), "utf8")) as FxBundle;
  for (const t of TICKERS) {
    try {
      const px = JSON.parse(await fs.readFile(path.join(dataDir, "px", `${t.symbol.toLowerCase()}.json`), "utf8")) as PxBundle;
      const r = runToToday(composeRows(px, tickerCurrency(t.symbol) === "KRW" ? null : fx), {
        monthlyKRW: COMPARE_MONTHLY * 10000,
        buyDay: COMPARE_BUY_DAY,
        targetKRW: COMPARE_TARGET_EOK * 100_000_000,
      });
      const isKRW = tickerCurrency(t.symbol) === "KRW";
      out.push({
        symbol: t.symbol,
        label: isKRW ? tickerName(t.symbol) : t.symbol,
        sub: isKRW ? "한국 ETF" : tickerName(t.symbol),
        isKRW,
        r,
      });
      const end = r.series.at(-1)?.date;
      if (end && (!dataEnd || end > dataEnd)) dataEnd = end;
    } catch {
      // 번들이 없으면 그 종목은 건너뜀
    }
  }
  // 도달한 종목을 빠른 순으로, 미달 종목은 평가액 큰 순으로 뒤에
  out.sort((a, b) => {
    if (a.r.reached !== b.r.reached) return a.r.reached ? -1 : 1;
    return a.r.reached ? a.r.months - b.r.months : b.r.valueKRW - a.r.valueKRW;
  });
  return { rows: out, dataEnd };
}

export function dataEndLabel(iso: string | null): string {
  if (!iso) return "";
  const [y, m] = iso.split("-").map(Number);
  return `${y}년 ${m}월`;
}

/** ISO 날짜에서 "YYYY년" 추출 (데이터 시작 연도 표기용). */
export function yearOf(iso: string | undefined): string {
  if (!iso) return "";
  return `${iso.slice(0, 4)}년`;
}
