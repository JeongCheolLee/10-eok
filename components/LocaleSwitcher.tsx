"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { localeHref } from "@/lib/i18n/seo";

// 헤더 우상단 언어 스위처(클라이언트). 현재 경로(usePathname)에서 로케일 프리픽스를 떼고
// 각 로케일로 다시 붙여 "같은 페이지, 다른 언어" 링크를 만든다(리다이렉트 없음).
// 라벨은 자국어 표기(엔도님) — 어느 언어 화면에서든 동일하게 읽히도록.
const NATIVE: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  de: "Deutsch",
};

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // 현재 로케일 프리픽스를 뗀 순수 경로 (기본 로케일=ko는 프리픽스 없음)
  const bare = locale === DEFAULT_LOCALE
    ? (pathname || "/")
    : (pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/");

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden>🌐</span>
        <span className="lang-cur">{NATIVE[locale]}</span>
        <span className="lang-caret" aria-hidden>▾</span>
      </button>
      {open && (
        <div className="lang-menu" role="menu">
          {LOCALES.map((loc) => (
            <a
              key={loc}
              href={localeHref(loc, bare)}
              hrefLang={loc}
              role="menuitem"
              aria-current={loc === locale ? "true" : undefined}
              className={"lang-item" + (loc === locale ? " on" : "")}
            >
              {NATIVE[loc]}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
