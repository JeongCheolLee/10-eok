import { conditionKey } from "./conditionKey";
import type { Plan } from "./plan";

export const FREE_CALCULATIONS = 2;
export const CALCULATION_ACCESS_KEY = "10eok-calculation-day-v2";
const DAY = 86_400_000;
const KST = 9 * 3_600_000;
export const koreanDay = (time = Date.now()) => new Date(time + KST).toISOString().slice(0, 10);
export const untilKoreanMidnight = (time = Date.now()) => DAY - ((time + KST) % DAY);
type State = { day: string; used: number; unlocked: boolean; seen: string[] };
type Store = Pick<Storage, "getItem" | "setItem">;

/** Device-local daily allowance. The clock is injectable for midnight boundary tests. */
export function createCalculationAccess(store?: Store, now: () => number = Date.now) {
  const fresh = (): State => ({ day: koreanDay(now()), used: 0, unlocked: false, seen: [] });
  let state = fresh();
  try {
    const raw = JSON.parse(store?.getItem(CALCULATION_ACCESS_KEY) ?? "null");
    if (raw && raw.day === state.day && Number.isInteger(raw.used) && raw.used >= 0 && raw.used <= FREE_CALCULATIONS
      && typeof raw.unlocked === "boolean" && Array.isArray(raw.seen) && raw.seen.every((key: unknown) => typeof key === "string")) state = raw;
  } catch { /* Storage unavailable: retain access in memory for this app instance. */ }
  const persist = () => { try { store?.setItem(CALCULATION_ACCESS_KEY, JSON.stringify(state)); } catch { /* Keep in-memory access. */ } };
  const current = () => {
    if (state.day !== koreanDay(now())) { state = fresh(); persist(); }
    return state;
  };
  // Replace obsolete daily records on the next app entry, too.
  persist();
  const known = (plan: Plan) => current().seen.includes(conditionKey(plan));
  return {
    needsAd: (plan: Plan) => !current().unlocked && state.used >= FREE_CALCULATIONS && !known(plan),
    remaining: () => Math.max(0, FREE_CALCULATIONS - current().used),
    isUnlocked: () => current().unlocked,
    known,
    /** Call only after a successful calculation. Saved/shared entries and ad errors are exempt. */
    complete(plan: Plan, exempt = false) {
      if (known(plan)) return;
      state.seen.push(conditionKey(plan));
      if (!exempt && !state.unlocked) state.used = Math.min(FREE_CALCULATIONS, state.used + 1);
      persist();
    },
    reward() { current().unlocked = true; persist(); },
  };
}

/** SDK Storage persists across webview closure; serialize writes to avoid stale quota overwrites. */
export async function loadCalculationAccess(store: {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<unknown>;
}, now: () => number = Date.now) {
  let raw: string | null = null;
  try { raw = await store.get(CALCULATION_ACCESS_KEY); } catch { /* Memory fallback. */ }
  let writes = Promise.resolve();
  const access = createCalculationAccess({
    getItem: () => raw,
    setItem: (key, value) => {
      raw = value;
      writes = writes.then(() => store.set(key, value)).then(() => {}, () => {});
    },
  }, now);
  return { ...access, flush: () => writes };
}
