"use client";

import { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";
import { localeHref } from "@/lib/i18n/seo";

// 브라우저 언어가 현재 로케일과 다르고, 그 언어가 공개(LOCALES) 중이면 상단에 제안 배너.
// 리다이렉트 없음(SEO 무영향) · localStorage로 닫음 기억 · SSR에선 아무것도 렌더 안 함(ko HTML 불변).
// CTA는 대상 언어로 표기(영어 사용자에겐 "View in English").
const CTA: Record<Locale, string> = {
  ko: "한국어로 보기",
  en: "View in English",
  ja: "日本語で見る",
  de: "Auf Deutsch ansehen",
};
const DISMISS_KEY = "10eok-locale-banner-dismissed";

export function LocaleBanner() {
  const params = useParams();
  const pathname = usePathname();
  const [target, setTarget] = useState<Locale | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch { /* localStorage 접근 불가 시 무시 */ }
    const langParam = typeof params.lang === "string" ? params.lang : "";
    const current: Locale = isLocale(langParam) ? langParam : DEFAULT_LOCALE;
    const nav = (navigator.language || "").slice(0, 2).toLowerCase();
    // 공개된 로케일 중에서만 제안(비공개 언어는 링크가 404라 제안하지 않음)
    const want = LOCALES.find((l) => l === nav);
    if (!want || want === current) return;
    setTarget(want);
  }, [params.lang, pathname]);

  if (!target) return null;

  const langParam = typeof params.lang === "string" ? params.lang : "";
  const current: Locale = isLocale(langParam) ? langParam : DEFAULT_LOCALE;
  const bare = current === DEFAULT_LOCALE
    ? (pathname || "/")
    : (pathname.replace(new RegExp(`^/${current}(?=/|$)`), "") || "/");
  const href = localeHref(target, bare);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* 무시 */ }
    setTarget(null);
  };

  return (
    <div
      role="region"
      aria-label={CTA[target]}
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--line)",
        color: "var(--muted)",
        fontSize: 14,
      }}
    >
      <div style={{ maxWidth: "var(--w-wide)", margin: "0 auto", padding: "8px var(--gutter)", display: "flex", alignItems: "center", gap: 12 }}>
        <span aria-hidden style={{ flex: "0 0 auto" }}>🌐</span>
        <a href={href} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>
          {CTA[target]} →
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
