import fs from "node:fs/promises";
import path from "node:path";
import { tickerName, tickerCurrency } from "@/lib/tickers";
import { tickerDesc } from "@/lib/i18n/tickerNames";
import type { BacktestResult } from "@/lib/backtest/types";
import { composeRows, type PxBundle, type FxBundle } from "@/lib/backtest/compose";
import { runToToday } from "@/lib/backtest/simulate";
import type { Market } from "@/lib/i18n/markets";

// 홈 본문과 /compare 페이지가 공유하는 종목별 백테스트 계산 (서버 전용).
// 시나리오는 시장 설정의 기본값(ko: 매달 100만원·목표 10억, en: $700·$1M 등). 오늘 시점 역산(runToToday).
export type TickerResult = {
  symbol: string;
  label: string;
  sub: string;
  isNative: boolean; // 그 시장에서 환율 변환 없이 자체 통화로 거래되는 종목(ko의 KODEX)
  r: BacktestResult;
};

export async function computeTickerResults(market: Market): Promise<{ rows: TickerResult[]; dataEnd: string | null }> {
  const out: TickerResult[] = [];
  let dataEnd: string | null = null;
  const dataDir = path.join(process.cwd(), "public", "data");
  // 환율은 통화별 1파일 — 루프 밖에서 1회 로드(USD 시장은 fxFile=null)
  const fx = market.fxFile ? (JSON.parse(await fs.readFile(path.join(dataDir, market.fxFile), "utf8")) as FxBundle) : null;
  const monthly = market.monthly.default * market.monthly.unit;
  const target = market.goal.default * market.goal.unit;
  for (const symbol of market.tickers) {
    try {
      const px = JSON.parse(await fs.readFile(path.join(dataDir, "px", `${symbol.toLowerCase()}.json`), "utf8")) as PxBundle;
      const isNative = tickerCurrency(symbol) === market.currency;
      const r = runToToday(composeRows(px, isNative ? null : fx), { monthly, buyDay: 1, target });
      // ko만 통화가 섞인 시장(KODEX=KRW 나머지=USD)이라 원어 이름/구분 라벨이 필요. 그 외 시장은 전부 동일 통화.
      // sub(부제)는 로케일별 카테고리 설명 — ko는 tickerName과 바이트 동일, en/ja/de는 tickerDesc 번역.
      out.push({
        symbol,
        label: isNative && market.locale === "ko" ? tickerName(symbol) : symbol,
        sub: isNative && market.locale === "ko" ? "한국 ETF" : tickerDesc(symbol, market.locale),
        isNative,
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
    return a.r.reached ? a.r.months - b.r.months : b.r.value - a.r.value;
  });
  return { rows: out, dataEnd };
}
