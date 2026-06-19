// 백테스트 도메인 타입. UI/프레임워크 비의존(순수).

/** 정렬·검증을 마친 한 거래일의 데이터. */
export type Row = {
  /** ISO 날짜 yyyy-mm-dd (NYSE 거래일) */
  date: string;
  /** 종목 수정주가 (USD, adjusted close) */
  price: number;
  /** 그날 USD/KRW 환율 (1달러 = N원) */
  fx: number;
};

/** EC2 생성기가 만들어 프론트가 받는 파생 번들. rows = [date, price, fx][] */
export type Bundle = {
  ticker: string;
  currencyTarget: "KRW";
  start: string;
  generatedAt: string;
  rows: [string, number, number][];
};

export type BacktestInput = {
  /** 매달 적립액 (KRW) */
  monthlyKRW: number;
  /** 매수일 (매달 며칠, 1~28). 휴장/주말이면 다음 거래일로 롤. */
  buyDay: number;
  /** 시작일 ISO. 생략 시 데이터 최초일. */
  startDate?: string;
  /** 목표액 KRW. 생략 시 10억. */
  targetKRW?: number;
  /** 물가연동 적립용 월별 CPI (오름차순). 주면 적립액 = base × CPI(매수월)/CPI(시작월). */
  cpi?: { ym: string; idx: number }[];
};

export type BacktestResult = {
  reached: boolean;
  reachedDate: string | null;
  /** 첫 매수일부터 도달일(미달 시 마지막일)까지 경과 개월 */
  months: number;
  years: number;
  monthsRem: number;
  /** 일별 평가액 시계열 (KRW) */
  series: { date: string; valueKRW: number }[];
  /** 누적 납입원금 (KRW) */
  principalKRW: number;
  /** 도달일(미달 시 마지막일) 평가액 (KRW) */
  valueKRW: number;
  /** 보유 구간 자산 연복리 수익률 (소수, 0.21 = 21%) */
  cagr: number;
};

export function bundleToRows(b: Bundle): Row[] {
  return b.rows.map(([date, price, fx]) => ({ date, price, fx }));
}
