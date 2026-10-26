import { SOURCES, type SourceId } from "@/lib/sources";
import type { Locale } from "@/lib/i18n/locales";

const copy = {
  ko: { title: "데이터 · 출처", prices: "과거 가격", fx: "환율", fund: "운용사 상품 설명" },
  en: { title: "Data and sources", prices: "Historical prices", fx: "Exchange rates", fund: "Fund provider’s product information" },
  ja: { title: "データと出典", prices: "過去の価格", fx: "為替レート", fund: "運用会社の商品説明" },
  de: { title: "Daten und Quellen", prices: "Historische Kurse", fx: "Wechselkurse", fund: "Produktinformationen des Fondsanbieters" },
};
const symbols: Partial<Record<SourceId, string>> = {
  prosharesQld: "QLD · ProShares", prosharesTqqq: "TQQQ · ProShares",
  vanguardVoo: "VOO · Vanguard", schwabSchd: "SCHD · Schwab", vanguardVt: "VT · Vanguard",
};

/**
 * 글 하단의 데이터·출처 인용 블록 — YMYL(금융) 신뢰(E-E-A-T) 신호.
 * 페이지가 관련 출처 id만 골라 넘긴다. 실제 사용하는 출처만 인용한다.
 */
export function Sources({ ids, locale = "ko" }: { ids: SourceId[]; locale?: Locale }) {
  const t = copy[locale];
  const items = ids.map((id) => {
    const source = SOURCES[id];
    const label = locale === "ko" ? source.label
      : id === "yahoo" ? `${t.prices} · Yahoo Finance`
      : id.startsWith("fredFx") ? `${t.fx} · ${source.href.split("/").at(-1)} · FRED`
      : symbols[id] ? `${t.fund} · ${symbols[id]}` : source.label;
    return { ...source, label };
  });
  if (items.length === 0) return null;
  return (
    <aside className="sources" aria-label={t.title}>
      <p className="sources-label">{t.title}</p>
      <ul>
        {items.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener">{s.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
