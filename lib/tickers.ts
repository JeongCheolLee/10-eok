// 종목 레지스트리 — 생성기(번들 생성)와 UI(선택지)가 공유.
// 미국(USD): 매수당일 환율로 환전. 한국(KRW): 원화 자산이라 환율=1(환전 없음).
// color는 모노그램 원형 로고(토스식 아바타)용 팔레트일 뿐, 브랜드 로고 이미지가 아님.
export type TickerInfo = {
  symbol: string; // Yahoo 심볼 (번들 파일명 = 소문자). 데이터 키.
  name: string; // 한국어 이름
  color: string; // 모노그램 아바타 배경색
  currency?: "USD" | "KRW"; // 기본 USD
  short?: string; // 모노그램에 표시할 짧은 라벨 (없으면 symbol)
  // 상장 이전 구간을 유사 전략 지수(proxy)로 스케일 접합해 합성. 생성기가 데이터를 만들고,
  // UI는 이 필드가 있으면 "상장 이전은 근사치" 안내를 띄운다. label은 안내에 쓸 프록시 이름.
  splice?: { proxy: string; label: string };
  // 상장이 늦어 데이터 이력이 짧음(장기 백테스트 한계). UI가 "이력 짧음" 안내를 띄운다.
  shortHistory?: boolean;
};

// ETF만 (단일 종목 제외). 검색 가능한 드롭다운으로 고르며, 추후 ETF 추가 용이.
export const TICKERS: TickerInfo[] = [
  { symbol: "QLD", name: "나스닥100 2배", color: "#5e6ad2" },
  { symbol: "TQQQ", name: "나스닥100 3배", color: "#e0467c" },
  { symbol: "QQQ", name: "나스닥100", color: "#3b82f6" },
  { symbol: "SPY", name: "S&P 500", color: "#e11d48" },
  { symbol: "VOO", name: "S&P 500 (뱅가드)", color: "#ea580c" },
  { symbol: "SCHD", name: "미국 배당성장", color: "#0d9488" },
  { symbol: "VT", name: "전세계 주식", color: "#16a34a" },
  { symbol: "SOXX", name: "미국 반도체", color: "#db2777" },
  { symbol: "VGT", name: "미국 기술주", color: "#1d4ed8" },
  { symbol: "VNQ", name: "미국 리츠", color: "#0891b2" },
  { symbol: "GLD", name: "금", color: "#ca8a04" },
  { symbol: "TLT", name: "미국 장기국채", color: "#7c3aed" },
  { symbol: "AGG", name: "미국 종합채권", color: "#64748b" },
  { symbol: "JEPI", name: "미국 커버드콜", color: "#4d7c0f", splice: { proxy: "^BXM", label: "CBOE S&P 500 커버드콜 지수(BXM)" } },
  { symbol: "JEPQ", name: "나스닥 커버드콜", color: "#b91c1c", shortHistory: true },
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
