import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ListRow, SegmentedControl, Switch } from "@toss/tds-mobile";
import { tickerTitle } from "@/lib/tickers";
import { tossSubtitle } from "../lib/groups";
import { NavBar, Stepper, TickerSheet, Avatar, HoldingRow, ChevronDown, AdSlot } from "../components/ui";
import { holdingsForFrequency, startDateError, type FrequencyAmounts } from "../lib/inputConditions";
import { analytics } from "../lib/platform";
import { manLabel, freqWord } from "../lib/fmt";
import { AMOUNT_CHIPS, AMOUNT_MIN, AMOUNT_STEP, MAX_HOLDINGS, withHoldings, totalAmount, type Plan, type Freq, type Weekday, type Holding } from "../lib/plan";

const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

export function InputScreen({ plan, setPlan, onSubmit, adRequired, accessNote, busy, hasClock, goClock, goLegal, onMenu, onClose }: {
  plan: Plan; setPlan: (p: Plan) => void; onSubmit: () => void; adRequired: boolean; accessNote: string; busy: boolean; hasClock: boolean; goClock: () => void; onMenu: () => void; onClose: () => void;
  goLegal: (kind: "terms" | "privacy") => void;
}) {
  // 종목 시트: 바꿀 행 번호, -1 = 새로 추가, null = 닫힘
  const [extrasOpen, setExtrasOpen] = useState(plan.tracking);
  const [hasLump, setHasLump] = useState(plan.lump > 0);
  const rememberedLump = useRef(plan.lump);
  const amountsByFrequency = useRef<FrequencyAmounts>({});
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});
  const reportValidity = useCallback((id: string, valid: boolean) => {
    setInvalidFields((fields) => {
      if (!!fields[id] === !valid) return fields;
      const next = { ...fields };
      if (valid) delete next[id]; else next[id] = true;
      return next;
    });
  }, []);
  const today = localToday();
  const [sheet, setSheet] = useState<number | null>(null);
  useEffect(() => { analytics.screen("home"); }, []);
  const set = (patch: Partial<Plan>) => setPlan({ ...plan, ...patch });
  const chooseLump = (enabled: boolean) => {
    if (!enabled) rememberedLump.current = plan.lump;
    setHasLump(enabled);
    set({ lump: enabled ? rememberedLump.current : 0 });
  };
  const hs = plan.holdings;
  const hasSelection = hs.length > 0;
  const multi = hs.length > 1;
  const midChip = (f: Freq) => { const chips = AMOUNT_CHIPS[f]; return chips[Math.floor(chips.length / 2)]; };
  const setHs = (next: Holding[], patch: Partial<Plan> = {}) => setPlan(withHoldings({ ...plan, ...patch }, next));
  const setAmount = (i: number, v: number) => hasSelection ? setHs(hs.map((h, j) => (j === i ? { ...h, amount: v } : h))) : set({ amount: v });
  const setFreq = (f: Freq) => {
    const draftHoldings = hasSelection ? hs : [{ ticker: "", amount: plan.amount }];
    amountsByFrequency.current[plan.freq] = Object.fromEntries(draftHoldings.map((h) => [h.ticker, h.amount]));
    const next = holdingsForFrequency(draftHoldings, f, amountsByFrequency.current);
    if (hasSelection) setHs(next, { freq: f });
    else set({ freq: f, amount: next[0].amount });
  };
  const pick = (t: string) => {
    if (!hasSelection) {
      setHs([{ ticker: t, amount: plan.amount }]);
      analytics.click("pick_ticker", { ticker: t });
    } else if (sheet === -1) {
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
  const dateError = plan.tracking ? startDateError(plan.startDate, today) : null;
  const canSubmit = hasSelection && Object.keys(invalidFields).length === 0 && !dateError && (!hasLump || plan.lump > 0);
  const total = totalAmount(plan);
  const cta = plan.tracking ? "이 조건으로 계산하기" : plan.mode === "time" ? "10억까지 계산하기" : "필요한 금액 계산하기";
  const buyingTitle = plan.freq === "monthly" ? "월급날마다 ETF를 모았다면" : plan.freq === "weekly" ? "매주 ETF를 모았다면" : "거래일마다 ETF를 모았다면";
  return (
    <div className="screen input-screen">
      <NavBar onMenu={onMenu} onClose={onClose} />
      <header className="input-hero">
        <p className="input-eyebrow">{plan.tracking ? "정한 날부터 ETF를 모았다면" : plan.mode === "amount" ? "기간을 정해 돌아보면" : buyingTitle}</p>
        <h1>{plan.tracking ? <>얼마나<br />모였을까요?</> : <><span className="target-line"><strong>10억</strong><span>까지,</span></span><br />{plan.mode === "amount" ? "얼마씩 필요했을까요?" : "얼마나 걸렸을까요?"}</>}</h1>
      </header>
      {hasClock && (
        <button type="button" className="clock-link" onClick={goClock}>
          <span>저장한 계산이 있어요</span><span className="brand-text">보기</span>
        </button>
      )}

      {/* 상단 계산 모드 탭은 임시로 숨긴다. 금액 계산 로직과 저장·공유 조건은 유지한다.
      {!plan.tracking && (
        <div className="seg-wrap">
          <SegmentedControl size="large" value={plan.mode} onChange={(v) => set({ mode: v === "amount" && !multi ? "amount" : "time" })} aria-label="계산 모드">
            <SegmentedControl.Item value="time">얼마나 걸렸을까</SegmentedControl.Item>
            <SegmentedControl.Item value="amount" disabled={multi}>얼마씩 모았을까</SegmentedControl.Item>
          </SegmentedControl>
          {multi && <p className="seg-note">얼마씩 모았을지는 ETF가 하나일 때 계산할 수 있어요</p>}
        </div>
      )}
      */}
      {!plan.tracking && plan.mode === "amount" && (
        <div className="list-head">
          <button type="button" className="text-btn" onClick={() => set({ mode: "time" })}>기간 계산으로 바꾸기</button>
        </div>
      )}

      <div className="section-label">{!hasSelection ? "어떤 ETF가 궁금하세요?" : multi ? `${hs.length}개 ETF에 나눠 사요` : "계산할 ETF"}</div>
      {!hasSelection ? (
        <button type="button" className="etf-select-empty" onClick={() => setSheet(0)} aria-haspopup="dialog"><span aria-hidden="true">＋</span> ETF 선택하기</button>
      ) : multi ? (
        hs.map((h, i) => (
          <HoldingRow onValidityChange={reportValidity} key={h.ticker} symbol={h.ticker} value={h.amount} unit="만원" min={AMOUNT_MIN[plan.freq]} max={100_000} step={AMOUNT_STEP[plan.freq]} share={total > 0 ? h.amount / total : 0} onChange={(v) => setAmount(i, v)} onPick={() => setSheet(i)} onRemove={() => remove(i)} />
        ))
      ) : (
        <ul className="tds-list">
          <ListRow
            left={<Avatar symbol={plan.ticker} size={40} />}
            contents={<ListRow.Texts type="2RowTypeA" top={tickerTitle(plan.ticker)} bottom={tossSubtitle(plan.ticker)} />}
            withArrow
            onClick={() => setSheet(0)}
            aria-haspopup="dialog"
            aria-label={`ETF ${tickerTitle(plan.ticker)} 바꾸기`}
          />
        </ul>
      )}
      {hasSelection && hs.length < MAX_HOLDINGS && (
        <>
          <button type="button" className="add-row" onClick={() => setSheet(-1)} aria-haspopup="dialog"><span className="plus" aria-hidden="true">+</span>ETF 추가하기</button>

        </>
      )}

      <section className="input-primary" aria-label="사는 주기와 금액">
      <div className="section-label">{plan.mode === "amount" && !plan.tracking ? "사는 주기와 기간" : "모으는 주기와 금액"}</div>
      <div className="seg-wrap tight">
        <SegmentedControl size="small" value={plan.freq} onChange={(v) => setFreq(v as Freq)} aria-label="사는 주기">
          <SegmentedControl.Item value="monthly">매달</SegmentedControl.Item>
          <SegmentedControl.Item value="weekly">매주</SegmentedControl.Item>
          <SegmentedControl.Item value="daily">매일</SegmentedControl.Item>
        </SegmentedControl>
      </div>
      {multi ? (
        <div className="row total-row"><span className="field-label">{freqWord(plan.freq)} 합계</span><span className="holdings-total">{manLabel(total)}</span></div>
      ) : plan.mode === "time" || plan.tracking ? (
        <Stepper onValidityChange={reportValidity} id="amount" label={`${freqWord(plan.freq)} 넣을 돈`} value={plan.amount} unit="만원" min={AMOUNT_MIN[plan.freq]} max={100_000} step={AMOUNT_STEP[plan.freq]} stepLabel={manLabel(AMOUNT_STEP[plan.freq])} chips={AMOUNT_CHIPS[plan.freq]} chipLabel={manLabel} onChange={(v) => setAmount(0, v)} accent />
      ) : (
        <Stepper onValidityChange={reportValidity} id="years" label="몇 년을 돌아볼까요?" value={plan.years} unit="년" min={1} max={40} step={1} stepLabel="1년" chips={[5, 10, 15, 20]} chipLabel={(y) => `${y}년`} onChange={(v) => set({ years: v })} accent />
      )}
      </section>
      <fieldset className="lump-choice">
        <legend>시작할 때 넣을 목돈이 있나요?</legend>
        <div className="lump-choices">
          <label><input type="radio" name="has-lump" checked={!hasLump} onChange={() => chooseLump(false)} /><span>아니요</span></label>
          <label><input type="radio" name="has-lump" checked={hasLump} onChange={() => chooseLump(true)} aria-controls="lump-amount" /><span>네</span></label>
        </div>
        {hasLump && <div id="lump-amount">
          <p className="lump-hint">과거 계산의 시작일에 이 금액을 한 번에 넣었다고 봐요.</p>
          <Stepper onValidityChange={reportValidity} id="lump" label="처음 넣을 금액" value={plan.lump} unit="만원" min={0} max={1_000_000} step={100} stepLabel="100만원" chips={[1000, 3000, 5000, 10000]} chipLabel={manLabel} onChange={(v) => { rememberedLump.current = v; set({ lump: v }); }} />
          {plan.lump === 0 && <p className="lump-hint">금액을 입력하거나 ‘아니요’를 골라 주세요.</p>}
        </div>}
      </fieldset>
      {plan.freq === "monthly" && (
        <div className="row">
          <label htmlFor="buyday" className="field schedule-field">
            <span className="field-label">매달 사는 날</span>
            <span className="select-wrap">
              <select id="buyday" className="select" value={plan.buyDay} onChange={(e) => set({ buyDay: Number(e.target.value) })}>
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}일</option>)}
                <option value={29}>말일</option>
              </select>
              <ChevronDown />
            </span>
          </label>
        </div>
      )}
      {plan.freq === "weekly" && (
        <div className="row">
          <label htmlFor="weekday" className="field schedule-field">
            <span className="field-label">매주 사는 요일</span>
            <span className="select-wrap">
              <select id="weekday" className="select" value={plan.weekday} onChange={(e) => set({ weekday: Number(e.target.value) as Weekday })}>
                {([1, 2, 3, 4, 5] as Weekday[]).map((w) => <option key={w} value={w}>{["", "월", "화", "수", "목", "금"][w]}요일</option>)}
              </select>
              <ChevronDown />
            </span>
          </label>
        </div>
      )}

      {/* 시작일 직접 지정 진입은 임시로 숨긴다. 기존 저장·공유 조건은 날짜를 확인하고 수정할 수 있게 유지한다. */}
      {plan.tracking && <details className="input-options" open={extrasOpen} onToggle={(event) => setExtrasOpen(event.currentTarget.open)}>
        <summary><span>계산 시작일</span><span className="option-summary">{plan.tracking ? "직접 선택" : plan.mode === "amount" ? "정한 기간 기준" : "자동으로 찾기"}</span></summary>
      <ul className="tds-list">
        <ListRow
          contents={<ListRow.Texts type="2RowTypeA" top="시작한 날을 정할게요" bottom="그날부터 샀을 때의 평가액을 봐요" />}
          right={<Switch checked={plan.tracking} onChange={(_, c) => set({ tracking: c, mode: "time" })} aria-label="시작한 날을 정할게요" />}
        />
      </ul>
      {plan.tracking && (
        <div className="row">
          <label htmlFor="startdate" className="field">
            <span className="field-label brand">계산을 시작할 날짜</span>
            <span className="select-wrap">
              <input id="startdate" type="date" className="select" aria-invalid={!!dateError && !!plan.startDate} aria-describedby={dateError ? "startdate-error" : undefined} value={plan.startDate} max={today} min="1990-01-01" onChange={(e) => set({ startDate: e.target.value })} />
              <ChevronDown />
            </span>
          </label>
        </div>
      )}
      {plan.tracking && dateError && <p id="startdate-error" className="input-error" role="status">{dateError}</p>}

      </details>}
      {plan.tracking && <p className="input-basis">입력한 날부터 반복해서 샀다고 계산해요. 실제 계좌 금액과 다를 수 있어요.</p>}
      <div className="input-footer">
        <AdSlot />
        <p className="disc">과거 자료로 계산한 결과예요.<br />특정 종목을 추천하거나 미래 수익을 보장하지 않아요.</p>
        <nav className="legal-links" aria-label="법적 안내">
          <a href="#terms" onClick={(event) => { event.preventDefault(); goLegal("terms"); }}>이용약관</a>
          <a href="#privacy" onClick={(event) => { event.preventDefault(); goLegal("privacy"); }}>개인정보처리방침</a>
        </nav>
      </div>
      <div className="spacer" />
      <div className="cta-bar">
        {accessNote && <p className="calculation-access-note" role="status">{accessNote}</p>}
        <Button display="full" size="xlarge" style={{ borderRadius: 16 }} disabled={!canSubmit || busy} onClick={onSubmit}>{busy ? "계산 중…" : adRequired ? "광고 보고 계산하기" : cta}</Button>
      </div>
      {sheet != null && <TickerSheet current={sheet >= 0 ? hs[sheet]?.ticker ?? "" : ""} taken={hs.map((h) => h.ticker)} onPick={pick} onClose={() => setSheet(null)} />}
    </div>
  );
}
