"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { getMarket } from "@/lib/i18n/markets";
import { getFormatter } from "@/lib/i18n/format";
import { tickerDesc } from "@/lib/i18n/tickerNames";
import { tickerInfo, tickerTitle } from "@/lib/tickers";
import {
  loadWebRows,
  loadWebCpi,
  type WebPlan,
  type WebCalculation,
} from "@/lib/web-calculator";
import {
  compareWebEtf,
  webComparisonWindow,
  comparisonGroup,
  COMPARISON_GROUPS,
  COMPARISON_TICKERS,
  type ComparisonRow,
  type ComparisonWindow,
} from "@/lib/web-comparison";
import "./compare.css";

const COPY = {
  ko: {
    back: "결과로 돌아가기",
    eyebrow: "ETF 바꿔보기",
    title: "같은 기간,\n다른 ETF였다면?",
    intro: "기간과 금액은 그대로, ETF만 바꿔 봐요.",
    loading: "같은 조건으로 계산 중…",
    error: "데이터를 불러오지 못했어요",
    retry: "다시 시도하기",
    empty: "비교할 기간의 자료가 없어요",
    conditions: "비교 조건",
    freq: { monthly: "매달", weekly: "매주", daily: "거래일마다" },
    total: "합계",
    initial: "처음 넣은 돈",
    baseline: "원래 조건의 평가액",
    combined: "합계 금액을 ETF 하나에 넣었다고 계산해요.",
    sort: "보기 순서",
    desc: "평가액 높은 순",
    asc: "평가액 낮은 순",
    type: "유형별",
    actual: "실제 거래 자료로 계산한 결과",
    estimated: "추정 자료를 포함한 결과",
    unavailable: "비교할 자료가 부족한 ETF",
    estimateNote:
      "상장 전 구간을 다른 ETF·지수로 채웠어요. 해당 ETF를 실제로 거래한 결과는 아니에요.",
    badge: "추정 포함",
    value: "마지막 평가액",
    estimateValue: "추정 포함 평가액",
    principal: "넣은 돈",
    shortage: "이 기간을 채울 거래 자료나 추정 자료가 부족해요.",
    held: "보유 자료",
    risk: "레버리지 ETF는 손실도 크게 늘어날 수 있어요.",
    asOf: "종가 기준일",
    source: "계산에 사용한 추정 자료",
    prices: "가격 자료",
    fx: "매수 당시 환율을 반영했어요. 환율이 없는 날은 직전 값을 써요.",
    nofx: "미국 달러로 계산했어요. 환전은 반영하지 않았어요.",
    limits: "보수·배당·운용 방식의 차이는 반영하지 못해요.",
    reinvest: "받은 배당으로 같은 ETF를 다시 샀다고 계산했어요.",
    noReinvest: "배당은 계산에 넣지 않았어요.",
    tax: "선택한 세금 조건을 반영했어요. 수수료는 계산에 넣지 않았어요.",
    noTax: "세금·수수료는 계산에 넣지 않았어요.",
    inflation: "원래 계산과 같은 물가연동 적립 조건을 적용했어요.",
    disclaimer:
      "과거 자료로 계산한 결과예요. 특정 종목을 추천하거나 미래 수익을 보장하지 않아요.",
    groups: ["지수", "배당", "섹터·테마", "채권·금", "국내 상장", "레버리지"],
  },
  en: {
    back: "Back to results",
    eyebrow: "Compare ETFs",
    title: "Same period.\nWhat if the ETF changed?",
    intro: "Keep the dates and contribution, and change only the ETF.",
    loading: "Calculating with the same conditions…",
    error: "We couldn’t load the data.",
    retry: "Try again",
    empty: "No data for this comparison period.",
    conditions: "Comparison conditions",
    freq: { monthly: "Monthly", weekly: "Weekly", daily: "Each trading day" },
    total: "Total",
    initial: "Initial deposit",
    baseline: "Original ending value",
    combined: "The full combined contribution is invested in one ETF.",
    sort: "Display order",
    desc: "Ending value: high to low",
    asc: "Ending value: low to high",
    type: "By type",
    actual: "Results using actual trading history",
    estimated: "Results including estimated history",
    unavailable: "ETFs without enough history",
    estimateNote:
      "Before listing, another ETF or index fills the history. These are not actual trades in this ETF.",
    badge: "Includes estimates",
    value: "Ending value",
    estimateValue: "Value including estimates",
    principal: "Contributed",
    shortage: "Actual and estimated data cannot cover the full period.",
    held: "Available history",
    risk: "Leveraged ETFs can magnify losses.",
    asOf: "Closing price date",
    source: "Estimated data used",
    prices: "Price history",
    fx: "Exchange rates at purchase are included. Missing dates use the previous available rate.",
    nofx: "Calculated in US dollars without currency conversion.",
    limits: "Differences in fees, dividends and management are not reflected.",
    reinvest: "Dividends are reinvested in the same ETF.",
    noReinvest: "Dividends are excluded.",
    tax: "Your selected tax setting is applied. Trading fees are excluded.",
    noTax: "Taxes and trading fees are excluded.",
    inflation:
      "The original inflation-linked contribution setting is preserved.",
    disclaimer:
      "Historical simulation only. This does not recommend any ETF or guarantee future returns.",
    groups: [
      "Index",
      "Dividends",
      "Sectors & themes",
      "Bonds & gold",
      "Listed in Korea",
      "Leveraged",
    ],
  },
  ja: {
    back: "結果に戻る",
    eyebrow: "ETFを比べる",
    title: "同じ期間に、\n別のETFを買っていたら？",
    intro: "期間と積立額を変えずに、ETFだけを替えて計算します。",
    loading: "同じ条件で計算しています…",
    error: "データを読み込めませんでした。",
    retry: "再試行",
    empty: "比較する期間のデータがありません。",
    conditions: "比較条件",
    freq: { monthly: "毎月", weekly: "毎週", daily: "取引日ごと" },
    total: "合計",
    initial: "最初に入れたお金",
    baseline: "元の条件での評価額",
    combined: "合計の積立額を1つのETFに投じたものとして計算します。",
    sort: "表示順",
    desc: "評価額が高い順",
    asc: "評価額が低い順",
    type: "種類別",
    actual: "実際の取引データによる結果",
    estimated: "推定データを含む結果",
    unavailable: "比較データが不足しているETF",
    estimateNote:
      "上場前の期間は別のETF・指数で補っています。このETFの実際の取引結果ではありません。",
    badge: "推定を含む",
    value: "最後の評価額",
    estimateValue: "推定を含む評価額",
    principal: "入れたお金",
    shortage: "実際のデータと推定データでは期間全体を計算できません。",
    held: "利用可能な期間",
    risk: "レバレッジETFは損失も大きくなる可能性があります。",
    asOf: "終値の基準日",
    source: "計算に使った推定データ",
    prices: "価格データ",
    fx: "購入時の為替を反映しています。データがない日は直前の値を使います。",
    nofx: "米ドルで計算し、為替換算は行っていません。",
    limits: "信託報酬・配当・運用方法の違いは反映できません。",
    reinvest: "配当で同じETFを買い増すものとして計算しました。",
    noReinvest: "配当は含めていません。",
    tax: "選択した税金の条件を反映しています。手数料は含めていません。",
    noTax: "税金・手数料は含めていません。",
    inflation: "元の計算と同じ物価連動の積立条件を使っています。",
    disclaimer:
      "過去のデータによるシミュレーションです。特定のETFを推奨したり、将来の利益を保証したりするものではありません。",
    groups: [
      "指数",
      "配当",
      "セクター・テーマ",
      "債券・金",
      "韓国上場",
      "レバレッジ",
    ],
  },
  de: {
    back: "Zurück zum Ergebnis",
    eyebrow: "ETFs vergleichen",
    title: "Gleicher Zeitraum.\nWas wäre mit einem anderen ETF?",
    intro: "Zeitraum und Sparrate bleiben gleich. Nur der ETF ändert sich.",
    loading: "Berechnung mit denselben Bedingungen…",
    error: "Die Daten konnten nicht geladen werden.",
    retry: "Erneut versuchen",
    empty: "Für diesen Vergleichszeitraum fehlen Daten.",
    conditions: "Vergleichsbedingungen",
    freq: {
      monthly: "Monatlich",
      weekly: "Wöchentlich",
      daily: "Je Handelstag",
    },
    total: "Gesamt",
    initial: "Anfangsbetrag",
    baseline: "Endwert der ursprünglichen Auswahl",
    combined: "Die gesamte Sparrate wird in einen einzelnen ETF investiert.",
    sort: "Anzeigereihenfolge",
    desc: "Endwert: absteigend",
    asc: "Endwert: aufsteigend",
    type: "Nach Typ",
    actual: "Ergebnisse mit tatsächlichen Kursdaten",
    estimated: "Ergebnisse mit geschätzten Daten",
    unavailable: "ETFs mit unzureichenden Daten",
    estimateNote:
      "Vor der Auflegung ergänzen andere ETFs oder Indizes die Daten. Dies sind keine tatsächlichen Handelsdaten dieses ETFs.",
    badge: "Enthält Schätzungen",
    value: "Endwert",
    estimateValue: "Endwert mit Schätzungen",
    principal: "Eingezahlt",
    shortage:
      "Tatsächliche und geschätzte Daten decken den Zeitraum nicht vollständig ab.",
    held: "Verfügbare Daten",
    risk: "Gehebelte ETFs können Verluste verstärken.",
    asOf: "Schlusskurs vom",
    source: "Verwendete Schätzdaten",
    prices: "Kursdaten",
    fx: "Wechselkurse zum Kaufzeitpunkt werden berücksichtigt. Fehlt ein Kurs, gilt der letzte verfügbare Wert.",
    nofx: "In US-Dollar berechnet, ohne Währungsumrechnung.",
    limits:
      "Unterschiede bei Gebühren, Ausschüttungen und Verwaltung werden nicht abgebildet.",
    reinvest: "Ausschüttungen werden in denselben ETF reinvestiert.",
    noReinvest: "Ausschüttungen sind nicht enthalten.",
    tax: "Die gewählte Steuereinstellung gilt. Handelsgebühren sind nicht enthalten.",
    noTax: "Steuern und Handelsgebühren sind nicht enthalten.",
    inflation:
      "Die ursprüngliche inflationsgebundene Sparrate bleibt erhalten.",
    disclaimer:
      "Simulation mit historischen Daten. Keine Empfehlung für einen ETF und keine Garantie für künftige Erträge.",
    groups: [
      "Index",
      "Dividenden",
      "Branchen & Themen",
      "Anleihen & Gold",
      "In Korea notiert",
      "Gehebelt",
    ],
  },
};

type State =
  | { status: "loading" | "error" | "empty" }
  | { status: "ready"; window: ComparisonWindow; rows: ComparisonRow[] };
type Sort = "desc" | "asc" | "type";
export function CalculatorCompare({
  locale,
  plan,
  calculation,
  onBack,
}: {
  locale: Locale;
  plan: WebPlan;
  calculation: WebCalculation;
  onBack: () => void;
}) {
  const text = COPY[locale],
    fmt = getFormatter(locale);
  const [state, setState] = useState<State>({ status: "loading" });
  const [retry, setRetry] = useState(0);
  const [sort, setSort] = useState<Sort>("desc");
  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    void (async () => {
      try {
        const [baseline, cpi] = await Promise.all([
          Promise.all(
            plan.holdings.map((holding) => loadWebRows(holding.ticker, locale)),
          ),
          plan.infl ? loadWebCpi(locale) : Promise.resolve(undefined),
        ]);
        const window = webComparisonWindow(plan, calculation, baseline);
        if (!window) {
          if (active) setState({ status: "empty" });
          return;
        }
        const rows = await Promise.all(
          getMarket(locale).tickers.map(
            async (symbol): Promise<ComparisonRow> => {
              try {
                return compareWebEtf(
                  plan,
                  window,
                  symbol,
                  await loadWebRows(symbol, locale, { estimated: true }),
                  cpi,
                );
              } catch {
                return { symbol, status: "error" };
              }
            },
          ),
        );
        if (active) setState({ status: "ready", window, rows });
      } catch {
        if (active) setState({ status: "error" });
      }
    })();
    return () => {
      active = false;
    };
  }, [locale, plan, calculation, retry]);
  const sections: { id: string; label: string; rows: ComparisonRow[] }[] = [];
  if (state.status === "ready") {
    const ordered = (rows: ComparisonRow[]) =>
      [...rows].sort((a, b) => {
        if (sort === "type")
          return (
            COMPARISON_TICKERS.indexOf(a.symbol) -
            COMPARISON_TICKERS.indexOf(b.symbol)
          );
        return a.status === "available" && b.status === "available"
          ? sort === "desc"
            ? b.value - a.value
            : a.value - b.value
          : 0;
      });
    const actual = state.rows
      .filter((row) => row.status === "available" && !row.estimate)
      .sort(
        (a, b) =>
          COMPARISON_TICKERS.indexOf(a.symbol) -
          COMPARISON_TICKERS.indexOf(b.symbol),
      );
    if (sort === "type")
      COMPARISON_GROUPS.forEach((id, index) =>
        sections.push({
          id,
          label: text.groups[index],
          rows: actual.filter((row) => comparisonGroup(row.symbol) === id),
        }),
      );
    else
      sections.push({
        id: "actual",
        label: text.actual,
        rows: ordered(actual),
      });
    sections.push({
      id: "estimated",
      label: text.estimated,
      rows: ordered(
        state.rows.filter((row) => row.status === "available" && row.estimate),
      ),
    });
    sections.push({
      id: "unavailable",
      label: text.unavailable,
      rows: state.rows.filter((row) => row.status !== "available"),
    });
  }
  return (
    <div className="web-compare" lang={locale}>
      <button className="web-compare-back" type="button" onClick={onBack}>
        ← {text.back}
      </button>
      <header className="web-compare-hero">
        <p>{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <div>{text.intro}</div>
      </header>
      {state.status === "loading" && (
        <p className="web-compare-state" role="status">
          {text.loading}
        </p>
      )}
      {state.status === "error" && (
        <div className="web-compare-state" role="alert">
          <p>{text.error}</p>
          <button type="button" onClick={() => setRetry((n) => n + 1)}>
            {text.retry}
          </button>
        </div>
      )}
      {state.status === "empty" && (
        <p className="web-compare-state">{text.empty}</p>
      )}
      {state.status === "ready" && (
        <>
          <section className="web-compare-window" aria-label={text.conditions}>
            <p>
              {fmt.ymd(state.window.anchor)} — {fmt.ymd(state.window.end)}
            </p>
            <strong>
              {text.freq[plan.freq]}{" "}
              {plan.holdings.length > 1 && `${text.total} `}
              {fmt.amount(state.window.contribution)}
            </strong>
            {plan.lump > 0 && (
              <p>
                {text.initial} · {fmt.amount(plan.lump)}
              </p>
            )}
            <p>
              {text.baseline} <b>{fmt.money(calculation.result.value)}</b>
            </p>
            {plan.holdings.length > 1 && <p>{text.combined}</p>}
          </section>
          <div className="web-compare-sort">
            <label htmlFor="web-comparison-sort">{text.sort}</label>
            <select
              id="web-comparison-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
            >
              <option value="desc">{text.desc}</option>
              <option value="asc">{text.asc}</option>
              <option value="type">{text.type}</option>
            </select>
          </div>
          {sort === "type" && (
            <p className="web-compare-explanation">{text.actual}</p>
          )}
          {sections
            .filter((section) => section.rows.length)
            .map((section) => (
              <section
                className="web-compare-section"
                key={section.id}
                aria-label={section.label}
              >
                <h2>{section.label}</h2>
                {section.id === "estimated" && (
                  <p className="web-compare-explanation">{text.estimateNote}</p>
                )}
                <ul>
                  {section.rows.map((row) => (
                    <li key={row.symbol} className="web-compare-card">
                      <div className="web-compare-name">
                        <span
                          className="web-compare-avatar"
                          style={{
                            backgroundColor: tickerInfo(row.symbol).color,
                          }}
                          aria-hidden="true"
                        >
                          {tickerInfo(row.symbol).short ?? row.symbol}
                        </span>
                        <div>
                          <h3>{tickerTitle(row.symbol)}</h3>
                          <p>{tickerDesc(row.symbol, locale)}</p>
                        </div>
                      </div>
                      {comparisonGroup(row.symbol) === "leverage" && (
                        <p className="web-compare-risk">{text.risk}</p>
                      )}
                      {row.status === "available" ? (
                        <>
                          {row.estimate && (
                            <span className="web-compare-badge">
                              {text.badge}
                            </span>
                          )}
                          <dl>
                            <div>
                              <dt>
                                {row.estimate ? text.estimateValue : text.value}
                              </dt>
                              <dd>{fmt.money(row.value)}</dd>
                            </div>
                            <div>
                              <dt>{text.principal}</dt>
                              <dd>{fmt.money(row.principal)}</dd>
                            </div>
                          </dl>
                          {row.valuationDate !== state.window.end && (
                            <p className="web-compare-explanation">
                              {text.asOf}: {fmt.ymd(row.valuationDate)}
                            </p>
                          )}
                          {row.estimate && (
                            <div className="web-compare-source">
                              <p>
                                {text.source} ·{" "}
                                <b>
                                  {row.estimate.proxy === "^BXM"
                                    ? "CBOE S&P 500 BuyWrite Index (BXM)"
                                    : row.estimate.proxy}
                                </b>{" "}
                                {text.prices}
                              </p>
                              <p>
                                {fmt.ymd(row.estimate.from)} —{" "}
                                {fmt.ymd(row.estimate.to)}
                              </p>
                              <p>{locale === "en" ? text.nofx : text.fx}</p>
                              <p>{text.limits}</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="web-compare-unavailable">
                          {row.status === "error" ? (
                            text.error
                          ) : (
                            <>
                              {text.shortage}
                              <br />
                              {text.held}: {fmt.ymd(row.start)} —{" "}
                              {fmt.ymd(row.end)}
                            </>
                          )}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          {state.rows.some((row) => row.status === "error") && (
            <button
              className="web-compare-retry"
              type="button"
              onClick={() => setRetry((n) => n + 1)}
            >
              {text.retry}
            </button>
          )}
          <p className="web-compare-disc">
            {plan.reinvest ? text.reinvest : text.noReinvest}
            <br />
            {plan.tax ? text.tax : text.noTax}
            {plan.infl && (
              <>
                <br />
                {text.inflation}
              </>
            )}
          </p>
        </>
      )}
      <p className="web-compare-disc">{text.disclaimer}</p>
    </div>
  );
}
