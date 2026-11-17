/** Payment state machine. An ambiguous response must never trigger a second grant. */
export type PromotionConfig = { code: string; amount: number; startsAt: number; endsAt: number; test: boolean };
export type PromotionStatus = "loading" | "ready" | "paying" | "paid" | "uncertain" | "retryable" | "ended" | "unavailable";
export type PromotionState = { status: PromotionStatus; reference?: string };
/** A fresh QR can exercise test payouts without deleting any previous receipt.
 * Live campaigns always use the original storage key, even if a URL supplies a run. */
export function promotionStorageKey(config: PromotionConfig, key: string, testRun: string | null): string {
  return config.test && config.code.startsWith("TEST_") && testRun && /^[a-zA-Z0-9_-]{1,64}$/.test(testRun)
    ? `${key}:test-run:${testRun}` : key;
}
type Receipt = { status: "pending" | "paid" | "failed" | "blocked"; reference: string; rewardKey?: string };
export type PromotionDeps = {
  // Unlike the general preferences store, read errors MUST propagate here.
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  identify: () => Promise<string>;
  grant: (code: string, amount: number) => Promise<{ key: string }>;
  now?: () => number;
  reference: () => string;
  timeoutMs?: number;
};

export function promotionConfig(env: Record<string, string | undefined>): PromotionConfig | null {
  const mode = env.VITE_CALC_PROMOTION_MODE;
  if (mode !== "test" && mode !== "live") return null;
  const code = env.VITE_CALC_PROMOTION_CODE?.trim() ?? "";
  const amount = Number(env.VITE_CALC_PROMOTION_AMOUNT);
  const startsAt = Date.parse(env.VITE_CALC_PROMOTION_START ?? "");
  const endsAt = Date.parse(env.VITE_CALC_PROMOTION_END ?? "");
  if (!code || (mode === "test") !== code.startsWith("TEST_") || !Number.isInteger(amount)
    || amount < 1 || amount > 5000 || !Number.isFinite(startsAt) || !Number.isFinite(endsAt) || startsAt >= endsAt) return null;
  return { code, amount, startsAt, endsAt, test: mode === "test" };
}

export function createCalculationPromotion(config: PromotionConfig, deps: PromotionDeps) {
  const now = deps.now ?? Date.now;
  let state: PromotionState = { status: "loading" };
  let key = "";
  let initialized: Promise<void> | undefined;
  let running: Promise<void> | undefined;
  let completed = false;
  const listeners = new Set<() => void>();
  const publish = (next: PromotionState) => { state = next; listeners.forEach((fn) => fn()); };
  const active = () => now() >= config.startsAt && now() < config.endsAt;
  const read = async (): Promise<Receipt | null> => {
    const raw = await deps.get(key);
    if (raw === null) return null;
    const value = JSON.parse(raw);
    if (!value || !["pending", "paid", "failed", "blocked"].includes(value.status) || typeof value.reference !== "string"
      || (value.status === "paid" && typeof value.rewardKey !== "string")) throw Error("Invalid receipt");
    return value;
  };
  const initialize = () => initialized ??= (async () => {
    if (!active()) { publish({ status: "ended" }); return; }
    try {
      const user = await deps.identify();
      if (!user) throw Error("No user");
      key = `10eok-calc-promotion-v1:${encodeURIComponent(config.code)}:${encodeURIComponent(user)}`;
      const receipt = await read();
      if (receipt) {
        completed = true;
        publish({ status: receipt.status === "paid" ? "paid" : receipt.status === "pending" ? "uncertain" : receipt.status === "failed" ? "retryable" : "unavailable", reference: receipt.reference });
      } else publish({ status: "ready" });
    } catch { publish({ status: "unavailable" }); }
  })();
  const run = async () => {
    await initialize();
    if (!completed || !["ready", "retryable"].includes(state.status)) return;
    if (!active()) { publish({ status: "ended" }); return; }
    let reference = "";
    try {
      // Read again immediately before writing, including after a definite-failure retry.
      const previous = await read();
      if (previous && previous.status !== "failed") {
        publish({ status: previous.status === "paid" ? "paid" : "uncertain", reference: previous.reference }); return;
      }
      reference = deps.reference();
      await deps.set(key, JSON.stringify({ status: "pending", reference } satisfies Receipt));
    } catch { publish({ status: "unavailable" }); return; }
    publish({ status: "paying", reference });
    // The request may still finish after this timeout; keep the pending receipt.
    const timer = setTimeout(() => publish({ status: "uncertain", reference }), deps.timeoutMs ?? 15_000);
    try {
      const result = await deps.grant(config.code, config.amount);
      if (!result || typeof result.key !== "string" || !result.key) throw Error("Unknown outcome");
      // The persisted pending record still prevents a retry if the success write fails.
      try { await deps.set(key, JSON.stringify({ status: "paid", reference, rewardKey: result.key } satisfies Receipt)); } catch { /* keep pending */ }
      publish({ status: "paid", reference });
    } catch (error) {
      const code = String((error as { code?: unknown })?.code ?? "");
      if (["4100", "4109", "4112", "4114", "4116", "40000", "4110", "UNSUPPORTED_APP_VERSION"].includes(code)) {
        try { await deps.set(key, JSON.stringify({ status: code === "4110" ? "failed" : "blocked", reference } satisfies Receipt)); }
        catch { publish({ status: "uncertain", reference }); return; }
        publish({ status: code === "4110" ? "retryable" : ["4109", "4112"].includes(code) ? "ended" : "unavailable", reference });
      } else publish({ status: "uncertain", reference });
    } finally { clearTimeout(timer); }
  };
  const attempt = () => {
    if (!running) running = run().finally(() => { running = undefined; });
    return running;
  };
  return {
    config,
    snapshot: () => state,
    subscribe: (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; },
    initialize,
    // The caller must supply a successful, explicitly submitted result, not saved/shared views.
    complete: (eligible: boolean) => { if (!eligible) return Promise.resolve(); completed = true; return attempt(); },
    retry: () => state.status === "retryable" ? attempt() : Promise.resolve(),
  };
}
export type CalculationPromotion = ReturnType<typeof createCalculationPromotion>;
