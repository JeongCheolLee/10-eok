import { useEffect, useMemo, useState } from "react";
import { Button, ListRow } from "@toss/tds-mobile";
import { tickerTitle } from "@/lib/tickers";
import { tossSubtitle } from "../lib/groups";
import { NavBar, Ring, Check, Avatar, ChevronRight } from "../components/ui";
import { loadRows, loadRowsBy } from "../lib/data";
import { analytics } from "../lib/platform";
import { clockStats, calcPlan, singlePlan, type ClockStats, type RowsBy } from "../lib/plan";
import type { SavedClock } from "../lib/clock";
import { fmt, manLabel, ymKo, mdKo, durKo, signedWon, signedPct, freqLabel, freqWord, holdingsTitle } from "../lib/fmt";

type Other = { symbol: string; years: number; monthsRem: number; reached: boolean; value: number; cagr: number };

export function ClockScreen({ saved, goHome, goResult, goCompare, onEdit, onMenu, onClose }: {
  saved: SavedClock | null; goHome: () => void; goResult: () => void; goCompare: () => void; onEdit: () => void; onMenu: () => void; onClose: () => void;
}) {
  const plan = saved?.plan ?? null;
  const [rowsBy, setRowsBy] = useState<RowsBy | null>(null);
  const [err, setErr] = useState(false);
  const [retry, setRetry] = useState(0);
  const [others, setOthers] = useState<Other[]>([]);
  const tickersKey = plan ? plan.holdings.map((h) => h.ticker).join(",") : "";
  const multi = !!plan && plan.holdings.length > 1;
  useEffect(() => { analytics.screen("clock", { saved: !!saved }); }, [saved]);
  useEffect(() => {
    if (!plan) return;
    let on = true;
    setRowsBy(null); setErr(false);
    loadRowsBy(plan.holdings.map((h) => h.ticker)).then((r) => { if (on) setRowsBy(r); }).catch(() => { if (on) setErr(true); });
    return () => { on = false; };
  }, [tickersKey, retry]); // eslint-disable-line react-hooks/exhaustive-deps
  const stats: ClockStats | "error" | null = useMemo(() => {
    if (!rowsBy || !plan) return null;
    try { return clockStats(rowsBy, plan); } catch (e) { console.error(e); return "error"; }
  }, [rowsBy, plan]);
  useEffect(() => {
    if (!plan || !stats || stats === "error") return;
    let on = true;
    const mine = plan.holdings.map((h) => h.ticker);
    const picks = ["TQQQ", "SOXX", "SPY", "QQQ"].filter((t) => !mine.includes(t)).slice(0, 3);
    // 같은 조건(분산 매수면 합계 금액)을 한 종목에 넣었을 때
    const p = { ...plan, mode: "time" as const, tracking: false, startDate: "" };
    const man = Math.round(stats.monthlyWon / 10_000);
    Promise.all(picks.map(async (symbol) => {
      const r = calcPlan({ [symbol]: await loadRows(symbol) }, singlePlan(p, symbol, man)).result;
      return { symbol, years: r.years, monthsRem: r.monthsRem, reached: r.reached, value: r.value, cagr: r.cagr };
    })).then((o) => { if (on) setOthers(o); }).catch(() => {});
    return () => { on = false; };
  }, [plan, stats]);

  if (!plan) {
    return (
      <div className="screen">
        <NavBar onMenu={onMenu} onClose={onClose} />
        <div className="state">
          <Ring size={96} stroke={8} progress={0}><span className="ring-pct">10억</span></Ring>
          <div className="state-title">아직 시계가 없어요</div>
          <div className="state-desc">계산 결과에서 '내 10억 시계로 저장하기'를 누르면 매일 아침 여기서 볼 수 있어요.</div>
          <Button size="large" onClick={goHome}>10억까지 계산하기</Button>
        </div>
      </div>
    );
  }
  if (err || stats === "error") {
    return (
      <div className="screen">
        <NavBar onMenu={onMenu} onClose={onClose} />
        <div className="state">
          <div className="state-title">데이터를 불러오지 못했어요</div>
          <div className="state-desc">잠시 후 다시 시도해 주세요</div>
          <Button size="large" onClick={() => setRetry((n) => n + 1)}>다시 시도하기</Button>
        </div>
      </div>
    );
  }
  if (!stats) {
    return (
      <div className="screen">
        <NavBar onMenu={onMenu} onClose={onClose} />
        <div className="state"><div className="spinner" aria-hidden="true" /><div className="state-desc">오늘 숫자로 계산 중…</div></div>
      </div>
    );
  }
  const down = stats.delta < 0;
  const dayShift = stats.daysAheadToday != null && stats.daysAheadYesterday != null ? stats.daysAheadToday - stats.daysAheadYesterday : null;
  const names = multi ? plan.holdings.map((h) => `${tickerTitle(h.ticker)} ${manLabel(h.amount)}`).join(", ") : holdingsTitle(plan);
  const cond = `${names} · ${plan.lump > 0 ? `목돈 ${manLabel(plan.lump)} · ` : ""}${freqWord(plan.freq)} ${fmt.amount(stats.monthlyWon)} · ${freqLabel(plan)}${stats.tracking ? ` · ${ymKo(stats.startDate)}부터` : ""}`;
  const pct = Math.round(stats.progress * 100);

  return (
    <div className="screen">
      <NavBar onMenu={onMenu} onClose={onClose} />
      <div className="top-row">
        <span className="top-k">내 10억 시계</span>
        <span className="top-d">{mdKo(stats.today)} 종가 기준</span>
      </div>

      <div className="card brand-card clock-card">
        <div className="clock-main">
          <Ring size={112} stroke={9} progress={stats.progress}>
            {stats.progress >= 1 ? <><span className="ring-check"><Check /></span><span className="ring-lbl">목표 달성</span></> : <><span className="ring-pct">{Math.round(stats.progress * 100)}%</span><span className="ring-lbl">10억까지</span></>}
          </Ring>
          <div className="clock-text">
            <div className="clock-lead">{stats.tracking ? `${ymKo(stats.startDate)}부터 모은 내 돈` : `${ymKo(stats.startDate)}부터 모았다면 지금`}</div>
            <div className="clock-num">{fmt.money(stats.value)}</div>
            <div className="clock-sub">{stats.tracking ? `원금 ${fmt.money(stats.principal)} · ${stats.reached ? "10억을 넘었어요" : `10억까지 ${pct}%`}` : stats.reached ? (stats.progress >= 1 ? `${durKo(stats.years, stats.monthsRem)} 만에 10억을 넘었어요` : `${durKo(stats.years, stats.monthsRem)} 만에 10억을 찍고 지금은 내려왔어요`) : `${durKo(stats.years, stats.monthsRem)}째 모으는 중이에요`}</div>
          </div>
        </div>
        <div className="clock-grid">
          <div className="cg"><span className="cg-k">어제보다</span><span className={"cg-v " + (down ? "down" : "up")}>{signedWon(stats.delta)}</span></div>
          <div className="cg"><span className="cg-k">등락률</span><span className={"cg-v " + (down ? "down" : "up")}>{signedPct(stats.deltaPct)}</span></div>
          {stats.tracking
            ? <div className="cg"><span className="cg-k">넣은 돈</span><span className="cg-v">{fmt.money(stats.principal)}</span></div>
            : <div className="cg"><span className="cg-k">도달 예상 <span className="badge">추정</span></span><span className="cg-v">{dayShift == null ? "—" : `${Math.abs(Math.round(dayShift))}일 ${dayShift >= 0 ? "앞당겨짐" : "늦어짐"}`}</span></div>}
        </div>
        <div className="clock-note">{stats.tracking ? "매일 아침 7시 30분, 전날 종가와 환율로 다시 계산해요. 넣은 돈은 입력한 규칙대로 샀다고 보고, 실제 체결가와는 다를 수 있어요." : `매일 아침 7시 30분, 전날 종가와 환율로 다시 계산해요. 도달 일수는 연평균 ${fmt.pct(stats.cagr)}로 환산한 추정치예요.`}</div>
      </div>

      <div className="btn-row">
        <Button color="dark" variant="weak" display="full" size="large" onClick={onEdit}>조건 바꾸기</Button>
        <Button display="full" size="large" onClick={goResult}>자세히 보기</Button>
      </div>

      <div className="list-head">
        <span>{multi ? "같은 금액을 한 종목에 넣었다면" : "같은 조건, 다른 종목이었다면"}</span>
        <button type="button" className="text-btn" onClick={goCompare}>전체 보기 <ChevronRight /></button>
      </div>
      <ul className="tds-list">
        {others.length === 0 && <ListRow contents={<ListRow.Texts type="1RowTypeA" top="계산 중…" />} />}
        {others.map((o) => (
          <ListRow
            key={o.symbol}
            left={<Avatar symbol={o.symbol} />}
            contents={<ListRow.Texts type="2RowTypeA" top={tickerTitle(o.symbol)} bottom={tossSubtitle(o.symbol)} />}
            right={<span className="right"><span className="row-title">{o.reached ? durKo(o.years, o.monthsRem) : `다 모아도 ${fmt.money(o.value)}`}</span><span className="row-desc">{o.reached && o.value < 1e9 ? `지금 ${fmt.money(o.value)} · ` : ""}연평균 {fmt.pct(o.cagr)}</span></span>}
          />
        ))}
      </ul>

      <div className="saved-row">
        <span className="field"><span className="row-desc">저장한 조건</span><span className="row-title">{cond}</span></span>
        <button type="button" className="text-btn" onClick={onEdit}>바꾸기</button>
      </div>
      <p className="disc">과거 데이터로 계산한 참고용 결과예요. 특정 종목을 추천하지 않고, 미래 수익을 보장하지 않아요.</p>
    </div>
  );
}
