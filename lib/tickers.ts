// 종목 레지스트리 — 생성기(번들 생성)와 UI(선택지)가 공유.
// 모두 미국 상장(USD) → 기존 KRW↔USD 환율 로직 그대로 적용.
export type TickerInfo = {
  symbol: string; // Yahoo 심볼 (번들 파일명 = 소문자)
  name: string; // 화면에 보이는 친숙한 이름
  sub: string; // 보조 설명
};

export const TICKERS: TickerInfo[] = [
  { symbol: "QLD", name: "나스닥100 ×2", sub: "QLD · 레버리지" },
  { symbol: "TQQQ", name: "나스닥100 ×3", sub: "TQQQ · 레버리지" },
  { symbol: "QQQ", name: "나스닥100", sub: "QQQ" },
  { symbol: "SPY", name: "S&P 500", sub: "SPY" },
  { symbol: "NVDA", name: "엔비디아", sub: "NVDA" },
  { symbol: "TSLA", name: "테슬라", sub: "TSLA" },
  { symbol: "AAPL", name: "애플", sub: "AAPL" },
];

export const DEFAULT_TICKER = "QLD";

export function tickerName(symbol: string): string {
  return TICKERS.find((t) => t.symbol === symbol)?.name ?? symbol;
}
