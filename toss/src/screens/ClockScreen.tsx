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

type Other = { symbol: string; years: number; monthsRem: number; reached: boolean; value: number; cagr: number; end: string };

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
      const rows = await loadRows(symbol);
      const r = calcPlan({ [symbol]: rows }, singlePlan(p, symbol, man)).result;
      // value는 그 종목 마지막 종가 기준 — 기준일을 같이 보여 위쪽 'N월 N일 종가 기준'과 어긋나지 않게
      return { symbol, years: r.years, monthsRem: r.monthsRem, reached: r.reached, value: r.value, cagr: r.cagr, end: rows[rows.length - 1]?.date ?? "" };
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
          <div className="state-desc">계산 결과에서 '시계에 저장하기'를 누르면 여기서 새 가격으로 다시 볼 수 있어요.</div>
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
            <div className="clock-lead">{stats.tracking ? `${ymKo(stats.startDate)}부터 입력한 대로 샀다면` : `${ymKo(stats.startDate)}부터 이 조건으로 샀다면`}</div>
            <div className="clock-num">{fmt.money(stats.value)}</div>
            <div className="clock-sub">{stats.tracking ? (stats.reached ? "10억을 넘었어요" : `10억까지 ${pct}%`) : stats.reached ? (stats.progress >= 1 ? `${durKo(stats.years, stats.monthsRem)} 만에 처음 10억을 넘었어요` : `${durKo(stats.years, stats.monthsRem)} 만에 처음 10억을 넘었다가 내려왔어요`) : "이 기간에는 10억을 넘지 않았어요"}</div>
          </div>
        </div>
        <div className="clock-grid">
          <div className="cg"><span className="cg-k">평가액 변화</span><span className={"cg-v " + (down ? "down" : "up")}>{signedWon(stats.delta)}</span></div>
          <div className="cg"><span className="cg-k">변화율</span><span className={"cg-v " + (down ? "down" : "up")}>{signedPct(stats.deltaPct)}</span></div>
          <div className="cg"><span className="cg-k">넣은 돈</span><span className="cg-v">{fmt.money(stats.principal)}</span></div>
        </div>
        <div className="clock-note">
          평가액 변화는 직전 거래일({mdKo(stats.yesterday)})보다 늘거나 준 금액이고, 그사이 새로 넣은 돈도 포함해요.<br />
          {stats.tracking
            ? "입력한 규칙대로 샀다고 보고 계산해서 실제 체결가와는 다를 수 있어요."
            : stats.reached ? `10억을 넘은 경우 중 가장 최근에 시작한 ${ymKo(stats.startDate)}부터 계산했어요.` : "데이터가 있는 첫 달부터 계산했어요."}<br />
          새 가격이 들어오면 다시 계산해요. 환율은 그날 값이 없으면 직전 값을 써요.
        </div>
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
            right={<span className="right"><span className="row-title">{o.reached ? durKo(o.years, o.monthsRem) : `다 모아도 ${fmt.money(o.value)}`}</span><span className="row-desc">{o.reached && o.end ? `${mdKo(o.end)} ${fmt.money(o.value)} · ` : ""}연평균 {fmt.pct(o.cagr)}</span></span>}
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
