import { useEffect, useState } from "react";
import { Button } from "@toss/tds-mobile";
import { tickerTitle } from "@/lib/tickers";
import { NavBar, ChevronRight } from "../components/ui";
import { analytics } from "../lib/platform";
import { loadDataInfo } from "../lib/data";
import type { LoadedDataInfo } from "../lib/dataInfo";
import { dataDatesOf, hasNewSavedData } from "../lib/savedData";
import { totalAmount } from "../lib/plan";
import type { SavedClock } from "../lib/clock";
import { manLabel, ymdKo, freqLabel, holdingsTitle } from "../lib/fmt";

export function ClockScreen({ saved, goHome, goResult, onRemove, onMenu, onClose }: {
  saved: SavedClock[]; goHome: () => void; goResult: (item: SavedClock) => void;
  onRemove: (id: string) => Promise<void>; onMenu: () => void; onClose: () => void;
}) {
  const [infos, setInfos] = useState<Record<string, LoadedDataInfo | null>>({});
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setInfos({});
    const tickers = [...new Set(saved.flatMap((item) => item.plan.holdings.map((h) => h.ticker)))];
    for (const ticker of tickers) {
      void loadDataInfo(ticker).then((info) => {
        if (active) setInfos((previous) => ({ ...previous, [ticker]: info }));
      }, () => {
        if (active) setInfos((previous) => ({ ...previous, [ticker]: null }));
      });
    }
    return () => { active = false; };
  }, [saved, retry]);
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  useEffect(() => { analytics.screen("clock", { saved: saved.length > 0, count: saved.length }); }, [saved.length]);
  const remove = async (id: string) => {
    setRemoving(id);
    try { await onRemove(id); } finally { setRemoving(null); }
  };

  return <div className="screen saved-screen">
    <NavBar back={goHome} onMenu={onMenu} onClose={onClose} />
    <header className="saved-heading">
      <div className="saved-heading-row">
        <h1>저장한 계산</h1>
        {saved.length > 0 && <button type="button" className="text-btn" onClick={() => setEditing((value) => !value)} aria-pressed={editing}>{editing ? "완료" : "편집"}</button>}
      </div>
      {saved.length > 0 && <p>{editing ? "삭제할 계산을 골라 주세요." : "저장한 조건을 누르면 최신 자료로 다시 계산해요."}</p>}
    </header>
    {saved.length === 0 ? <div className="state">
      <div className="state-title">아직 저장한 계산이 없어요</div>
      <div className="state-desc">계산 결과에서 ‘계산 저장하기’를 누르면 조건별로 모아볼 수 있어요.</div>
      <Button size="large" onClick={goHome}>10억까지 계산하기</Button>
    </div> : <>
      <ul className="saved-calculations">
        {saved.map((item) => {
          const { plan } = item;
          const names = holdingsTitle(plan);
          const amountMode = plan.mode === "amount" && !plan.tracking;
          const schedule = plan.freq === "daily" ? "거래일마다" : freqLabel(plan);
          const data = plan.holdings.map((h) => infos[h.ticker]);
          const complete = data.every((info) => info != null);
          const failed = data.some((info) => info === null);
          const current = complete ? dataDatesOf(data) : undefined;
          const updated = current && hasNewSavedData(item.dataDates, current);
          const priceDate = current ? Object.values(current).map((info) => info.price).sort()[0] : null;
          const fxDate = current ? Object.values(current).flatMap((info) => info.fx ? [info.fx] : []).sort()[0] : null;
          const Card = editing ? "div" : "button";
          return <li key={item.id} className="saved-calculation">
            <Card type={editing ? undefined : "button"} className={"saved-calculation-open" + (editing ? " editing" : "")} onClick={editing ? undefined : () => goResult(item)}>
              <span className="saved-calculation-title"><strong>{names}</strong>{editing
                ? <button type="button" className="saved-calculation-delete" disabled={removing !== null} aria-label={`${names} 저장한 계산 삭제하기`} onClick={() => void remove(item.id)}>{removing === item.id ? "삭제 중…" : "삭제"}</button>
                : <ChevronRight />}</span>
              <span className="saved-calculation-amount">{amountMode ? `지난 ${plan.years}년 · ${schedule} 필요한 금액` : `${schedule} · ${plan.holdings.length > 1 ? "합계 " : ""}${manLabel(totalAmount(plan))}씩`}</span>
              {plan.holdings.length > 1 && <span className="saved-calculation-detail">{plan.holdings.map((h) => `${tickerTitle(h.ticker)} ${manLabel(h.amount)}`).join(" · ")}</span>}
              <span className="saved-calculation-detail">{plan.lump > 0 ? `처음 목돈 ${manLabel(plan.lump)}` : "목돈 없이"} · {plan.reinvest ? "배당 재투자" : "배당 미반영"}</span>
              {plan.tracking && <span className="saved-calculation-detail">{ymdKo(plan.startDate)}부터 계산</span>}
              {updated && <span className="saved-data-badge">저장 후 새 자료</span>}
              <span className="saved-calculation-detail">{priceDate ? `가격 자료: ${ymdKo(priceDate)}까지` : failed ? "자료 기준일을 확인하지 못했어요" : "자료 기준일 확인 중…"}</span>
              {fxDate && <span className="saved-calculation-detail">환율 자료: {ymdKo(fxDate)}까지</span>}
              <span className="saved-calculation-date">{ymdKo(item.savedAt.slice(0, 10))} 저장</span>
            </Card>
          </li>;
        })}
      </ul>
      {Object.values(infos).some((info) => info === null) && <Button color="dark" variant="weak" onClick={() => setRetry((value) => value + 1)}>자료 다시 확인하기</Button>}
      <p className="saved-footnote">저장한 조건은 이 기기에 보관해요.<br />결과는 확인할 때 불러온 자료로 다시 계산해요.<br />‘저장 후 새 자료’는 저장 당시보다 가격·환율 기준일이 새로워졌다는 뜻이에요.</p>
    </>}
    <p className="disc">과거 자료로 계산한 결과예요.<br />특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
    {saved.length > 0 && <div className="cta-bar saved-cta">
      <Button display="full" size="xlarge" style={{ borderRadius: 16 }} onClick={goHome}>새로 계산하기</Button>
    </div>}
  </div>;
}
