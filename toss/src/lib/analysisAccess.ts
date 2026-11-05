type Store = { get: (key: string) => Promise<string | null>; set: (key: string, value: string) => Promise<boolean> };
const PREFIX = "10eok-analysis-v1:";

/** Per-condition keys avoid lost updates between independent results. No daily expiry. */
export function createAnalysisAccess(store: Store) {
  const earned = new Set<string>();
  return {
    async has(key: string) {
      if (earned.has(key)) return true;
      try {
        if (await store.get(PREFIX + key) === "earned") { earned.add(key); return true; }
      } catch { /* Unavailable storage must not break basic calculations. */ }
      return false;
    },
    async grant(key: string) {
      earned.add(key);
      try { return await store.set(PREFIX + key, "earned"); } catch { return false; }
    },
  };
}
