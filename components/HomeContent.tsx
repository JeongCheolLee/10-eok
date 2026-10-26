import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { localeHref } from "@/lib/i18n/seo";
const copy = {
  ko: {
    title: "꾸준히 모았다면, 결과는 어땠을까요?",
    body: "궁금한 ETF와 모으는 주기, 금액을 골라 과거 결과를 확인해요. 처음 목표를 넘은 시점과 이후 평가액을 나눠 보고, 같은 기간에 다른 ETF를 모았을 때와도 비교할 수 있어요.",
    links: ["계산 방법 알아보기", "ETF 가이드 읽기"],
  },
  en: {
    title: "What if you had kept investing?",
    body: "Choose ETFs, a saving frequency and an amount to explore historical results. See when you would first have crossed your target and the value afterward. Compare other ETFs over the same period.",
    links: ["How calculations work", "Explore ETF guides"],
  },
  ja: {
    title: "コツコツ積み立てていたら？",
    body: "ETF、積立頻度、金額を選んで、過去の結果を確認できます。初めて目標を超えた時点と、その後の評価額を分けて表示。同じ期間に別のETFを積み立てた場合も比較できます。",
    links: ["計算方法を見る", "ETFガイドを読む"],
  },
  de: {
    title: "Was wäre aus regelmäßigem Sparen geworden?",
    body: "Wähle ETFs, Sparrhythmus und Betrag und erkunde historische Ergebnisse. Sieh, wann das Ziel erstmals erreicht worden wäre und wie sich der Wert danach entwickelt hätte. Vergleiche andere ETFs im selben Zeitraum.",
    links: ["So wird gerechnet", "ETF-Ratgeber lesen"],
  },
};
export function HomeContent({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section className="home-editorial">
      <div className="content">
        <article className="prose">
          <h2>{t.title}</h2>
          <p>{t.body}</p>
          <div className="home-guide-links">
            <Link href={localeHref(locale, "/how-it-works")}>
              {t.links[0]} →
            </Link>
            <Link href={localeHref(locale, "/guides")}>{t.links[1]} →</Link>
          </div>
        </article>
      </div>
    </section>
  );
}
