import { useEffect, useMemo, useState } from "react";
import { Button } from "@toss/tds-mobile";
import { tickerTitle } from "@/lib/tickers";
import { NavBar, ChevronRight } from "../components/ui";
import { loadRowsBy } from "../lib/data";
import { analytics, shareResult } from "../lib/platform";
import { calcPlan, commonEnd, shareQueryOf, type Calc, type RowsBy } from "../lib/plan";
import type { SavedClock } from "../lib/clock";
import { fmt, manLabel, ymdKo, freqLabel, freqWord } from "../lib/fmt";

const disclaimer = <p className="disc">과거 데이터로 계산한 참고용 결과예요. 특정 종목을 추천하지 않고, 미래 수익을 보장하지 않아요.</p>;

export function ClockScreen({ saved, goHome, goResult, goCompare, onEdit, onMenu, onClose, showToast }: {
  saved: SavedClock | null; goHome: () => void; goResult: () => void; goCompare: () => void; onEdit: () => void; onMenu: () => void; onClose: () => void; showToast?: (m: string) => void;
}) {
  const plan = saved?.plan ?? null;
  const [rowsBy, setRowsBy] = useState<RowsBy | null>(null);
  const [err, setErr] = useState(false);
  const [retry, setRetry] = useState(0);
  const tickersKey = plan ? plan.holdings.map((h) => h.ticker).join(",") : "";
  useEffect(() => { analytics.screen("clock", { saved: !!saved }); }, [saved]);
  useEffect(() => {
    if (!tickersKey) return;
    let on = true;
    setRowsBy(null); setErr(false);
    loadRowsBy(tickersKey.split(",")).then((r) => { if (on) setRowsBy(r); }).catch(() => { if (on) setErr(true); });
    return () => { on = false; };
  }, [tickersKey, retry]);
  const calc: Calc | "error" | null = useMemo(() => {
    if (!rowsBy || !plan) return null;
    try { return calcPlan(rowsBy, plan); } catch (e) { console.error(e); return "error"; }
  }, [rowsBy, plan]);
  const heading = <div className="top-row"><span className="top-k">저장한 계산</span></div>;

  if (!plan) {
    return (
      <div className="screen">
        <NavBar onMenu={onMenu} onClose={onClose} />
        {heading}
        <div className="state">
          <div className="state-title">아직 저장한 계산이 없어요</div>
          <div className="state-desc">계산 결과에서 '계산 저장하기'를 누르면 여기서 새 가격으로 다시 볼 수 있어요.</div>
          <Button size="large" onClick={goHome}>10억까지 계산하기</Button>
        </div>
        {disclaimer}
      </div>
    );
  }
  if (err || calc === "error") {
    return (
      <div className="screen">
        <NavBar onMenu={onMenu} onClose={onClose} />
        {heading}
        <div className="state">
          <div className="state-title">데이터를 불러오지 못했어요</div>
          <div className="state-desc">잠시 후 다시 시도해 주세요</div>
          <Button size="large" onClick={() => setRetry((n) => n + 1)}>다시 시도하기</Button>
        </div>
        {disclaimer}
      </div>
    );
  }
  if (!calc || !rowsBy) {
    return (
      <div className="screen">
        <NavBar onMenu={onMenu} onClose={onClose} />
        {heading}
        <div className="state"><div className="spinner" aria-hidden="true" /><div className="state-desc">저장한 조건으로 계산 중…</div></div>
        {disclaimer}
      </div>
    );
  }
  const result = calc.result;
  const start = result.series[0]?.date ?? "";
  const end = commonEnd(rowsBy, plan);
  const names = plan.holdings.map((h, i) => {
    const amountWon = calc.reqMonthly === null ? h.amount * 10_000 : calc.portfolio?.holdings[i]?.amountWon ?? calc.monthlyWon;
    return `${tickerTitle(h.ticker)} ${fmt.amount(amountWon)}`;
  }).join(" · ");

  return (
    <div className="screen">
      <NavBar onMenu={onMenu} onClose={onClose} />
      {heading}
      <div className="card brand-card">
        <div className="clock-lead">최근 종가로 계산한 평가액</div>
        <div className="clock-num">{fmt.money(result.value)}</div>
        <div className="clock-sub">{ymdKo(end)} 종가 기준</div>
        <div className="stats">
          <div className="stat"><span className="stat-k">넣은 돈</span><span className="stat-v">{fmt.money(result.principal)}</span></div>
        </div>
        <div className="clock-note">새 가격이 들어오면 저장한 조건으로 다시 계산해요.</div>
      </div>

      <div className="card">
        <div className="card-title">저장한 조건</div>
        <div className="card-desc">{freqWord(plan.freq)} {names}</div>
        <div className="card-desc">{freqLabel(plan)} · 처음에 {plan.lump > 0 ? manLabel(plan.lump) : "0원"}</div>
        <div className="card-desc">{start ? `${ymdKo(start)}부터 계산했어요.` : "데이터가 있는 기간으로 계산했어요."}</div>
        {calc.reqMonthly !== null && <div className="clock-note">저장한 {plan.years}년 조건으로 필요한 금액을 다시 계산해요.</div>}
        <div className="clock-note">{plan.reinvest ? "받은 배당으로 다시 사요." : "배당은 계산에 넣지 않아요."}</div>
      </div>

      <div className="btn-row">
        <Button color="dark" variant="weak" display="full" size="large" onClick={onEdit}>조건 바꾸기</Button>
        <Button display="full" size="large" onClick={goResult}>결과 보기</Button>
      </div>
      <div className="share-top"><Button color="dark" variant="weak" size="medium" onClick={async () => {
        analytics.click("share", { from: "clock", holdings: plan.holdings.length });
        const text = `${start ? `${ymdKo(start)}부터 ` : ""}${freqWord(plan.freq)} ${names}씩 샀다면 ${ymdKo(end)} 종가 기준 ${fmt.money(result.value)}이에요. 넣은 돈은 ${fmt.money(result.principal)}이에요 — 주식으로 10억 부자되기`;
        const res = await shareResult(text, shareQueryOf(plan));
        if (res === "copied") showToast?.("조건을 복사했어요 · 토스에서는 공유 링크로 열려요");
        if (res === "failed") showToast?.("지금은 공유할 수 없어요");
      }}>이 조건 공유하기</Button></div>
      <div className="list-head">
        <button type="button" className="text-btn" onClick={goCompare}>다른 ETF와 비교하기 <ChevronRight /></button>
      </div>
      {disclaimer}
    </div>
  );
}
