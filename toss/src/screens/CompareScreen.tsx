import { useEffect, useState } from "react";
import { ListRow, TextButton, Top } from "@toss/tds-mobile";
import { TOSS_TICKERS, tickerInfo, tickerTitle } from "@/lib/tickers";
import { tossSubtitle } from "../lib/groups";
import { NavBar, Avatar } from "../components/ui";
import { loadRows } from "../lib/data";
import { analytics, DATA_BASE } from "../lib/platform";
import { calcPlan, singlePlan, totalAmount, DEFAULT_PLAN, type Plan } from "../lib/plan";
import { fmt, mdKo, durKo, freqAdverb, freqWord, manLabel } from "../lib/fmt";

type RowOut = { symbol: string; reached: boolean; years: number; monthsRem: number; months: number; value: number; cagr: number; dataEnd?: string };
type Summary = { dataEnd: string | null; rows: RowOut[] };

/** 기본 시나리오(매달 100만원·1일·배당 재투자·세금 제외)면 매일 생성되는 요약 파일 한 번만 받는다.
 *  미니앱 전체 종목 요약(toss.json)을 먼저, 없으면 웹 16종 요약(ko.json), 그것도 없으면 직접 계산. */
/** 상장 전 구간을 유사 지수로 이어 붙인 종목(레지스트리 splice 필드) — 하단 안내용 */
const SPLICED = TOSS_TICKERS.filter((t) => tickerInfo(t).splice).map(tickerTitle).join("·");
// 처음 10억 도달 기준(10/22)으로 만든 toss.json만 쓴다. 행에 reachDate 키가 없으면 옛 기준(오늘도 10억 이상)이라 직접 계산.
const SUMMARY_FILES = ["summary/toss.json"];
/** 도달 종목은 빠른 순, 미달 종목은 평가액 큰 순(generator/summary.ts와 같은 규칙). */
function sortRows(rows: RowOut[]): RowOut[] {
  return [...rows].sort((a, b) => (a.reached !== b.reached ? (a.reached ? -1 : 1) : a.reached ? a.months - b.months : b.value - a.value));
}
/** 한 종목을 직접 계산. 데이터를 못 받으면 throw(loadRows 그대로) — 호출부가 '빠진 종목'으로 모은다. */
async function calcRow(symbol: string, p: Plan, monthlyMan: number): Promise<RowOut> {
  const rows = await loadRows(symbol);
  const r = calcPlan({ [symbol]: rows }, singlePlan(p, symbol, monthlyMan)).result;
  return { symbol, reached: r.reached, years: r.years, monthsRem: r.monthsRem, months: r.months, value: r.value, cagr: r.cagr, dataEnd: rows[rows.length - 1].date };
}
/** 종목별 마지막 종가일의 가장 이른·늦은 날. 다르면 화면이 범위를 보여준다. */
function endRange(rows: RowOut[]): { min: string; max: string } | null {
  const ends = rows.map((r) => r.dataEnd).filter((d): d is string => !!d).sort();
  return ends.length ? { min: ends[0], max: ends[ends.length - 1] } : null;
}
function isDefaultScenario(p: Plan): boolean {
  return p.mode === "time" && p.freq === "monthly" && p.amount === DEFAULT_PLAN.amount && p.buyDay === 1 && p.lump === 0 && p.reinvest && !p.tax;
}

export function CompareScreen({ plan, back, onMenu, onClose }: { plan: Plan; back: () => void; onMenu: () => void; onClose: () => void }) {
  const [out, setOut] = useState<RowOut[]>([]);
  const [done, setDone] = useState(false);
  /** 데이터를 못 받아 빠진 종목 — 조용히 숨기지 않고 목록 아래 알리고 그 종목만 다시 시도한다. */
  const [failed, setFailed] = useState<string[]>([]);
  const [retrying, setRetrying] = useState(false);
  // 분산 매수면 1회 적립액 합계를 한 종목에 넣었다고 본다
  const multi = plan.holdings.length > 1;
  const monthlyMan = plan.mode === "time" || plan.tracking ? totalAmount(plan) : 100;
  const scenario = (): Plan => singlePlan({ ...plan, mode: "time", tracking: false, startDate: "" }, plan.ticker, monthlyMan);
  useEffect(() => { analytics.screen("compare"); }, []);
  useEffect(() => {
    let on = true;
    setOut([]); setDone(false); setFailed([]);
    const p = scenario();
    (async () => {
      let todo = TOSS_TICKERS;
      const acc: RowOut[] = [];
      if (isDefaultScenario(p)) {
        for (const file of SUMMARY_FILES) {
          try {
            const res = await fetch(`${DATA_BASE}/${file}`);
            if (!res.ok) continue;
            const s = (await res.json()) as Summary;
            if (!on) return;
            if (Array.isArray(s.rows) && s.rows.length > 0 && "reachDate" in s.rows[0]) {
              const have = new Set(s.rows.map((r) => r.symbol));
              acc.push(...s.rows.filter((r) => TOSS_TICKERS.includes(r.symbol)));
              todo = TOSS_TICKERS.filter((t) => !have.has(t)); // 요약에 없는 종목은 아래에서 직접 계산
              setOut(sortRows(acc));
              break;
            }
          } catch { /* 이 요약 파일이 없으면 다음 후보 → 직접 계산 */ }
        }
      }
      const miss: string[] = [];
      for (const symbol of todo) {
        try {
          acc.push(await calcRow(symbol, p, monthlyMan));
          if (on) setOut([...acc]);
        } catch { miss.push(symbol); }
      }
      if (on) { setOut(sortRows(acc)); setFailed(miss); setDone(true); }
    })();
    return () => { on = false; };
  }, [plan.ticker, multi, plan.lump, plan.buyDay, plan.freq, plan.weekday, plan.reinvest, plan.tax, monthlyMan]);

  const retry = async () => {
    if (retrying) return;
    setRetrying(true);
    const p = scenario();
    const got: RowOut[] = [];
    const still: string[] = [];
    for (const symbol of failed) {
      try { got.push(await calcRow(symbol, p, monthlyMan)); } catch { still.push(symbol); }
    }
    setOut((prev) => sortRows([...prev.filter((r) => !got.some((g) => g.symbol === r.symbol)), ...got]));
    setFailed(still);
    setRetrying(false);
  };

  const range = endRange(out);
  const oneDay = !range || range.min === range.max;
  const asOfText = !range ? "종목별 마지막 종가에서 거꾸로 계산했어요."
    : oneDay ? `${mdKo(range.min)} 종가에서 거꾸로 계산했어요.`
    : `종목마다 마지막 종가일이 달라요. ${mdKo(range.min)}~${mdKo(range.max)} 종가에서 거꾸로 계산했어요.`;
  // 행의 '지금'은 기준일이 하나일 때만. 종가일이 섞이면 그 종목의 종가일을 적는다.
  const nowLabel = (o: RowOut) => (oneDay || !o.dataEnd ? "지금" : mdKo(o.dataEnd));

  return (
    <div className="screen">
      <NavBar back={back} onMenu={onMenu} onClose={onClose} />
      <Top
        upperGap={16}
        lowerGap={4}
        title={<Top.TitleParagraph size={22}>{multi ? <>{freqWord(plan.freq)} {manLabel(monthlyMan)}을 한 종목에 넣었다면,<br />10억까지 누가 빨랐을까요</> : <>{freqWord(plan.freq)} {monthlyMan}만원이면,<br />10억까지 누가 빨랐을까요</>}</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>{done ? out.length : TOSS_TICKERS.length}개 ETF를 {freqAdverb(plan)} 샀다면? {asOfText} 배당은 {plan.reinvest ? "다시 샀고" : "빼고"}, 세금·수수료는 계산에 넣지 않았어요.</Top.SubtitleParagraph>}
      />
      <div className="list-cols"><span>종목</span><span>10억까지 · 연평균</span></div>
      <ul className="tds-list">
        {out.map((o) => (
          <ListRow
            key={o.symbol}
            left={<Avatar symbol={o.symbol} />}
            contents={<ListRow.Texts type="2RowTypeA" top={tickerTitle(o.symbol)} bottom={tossSubtitle(o.symbol)} />}
            right={<span className="right"><span className={"row-title" + (o.reached ? "" : " muted")}>{o.reached ? durKo(o.years, o.monthsRem) : `다 모아도 ${fmt.money(o.value)}`}</span><span className="row-desc">{o.reached ? (o.value < 1e9 ? `${nowLabel(o)} ${fmt.money(o.value)} · ` : "") : `${durKo(o.years, o.monthsRem)} · `}연평균 {fmt.pct(o.cagr)}</span></span>}
          />
        ))}
        {done && failed.length > 0 && (
          <ListRow
            contents={<ListRow.Texts type="2RowTypeA" top="데이터를 불러오지 못해 빠졌어요" bottom={failed.map(tickerTitle).join("·")} />}
            right={<TextButton size="medium" variant="clear" disabled={retrying} onClick={retry}>다시 시도하기</TextButton>}
          />
        )}
        {!done && <ListRow contents={<ListRow.Texts type="1RowTypeA" top={`${out.length}/${TOSS_TICKERS.length} 계산 중…`} />} />}
      </ul>
      <p className="disc">'10억까지'는 가장 최근에 시작해서 10억을 넘은 경우, 처음 넘기까지 걸린 기간이에요. 그 뒤 10억 아래로 내려온 종목은 마지막 종가일 금액을 같이 적었어요. 10억을 넘지 않은 종목은 데이터가 있는 전체 기간을 모았을 때 금액이에요. {SPLICED} 상장 전 구간은 비슷한 지수로 추정했어요.</p>
      <p className="disc">과거 성과가 미래 수익을 보장하지 않아요. 특정 종목을 추천하지 않고, 투자 판단과 책임은 본인에게 있어요.</p>
    </div>
  );
}
