import { useEffect, useState } from "react";
import { Button } from "@toss/tds-mobile";
import { tickerTitle } from "@/lib/tickers";
import { GROUPS, TOSS_DISPLAY_TICKERS, tickerGroup, tossSubtitle } from "../lib/groups";
import { NavBar, Avatar } from "../components/ui";
import { loadComparisonHistory, loadRowsBy } from "../lib/data";
import { analytics } from "../lib/platform";
import { calcPlan, type Plan } from "../lib/plan";
import { compareEtf, comparisonWindow, type ComparisonWindow, type EtfComparison } from "../lib/etfComparison";
import { fmt, freqWord, manLabel, ymdKo } from "../lib/fmt";

const groups = [...GROUPS.filter((g) => g.id !== "leverage"), ...GROUPS.filter((g) => g.id === "leverage")];
type State = { status: "loading" | "error" | "empty" } | { status: "ready"; window: ComparisonWindow; rows: EtfComparison[] };
type SortOrder = "value-asc" | "value-desc" | "type";

export function CompareScreen({ plan, back, onMenu, onClose }: { plan: Plan; back: () => void; onMenu: () => void; onClose: () => void }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [retry, setRetry] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("value-desc");
  const key = JSON.stringify(plan);
  useEffect(() => { analytics.screen("compare"); }, []);
  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    (async () => {
      try {
        const baselineRows = await loadRowsBy(plan.holdings.map((h) => h.ticker));
        const window = comparisonWindow(plan, baselineRows, calcPlan(baselineRows, plan));
        if (!window) { if (active) setState({ status: "empty" }); return; }
        const rows = await Promise.all(TOSS_DISPLAY_TICKERS.map(async ({ symbol }): Promise<EtfComparison> => {
          try { const history = await loadComparisonHistory(symbol); return compareEtf(plan, window, symbol, history.rows, history.estimate); }
          catch { return { symbol, status: "error" }; }
        }));
        if (active) setState({ status: "ready", window, rows });
      } catch { if (active) setState({ status: "error" }); }
    })();
    return () => { active = false; };
  }, [key, retry]); // eslint-disable-line react-hooks/exhaustive-deps

  const available = state.status === "ready" ? state.rows.filter((row): row is Extract<EtfComparison, { status: "available" }> => row.status === "available") : [];
  const sortValues = (rows: typeof available) => [...rows].sort((a, b) => sortOrder === "value-desc" ? b.value - a.value : a.value - b.value);
  const actual = available.filter((row) => !row.estimate);
  const estimated = available.filter((row) => row.estimate);
  const sections = state.status !== "ready" ? [] : [
    ...(sortOrder === "type"
      ? groups.map((group) => ({ ...group, rows: actual.filter((row) => tickerGroup(row.symbol) === group.id) }))
      : [{ id: "values", label: "실제 거래 자료로 계산한 결과", rows: sortValues(actual) }]),
    { id: "estimated", label: "추정 자료를 포함한 결과", rows: sortOrder === "type" ? groups.flatMap((group) => estimated.filter((row) => tickerGroup(row.symbol) === group.id)) : sortValues(estimated) },
    { id: "unavailable", label: "비교할 자료가 부족한 ETF", rows: state.rows.filter((row) => row.status !== "available") },
  ];

  return <div className="screen compare-screen">
    <NavBar back={back} onMenu={onMenu} onClose={onClose} />
    <header className="input-hero">
      <p className="input-eyebrow">ETF 바꿔보기</p>
      <h1>같은 기간,<br />다른 ETF였다면?</h1>
      <p className="input-intro">기간과 금액은 그대로, ETF만 바꿔 봐요.</p>
    </header>
    {state.status === "loading" && <div className="state"><div className="spinner" aria-hidden="true" /><p className="state-desc">같은 조건으로 계산 중…</p></div>}
    {state.status === "error" && <div className="state"><p className="state-title">데이터를 불러오지 못했어요</p><Button onClick={() => setRetry((n) => n + 1)}>다시 시도하기</Button></div>}
    {state.status === "empty" && <div className="state"><p className="state-title">비교할 기간의 자료가 없어요</p><Button onClick={back}>돌아가기</Button></div>}
    {state.status === "ready" && <>
      <section className="comparison-window" aria-label="비교 조건">
        <p>{ymdKo(state.window.start)} ~ {ymdKo(state.window.end)}</p>
        <strong>{freqWord(plan.freq)} {plan.holdings.length > 1 ? "합계 " : ""}{fmt.amount(state.window.amountWon)}씩</strong>
        {plan.lump > 0 && <p>처음에 {manLabel(plan.lump)}으로 시작</p>}
        <p>{plan.holdings.map((h) => tickerTitle(h.ticker)).join(" · ")}의 평가액 <b>{fmt.money(state.window.value)}</b></p>
        {plan.holdings.length > 1 && <p>합계 금액을 ETF 하나에 넣었다고 계산해요.</p>}
      </section>
      <div className="comparison-sort">
        <label htmlFor="comparison-sort">보기 순서</label>
        <select id="comparison-sort" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
          <option value="value-desc">평가액 높은 순</option>
          <option value="value-asc">평가액 낮은 순</option>
          <option value="type">유형별</option>
        </select>
      </div>
      <p className="comparison-caption">{sortOrder === "type" ? "실제 거래 자료로 계산한 ETF를 유형별로 모았어요." : "실제 결과와 추정 포함 결과를 나눠, 각각 평가액순으로 정렬했어요."}</p>
      {sections.map((group) => {
        return group.rows.length > 0 && <section className="comparison-group" key={group.id} aria-label={group.label}>
          <h2>{group.label}</h2>
          {group.id === "estimated" && <p className="comparison-group-note">상장 전 구간을 다른 ETF·지수로 채웠어요. 해당 ETF를 실제로 거래한 결과는 아니에요.</p>}
          {group.id === "leverage" && <p className="comparison-group-note">레버리지 ETF는 손실도 크게 늘어날 수 있어요.</p>}
          <ul>{group.rows.map((row) => <li key={row.symbol} className="comparison-etf">
            <div className="comparison-etf-title"><Avatar symbol={row.symbol} /><div><h3>{tickerTitle(row.symbol)}</h3>{row.status === "available" && row.estimate && <span className="estimate-badge">추정 포함</span>}<p>{tossSubtitle(row.symbol)}</p></div></div>
            {(sortOrder !== "type" || group.id === "unavailable" || group.id === "estimated") && tickerGroup(row.symbol) === "leverage" && <p className="comparison-risk">레버리지 ETF · 손실도 크게 늘어날 수 있어요.</p>}
            {row.status === "available" ? <>
              <dl><div><dt>{row.estimate ? "추정 포함 평가액" : "마지막 평가액"}</dt><dd>{fmt.money(row.value)}</dd></div><div><dt>넣은 돈</dt><dd>{fmt.money(row.principal)}</dd></div></dl>
              {row.estimate && <div className="comparison-estimate-note">
                <p>{ymdKo(row.estimate.from)} ~ {ymdKo(row.estimate.to)} 구간은 {row.estimate.proxy === "^BXM" ? "BXM 커버드콜 지수" : tickerTitle(row.estimate.proxy)}{row.estimate.convertedToKrw ? " 가격과 당시 환율" : " 가격"}로 계산했어요.</p>
                <p>보수·배당·운용 방식의 차이는 반영하지 못해요.</p>
              </div>}
              {row.valuationDate !== state.window.end && <p className="comparison-date">{ymdKo(row.valuationDate)} 종가 기준</p>}
            </> : <p className="comparison-unavailable">{row.status === "error" ? "데이터를 불러오지 못했어요" : `이 기간을 채울 거래 자료나 추정 자료가 부족해요. 보유 자료: ${ymdKo(row.dataStart)} ~ ${ymdKo(row.dataEnd)}`}</p>}
          </li>)}</ul>
        </section>;
      })}
      {state.rows.some((row) => row.status === "error") && <div className="btn-row"><Button color="dark" variant="weak" onClick={() => setRetry((n) => n + 1)}>다시 시도하기</Button></div>}
      <p className="disc">{plan.reinvest ? "받은 배당으로 같은 ETF를 다시 샀다고 계산했어요." : "배당은 계산에 넣지 않았어요."}<br />세금·수수료는 계산에 넣지 않았어요.</p>
    </>}
    <p className="disc">과거 자료로 계산한 결과예요.<br />특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
  </div>;
}
