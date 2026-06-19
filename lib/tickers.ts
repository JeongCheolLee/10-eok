// 종목 레지스트리 — 생성기(번들 생성)와 UI(선택지)가 공유.
// 미국(USD): 매수당일 환율로 환전. 한국(KRW): 원화 자산이라 환율=1(환전 없음).
// color는 모노그램 원형 로고(토스식 아바타)용 팔레트일 뿐, 브랜드 로고 이미지가 아님.
export type TickerInfo = {
  symbol: string; // Yahoo 심볼 (번들 파일명 = 소문자). 데이터 키.
  name: string; // 한국어 이름
  color: string; // 모노그램 아바타 배경색
  currency?: "USD" | "KRW"; // 기본 USD
  short?: string; // 모노그램에 표시할 짧은 라벨 (없으면 symbol)
};

// ETF만 (단일 종목 제외). 검색 가능한 드롭다운으로 고르며, 추후 ETF 추가 용이.
export const TICKERS: TickerInfo[] = [
  { symbol: "QLD", name: "나스닥100 2배", color: "#5e6ad2" },
  { symbol: "TQQQ", name: "나스닥100 3배", color: "#e0467c" },
  { symbol: "QQQ", name: "나스닥100", color: "#3b82f6" },
  { symbol: "SPY", name: "S&P 500", color: "#e11d48" },
  { symbol: "069500.KS", name: "KODEX 200", color: "#c0392b", currency: "KRW", short: "K200" },
];

export const DEFAULT_TICKER = "QLD";

export function tickerInfo(symbol: string): TickerInfo {
  return TICKERS.find((t) => t.symbol === symbol) ?? { symbol, name: symbol, color: "#666666" };
}
export function tickerName(symbol: string): string {
  return tickerInfo(symbol).name;
}
export function tickerCurrency(symbol: string): "USD" | "KRW" {
  return tickerInfo(symbol).currency ?? "USD";
}
/** 원형 로고에 들어갈 짧은 라벨 (미국=티커, 한국=한글 약자) */
export function tickerMonogram(symbol: string): string {
  const i = tickerInfo(symbol);
  return i.short ?? i.symbol;
}
/** 주 표기: 미국=티커, 한국=이름(삼성전자) */
export function tickerTitle(symbol: string): string {
  const i = tickerInfo(symbol);
  return i.currency === "KRW" ? i.name : i.symbol;
}
/** 보조 표기 */
export function tickerSubtitle(symbol: string): string {
  const i = tickerInfo(symbol);
  return i.currency === "KRW" ? "한국 주식" : i.name;
}
