import { type ResultCard, encodeResultCard } from "@/lib/share/resultCard";
import { type Calc, type Plan, shareQueryOf } from "./plan";
import { fmt, freqLabel, freqWord, holdingsTitle, ymdKo, durKo } from "./fmt";

/** Short blocks keep the result readable in a narrow chat bubble. */
export function resultShareText(plan: Plan, calc: Calc): string {
  const card = makeResultCard(plan, calc);
  const headline = card.kind === "reach"
    ? `10억을 처음 넘기까지\n${durKo(Math.floor(card.months / 12), card.months % 12)}`
    : card.kind === "amount"
      ? card.amount === 0 ? "처음 목돈만으로 10억을 넘었어요" : `지난 ${card.years}년, 10억까지 필요했던 금액\n${freqWord(plan.freq)} ${fmt.amount(card.amount)}`
      : `이 조건으로 샀다면\n마지막 평가액 ${fmt.money(card.value)}`;
  const schedule = plan.freq === "daily" ? "거래일마다" : freqLabel(plan);
  const conditions = [holdingsTitle(plan)];
  if (card.amount > 0) conditions.push(`${schedule} ${plan.holdings.length > 1 ? "합계 " : ""}${fmt.amount(card.amount)}씩`);
  if (card.lump > 0) conditions.push(`처음 목돈 ${fmt.amount(card.lump)}`);
  if (!plan.reinvest) conditions.push("배당 재투자 안 함");
  const dates = `${ymdKo(card.start)} 시작\n${ymdKo(card.reached ?? card.end)} ${card.kind === "reach" ? "첫 도달" : "기준"}`;
  return `${headline}\n\n${conditions.join("\n")}\n${dates}\n\n과거 자료로 계산한 결과예요.\n같은 조건으로 계산해보기`;
}

export function makeResultCard(plan: Plan, calc: Calc): ResultCard {
  const r = calc.result;
  if (!r.series.length) throw new Error("Empty result");
  const max = Math.max(...r.series.map(p => p.value), 1);
  const length = Math.min(32, Math.max(2, r.series.length));
  const graph = Array.from({ length }, (_, i) => Math.round(r.series[Math.round(i * (r.series.length - 1) / (length - 1))].value / max * 1000));
  const kind = !calc.tracking && plan.mode === "amount" ? "amount" : !calc.tracking && calc.reach ? "reach" : "value";
  const card: ResultCard = {
    v: 1, kind, tickers: plan.holdings.map(h => h.ticker), freq: plan.freq,
    amount: calc.monthlyWon, lump: plan.lump * 10_000, reinvest: plan.reinvest,
    start: r.series[0].date, end: r.series.at(-1)!.date, reached: kind === "reach" ? calc.reach!.date : null,
    months: r.months, years: calc.yearsUsed, value: r.value, principal: r.principal, graph, query: shareQueryOf(plan),
  };
  encodeResultCard(card); // Fail before handing a malformed snapshot to the native share sheet.
  return card;
}
