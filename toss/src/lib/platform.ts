// 플랫폼 어댑터. 브라우저(프로토타입·Vite dev)와 토스 미니앱의 차이는 이 파일 하나에 모은다.
// 토스 안에서는 @apps-in-toss/web-framework SDK를, 밖에서는 브라우저 API를 쓴다.
import * as ait from "@apps-in-toss/web-framework";

export const APP_NAME = "10-eok";
export const SITE = "https://jeongcheol.cloud";
// 공유 링크 미리보기: 결과 숫자 없는 앱 소개 카드(숫자는 공유 문구에). 웹 /api/og는 웹 계산 기준이라 미니앱 결과와 다를 수 있다.
export const OG_IMAGE = `${SITE}/og/toss-share.png?v=20261024-2`;

/** 토스 앱(또는 샌드박스) 안에서 실행 중인지. SDK 호출이 실패하면 브라우저로 간주. */
export const inToss: boolean = (() => {
  try {
    const env = ait.getOperationalEnvironment();
    return env === "toss" || env === "sandbox";
  } catch {
    return false;
  }
})();

/** 데이터 주소. 토스에서는 운영 서버(CORS 허용), 브라우저 프로토타입은 동봉한 ./data, dev는 .env의 VITE_DATA_BASE */
export const DATA_BASE: string = import.meta.env.VITE_DATA_BASE ?? (inToss ? `${SITE}/data` : "data");

/** get은 실패 시 null. set·remove는 성공 여부를 돌려준다(실패를 숨기면 '저장했어요'가 거짓이 된다). */
export const storage = {
  async get(key: string): Promise<string | null> {
    if (inToss) { try { return await ait.Storage.getItem(key); } catch { return null; } }
    try { return localStorage.getItem(key); } catch { return null; }
  },
  async set(key: string, value: string): Promise<boolean> {
    if (inToss) { try { await ait.Storage.setItem(key, value); return true; } catch { return false; } }
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  },
  async remove(key: string): Promise<boolean> {
    if (inToss) { try { await ait.Storage.removeItem(key); return true; } catch { return false; } }
    try { localStorage.removeItem(key); return true; } catch { return false; }
  },
};

type Params = Record<string, string | number | boolean | undefined>;
/** 콘솔 분석 > 이벤트. 토스 밖에서는 콘솔 출력만. */
export const analytics = {
  screen(log_name: string, params: Params = {}): void {
    if (inToss) { try { void ait.Analytics.screen({ log_name, ...params }); } catch { /* noop */ } return; }
    console.log("[analytics.screen]", log_name, params);
  },
  click(log_name: string, params: Params = {}): void {
    if (inToss) { try { void ait.Analytics.click({ log_name, ...params }); } catch { /* noop */ } return; }
    console.log("[analytics.click]", log_name, params);
  },
};

async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

/** 결과 공유. 토스: 미니앱 딥링크(intoss://10-eok?…)를 토스 공유 링크로 바꿔 폰 공유 창(카카오톡·문자 등).
 *  브라우저: 폰 공유 창(Web Share)이 있으면 그것, 없으면 텍스트 복사. 사용자가 공유 창을 닫으면 "cancelled". */
export async function shareResult(text: string, query: string): Promise<"shared" | "copied" | "cancelled" | "failed"> {
  if (inToss) {
    try {
      const link = await ait.getTossShareLink(`intoss://${APP_NAME}?${query}`, OG_IMAGE);
      await ait.share({ message: `${text}\n${link}` });
      return "shared";
    } catch { return "failed"; }
  }
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try { await navigator.share({ text }); return "shared"; }
    catch (e) { if ((e as Error)?.name === "AbortError") return "cancelled"; }
  }
  return (await copyText(text)) ? "copied" : "failed";
}

/** X 버튼·첫 화면 종료. 토스 밖에서는 아무것도 안 함(호출자가 안내). */
export async function closeApp(): Promise<boolean> {
  if (!inToss) return false;
  try { await ait.closeView(); return true; } catch { return false; }
}

/** 진입 쿼리. 토스 딥링크(intoss://10-eok?t=QLD&m=100)는 getSchemeUri로, 브라우저는 location.search로. */
export function entryQuery(): URLSearchParams {
  if (inToss) {
    try {
      const uri = ait.getSchemeUri();
      const q = uri.split("?")[1] ?? "";
      if (q) return new URLSearchParams(q);
    } catch { /* fall through */ }
  }
  return new URLSearchParams(location.search);
}

/** 진입 경로. 콘솔 '주요 기능' 딥링크(intoss://10-eok/clock)의 첫 경로 조각. 브라우저는 ?page=clock. 없으면 "". */
export function entryPath(): string {
  if (inToss) {
    try {
      const m = /^[a-z][a-z0-9+.-]*:\/\/[^/?#]+\/([^/?#]+)/i.exec(ait.getSchemeUri());
      if (m) return decodeURIComponent(m[1]).toLowerCase();
    } catch { /* fall through */ }
  }
  return (new URLSearchParams(location.search).get("page") ?? "").toLowerCase();
}

/* ── 광고 ── 콘솔에서 발급한 운영 ID는 출시 번들에서만. 개발·QR 테스트는 테스트 ID. */
export const AD_BANNER_ID = import.meta.env.VITE_AD_BANNER_ID ?? "ait-ad-test-banner-id";
export const AD_REWARDED_ID = import.meta.env.VITE_AD_REWARDED_ID ?? "ait-ad-test-rewarded-id";
// 2026-10-19 공지: 신규 전면·리워드 지면 사용 보류. 정상화 뒤 명시적 설정+ID로만 재개한다.
export const REWARDED_ADS_ENABLED = import.meta.env.VITE_REWARDED_ADS_ENABLED === "true"
  && !!import.meta.env.VITE_AD_REWARDED_ID?.trim();
export const adsSupported: boolean = (() => {
  if (!inToss) return false;
  try { return ait.TossAds.attachBanner.isSupported(); } catch { return false; }
})();

let adsInit: Promise<boolean> | null = null;
export function initAds(): Promise<boolean> {
  if (!adsSupported) return Promise.resolve(false);
  return (adsInit ??= new Promise<boolean>((resolve) => {
    try {
      ait.TossAds.initialize({ callbacks: { onInitialized: () => resolve(true), onInitializationFailed: () => resolve(false) } });
    } catch { resolve(false); }
  }));
}

/** 배너를 el에 붙인다. 반환값으로 해제. 지원 안 되면 null. */
export async function attachBanner(el: HTMLElement, onRenderedChange: (rendered: boolean) => void = () => {}): Promise<(() => void) | null> {
  onRenderedChange(false);
  if (!(await initAds())) return null;
  let disposed = false;
  const update = (rendered: boolean) => { if (!disposed) onRenderedChange(rendered); };
  try {
    const r = ait.TossAds.attachBanner(AD_BANNER_ID, el, {
      theme: "light", tone: "blackAndWhite", variant: "expanded",
      callbacks: {
        onAdRendered: () => update(true),
        onNoFill: () => update(false),
        onAdFailedToRender: () => update(false),
      },
    });
    return () => { disposed = true; r.destroy(); };
  } catch { update(false); return null; }
}

export type Rewarded = { load: () => void; show: (h: { onReward: () => void; onDismiss: () => void; onError: () => void }) => void; dispose: () => void };
/** 앱 진입 시 load, 계산 버튼에서 show. userEarnedReward에서만 보상. */
export function createRewarded(): Rewarded | null {
  if (!REWARDED_ADS_ENABLED || !inToss) return null;
  try { if (!ait.loadFullScreenAd.isSupported()) return null; } catch { return null; }
  let loaded = false;
  let unsubLoad: (() => void) | null = null;
  let unsubShow: (() => void) | null = null;
  const load = () => {
    loaded = false;
    unsubLoad?.();
    unsubLoad = ait.loadFullScreenAd({ options: { adGroupId: AD_REWARDED_ID }, onEvent: (e) => { if (e.type === "loaded") loaded = true; }, onError: () => { loaded = false; } });
  };
  const show: Rewarded["show"] = (h) => {
    if (!loaded) { h.onError(); load(); return; }
    let rewarded = false;
    unsubShow?.();
    unsubShow = ait.showFullScreenAd({
      options: { adGroupId: AD_REWARDED_ID },
      onEvent: (e) => {
        if (e.type === "userEarnedReward") { rewarded = true; h.onReward(); }
        if (e.type === "dismissed") { if (!rewarded) h.onDismiss(); load(); }
        if (e.type === "failedToShow") { h.onError(); load(); }
      },
      onError: () => { h.onError(); load(); },
    });
  };
  return { load, show, dispose: () => { unsubLoad?.(); unsubShow?.(); } };
}
