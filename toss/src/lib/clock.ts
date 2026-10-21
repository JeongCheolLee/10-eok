import { storage } from "./platform";
import type { Plan } from "./plan";

const KEY = "10eok-toss-clock-v1";
export type SavedClock = { v: 1; plan: Plan; savedAt: string };

function parse(raw: string | null): SavedClock | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as SavedClock;
    return j && j.v === 1 && j.plan ? j : null;
  } catch { return null; }
}
export async function loadSavedClock(): Promise<SavedClock | null> { return parse(await storage.get(KEY)); }
export async function saveClock(plan: Plan): Promise<void> {
  await storage.set(KEY, JSON.stringify({ v: 1, plan, savedAt: new Date().toISOString() } satisfies SavedClock));
}
export async function clearClock(): Promise<void> { await storage.remove(KEY); }
