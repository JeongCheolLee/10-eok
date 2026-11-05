export type AnalysisAdOutcome = "rewarded" | "dismissed" | "error";
type AdCall = (args: {
  options: { adGroupId: string };
  onEvent: (e: { type: string }) => void;
  onError: (error: Error) => void;
}) => (() => void);
export type AnalysisAdSdk = { load: AdCall; show: AdCall };

/** Called only on explicit user consent. Timers bound loading, never video duration. */
export function startAnalysisReward(sdk: AnalysisAdSdk, id: string, done: (outcome: AnalysisAdOutcome) => void) {
  let ended = false;
  let shown = false;
  const cleanups: (() => void)[] = [];
  let timer: ReturnType<typeof setTimeout>;
  const dispose = () => {
    ended = true;
    clearTimeout(timer);
    for (const cleanup of cleanups.splice(0)) { try { cleanup(); } catch { /* Optional SDK cleanup. */ } }
  };
  const finish = (outcome: AnalysisAdOutcome) => {
    if (ended) return;
    dispose(); done(outcome);
  };
  const attach = (call: () => () => void) => {
    const cleanup = call();
    if (ended) { try { cleanup(); } catch { /* Synchronous completion. */ } }
    else cleanups.push(cleanup);
  };
  const arm = () => { clearTimeout(timer); timer = setTimeout(() => finish("error"), 12_000); };
  arm();
  try {
    attach(() => sdk.load({ options: { adGroupId: id }, onError: () => { if (!shown) finish("error"); }, onEvent: event => {
      if (ended || shown || event.type !== "loaded") return;
      shown = true; arm();
      try {
        attach(() => sdk.show({ options: { adGroupId: id }, onError: () => finish("error"), onEvent: e => {
          if (ended) return;
          if (e.type === "show" || e.type === "impression" || e.type === "clicked") clearTimeout(timer);
          if (e.type === "userEarnedReward") finish("rewarded");
          if (e.type === "dismissed") finish("dismissed");
          if (e.type === "failedToShow") finish("error");
        } }));
      } catch { finish("error"); }
    } }));
  } catch { finish("error"); }
  return dispose;
}
