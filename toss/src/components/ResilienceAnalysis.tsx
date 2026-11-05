import { useEffect, useMemo, useRef, useState } from "react";
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
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    active.current = true;
    void analysisAccess.has(accessKey).then(earned => {
      if (active.current) { setUnlocked(earned); setReady(true); }
    });
    return () => { active.current = false; cleanup.current?.(); };
  }, [accessKey]);
  useEffect(() => { if (open) heading.current?.focus({ preventScroll: true }); }, [open]);

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
    if (unlocked || !ANALYSIS_REWARDED_ADS_ENABLED || !data.worst) { setOpen(true); return; }
    pending.current = true; setBusy(true);
    if (!inToss) { setPreview(true); return; }
    cleanup.current = requestAnalysisAd(complete);
  };
  const needsAd = ANALYSIS_REWARDED_ADS_ENABLED && !unlocked && !!data.worst;
  const signed = (value: number) => `${value >= 0 ? "+" : "−"}${fmt.money(Math.abs(value))}`;
  return <section className="resilience card" aria-label="투자 과정 분석">
    <p className="resilience-eyebrow">투자 과정 돌아보기</p>
    <h2 ref={heading} tabIndex={-1}>{calc.reach ? <>10억까지 가는 길,<br />버틸 수 있었을까요?</> : <>꾸준히 모으는 동안,<br />어떤 일이 있었을까요?</>}</h2>
    <p className="resilience-intro">내 투자 조건으로 힘들었던 시기와 그 이후를 살펴봐요.</p>
    <p className="resilience-period">{ymdKo(data.start)} ~ {ymdKo(data.end)}{calc.reach ? " · 첫 도달까지" : " · 계산 기간"}</p>
    {!open ? <>
      <ul className="resilience-features"><li>가장 큰 원금 대비 손실</li><li>원금 아래에 머문 가장 긴 기간</li><li>계속 적립했을 때의 이후 변화</li></ul>
      <Button display="full" size="large" variant="weak" style={{ borderRadius: 14 }} disabled={!ready || busy} onClick={show}>
        {!ready ? "이용 기록 확인 중…" : busy ? "광고 준비 중…" : needsAd ? "광고 보고 상세 분석 보기" : "상세 분석 보기"}
      </Button>
      <p className="resilience-help">{needsAd ? "광고를 끝까지 보면 이 조건의 분석을 볼 수 있어요. 기본 계산은 계속 무료예요." : unlocked ? "같은 조건의 분석을 다시 볼 수 있어요." : "이 분석은 광고 없이 확인할 수 있어요."}</p>
    </> : <div className="resilience-details">
      <article>
        <h3>가장 큰 원금 대비 손실</h3>
        {data.worst ? <>
          <p className="resilience-number loss">−{fmt.money(data.loss)}</p>
          <p>{ymdKo(data.worst.date)} · 당시 넣은 돈 대비 −{(data.lossRate * 100).toFixed(1)}%</p>
          <dl><div><dt>당시 넣은 돈</dt><dd>{fmt.money(data.worst.principal)}</dd></div><div><dt>당시 평가액</dt><dd>{fmt.money(data.worst.value)}</dd></div></dl>
        </> : <p>이 기간의 종가 기준으로는 평가액이 넣은 돈 아래로 내려가지 않았어요.</p>}
        <p className="resilience-help">누적 납입금과 평가액의 차이가 가장 컸던 날이에요. 고점 대비 하락률과는 달라요.</p>
      </article>
      <article>
        <h3>원금 아래에 머문 가장 긴 기간</h3>
        {data.longest ? <>
          <p className="resilience-number">{data.longest.days === 0 ? "마지막 자료일에 시작" : `${data.longest.days.toLocaleString("ko-KR")}일`}</p>
          <p>{ymdKo(data.longest.start)} ~ {ymdKo(data.longest.end)}</p>
          <p>{data.longest.recovered ? "마지막 날 종가 기준으로 누적 납입금 이상이 됐어요." : "분석 종료일까지 누적 납입금을 회복하지 못했어요."}</p>
        </> : <p>원금 아래에 머문 구간이 없었어요.</p>}
        <p className="resilience-help">주말·공휴일을 포함한 경과 일수예요. 추가 납입을 반영한 원금과 비교해요.</p>
      </article>
      <article>
        <h3>그때도 계속 적립했다면</h3>
        {!data.worst ? <p>원금 대비 손실 구간이 없어 이후 비교는 표시하지 않아요.</p> : !data.checkpoints.length ? <p>가장 큰 손실이 마지막 자료일에 발생해, 그 이후의 변화는 아직 알 수 없어요.</p> : <>
          <p>{ymdKo(data.worst.date)} 이후에도 같은 조건을 유지했다고 계산했어요.</p>
          {data.checkpoints.map(({ label, point, added, pnlChange }) => <div className="resilience-checkpoint" key={point.date}>
            <h4>{label} <span>{ymdKo(point.date)}</span></h4>
            <dl><div><dt>평가액</dt><dd>{fmt.money(point.value)}</dd></div><div><dt>누적 납입금</dt><dd>{fmt.money(point.principal)}</dd></div><div><dt>그 이후 추가 납입</dt><dd>{fmt.money(added)}</dd></div><div><dt>그때보다 손익 변화</dt><dd>{signed(pnlChange)}</dd></div></dl>
          </div>)}
          <p className="resilience-help">손익 변화는 평가액 증가분에서 추가 납입금을 뺀 금액이에요. 1년·3년 뒤는 해당 날짜 이후 첫 거래일을 사용해요. 이후 자료가 있는 시점만 표시해요.</p>
        </>}
      </article>
      <p className="resilience-help">실제 거래 자료의 일별 종가로 계산했어요. 장중 손실은 반영하지 않으며, 과거의 회복이 앞으로의 회복을 보장하지 않아요.</p>
      <button className="text-btn" type="button" onClick={() => setOpen(false)}>상세 분석 접기</button>
    </div>}
    {notice && <p className="resilience-notice" role="status">{notice}</p>}
    {preview && <AnalysisAdPreview onComplete={() => complete("rewarded")} onClose={() => complete("dismissed")} />}
  </section>;
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
    <p className="ad-badge">AD · 미리보기</p><h2>상세 분석 열기</h2>
    <p>브라우저 테스트 화면이에요. 토스 앱에서는 실제 리워드 광고가 표시돼요.</p>
    <p role="status">{left ? `${left}초 남았어요` : "분석을 열 수 있어요"}</p>
    <Button display="full" style={{ borderRadius: 14 }} disabled={left > 0} onClick={onComplete}>분석 열기</Button>
    <button type="button" className="text-btn" onClick={onClose}>닫기</button>
  </dialog>;
}
