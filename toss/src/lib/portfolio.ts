// 분산 매수(여러 종목) 계산. 공용 엔진(lib/backtest)은 종목 하나씩 돌리고, 여기서 날짜별로 합산한다.
// ── 계약(2026-10-22): 화면 쪽은 아래 타입·함수 시그니처만 의존한다. 구현은 별도 작업에서 채운다. ──
import type { BacktestResult, BuySchedule, Row } from "@/lib/backtest/types";

/** 보유 종목 1개. amount = 1회 적립액(만원). */
export type Holding = { ticker: string; amount: number };

/** 종목 공통 조건. lump(만원)는 holdings 금액 비율로 나눠 투입. */
export type PortfolioOpts = {
  lump: number;
  schedule: BuySchedule;
  buyDay: number;
  reinvest: boolean;
  /** 해외주식 양도세 반영. 종목별이 아니라 USD 종목 차익 합계에 1회(22%·기본공제 250만). */
  tax: boolean;
  target: number;
};

export type HoldingResult = {
  ticker: string;
  /** 이 종목의 1회 적립액(원) — 금액 모드에서는 역산된 값 */
  amountWon: number;
  value: number;
  principal: number;
  cagr: number;
  dataStart: string;
  dataEnd: string;
};

/** 합산 결과. BacktestResult 필드는 합계 기준(series도 합계). */
export type PortfolioResult = BacktestResult & {
  holdings: HoldingResult[];
  /** 실제 계산 시작일(모든 종목 데이터가 있는 가장 이른 날 이후) */
  startDate: string;
  /** 시작일을 늦춘 종목(데이터가 가장 늦게 시작). 없으면 null */
  limitedBy: string | null;
  /** 세금 반영액(원, 0 이상) */
  taxWon: number;
};

/** 고정 시작일부터 endDate(생략 시 데이터 끝)까지. target 도달 여부·도달일 포함. */
export function runPortfolio(rowsBy: Record<string, Row[]>, holdings: Holding[], opts: PortfolioOpts, startDate: string, endDate?: string): PortfolioResult {
  void rowsBy; void holdings; void opts; void startDate; void endDate;
  throw new Error("runPortfolio: not implemented");
}

/** 기간 모드: 오늘(데이터 끝)에 target을 넘기는 가장 늦은 시작월을 찾는다(runToToday와 같은 규칙). */
export function portfolioToToday(rowsBy: Record<string, Row[]>, holdings: Holding[], opts: PortfolioOpts): PortfolioResult {
  void rowsBy; void holdings; void opts;
  throw new Error("portfolioToToday: not implemented");
}

/** 금액 모드: years년 전부터 오늘까지 target에 닿으려면 필요한 금액. holdings 비율을 고정하고 스케일만 찾는다. */
export function portfolioRequired(rowsBy: Record<string, Row[]>, holdings: Holding[], opts: PortfolioOpts, years: number): { scale: number; amountsWon: number[]; result: PortfolioResult } {
  void rowsBy; void holdings; void opts; void years;
  throw new Error("portfolioRequired: not implemented");
}
