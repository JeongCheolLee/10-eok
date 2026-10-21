import { useCallback, useEffect, useState } from "react";
import { InputScreen } from "./screens/InputScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { ClockScreen } from "./screens/ClockScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { Menu, Toast } from "./components/ui";
import { DEFAULT_PLAN, type Plan } from "./lib/plan";
import { loadSavedClock, clearClock, type SavedClock } from "./lib/clock";
import { analytics, closeApp, entryPath, entryQuery, inToss } from "./lib/platform";
import { TICKERS } from "@/lib/tickers";

type Screen = "home" | "result" | "clock" | "compare";
const SCREENS: Screen[] = ["home", "result", "clock", "compare"];
function readHash(): Screen | null {
  const h = location.hash.replace(/^#/, "") as Screen;
  return SCREENS.includes(h) ? h : null;
}
/** 공유 딥링크(intoss://10eok?t=QLD&m=100&d=1&i=0) → 플랜. 종목이 유효할 때만. */
function planFromQuery(q: URLSearchParams): Plan | null {
  const t = (q.get("t") ?? "").toUpperCase();
  if (!TICKERS.some((x) => x.symbol === t)) return null;
  const num = (k: string, d: number) => { const n = parseInt(q.get(k) ?? "", 10); return Number.isFinite(n) ? n : d; };
  const mode: Plan["mode"] = q.get("mode") === "amt" ? "amount" : "time";
  const f = q.get("f");
  const freq: Plan["freq"] = f === "w" ? "weekly" : f === "d" ? "daily" : "monthly";
  const weekday = Math.min(5, Math.max(1, num("wd", 1))) as Plan["weekday"];
  const s = q.get("s") ?? "";
  const tracking = /^\d{4}-\d{2}-\d{2}$/.test(s);
  return { ...DEFAULT_PLAN, ticker: t, mode: tracking ? "time" : mode, amount: Math.max(1, num("m", 100)), years: Math.max(1, num("y", 10)), lump: Math.max(0, num("i", 0)), buyDay: Math.min(29, Math.max(1, num("d", 1))), freq, weekday, tracking, startDate: tracking ? s : "", reinvest: q.get("div") !== "0", tax: q.get("tax") === "1" };
}

export function App() {
  const [saved, setSaved] = useState<SavedClock | null>(null);
  const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);
  const [screen, setScreen] = useState<Screen>(() => readHash() ?? "home");
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");

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
  useEffect(() => {
    const on = () => setScreen(readHash() ?? "home");
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const go = useCallback((s: Screen) => { if (readHash() === s) setScreen(s); else location.hash = s; window.scrollTo(0, 0); }, []);
  const back = useCallback(() => { if (history.length > 1) history.back(); else go("home"); }, [go]);
  const showToast = useCallback((m: string) => { setToast(m); window.setTimeout(() => setToast(""), 2200); }, []);
  const refreshSaved = useCallback(async () => setSaved(await loadSavedClock()), []);
  const onClose = async () => { if (!(await closeApp())) showToast("토스 앱에서는 미니앱이 닫혀요"); };

  if (!ready) return <div className="app" />;
  const common = { onMenu: () => setMenu(true), onClose };
  let body: JSX.Element;
  switch (screen) {
    case "result":
      body = <ResultScreen plan={plan} setPlan={setPlan} back={back} goClock={async () => { await refreshSaved(); go("clock"); }} showToast={showToast} {...common} />;
      break;
    case "clock":
      body = <ClockScreen saved={saved} goHome={() => go("home")} goResult={() => { if (saved) setPlan(saved.plan); go("result"); }} goCompare={() => go("compare")} onEdit={() => { if (saved) setPlan(saved.plan); go("home"); }} {...common} />;
      break;
    case "compare":
      body = <CompareScreen plan={saved?.plan ?? plan} back={back} {...common} />;
      break;
    default:
      body = <InputScreen plan={plan} setPlan={setPlan} onSubmit={() => { analytics.click("calculate", { ticker: plan.ticker, mode: plan.mode }); go("result"); }} hasClock={!!saved} goClock={() => go("clock")} {...common} />;
  }

  return (
    <div className={"app" + (inToss ? " in-toss" : "")}>
      {body}
      {menu && (
        <Menu
          onClose={() => setMenu(false)}
          items={[
            { label: "공유하기", onClick: () => showToast("토스에서는 미니앱 링크를 공유해요") },
            { label: "신고하기", onClick: () => showToast("토스 신고 화면이 열려요") },
            { label: "내 10억 시계 지우기", danger: true, onClick: async () => { await clearClock(); await refreshSaved(); showToast("저장한 시계를 지웠어요"); go("home"); } },
          ]}
        />
      )}
      <Toast msg={toast} />
    </div>
  );
}
