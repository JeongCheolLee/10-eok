import { useId, useMemo, useState } from "react";
import type { Calc, Plan, RowsBy } from "../lib/plan";
import { compareContributions } from "../lib/contributionComparison";
import { fmt, freqWord, ymdKo } from "../lib/fmt";
import "./ContributionComparison.css";

export function ContributionComparison({ plan, rowsBy, calc }: { plan: Plan; rowsBy: RowsBy; calc: Calc }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(() => String(Number((Math.max(1, calc.monthlyWon / 10_000)).toFixed(4))));
  const amountWon = input.trim() === "" ? NaN : Number(input) * 10_000;
  const valid = Number.isFinite(amountWon) && amountWon >= 10_000 && amountWon <= Number.MAX_SAFE_INTEGER;
  const hasWindow = calc.result.series.length > 0;
  const comparison = useMemo(() => open && valid && hasWindow ? compareContributions(plan, rowsBy, calc, amountWon) : null, [open, valid, hasWindow, plan, rowsBy, calc, amountWon]);
  if (!hasWindow) return null;
  return (
    <section className="contribution-comparison">
      <button type="button" className="contribution-toggle" aria-expanded={open} aria-controls={`${id}-body`} onClick={() => setOpen((v) => !v)}>
        금액 바꿔 비교하기 <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <div id={`${id}-body`} className="contribution-body">
        <p className="contribution-note">금액만 바꿔 비교해요</p>
        <p className="contribution-dates">{ymdKo(calc.result.series[0].date)}부터<br />{ymdKo(calc.result.series[calc.result.series.length - 1].date)}까지 같은 기간이에요</p>
        <label className="contribution-label" htmlFor={`${id}-amount`}>{freqWord(plan.freq)} 넣을 돈을 바꿔 볼까요?</label>
        <div className="contribution-input">
          <input id={`${id}-amount`} type="number" inputMode="decimal" min="1" step="any" value={input} aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined} onChange={(e) => setInput(e.target.value)} />
          <span>만원</span>
        </div>
        {!valid && <p id={`${id}-error`} className="contribution-error" role="status">1만원 이상으로 입력해 주세요</p>}
        {comparison && <table className="contribution-table">
          <caption className="contribution-caption">같은 기간에 샀다면</caption>
          <thead><tr><th scope="col">비교 항목</th><th scope="col">계산한 금액</th><th scope="col">바꾼 금액</th></tr></thead>
          <tbody>
            <tr><th scope="row">{freqWord(plan.freq)} 넣을 돈</th><td>{fmt.amount(comparison.baseline.amountWon)}</td><td>{fmt.amount(comparison.alternate.amountWon)}</td></tr>
            <tr className="contribution-value"><th scope="row">마지막 평가액</th><td>{fmt.money(comparison.baseline.value)}</td><td>{fmt.money(comparison.alternate.value)}</td></tr>
            <tr><th scope="row">넣은 돈</th><td>{fmt.money(comparison.baseline.principal)}</td><td>{fmt.money(comparison.alternate.principal)}</td></tr>
          </tbody>
        </table>}
      </div>}
    </section>
  );
}
