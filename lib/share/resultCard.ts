import { TICKERS, tickerTitle } from "../tickers";
import { getFormatter } from "../i18n/format";

// Bump when presentation changes so previously cached messenger cards stay separate.
export const RESULT_CARD_STYLE_VERSION = 2;

/** A bounded, versioned snapshot of the result the sender actually saw. No live-data recalculation. */
export type ResultCard = {
  v: 1; kind: "reach" | "value" | "amount"; tickers: string[];
  freq: "monthly" | "weekly" | "daily"; amount: number; lump: number; reinvest: boolean;
  start: string; end: string; reached: string | null; months: number; years: number;
  value: number; principal: number; graph: number[]; query: string;
};
const symbols = new Set(TICKERS.map(t => t.symbol));
const keys = new Set(["t", "h", "m", "i", "d", "f", "wd", "s", "div", "mode", "y"]);
const date = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
const money = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1e20;
export function validResultCard(v: unknown): v is ResultCard {
  if (!v || typeof v !== "object") return false;
  const c = v as ResultCard;
  return c.v === 1 && ["reach", "value", "amount"].includes(c.kind)
    && Array.isArray(c.tickers) && c.tickers.length >= 1 && c.tickers.length <= 5 && c.tickers.every(t => symbols.has(t))
    && ["monthly", "weekly", "daily"].includes(c.freq) && money(c.amount) && money(c.lump) && money(c.value) && money(c.principal)
    && typeof c.reinvest === "boolean" && date(c.start) && date(c.end) && c.start <= c.end
    && (c.reached === null || date(c.reached) && c.start <= c.reached && c.reached <= c.end)
    && (c.kind !== "reach" || c.reached !== null)
    && Number.isInteger(c.months) && c.months >= 0 && c.months <= 2400
    && Number.isInteger(c.years) && c.years >= 0 && c.years <= 200
    && Array.isArray(c.graph) && c.graph.length >= 2 && c.graph.length <= 40 && c.graph.every(n => Number.isInteger(n) && n >= 0 && n <= 1000)
    && typeof c.query === "string" && c.query.length <= 600 && /^[a-zA-Z0-9.,:=&-]+$/.test(c.query)
    && [...new URLSearchParams(c.query).keys()].every(k => keys.has(k));
}
export function encodeResultCard(card: ResultCard): string {
  if (!validResultCard(card)) throw new Error("Invalid result card");
  // The schema only contains ASCII strings; btoa also works in the mini-app WebView.
  return btoa(JSON.stringify(card)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function decodeResultCard(value: string | null): ResultCard | null {
  if (!value || value.length > 3500 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try { const card: unknown = JSON.parse(atob(value.replace(/-/g, "+").replace(/_/g, "/"))); return validResultCard(card) ? card : null; }
  catch { return null; }
}
export function resultCardCopy(c: ResultCard) {
  const fmt = getFormatter("ko");
  const frequency = c.freq === "daily" ? "거래일마다" : c.freq === "weekly" ? "매주" : "매달";
  const names = c.tickers.map(tickerTitle).join(", ");
  const condition = `${frequency} ${c.tickers.length > 1 ? "합계 " : ""}${fmt.amount(c.amount)}씩 샀다면`;
  const label = c.kind === "reach" ? "처음 10억을 넘기까지" : c.kind === "amount" ? `지난 ${c.years}년, 10억까지 필요했던 금액` : "이 조건으로 샀을 때 마지막 평가액";
  const value = c.kind === "reach" ? `${Math.floor(c.months / 12) ? `${Math.floor(c.months / 12)}년 ` : ""}${c.months % 12}개월`
    : c.kind === "amount" ? c.amount === 0 ? "목돈만으로 도달" : `${frequency} ${fmt.amount(c.amount)}` : fmt.money(c.value);
  const dates = `${c.start.replaceAll("-", ".")} ~ ${c.end.replaceAll("-", ".")}`;
  return { names, condition, label, value, dates,
    title: `${names}: ${label} ${value}`,
    description: `${c.kind === "amount" ? `${label} ${value}` : condition}${c.lump ? `, 처음 목돈 ${fmt.amount(c.lump)}` : ""}. ${dates} 과거 자료로 계산한 결과예요.`,
    principal: fmt.money(c.principal), final: fmt.money(c.value), lump: fmt.amount(c.lump) };
}
export function resultShareUrl(origin: string, card: ResultCard) {
  return `${origin}/miniapp/share?d=${encodeResultCard(card)}&v=${RESULT_CARD_STYLE_VERSION}`;
}
