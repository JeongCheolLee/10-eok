import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "@toss/tds-mobile";
import type { Calc } from "../lib/plan";
import { analyzeResilience } from "../lib/resilience";
import { analysisAccess, ANALYSIS_REWARDED_ADS_ENABLED, analytics, inToss, requestAnalysisAd } from "../lib/platform";
import { fmt, ymdKo } from "../lib/fmt";
import type { AnalysisAdOutcome } from "../lib/analysisReward";

/** The parent keys this component by normalized conditions: old callbacks cannot unlock a new result. */
export function ResilienceAnalysis({ calc, accessKey, onEngage }: { calc: Calc; accessKey: string; onEngage: () => void }) {
  const data = useMemo(() => analyzeResilience(calc.result.series, calc.reach?.date), [calc]);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  const active = useRef(false);
  const pending = useRef(false);
  const cleanup = useRef<(() => void) | null>(null);
  const entry = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    active.current = true;
    void analysisAccess.has(accessKey).then(earned => {
      if (active.current) { setUnlocked(earned); setReady(true); }
    });
    return () => { active.current = false; cleanup.current?.(); };
  }, [accessKey]);
  const closeDetails = () => {
    setOpen(false);
    requestAnimationFrame(() => entry.current?.focus({ preventScroll: true }));
  };

  const complete = (outcome: AnalysisAdOutcome) => {
    if (!active.current || !pending.current) return;
    pending.current = false; setBusy(false); setPreview(false);
    analytics.click("analysis_ad_result", { outcome });
    if (outcome === "dismissed") {
      setNotice("광고를 끝까지 보면 상세 분석을 볼 수 있어요."); return;
    }
    setOpen(true); setUnlocked(true);
    if (outcome === "rewarded") {
      setNotice("이 조건의 분석을 열었어요. 같은 기기에서 다시 볼 수 있어요.");
      void analysisAccess.grant(accessKey).then(saved => {
        if (active.current && !saved) setNotice("분석은 열었지만 이용 기록을 저장하지 못했어요. 앱을 닫으면 다시 광고가 표시될 수 있어요.");
      });
    } else setNotice("광고를 불러오지 못해 이번 분석은 무료로 열었어요.");
  };
  const show = () => {
    if (!ready || pending.current) return;
    onEngage(); setNotice("");
    analytics.click("analysis_open", { unlocked, reached: !!calc.reach });
    if (unlocked || !ANALYSIS_REWARDED_ADS_ENABLED) { setOpen(true); return; }
    pending.current = true; setBusy(true);
    if (!inToss) { setPreview(true); return; }
    cleanup.current = requestAnalysisAd(complete);
  };
  const needsAd = ANALYSIS_REWARDED_ADS_ENABLED && !unlocked;
  const signed = (value: number) => `${value >= 0 ? "+" : "−"}${fmt.money(Math.abs(value))}`;
  const title = calc.reach ? <>10억까지 가는 길,<br /><span>버틸 수 있었을까요?</span></> : <>꾸준히 모으는 동안,<br /><span>어떤 일이 있었을까요?</span></>;
  return <>
    <section className="resilience card resilience-teaser" aria-label="투자 과정 분석">
    <p className="resilience-eyebrow">투자 과정 돌아보기</p>
    <h2>{title}</h2>
      <dl className="resilience-preview-metrics" aria-label="분석에서 확인할 내용">
        {["가장 큰 손실률", "가장 길었던 손실 기간", "손실 이후의 변화"].map((label, index) => <div key={label}>
          <dt>{label}</dt>
          <dd aria-label={!ready ? "이용 기록 확인 중" : needsAd ? "광고 시청 후 확인" : "상세 분석에서 확인"}>
            {needsAd ? <>
              <span className="resilience-unknown" aria-hidden="true"><strong>??</strong>{index < 2 && <span>{index === 0 ? "%" : "일"}</span>}</span>
              <svg className="resilience-lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>
            </> : <span className="resilience-preview-available" aria-hidden="true">{ready ? "보기" : "…"}</span>}
          </dd>
        </div>)}
      </dl>
      <Button ref={entry} aria-haspopup="dialog" display="full" size="large" style={{ borderRadius: 14, minHeight: 56, ...(!busy && ready ? { "--button-background-color": "#00875b" } : {}) } as CSSProperties} disabled={!ready || busy} onClick={show}>
        {!ready ? "이용 기록 확인 중…" : busy ? "광고 준비 중…" : needsAd ? "광고 보고 분석 보기" : unlocked ? "분석 다시 보기" : "상세 분석 보기"}
      </Button>
      {ready && (needsAd || unlocked) && <p className="resilience-help resilience-unlock-help">{needsAd ? "광고를 끝까지 보면 이 조건의 분석이 열려요." : "같은 조건의 분석을 다시 볼 수 있어요."}</p>}
    {notice && !open && <p className="resilience-notice" role="status">{notice}</p>}
    </section>
    {open && <AnalysisDetailsDialog onClose={closeDetails}>
      <div className="resilience analysis-dialog-content">
      <h2>{title}</h2>
      <p className="resilience-intro">넣은 돈 대비 손실과<br />손실 이후에도 계속 샀을 때의 변화를 살펴봐요.</p>
      <p className="resilience-period">{calc.reach ? "처음 10억을 넘은 날까지의 손실을 살펴봐요." : "계산 기간 전체의 손실을 살펴봐요."}<br />{ymdKo(data.start)} ~ {ymdKo(data.end)}</p>
      {notice && <p className="resilience-notice" role="status">{notice}</p>}
      <div className="resilience-details">
      {!data.worst ? <article>
        <h3>이 기간에는 손실 구간이 없었어요</h3>
        <p>일별 종가로 계산한 평가액이 그날까지 넣은 돈 아래로 내려가지 않았어요.</p>
        <p>손실이 있었던 날이 없어, 손실 이후의 변화는 따로 비교하지 않아요.</p>
      </article> : <>
      <article>
        <h3>손실률이 가장 컸던 날</h3>
        {data.worstRate ? <>
          <p className="resilience-number loss">−{(data.maxLossRate * 100).toFixed(1)}%</p>
          <p>{ymdKo(data.worstRate.date)}<br />손실 −{fmt.money(data.worstRate.principal - data.worstRate.value)}</p>
          <dl><div><dt>당시까지 넣은 돈</dt><dd>{fmt.money(data.worstRate.principal)}</dd></div><div><dt>당시 평가액</dt><dd>{fmt.money(data.worstRate.value)}</dd></div></dl>
          <p className="resilience-help">그날까지 넣은 돈에서 줄어든 비율이 가장 컸던 날이에요. 고점 대비 하락률과는 달라요.{data.worstRate.date === data.worst?.date && " 손실 금액이 가장 컸던 날과 같아요."}</p>
        </> : <p>이 기간의 종가 기준으로는 평가액이 넣은 돈 아래로 내려가지 않았어요.</p>}
      </article>
      <article>
        <h3>손실 금액이 가장 컸던 날</h3>
        {data.worst ? <>
          <p className="resilience-number loss">−{fmt.money(data.loss)}</p>
          <p>{ymdKo(data.worst.date)}<br />당시까지 넣은 돈 대비 −{(data.lossRate * 100).toFixed(1)}%</p>
          <dl><div><dt>당시까지 넣은 돈</dt><dd>{fmt.money(data.worst.principal)}</dd></div><div><dt>당시 평가액</dt><dd>{fmt.money(data.worst.value)}</dd></div></dl>
        </> : <p>이 기간의 종가 기준으로는 평가액이 넣은 돈 아래로 내려가지 않았어요.</p>}
        {data.worst && <p className="resilience-help">그날까지 넣은 돈에서 평가액을 뺀 손실액이 가장 컸던 날이에요.</p>}
      </article>
      <article>
        <h3>손실이 가장 오래 이어진 기간</h3>
        {data.longest ? <>
          <p className="resilience-number">{data.longest.days === 0 ? "분석 마지막 날에 시작" : `${data.longest.days.toLocaleString("ko-KR")}일`}</p>
          <p>{ymdKo(data.longest.start)} ~ {ymdKo(data.longest.end)}</p>
          <p>{data.longest.recovered ? "위 기간의 마지막 날, 평가액이 그날까지 넣은 돈 이상으로 회복됐어요." : "분석 마지막 날까지 평가액이 넣은 돈보다 적었어요."}</p>
        </> : <p>평가액이 넣은 돈 아래로 내려간 구간이 없었어요.</p>}
        {data.longest && <p className="resilience-help">평가액이 그날까지 넣은 돈보다 적었던 연속 구간이에요. 주말과 공휴일을 포함해 계산하며, 손실액이 가장 컸던 날이 이 구간에 속하지 않을 수도 있어요.</p>}
      </article>
      <article>
        <h3>손실 이후에도 계속 적립했다면</h3>
        {!data.worst ? <p>손실이 있었던 날이 없어 이후 비교는 표시하지 않아요.</p> : !data.checkpoints.length ? <p>손실액이 가장 컸던 날이 계산 마지막 날이라 이후를 비교할 자료가 없어요.</p> : <>
          <p>손실 금액이 가장 컸던 {ymdKo(data.worst.date)}부터 같은 금액과 주기로 계속 적립한 결과예요.</p>
          {data.checkpoints.map(({ label, point, added, pnl }) => <div className="resilience-checkpoint" key={point.date}>
            <header className="checkpoint-header">
              <h4>{label.replace(", 마지막 평가일", "")}</h4>
              <p className="checkpoint-date">{ymdKo(point.date)}{label.endsWith(", 마지막 평가일") && <><br />마지막 평가일</>}</p>
            </header>
            <dl className="checkpoint-valuation">
              <div><dt>평가액</dt><dd>{fmt.money(point.value)}</dd></div>
            </dl>
            <dl className="checkpoint-breakdown">
              <div className="checkpoint-profit"><dt>그날까지의 손익</dt><dd className={pnl < 0 ? "loss" : pnl > 0 ? "profit" : undefined}>{signed(pnl)}</dd></div>
              <div><dt>그날까지 넣은 돈</dt><dd>{fmt.money(point.principal)}</dd></div>
              <div className="checkpoint-added"><dt>그중 기준일 이후</dt><dd>{fmt.money(added)}</dd></div>
            </dl>
          </div>)}
          <details className="checkpoint-basis">
            <summary>비교 기준 보기</summary>
            <p>기준일은 손실 금액이 가장 컸던 {ymdKo(data.worst.date)}예요. 각 카드의 ‘그중 기준일 이후’는 이날 이후 추가로 넣은 돈이에요.</p>
            <p>1년 뒤와 3년 뒤를 보고, 5년 뒤부터 5년 간격으로 비교해요. 해당 날짜 또는 그다음 첫 거래일의 자료가 있는 시점과 마지막 평가일을 표시해요.</p>
            {calc.reach && <p>이후 비교에는 처음 10억을 넘은 날 이후의 자료도 포함해요.</p>}
            <p>손익은 평가액에서 그날까지 넣은 돈을 뺀 금액이에요. 추가로 넣은 돈은 수익에 포함하지 않아요.</p>
          </details>
        </>}
      </article>
      </>}
      <p className="resilience-help">실제 거래 자료의 일별 종가로 계산해 장중 가격 변동은 반영하지 않아요. 과거에 회복했더라도 앞으로 같은 결과를 보장하지 않아요.</p>
      <Button display="full" color="dark" variant="weak" style={{ borderRadius: 14 }} onClick={closeDetails}>결과로 돌아가기</Button>
      </div>
      </div>
    </AnalysisDetailsDialog>}
    {preview && <AnalysisAdPreview onComplete={() => complete("rewarded")} onClose={() => complete("dismissed")} />}
  </>;
}

/** Keep long analysis out of the result flow; the native modal traps focus and makes the result inert. */
function AnalysisDetailsDialog({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return createPortal(<dialog ref={dialog} className="analysis-details-dialog" aria-label="상세 분석" onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className="analysis-dialog-header">
      <span>상세 분석</span>
      <button className="icon-btn" type="button" aria-label="상세 분석 닫기" onClick={onClose}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </header>
    <div className="analysis-dialog-scroll">{children}</div>
  </dialog>, document.body);
}

/** Browser-only demo. Native rewards are granted exclusively by the SDK event. */
function AnalysisAdPreview({ onComplete, onClose }: { onComplete: () => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [left, setLeft] = useState(3);
  useEffect(() => { dialog.current?.showModal(); }, []);
  useEffect(() => {
    if (!left) return;
    const timer = setTimeout(() => setLeft(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);
  return <dialog className="analysis-ad-preview" ref={dialog} aria-label="광고 미리보기" onCancel={event => { event.preventDefault(); onClose(); }}>
    <p className="ad-badge">광고 미리보기</p><h2>상세 분석 열기</h2>
    <p>브라우저 테스트 화면이에요. 토스 앱에서는 실제 리워드 광고가 표시돼요.</p>
    <p role="status">{left ? `${left}초 남았어요` : "분석을 열 수 있어요"}</p>
    <Button display="full" style={{ borderRadius: 14 }} disabled={left > 0} onClick={onComplete}>분석 열기</Button>
    <button type="button" className="text-btn" onClick={onClose}>닫기</button>
  </dialog>;
}
