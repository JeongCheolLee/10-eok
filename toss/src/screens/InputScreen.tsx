import { useEffect, useState } from "react";
import { Button, ListRow, SegmentedControl, Switch, Top } from "@toss/tds-mobile";
import { tickerTitle, tickerSubtitle } from "@/lib/tickers";
import { NavBar, Stepper, TickerSheet, Avatar, HoldingRow } from "../components/ui";
import { analytics } from "../lib/platform";
import { manLabel, freqWord } from "../lib/fmt";
import { AMOUNT_CHIPS, AMOUNT_MIN, AMOUNT_STEP, MAX_HOLDINGS, withHoldings, totalAmount, type Plan, type Freq, type Weekday, type Holding } from "../lib/plan";

const TODAY = new Date().toISOString().slice(0, 10);

export function InputScreen({ plan, setPlan, onSubmit, adNeeded = false, hasClock, goClock, onMenu, onClose }: {
  plan: Plan; setPlan: (p: Plan) => void; onSubmit: () => void; adNeeded?: boolean; hasClock: boolean; goClock: () => void; onMenu: () => void; onClose: () => void;
}) {
  // 종목 시트: 바꿀 행 번호, -1 = 새로 추가, null = 닫힘
  const [sheet, setSheet] = useState<number | null>(null);
  useEffect(() => { analytics.screen("home"); }, []);
  const set = (patch: Partial<Plan>) => setPlan({ ...plan, ...patch });
  const hs = plan.holdings;
  const multi = hs.length > 1;
  const midChip = (f: Freq) => { const chips = AMOUNT_CHIPS[f]; return chips[Math.floor(chips.length / 2)]; };
  const setHs = (next: Holding[], patch: Partial<Plan> = {}) => setPlan(withHoldings({ ...plan, ...patch }, next));
  const setAmount = (i: number, v: number) => setHs(hs.map((h, j) => (j === i ? { ...h, amount: v } : h)));
  const setFreq = (f: Freq) => {
    // 주기를 바꾸면 금액 단위가 달라지므로 프리셋 중간값으로 맞춘다
    setHs(hs.map((h) => ({ ...h, amount: midChip(f) })), { freq: f });
  };
  const pick = (t: string) => {
    if (sheet === -1) {
      // 금액 모드는 종목 1개일 때만 — 종목을 더하면 기간 모드로
      setHs([...hs, { ticker: t, amount: midChip(plan.freq) }], { mode: "time" });
      analytics.click("add_holding", { ticker: t, count: hs.length + 1 });
    } else if (sheet != null) {
      setHs(hs.map((h, j) => (j === sheet ? { ...h, ticker: t } : h)));
      analytics.click("pick_ticker", { ticker: t });
    }
    setSheet(null);
  };
  const remove = (i: number) => { setHs(hs.filter((_, j) => j !== i)); analytics.click("remove_holding", { count: hs.length - 1 }); };
  const canSubmit = !plan.tracking || /^\d{4}-\d{2}-\d{2}$/.test(plan.startDate);
  return (
    <div className="screen">
      <NavBar onMenu={onMenu} onClose={onClose} />
      <Top
        upperGap={16}
        lowerGap={4}
        title={<Top.TitleParagraph size={28}>{plan.tracking ? <>내 돈은 지금,<br />10억까지 얼마나 왔을까요?</> : <>10억까지,<br />얼마나 걸릴까요?</>}</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>{plan.tracking ? "실제로 모으기 시작한 날과 금액을 넣으면, 지금 평가액과 10억까지 진행률을 매일 다시 계산해요." : "매달·매주·매일 같은 금액으로 ETF를 샀다면 어땠을지, 실제 과거 가격과 그날 환율로 계산해요."}</Top.SubtitleParagraph>}
      />
      {hasClock && (
        <button type="button" className="clock-link" onClick={goClock}>
          <span>내 10억 시계가 오늘 숫자를 준비했어요</span><span className="brand-text">보기</span>
        </button>
      )}
      {!plan.tracking && (
        <div className="seg-wrap">
          <SegmentedControl size="large" value={plan.mode} onChange={(v) => set({ mode: v === "amount" && !multi ? "amount" : "time" })} aria-label="계산 모드">
            <SegmentedControl.Item value="time">걸리는 기간</SegmentedControl.Item>
            <SegmentedControl.Item value="amount" disabled={multi}>넣을 돈</SegmentedControl.Item>
          </SegmentedControl>
          {multi && <p className="seg-note">넣을 돈 계산은 종목이 하나일 때 할 수 있어요</p>}
        </div>
      )}

      {multi ? (
        <>
          <div className="holdings-head">
            <span className="field-label">{hs.length}개 종목에 나눠 사요</span>
            <span className="holdings-total">{freqWord(plan.freq)} {manLabel(totalAmount(plan))}</span>
          </div>
          {hs.map((h, i) => (
            <HoldingRow key={h.ticker} symbol={h.ticker} value={h.amount} unit="만원" min={AMOUNT_MIN[plan.freq]} max={100_000} step={AMOUNT_STEP[plan.freq]} onChange={(v) => setAmount(i, v)} onPick={() => setSheet(i)} onRemove={() => remove(i)} />
          ))}
        </>
      ) : (
        <ul className="tds-list">
          <ListRow
            left={<Avatar symbol={plan.ticker} size={40} />}
            contents={<ListRow.Texts type="2RowTypeA" top={`${tickerTitle(plan.ticker)} · ${tickerSubtitle(plan.ticker)}`} bottom="종목" />}
            withArrow
            onClick={() => setSheet(0)}
            aria-haspopup="dialog"
          />
        </ul>
      )}
      {hs.length < MAX_HOLDINGS && (
        <button type="button" className="add-row" onClick={() => setSheet(-1)} aria-haspopup="dialog"><span className="plus" aria-hidden="true">+</span>종목 추가하기</button>
      )}

      <div className="seg-wrap">
        <SegmentedControl size="small" value={plan.freq} onChange={(v) => setFreq(v as Freq)} aria-label="사는 주기">
          <SegmentedControl.Item value="monthly">매달</SegmentedControl.Item>
          <SegmentedControl.Item value="weekly">매주</SegmentedControl.Item>
          <SegmentedControl.Item value="daily">매일</SegmentedControl.Item>
        </SegmentedControl>
      </div>

      {multi ? null : plan.mode === "time" || plan.tracking ? (
        <Stepper id="amount" label={`${freqWord(plan.freq)} 넣을 돈`} value={plan.amount} unit="만원" min={AMOUNT_MIN[plan.freq]} max={100_000} step={AMOUNT_STEP[plan.freq]} chips={AMOUNT_CHIPS[plan.freq]} chipLabel={manLabel} onChange={(v) => setAmount(0, v)} accent />
      ) : (
        <Stepper id="years" label="몇 년 안에 모을까요?" value={plan.years} unit="년" min={1} max={40} step={1} chips={[5, 10, 15, 20]} chipLabel={(y) => `${y}년`} onChange={(v) => set({ years: v })} accent />
      )}
      <div className="hr" />
      <Stepper id="lump" label="처음에 넣을 목돈" value={plan.lump} unit="만원" min={0} max={1_000_000} step={100} chips={[0, 1000, 5000, 10000]} chipLabel={(v) => (v === 0 ? "없어요" : manLabel(v))} onChange={(v) => set({ lump: v })} />
      {plan.freq !== "daily" && <div className="hr" />}
      {plan.freq === "monthly" && (
        <div className="row">
          <label htmlFor="buyday" className="field">
            <span className="field-label">매달 사는 날</span>
            <select id="buyday" className="select" value={plan.buyDay} onChange={(e) => set({ buyDay: Number(e.target.value) })}>
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>매달 {d}일</option>)}
              <option value={29}>매달 말일</option>
            </select>
          </label>
        </div>
      )}
      {plan.freq === "weekly" && (
        <div className="row">
          <label htmlFor="weekday" className="field">
            <span className="field-label">매주 사는 요일</span>
            <select id="weekday" className="select" value={plan.weekday} onChange={(e) => set({ weekday: Number(e.target.value) as Weekday })}>
              {([1, 2, 3, 4, 5] as Weekday[]).map((w) => <option key={w} value={w}>{["", "월", "화", "수", "목", "금"][w]}요일</option>)}
            </select>
          </label>
        </div>
      )}

      <ul className="tds-list" style={{ marginTop: 8 }}>
        <ListRow
          contents={<ListRow.Texts type="2RowTypeA" top="이미 모으고 있어요" bottom="시작한 날을 넣으면 내 돈 기준으로 계산해요" />}
          right={<Switch checked={plan.tracking} onChange={(_, c) => set({ tracking: c, mode: "time" })} aria-label="이미 모으고 있어요" />}
        />
      </ul>
      {plan.tracking && (
        <div className="row">
          <label htmlFor="startdate" className="field">
            <span className="field-label brand">언제부터 샀나요?</span>
            <input id="startdate" type="date" className="select" value={plan.startDate} max={TODAY} min="1990-01-01" onChange={(e) => set({ startDate: e.target.value })} />
          </label>
        </div>
      )}
      <p className="disc cta-space">과거 데이터로 계산한 참고용 결과예요. 투자 권유가 아니고, 미래 수익을 보장하지 않아요.</p>
      <div className="spacer" />
      <div className="cta-bar">
        <Button display="full" size="xlarge" disabled={!canSubmit} onClick={onSubmit}>{plan.tracking ? "내 돈 계산하기" : plan.mode === "time" ? "10억까지 계산하기" : "필요한 금액 계산하기"}{adNeeded && <span className="ad-chip">AD</span>}</Button>
      </div>
      {sheet != null && <TickerSheet current={sheet >= 0 ? hs[sheet]?.ticker ?? "" : ""} taken={hs.map((h) => h.ticker)} onPick={pick} onClose={() => setSheet(null)} />}
    </div>
  );
}
