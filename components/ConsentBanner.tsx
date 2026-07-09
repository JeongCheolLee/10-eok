"use client";

import { useEffect, useState } from "react";
import { localeHref } from "@/lib/i18n/seo";
import type { Locale } from "@/lib/i18n/locales";

// GDPR 동의(Google Consent Mode v2) 배너.
// 기본 상태(거부)는 layout.tsx 의 <head> 인라인 스크립트가 GA/AdSense 로드 전에 설정한다.
// 이 배너는 아직 선택 안 한 방문자에게만 노출되고, 선택 시 gtag consent update + localStorage 기록.
// SSR/최초 렌더에선 아무것도 안 그림(하이드레이션 불일치 방지) — LocaleBanner 와 동일한 패턴.

// ⚠️ 이 키는 layout.tsx 의 인라인 스크립트와 반드시 동일해야 한다.
const CONSENT_KEY = "10eok-consent-v1";

type Grant = "granted" | "denied";

const T: Record<Locale, { msg: string; accept: string; reject: string; more: string }> = {
  ko: { msg: "이 사이트는 방문 통계와 광고를 위해 쿠키를 사용합니다.", accept: "동의", reject: "거부", more: "자세히" },
  en: { msg: "This site uses cookies for analytics and ads.", accept: "Accept", reject: "Reject", more: "Learn more" },
  ja: { msg: "当サイトはアクセス解析と広告のためにクッキーを使用します。", accept: "同意する", reject: "拒否", more: "詳細" },
  de: { msg: "Diese Website verwendet Cookies für Analyse und Werbung.", accept: "Zustimmen", reject: "Ablehnen", more: "Mehr erfahren" },
};

function updateConsent(state: Grant) {
  // head 스크립트가 window.gtag 를 항상 정의하므로 그대로 호출.
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }
}

export function ConsentBanner({ locale }: { locale: Locale }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setShow(true);
    } catch {
      setShow(true); // localStorage 접근 불가(프라이빗 모드 등) 시에도 배너는 노출
    }
  }, []);

  if (!show) return null;

  const t = T[locale] ?? T.ko;

  const decide = (state: Grant) => {
    updateConsent(state);
    try { localStorage.setItem(CONSENT_KEY, state); } catch { /* 무시 */ }
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t.msg}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60,
        background: "var(--surface)",
        borderTop: "1px solid var(--line)",
        boxShadow: "0 -2px 16px rgba(0,0,0,0.35)",
        fontSize: 14,
      }}
    >
      <div
        style={{
          maxWidth: "var(--w-wide)",
          margin: "0 auto",
          padding: "12px var(--gutter)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ color: "var(--muted)", flex: "1 1 260px", minWidth: 0 }}>
          {t.msg}{" "}
          <a href={localeHref(locale, "/privacy")} style={{ color: "var(--accent)", textDecoration: "underline" }}>
            {t.more}
          </a>
        </span>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto", flex: "0 0 auto" }}>
          <button
            type="button"
            onClick={() => decide("denied")}
            style={{
              background: "transparent",
              color: "var(--muted)",
              border: "1px solid var(--line)",
              borderRadius: 500,
              fontWeight: 700,
              padding: "8px 18px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 14,
            }}
          >
            {t.reject}
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            style={{
              background: "var(--accent)",
              color: "#000",
              border: 0,
              borderRadius: 500,
              fontWeight: 700,
              padding: "8px 18px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 14,
            }}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
