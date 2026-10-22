import { useCallback, useEffect, useRef, useState } from "react";
import { InputScreen } from "./screens/InputScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { ClockScreen } from "./screens/ClockScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { AdGate, Menu, Toast } from "./components/ui";
import { DEFAULT_PLAN, cleanHoldings, withHoldings, type Plan } from "./lib/plan";
import { loadSavedClock, clearClock, type SavedClock } from "./lib/clock";
import { analytics, closeApp, createRewarded, entryPath, entryQuery, inToss, type Rewarded } from "./lib/platform";

type Screen = "home" | "result" | "clock" | "compare";
const SCREENS: Screen[] = ["home", "result", "clock", "compare"];
function readHash(): Screen | null {
  const h = location.hash.replace(/^#/, "") as Screen;
  return SCREENS.includes(h) ? h : null;
}
/** 공유 딥링크(intoss://10eok?t=SPY&m=100&d=1&i=0, 분산 매수는 h=QQQ:50,SCHD:30) → 플랜.
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

/** 보상형 광고로 여는 동작. 광고를 끝까지 보면 run, 광고를 못 불러오면 막지 않고 run(토스 정책). */
export type WatchAd = (purpose: string, run: () => void, gate?: { desc: string; cta: string }) => void;
const planKey = (p: Plan) => JSON.stringify(p);

export function App() {
  const [saved, setSaved] = useState<SavedClock | null>(null);
  const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);
  const [screen, setScreen] = useState<Screen>(() => readHash() ?? "home");
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  // 마지막으로 결과를 본 조건(planKey = 플랜 전체 JSON이라 holdings 변경도 '조건 변경'). 첫 계산·같은 조건은 무료, 조건을 바꾼 재계산은 [AD] 버튼으로.
  const [seenKey, setSeenKey] = useState<string | null>(null);
  const [gate, setGate] = useState<{ run: () => void; desc: string; cta: string } | null>(null);
  const rewarded = useRef<Rewarded | null>(null);
  useEffect(() => {
    rewarded.current = createRewarded();
    rewarded.current?.load(); // 광고는 미리 로드하고 버튼에서 노출(체크리스트 10)
    return () => { rewarded.current?.dispose(); rewarded.current = null; };
  }, []);
  useEffect(() => { if (screen === "result") setSeenKey(planKey(plan)); }, [screen, plan]);

  // 첫 진입: 공유 딥링크 플랜이 있으면 결과로, 주요 기능 경로(intoss://10eok/clock·compare·result)가 있으면 그 화면으로,
  // 저장한 시계가 있으면 시계로. history를 쌓지 않게 replaceState.
  useEffect(() => {
    let on = true;
    (async () => {
      const s = await loadSavedClock();
      if (!on) return;
      setSaved(s);
      const fromLink = planFromQuery(entryQuery());
      const path = entryPath();
      const target: Screen | null = SCREENS.includes(path as Screen) && path !== "home" ? (path as Screen) : null;
      if (fromLink) { setPlan(fromLink); history.replaceState(null, "", "#result"); setScreen("result"); }
      else if (target) { if (s) setPlan(s.plan); history.replaceState(null, "", `#${target}`); setScreen(target); }
      else if (s) { setPlan(s.plan); if (!readHash()) { history.replaceState(null, "", "#clock"); setScreen("clock"); } }
      setReady(true);
    })();
    return () => { on = false; };
  }, []);
  // 화면 전환 애니메이션: 앞으로 가기(go)만 짧게 밀어 넣고, 뒤로 가기(백버튼·스와이프·history.back)는 즉시.
  const forward = useRef(false);
  const [nav, setNav] = useState<{ n: number; fwd: boolean }>({ n: 0, fwd: false });
  useEffect(() => {
    const on = () => { setNav((v) => ({ n: v.n + 1, fwd: forward.current })); forward.current = false; setScreen(readHash() ?? "home"); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const go = useCallback((s: Screen) => {
    if (readHash() === s) { setNav((v) => ({ n: v.n + 1, fwd: true })); setScreen(s); }
    else { forward.current = true; location.hash = s; }
    window.scrollTo(0, 0);
  }, []);
  const back = useCallback(() => { if (history.length > 1) history.back(); else go("home"); }, [go]);
  const showToast = useCallback((m: string) => { setToast(m); window.setTimeout(() => setToast(""), 2200); }, []);
  const refreshSaved = useCallback(async () => setSaved(await loadSavedClock()), []);
  const watchAd: WatchAd = useCallback((purpose, run, g = { desc: "끝까지 보면 바로 열려요.", cta: "계속하기" }) => {
    analytics.click("ad_gate", { purpose });
    const rw = rewarded.current;
    const done = () => { analytics.click("ad_rewarded", { purpose }); run(); };
    if (rw) rw.show({ onReward: done, onDismiss: () => showToast("광고를 끝까지 보면 열려요"), onError: run });
    else setGate({ run: done, ...g });
  }, [showToast]);
  const onClose = async () => { if (!(await closeApp())) showToast("토스 앱에서는 미니앱이 닫혀요"); };

  if (!ready) return <div className="app" />;
  const common = { onMenu: () => setMenu(true), onClose };
  let body: JSX.Element;
  switch (screen) {
    case "result":
      body = <ResultScreen plan={plan} setPlan={setPlan} watchAd={watchAd} back={back} goClock={async () => { await refreshSaved(); go("clock"); }} showToast={showToast} {...common} />;
      break;
    case "clock":
      body = <ClockScreen saved={saved} goHome={() => go("home")} goResult={() => { if (saved) setPlan(saved.plan); go("result"); }} goCompare={() => go("compare")} onEdit={() => { if (saved) setPlan(saved.plan); go("home"); }} {...common} showToast={showToast} />;
      break;
    case "compare":
      body = <CompareScreen plan={saved?.plan ?? plan} back={back} {...common} />;
      break;
    default:
      {
        const adNeeded = seenKey !== null && seenKey !== planKey(plan);
        const submit = () => { analytics.click("calculate", { ticker: plan.ticker, holdings: plan.holdings.length, mode: plan.mode, ad: adNeeded }); go("result"); };
        body = <InputScreen plan={plan} setPlan={setPlan} adNeeded={adNeeded} onSubmit={() => (adNeeded ? watchAd("recalc", submit, { desc: "끝까지 보면 바꾼 조건으로 계산해요.", cta: "계산 결과 보기" }) : submit())} hasClock={!!saved} goClock={() => go("clock")} {...common} />;
      }
  }

  return (
    <div className={"app" + (inToss ? " in-toss" : "")}>
      <div key={nav.n} className={"screen-host" + (nav.fwd ? " enter-fwd" : "")}>{body}</div>
      {menu && (
        <Menu
          onClose={() => setMenu(false)}
          items={[
            { label: "공유하기", onClick: () => showToast("토스에서는 미니앱 링크를 공유해요") },
            { label: "신고하기", onClick: () => showToast("토스 신고 화면이 열려요") },
            { label: "저장한 계산 지우기", danger: true, onClick: async () => { if (!(await clearClock())) { showToast("지우지 못했어요. 다시 시도해 주세요"); return; } await refreshSaved(); showToast("저장한 계산을 지웠어요"); go("home"); } },
          ]}
        />
      )}
      {gate && <AdGate desc={gate.desc} cta={gate.cta} onReward={() => { const g = gate; setGate(null); g.run(); }} onClose={() => setGate(null)} />}
      <Toast msg={toast} />
    </div>
  );
}
