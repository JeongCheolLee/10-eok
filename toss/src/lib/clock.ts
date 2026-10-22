import { storage } from "./platform";
import { normalizePlan, type Plan } from "./plan";

// v2(2026-10-22): plan.holdings 추가. 키는 그대로 두고 v1 저장본은 읽을 때 holdings=[{ticker, amount}]로 옮긴다.
const KEY = "10eok-toss-clock-v1";
export type SavedClock = { v: 2; plan: Plan; savedAt: string };
type SavedV1 = { v: 1; plan: Omit<Plan, "holdings">; savedAt: string };

function parse(raw: string | null): SavedClock | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as SavedClock | SavedV1;
    if (!j || !j.plan || (j.v !== 1 && j.v !== 2)) return null;
    return { v: 2, plan: normalizePlan(j.plan as Partial<Plan>), savedAt: j.savedAt };
  } catch { return null; }
}
export async function loadSavedClock(): Promise<SavedClock | null> { return parse(await storage.get(KEY)); }
/** 성공하면 true. 실패(용량·권한·SDK 오류)는 false — 호출자가 '저장했어요' 대신 실패를 알린다. */
export async function saveClock(plan: Plan): Promise<boolean> {
  return storage.set(KEY, JSON.stringify({ v: 2, plan: normalizePlan(plan), savedAt: new Date().toISOString() } satisfies SavedClock));
}
/** 성공하면 true. */
export async function clearClock(): Promise<boolean> { return storage.remove(KEY); }
