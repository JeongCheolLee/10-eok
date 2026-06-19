// 종목 레지스트리 — 생성기(번들 생성)와 UI(선택지)가 공유.
// 모두 미국 상장(USD) → 기존 KRW↔USD 환율 로직 그대로 적용.
// color는 모노그램 원형 로고(토스식 아바타)용 팔레트일 뿐, 브랜드 로고 이미지가 아님.
export type TickerInfo = {
  symbol: string; // Yahoo 심볼 (번들 파일명 = 소문자), 화면 주 표기
  name: string; // 보조 한국어 이름
  color: string; // 모노그램 아바타 배경색
};

export const TICKERS: TickerInfo[] = [
  { symbol: "QLD", name: "나스닥100 2배", color: "#5e6ad2" },
  { symbol: "TQQQ", name: "나스닥100 3배", color: "#e0467c" },
  { symbol: "QQQ", name: "나스닥100", color: "#3b82f6" },
  { symbol: "SPY", name: "S&P 500", color: "#e11d48" },
  { symbol: "NVDA", name: "엔비디아", color: "#5a8f00" },
  { symbol: "TSLA", name: "테슬라", color: "#d33a3f" },
  { symbol: "AAPL", name: "애플", color: "#8a9197" },
];

export const DEFAULT_TICKER = "QLD";

export function tickerInfo(symbol: string): TickerInfo {
  return TICKERS.find((t) => t.symbol === symbol) ?? { symbol, name: symbol, color: "#666666" };
}

export function tickerName(symbol: string): string {
  return tickerInfo(symbol).name;
}
