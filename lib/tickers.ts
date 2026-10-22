// 종목 레지스트리 — 생성기(번들 생성)와 UI(선택지)가 공유.
// 미국(USD): 매수당일 환율로 환전. 한국(KRW): 원화 자산이라 환율=1(환전 없음).
// color는 모노그램 원형 로고(토스식 아바타)용 팔레트일 뿐, 브랜드 로고 이미지가 아님.
export type TickerInfo = {
  symbol: string; // Yahoo 심볼 (번들 파일명 = 소문자). 데이터 키.
  name: string; // 한국어 이름
  color: string; // 모노그램 아바타 배경색
  currency?: "USD" | "KRW"; // 기본 USD
  short?: string; // 모노그램에 표시할 짧은 라벨 (없으면 symbol)
  // 상장 이전 구간을 유사 전략 지수(proxy)로 스케일 접합해 합성. 원화 종목에 달러 프록시를 붙이면 생성기가 그날 환율로 원화 환산 후 접합. 생성기가 데이터를 만들고,
  // UI는 이 필드가 있으면 "상장 이전은 근사치" 안내를 띄운다. label은 안내에 쓸 프록시 이름.
  splice?: { proxy: string; label: string };
  // 상장이 늦어 데이터 이력이 짧음(장기 백테스트 한계). UI가 "이력 짧음" 안내를 띄운다.
  shortHistory?: boolean;
  // 웹(jeongcheol.cloud) 시장 목록·ETF 상세 페이지에서 제외. 토스 미니앱에만 노출(웹은 4개 언어 콘텐츠가 필요해서, 2026-10-22).
  webHidden?: boolean;
  // 세금 규칙. 생략 시 currency로 결정: USD → "us"(해외주식 양도세 22%, 연 250만 공제 합산), KRW → "kr-domestic"(국내주식형 ETF 매매차익 비과세).
  // "kr-foreign" = 국내 상장 해외주식형 ETF: 매매차익에 배당소득세 15.4%(공제 없음, 종목별).
  tax?: "us" | "kr-domestic" | "kr-foreign";
  // 미니앱 종목 선택 시트의 묶음.
  group?: "index" | "leverage" | "dividend" | "sector" | "bond-gold" | "kr-listed";
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
  // ── 2026-10-22 추가(미니앱 전용). 데이터 시작·접합은 생성기에서 확인 ──
  { symbol: "QQQM", name: "나스닥100 (저보수)", color: "#2563eb", splice: { proxy: "QQQ", label: "QQQ(같은 나스닥100 지수)" }, webHidden: true, group: "index" },
  { symbol: "SPYM", name: "S&P 500 (저보수)", color: "#f97316", webHidden: true, group: "index" },
  { symbol: "DIA", name: "다우존스 30", color: "#475569", webHidden: true, group: "index" },
  { symbol: "SOXL", name: "미국 반도체 3배", color: "#be185d", webHidden: true, group: "leverage" },
  { symbol: "VYM", name: "미국 고배당", color: "#0f766e", webHidden: true, group: "dividend" },
  { symbol: "DGRO", name: "미국 배당성장 (아이셰어즈)", color: "#047857", webHidden: true, group: "dividend" },
  { symbol: "360750.KS", name: "TIGER 미국S&P500", color: "#ea580c", currency: "KRW", short: "T500", splice: { proxy: "SPY", label: "SPY(같은 S&P 500 지수, 원화 환산)" }, tax: "kr-foreign", webHidden: true, group: "kr-listed" },
  { symbol: "133690.KS", name: "TIGER 미국나스닥100", color: "#1d4ed8", currency: "KRW", short: "TNDQ", tax: "kr-foreign", webHidden: true, group: "kr-listed" },
  { symbol: "458730.KS", name: "TIGER 미국배당다우존스", color: "#0d9488", currency: "KRW", short: "TDIV", splice: { proxy: "SCHD", label: "SCHD(같은 배당다우존스 지수, 원화 환산)" }, tax: "kr-foreign", webHidden: true, group: "kr-listed" },
];

/** 세금 규칙(필드 생략 시 통화로 결정). */
export function tickerTax(symbol: string): "us" | "kr-domestic" | "kr-foreign" {
  const i = tickerInfo(symbol);
  return i.tax ?? ((i.currency ?? "USD") === "KRW" ? "kr-domestic" : "us");
}
/** 미니앱에서 고를 수 있는 전체 종목(웹 숨김 포함). */
export const TOSS_TICKERS: string[] = TICKERS.map((t) => t.symbol);

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
