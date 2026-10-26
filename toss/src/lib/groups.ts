// 미니앱 종목 묶음·세금 안내. lib/tickers.ts(계약)는 건드리지 않고, group이 빈 기존 16종은 여기서 매핑한다.
import { TICKERS, tickerInfo, tickerSubtitle, tickerTax, type TickerInfo } from "@/lib/tickers";

export type Group = NonNullable<TickerInfo["group"]>;
export type Tax = ReturnType<typeof tickerTax>;

/** 시트에 보이는 순서·이름·한 줄 설명 */
export const GROUPS: { id: Group; label: string; desc?: string }[] = [
  { id: "index", label: "지수" },
  { id: "leverage", label: "레버리지" },
  { id: "dividend", label: "배당" },
  { id: "sector", label: "섹터·테마" },
  { id: "bond-gold", label: "채권·금" },
  { id: "kr-listed", label: "국내 상장", desc: "연금저축·ISA에서 살 수 있어요" },
];

/** group 필드가 없는 기존 16종 */
const LEGACY: Record<string, Group> = {
  QQQ: "index", SPY: "index", VOO: "index", VT: "index", "069500.KS": "index",
  QLD: "leverage", TQQQ: "leverage",
  SCHD: "dividend", JEPI: "dividend", JEPQ: "dividend",
  SOXX: "sector", VGT: "sector", VNQ: "sector",
  GLD: "bond-gold", TLT: "bond-gold", AGG: "bond-gold",
};

export function tickerGroup(symbol: string): Group {
  return tickerInfo(symbol).group ?? LEGACY[symbol] ?? (tickerTax(symbol) === "kr-foreign" ? "kr-listed" : "index");
}

/** Representative funds first: editorial familiarity order, not a measured popularity or performance ranking. */
const DISPLAY_ORDER: Record<Group, readonly string[]> = {
  index: ["SPY", "QQQ", "VOO", "QQQM", "SPYM", "DIA", "VT", "069500.KS"],
  leverage: ["TQQQ", "SOXL", "QLD"],
  dividend: ["SCHD", "JEPI", "JEPQ", "VYM", "DGRO"],
  sector: ["SOXX", "VGT", "VNQ"],
  "bond-gold": ["TLT", "GLD", "AGG"],
  "kr-listed": ["360750.KS", "133690.KS", "458730.KS"],
};
export const TOSS_DISPLAY_TICKERS = GROUPS.flatMap(({ id }) => {
  const rank = (symbol: string) => {
    const index = DISPLAY_ORDER[id].indexOf(symbol);
    return index < 0 ? Number.MAX_SAFE_INTEGER : index;
  };
  return TICKERS.filter((ticker) => tickerGroup(ticker.symbol) === id)
    .sort((a, b) => rank(a.symbol) - rank(b.symbol));
});

/** 보조 표기. 국내 상장 해외 ETF는 "국내 상장"으로 구분(tickers.ts의 "한국 주식"은 오해 소지). */
export function tossSubtitle(symbol: string): string {
  return tickerTax(symbol) === "kr-foreign" ? "국내 상장" : tickerSubtitle(symbol);
}

const TAX_DESC: Record<Tax, string> = {
  us: "해외주식 양도세 22%, 250만원까지는 안 내요",
  "kr-foreign": "매매차익에 배당소득세 15.4%가 붙어요",
  "kr-domestic": "국내 주식형 ETF는 매매차익에 세금이 없어요",
};

/** 담은 종목들의 세금 안내. taxable=false면 스위치를 끈다(국내 주식형만 담았을 때). label은 "평가액은 ○○ N원을 뺀 금액" 문구용. */
export function taxInfo(symbols: string[]): { taxable: boolean; desc: string; label: string } {
  const set = new Set(symbols.map(tickerTax));
  const us = set.has("us"), krf = set.has("kr-foreign");
  if (us && krf) return { taxable: true, label: "세금", desc: "해외 ETF 양도세는 합쳐서 250만원까지 안 내고, 국내 상장 해외 ETF는 15.4%가 붙어요" };
  if (us) return { taxable: true, label: "양도세", desc: TAX_DESC.us };
  if (krf) return { taxable: true, label: "배당소득세", desc: TAX_DESC["kr-foreign"] };
  return { taxable: false, label: "세금", desc: TAX_DESC["kr-domestic"] };
}
