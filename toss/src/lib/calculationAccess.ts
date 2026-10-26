import { conditionKey } from "./conditionKey";
import type { Plan } from "./plan";

export const FREE_CALCULATIONS = 2;
const KEY = "10eok-calculation-session-v1";
type State = { used: number; unlocked: boolean; seen: string[] };
type SessionStore = Pick<Storage, "getItem" | "setItem">;

/** sessionStorage keeps reloads in the same webview session; never use permanent app storage. */
export function createCalculationAccess(store?: SessionStore) {
  let state: State = { used: 0, unlocked: false, seen: [] };
  try {
    const raw = JSON.parse(store?.getItem(KEY) ?? "null");
    if (raw && Number.isInteger(raw.used) && raw.used >= 0 && raw.used <= FREE_CALCULATIONS
      && typeof raw.unlocked === "boolean" && Array.isArray(raw.seen) && raw.seen.every((key: unknown) => typeof key === "string")) state = raw;
  } catch { /* Storage unavailable: retain access in memory for this app instance. */ }
  const persist = () => { try { store?.setItem(KEY, JSON.stringify(state)); } catch { /* Keep in-memory access. */ } };
  const known = (plan: Plan) => state.seen.includes(conditionKey(plan));
  return {
    needsAd: (plan: Plan) => !state.unlocked && state.used >= FREE_CALCULATIONS && !known(plan),
    remaining: () => Math.max(0, FREE_CALCULATIONS - state.used),
    isUnlocked: () => state.unlocked,
    known,
    /** Call only after a successful calculation. Saved/shared entries and ad errors are exempt. */
    complete(plan: Plan, exempt = false) {
      if (known(plan)) return;
      state.seen.push(conditionKey(plan));
      if (!exempt && !state.unlocked) state.used = Math.min(FREE_CALCULATIONS, state.used + 1);
      persist();
    },
    reward() { state.unlocked = true; persist(); },
  };
}

export function browserCalculationAccess() {
  try { return createCalculationAccess(window.sessionStorage); }
  catch { return createCalculationAccess(); }
}
