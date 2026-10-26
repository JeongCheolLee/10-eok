import { useCallback, useEffect, useRef, useState } from "react";
import { browserCalculationAccess } from "./lib/calculationAccess";
import { loadRowsBy } from "./lib/data";
import { calcPlan } from "./lib/plan";
import { InputScreen } from "./screens/InputScreen";
import { ResultScreen, type ResultEntrance } from "./screens/ResultScreen";
import { ClockScreen } from "./screens/ClockScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { LegalScreen } from "./screens/LegalScreen";
import { AdGate, Menu, Toast } from "./components/ui";
import { DEFAULT_PLAN, cleanHoldings, withHoldings, type Plan } from "./lib/plan";
import { loadSavedClocks, removeSavedClock, type SavedClock } from "./lib/clock";
import { analytics, closeApp, createRewarded, entryPath, entryQuery, inToss, REWARDED_ADS_ENABLED, type Rewarded } from "./lib/platform";

type Screen = "home" | "result" | "clock" | "compare" | "terms" | "privacy";
const SCREENS: Screen[] = ["home", "result", "clock", "compare", "terms", "privacy"];
function readHash(): Screen | null {
  const h = location.hash.replace(/^#/, "").split("?")[0] as Screen;
  return SCREENS.includes(h) ? h : null;
}
function readSavedId(): string | null {
  return new URLSearchParams(location.hash.split("?")[1] ?? "").get("saved");
}
function screenForSelection(screen: Screen, hasSelection: boolean): Screen {
  return !hasSelection && (screen === "result" || screen === "compare") ? "home" : screen;
}
/** 공유 딥링크(intoss://10-eok?t=SPY&m=100&d=1&i=0, 분산 매수는 h=QQQ:50,SCHD:30) → 플랜.
 *  h가 있으면 우선, 없으면 t·m. 유효하지 않은 티커는 버리고 남는 종목이 없으면 null. */
function planFromQuery(q: URLSearchParams): Plan | null {
  const num = (k: string, d: number) => { const n = parseInt(q.get(k) ?? "", 10); return Number.isFinite(n) ? n : d; };
  const h = q.get("h");
  const holdings = h
    ? cleanHoldings(h.split(",").map((part) => { const [ticker, amount] = part.split(":"); return { ticker, amount: parseInt(amount ?? "", 10) }; }))
    : cleanHoldings([{ ticker: q.get("t") ?? "", amount: Math.max(1, num("m", 100)) }]);
  if (holdings.length === 0) return null;
  const f = q.get("f");
  const freq: Plan["freq"] = f === "w" ? "weekly" : f === "d" ? "daily" : "monthly";
  const weekday = Math.min(5, Math.max(1, num("wd", 1))) as Plan["weekday"];
  const s = q.get("s") ?? "";
  const tracking = /^\d{4}-\d{2}-\d{2}$/.test(s);
  // 금액 모드는 종목 1개일 때만 연다
  const mode: Plan["mode"] = q.get("mode") === "amt" && !tracking && holdings.length === 1 ? "amount" : "time";
  return withHoldings({ ...DEFAULT_PLAN, mode, years: Math.max(1, num("y", 10)), lump: Math.max(0, num("i", 0)), buyDay: Math.min(29, Math.max(1, num("d", 1))), freq, weekday, tracking, startDate: tracking ? s : "", reinvest: q.get("div") !== "0", tax: false /* 세금 반영 UI 제거(10/22): tax=1 링크도 무시 */ }, holdings);
}

export function App() {
  const [access] = useState(browserCalculationAccess);
  const [, updateAccess] = useState(0);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [saved, setSaved] = useState<SavedClock[]>([]);
  const [plan, setPlan] = useState<Plan>({ ...DEFAULT_PLAN, ticker: "", holdings: [] });
  const hasSelection = plan.holdings.length > 0;
  const [screen, setScreen] = useState<Screen>(() => readHash() ?? "home");
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [gate, setGate] = useState<{ run: () => void; cancel: () => void; desc: string; cta: string } | null>(null);
  const rewarded = useRef<Rewarded | null>(null);
  const isLegal = screen === "terms" || screen === "privacy";
  useEffect(() => {
    if (isLegal) return;
    rewarded.current = createRewarded();
    rewarded.current?.load(); // 광고는 미리 로드하고 버튼에서 노출(체크리스트 10)
    return () => { rewarded.current?.dispose(); rewarded.current = null; };
  }, [isLegal]);

  // 첫 진입: 공유 딥링크 플랜이 있으면 결과로, 주요 기능 경로(intoss://10-eok/clock·compare·result)가 있으면 그 화면으로,
  // 저장한 조건이 있으면 목록으로. history를 쌓지 않게 replaceState.
  useEffect(() => {
    let on = true;
    (async () => {
      const s = await loadSavedClocks();
      if (!on) return;
      setSaved(s);
      const fromLink = planFromQuery(entryQuery());
      const path = entryPath();
      const target: Screen | null = SCREENS.includes(path as Screen) && path !== "home" ? (path as Screen) : null;
      const requestedSavedId = readSavedId();
      const selected = s.find((item) => item.id === requestedSavedId);
      const restored = fromLink ?? selected?.plan ?? s[0]?.plan;
      if (restored) {
        setPlan(restored);
        access.complete(restored, true);
      }
      const requested = fromLink ? "result" : target ?? readHash() ?? (s.length ? "clock" : "home");
      const next = !fromLink && requested === "result" && requestedSavedId && !selected ? "clock" : screenForSelection(requested, !!restored?.holdings.length);
      history.replaceState(null, "", `#${next}${!fromLink && next === "result" && selected ? `?saved=${encodeURIComponent(selected.id)}` : ""}`);
      setScreen(next);
      setReady(true);
    })();
    return () => { on = false; };
  }, []);
  // 화면 전환 애니메이션: 앞으로 가기(go)만 짧게 밀어 넣고, 뒤로 가기(백버튼·스와이프·history.back)는 즉시.
  const forward = useRef(false);
  const pendingEntrance = useRef<ResultEntrance>("quick");
  const [nav, setNav] = useState<{ n: number; fwd: boolean; entrance: ResultEntrance }>({ n: 0, fwd: false, entrance: "quick" });
  useEffect(() => {
    const on = () => {
      const requested = readHash() ?? "home";
      const id = readSavedId();
      const selected = saved.find((item) => item.id === id);
      if (requested === "result" && selected) { access.complete(selected.plan, true); setPlan(selected.plan); }
      const next = requested === "result" && id && !selected ? "clock"
        : requested === "result" && !selected && !access.known(plan) ? "home"
        : screenForSelection(requested, hasSelection || !!selected);
      if (next !== requested) history.replaceState(null, "", `#${next}`);
      const fwd = forward.current;
      const entrance = next === "result" && fwd ? pendingEntrance.current : "quick";
      setNav((v) => ({ n: v.n + 1, fwd, entrance })); forward.current = false; setScreen(next);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, [hasSelection, saved, access, plan]);

  const go = useCallback((s: Screen, savedId?: string, entrance: ResultEntrance = "quick") => {
    // 공유 조건은 첫 진입에만 쓴다. 이후 저장 상세를 새로고침할 때 덮어쓰지 않게 한다.
    if (location.search) history.replaceState(null, "", `${location.pathname}${location.hash}`);
    const hash = `#${s}${savedId ? `?saved=${encodeURIComponent(savedId)}` : ""}`;
    if (location.hash === hash) { setNav((v) => ({ n: v.n + 1, fwd: true, entrance })); setScreen(s); }
    else { pendingEntrance.current = entrance; forward.current = true; location.hash = hash; }
    window.scrollTo(0, 0);
  }, []);
  const back = useCallback(() => { if (history.length > 1) history.back(); else go("home"); }, [go]);
  const showToast = useCallback((m: string) => { setToast(m); window.setTimeout(() => setToast(""), 2200); }, []);
  const refreshSaved = useCallback(async () => setSaved(await loadSavedClocks()), []);
  const needsRewardedAd = (p: Plan) => REWARDED_ADS_ENABLED && access.needsAd(p);
  const calculationLabel = (p: Plan) => needsRewardedAd(p) ? "광고 보고 계산하기" : "이 조건으로 계산하기";
  const calculate = async (next: Plan) => {
    if (!next.holdings.length || submitting.current) return;
    submitting.current = true; setBusy(true);
    const release = () => { submitting.current = false; setBusy(false); };
    // Validate data before showing an ad or consuming a free calculation.
    try {
      const rows = await loadRowsBy(next.holdings.map((h) => h.ticker));
      if (!calcPlan(rows, next).result.series.length) {
        showToast("이 날짜로 계산할 자료가 없어요. 시작일을 바꿔 주세요"); release(); return;
      }
    } catch { showToast("데이터를 불러오지 못했어요. 다시 시도해 주세요"); release(); return; }
    const needsAd = needsRewardedAd(next);
    let settled = false;
    const finish = (reward: boolean, exempt = false) => {
      if (settled) return;
      settled = true;
      if (reward) { access.reward(); analytics.click("ad_rewarded", { purpose: "calculate" }); }
      access.complete(next, exempt || !REWARDED_ADS_ENABLED);
      updateAccess((v) => v + 1);
      analytics.click("calculate", { ticker: next.ticker, holdings: next.holdings.length, mode: next.mode, ad: reward });
      // 광고 뒤에는 롤링을 반복하지 않는다. 계산 자체에는 인위적인 지연을 넣지 않는다.
      setPlan(next); release(); go("result", undefined, needsAd || reward ? "quick" : "reveal");
    };
    const cancel = () => {
      if (settled) return;
      settled = true; release(); showToast("광고를 끝까지 보면 계속 계산할 수 있어요");
    };
    if (!needsAd) { finish(false); return; }
    analytics.click("ad_gate", { purpose: "calculate" });
    const fallback = () => {
      if (settled) return;
      showToast("광고를 불러오지 못해 이번 계산은 무료로 열었어요"); finish(false, true);
    };
    if (rewarded.current) {
      try { rewarded.current.show({ onReward: () => finish(true), onDismiss: cancel, onError: fallback }); }
      catch { fallback(); }
    } else if (inToss) fallback();
    else setGate({ run: () => finish(true), cancel, desc: "끝까지 보면 앱을 닫기 전까지 추가 광고 시청 없이 계산할 수 있어요.", cta: "계산 결과 보기" });
  };
  const accessNote = !REWARDED_ADS_ENABLED ? "" : access.isUnlocked() ? "앱을 닫기 전까지 추가 광고 시청 없이 계산해요."
    : access.needsAd(plan) ? "광고 한 번 보면 앱을 닫기 전까지 자유롭게 계산해요."
    : access.known(plan) ? "이미 확인한 조건은 무료로 다시 볼 수 있어요."
    : `무료 계산 ${access.remaining()}회 남았어요.`;
  const onClose = async () => { if (!(await closeApp())) showToast("토스 앱에서는 미니앱이 닫혀요"); };

  if (!ready) return <div className="app" />;
  const common = { onMenu: () => setMenu(true), onClose };
  let body: JSX.Element;
  switch (screenForSelection(screen, hasSelection)) {
    case "terms":
    case "privacy":
      body = <LegalScreen kind={screen as "terms" | "privacy"} back={back} {...common} />;
      break;
    case "result":
      body = <ResultScreen plan={plan} entrance={nav.entrance} onCalculate={calculate} calculationLabel={calculationLabel} busy={busy} back={readSavedId() ? () => go("clock") : back} goCompare={() => go("compare")} onEdit={() => go("home")} goClock={async () => { await refreshSaved(); go("clock"); }} showToast={showToast} {...common} />;
      break;
    case "clock":
      body = <ClockScreen saved={saved} goHome={() => { setPlan({ ...DEFAULT_PLAN, ticker: "", holdings: [] }); go("home"); }} goResult={(item) => { access.complete(item.plan, true); setPlan(item.plan); go("result", item.id); }} onRemove={async (id) => {
        try {
          if (!(await removeSavedClock(id))) { showToast("지우지 못했어요. 다시 시도해 주세요"); return; }
          await refreshSaved(); showToast("저장한 계산을 지웠어요");
        } catch { showToast("지우지 못했어요. 다시 시도해 주세요"); }
      }} {...common} />;
      break;
    case "compare":
      body = <CompareScreen plan={plan} back={back} {...common} />;
      break;
    default:
      {
        body = <InputScreen plan={plan} setPlan={setPlan} onSubmit={() => calculate(plan)} adRequired={hasSelection && needsRewardedAd(plan)} accessNote={accessNote} busy={busy} hasClock={saved.length > 0} goClock={() => go("clock")} goLegal={go} {...common} />;
      }
  }

  return (
    <div className={"app" + (inToss ? " in-toss" : "")}>
      <div key={nav.n} className={"screen-host" + (nav.fwd ? screen === "result" ? " enter-result" : " enter-fwd" : "")}>{body}</div>
      {menu && (
        <Menu
          onClose={() => setMenu(false)}
          items={[
            { label: "공유하기", onClick: () => showToast("토스에서는 미니앱 링크를 공유해요") },
            { label: "신고하기", onClick: () => showToast("토스 신고 화면이 열려요") },
            { label: "저장한 계산 보기", onClick: () => go("clock") },
            { label: "이용약관", onClick: () => go("terms") },
            { label: "개인정보처리방침", onClick: () => go("privacy") },
          ]}
        />
      )}
      {gate && <AdGate desc={gate.desc} cta={gate.cta} onReward={() => { const g = gate; setGate(null); g.run(); }} onClose={() => { const g = gate; setGate(null); g.cancel(); }} />}
      <Toast msg={toast} />
    </div>
  );
}
