import { conditionKey } from "./conditionKey";
import { storage } from "./platform";
import { cleanHoldings, normalizePlan, type Plan } from "./plan";

// 같은 키에서 v1/v2 한 건을 v3 목록으로 읽는다. 다음 저장 때 새 형식으로 기록한다.
const KEY = "10eok-toss-clock-v1";
export type SavedClock = { id: string; plan: Plan; savedAt: string };
type SavedClocks = { v: 3; items: SavedClock[] };

function readItem(value: unknown, fallbackId?: string): SavedClock | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<SavedClock>;
  if (!item.plan || typeof item.plan !== "object" || typeof item.savedAt !== "string") return null;
  const raw = item.plan;
  const holdings = Array.isArray(raw.holdings) ? raw.holdings : [{ ticker: raw.ticker, amount: raw.amount }];
  if (!cleanHoldings(holdings).length) return null;
  const id = typeof item.id === "string" && item.id ? item.id : fallbackId;
  return id ? { id, plan: normalizePlan(raw), savedAt: item.savedAt } : null;
}

function parse(raw: string | null): SavedClock[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (value?.v === 1 || value?.v === 2) {
      const item = readItem(value, "legacy");
      return item ? [item] : [];
    }
    if (value?.v !== 3 || !Array.isArray(value.items)) return [];
    return value.items.flatMap((item: unknown) => { try { const parsed = readItem(item); return parsed ? [parsed] : []; } catch { return []; } });
  } catch { return []; }
}

export async function loadSavedClocks(): Promise<SavedClock[]> { return parse(await storage.get(KEY)); }

// 빠른 연속 저장·삭제에서 read→write가 겹쳐 다른 항목을 잃지 않게 직렬화한다.
let pending: Promise<unknown> = Promise.resolve();
function mutate(run: () => Promise<boolean>): Promise<boolean> {
  const next = pending.then(run, run);
  pending = next.catch(() => false);
  return next;
}
function write(items: SavedClock[]): Promise<boolean> {
  return storage.set(KEY, JSON.stringify({ v: 3, items } satisfies SavedClocks));
}

/** 같은 조건은 기존 ID를 유지해 맨 위로 갱신하고, 다른 조건은 추가한다. */
export function saveClock(plan: Plan): Promise<boolean> {
  if (!plan.holdings.length) return Promise.resolve(false);
  return mutate(async () => {
    const items = await loadSavedClocks();
    const key = conditionKey(plan);
    const same = items.find((item) => conditionKey(item.plan) === key);
    const entry: SavedClock = { id: same?.id ?? crypto.randomUUID(), plan: normalizePlan(plan), savedAt: new Date().toISOString() };
    return write([entry, ...items.filter((item) => conditionKey(item.plan) !== key)]);
  });
}

export function removeSavedClock(id: string): Promise<boolean> {
  return mutate(async () => write((await loadSavedClocks()).filter((item) => item.id !== id)));
}
