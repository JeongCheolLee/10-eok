import { inToss, requestAppReview, storage } from "./platform";

const KEY = "10eok-review-v1";
const INTERVAL = 30 * 24 * 60 * 60_000;
type State = { completed: number; requestedAt: number | null };
type Store = { get: (key: string) => Promise<string | null>; set: (key: string, value: string) => Promise<boolean> };

/** Request only after a successful save, after 2 calculations; never infer rating or completion. */
export function createReviewPrompt(store: Store, request: () => Promise<void>, now = Date.now) {
  let attempted = false;
  let queue: Promise<unknown> = Promise.resolve();
  const run = (task: () => Promise<void>) => {
    const next = queue.then(task).catch(() => {});
    queue = next;
    return next;
  };
  const read = async (): Promise<State> => {
    try {
      const value = JSON.parse(await store.get(KEY) ?? "null");
      if (value && Number.isInteger(value.completed) && value.completed >= 0
        && (value.requestedAt === null || (Number.isFinite(value.requestedAt) && value.requestedAt >= 0))) return value;
    } catch { /* No prompt based on unreadable history. */ }
    return { completed: 0, requestedAt: null };
  };
  return {
    completed: () => run(async () => {
      const state = await read();
      await store.set(KEY, JSON.stringify({ ...state, completed: Math.min(2, state.completed + 1) }));
    }),
    afterSave: () => run(async () => {
      if (attempted) return;
      const state = await read();
      if (state.completed < 2 || (state.requestedAt !== null && now() - state.requestedAt < INTERVAL)) return;
      attempted = true;
      // Persist before calling the SDK; unavailable storage should not cause repeat prompts.
      if (!(await store.set(KEY, JSON.stringify({ ...state, requestedAt: now() })))) return;
      await request();
    }),
  };
}
const prompt = createReviewPrompt(storage, requestAppReview);
export function recordCompletedCalculation() { if (inToss) void prompt.completed(); }
export function requestReviewAfterSave() { if (inToss) void prompt.afterSave(); }
