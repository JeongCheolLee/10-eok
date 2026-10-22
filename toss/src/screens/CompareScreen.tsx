import { useEffect, useState } from "react";
import { ListRow, Top } from "@toss/tds-mobile";
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
function isDefaultScenario(p: Plan): boolean {
  return p.mode === "time" && p.freq === "monthly" && p.amount === DEFAULT_PLAN.amount && p.buyDay === 1 && p.lump === 0 && p.reinvest && !p.tax;
}

export function CompareScreen({ plan, back, onMenu, onClose }: { plan: Plan; back: () => void; onMenu: () => void; onClose: () => void }) {
  const [out, setOut] = useState<RowOut[]>([]);
  const [done, setDone] = useState(false);
  const [asOf, setAsOf] = useState("");
  // 분산 매수면 1회 적립액 합계를 한 종목에 넣었다고 본다
  const multi = plan.holdings.length > 1;
  const monthlyMan = plan.mode === "time" || plan.tracking ? totalAmount(plan) : 100;
  useEffect(() => { analytics.screen("compare"); }, []);
  useEffect(() => {
    let on = true;
    setOut([]); setDone(false);
    const syms = TOSS_TICKERS;
    const p: Plan = singlePlan({ ...plan, mode: "time", tracking: false, startDate: "" }, plan.ticker, monthlyMan);
    (async () => {
      if (isDefaultScenario(p)) {
        for (const file of SUMMARY_FILES) {
          try {
            const res = await fetch(`${DATA_BASE}/${file}`);
            if (!res.ok) continue;
            const s = (await res.json()) as Summary;
            if (!on) return;
            if (Array.isArray(s.rows) && s.rows.length > 0 && "reachDate" in s.rows[0]) { setOut(s.rows); const ends = new Set(s.rows.map((r) => r.dataEnd).filter(Boolean)); setAsOf(ends.size === 1 ? [...ends][0]! : ""); setDone(true); return; }
          } catch { /* 이 요약 파일이 없으면 다음 후보 → 직접 계산 */ }
        }
      }
      const acc: RowOut[] = [];
      const ends = new Set<string>();
      for (const symbol of syms) {
        try {
          const rows = await loadRows(symbol);
          const r = calcPlan({ [symbol]: rows }, singlePlan(p, symbol, monthlyMan)).result;
          acc.push({ symbol, reached: r.reached, years: r.years, monthsRem: r.monthsRem, months: r.months, value: r.value, cagr: r.cagr, dataEnd: rows[rows.length - 1].date });
          ends.add(rows[rows.length - 1].date);
          if (on) { setOut([...acc]); setAsOf(ends.size === 1 ? [...ends][0]! : ""); }
        } catch { /* 번들 없는 종목은 건너뜀 */ }
      }
      acc.sort((a, b) => (a.reached !== b.reached ? (a.reached ? -1 : 1) : a.reached ? a.months - b.months : b.value - a.value));
      if (on) { setOut(acc); setDone(true); }
    })();
    return () => { on = false; };
  }, [plan.ticker, multi, plan.lump, plan.buyDay, plan.freq, plan.weekday, plan.reinvest, plan.tax, monthlyMan]);

  return (
    <div className="screen">
      <NavBar back={back} onMenu={onMenu} onClose={onClose} />
      <Top
        upperGap={16}
        lowerGap={4}
        title={<Top.TitleParagraph size={22}>{multi ? <>{freqWord(plan.freq)} {manLabel(monthlyMan)}을 한 종목에 넣었다면,<br />10억까지 누가 빨랐을까요</> : <>{freqWord(plan.freq)} {monthlyMan}만원이면,<br />10억까지 누가 빨랐을까요</>}</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>{done ? out.length : TOSS_TICKERS.length}개 ETF를 {freqAdverb(plan)} 샀다면? {asOf ? `${mdKo(asOf)} 종가` : "종목별 최근 종가"}에서 거꾸로 계산했어요. 배당은 {plan.reinvest ? "다시 샀고" : "빼고"}, 세금·수수료는 계산에 넣지 않았어요.</Top.SubtitleParagraph>}
      />
      <div className="list-cols"><span>종목</span><span>10억까지 · 연평균</span></div>
      <ul className="tds-list">
        {out.map((o) => (
          <ListRow
            key={o.symbol}
            left={<Avatar symbol={o.symbol} />}
            contents={<ListRow.Texts type="2RowTypeA" top={tickerTitle(o.symbol)} bottom={tossSubtitle(o.symbol)} />}
            right={<span className="right"><span className={"row-title" + (o.reached ? "" : " muted")}>{o.reached ? durKo(o.years, o.monthsRem) : `다 모아도 ${fmt.money(o.value)}`}</span><span className="row-desc">{o.reached ? (o.value < 1e9 ? `지금 ${fmt.money(o.value)} · ` : "") : `${durKo(o.years, o.monthsRem)} · `}연평균 {fmt.pct(o.cagr)}</span></span>}
          />
        ))}
        {!done && <ListRow contents={<ListRow.Texts type="1RowTypeA" top={`${out.length}/${TOSS_TICKERS.length} 계산 중…`} />} />}
      </ul>
      <p className="disc">'10억까지'는 처음 10억을 넘기까지 걸린 가장 짧은 기간이에요. 그 뒤 10억 아래로 내려온 종목은 지금 금액을 같이 적었어요. 10억에 못 미친 종목은 데이터가 있는 전체 기간을 모았을 때 금액이에요. {SPLICED} 상장 전 구간은 비슷한 지수로 추정했어요.</p>
      <p className="disc">과거 성과가 미래 수익을 보장하지 않아요. 특정 종목을 추천하지 않고, 투자 판단과 책임은 본인에게 있어요.</p>
    </div>
  );
}
