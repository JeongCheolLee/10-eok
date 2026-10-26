"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalculatorInput } from "./calculator/CalculatorInput";
import { CalculatorCompare } from "./calculator/CalculatorCompare";
import { CalculatorChart } from "./calculator/CalculatorChart";
import { resultCopy } from "./calculator/result-copy";
import {
  calculateWebPlan,
  defaultWebPlan,
  loadWebRows,
  loadWebCpi,
  parseWebPlan,
  webPlanKey,
  webPlanQuery,
  type WebPlan,
  type WebCalculation,
} from "@/lib/web-calculator";
import { getFormatter } from "@/lib/i18n/format";
import { localeHref } from "@/lib/i18n/seo";
import type { Locale } from "@/lib/i18n/locales";
import type { Row } from "@/lib/backtest/types";
import { TickerLogo } from "./TickerLogo";
import "./calculator/calculator.css";

type Saved = { id: string; query: string; updatedAt: string };
type Screen = "input" | "result" | "saved" | "compare";
const storageKey = (locale: Locale) => `10eok-web-calculations-v1:${locale}`;
function readSaved(locale: Locale): Saved[] {
  try {
    const items = JSON.parse(localStorage.getItem(storageKey(locale)) || "[]");
    return Array.isArray(items)
      ? items
          .filter(
            (s: Saved) =>
              s &&
              typeof s.id === "string" &&
              typeof s.updatedAt === "string" &&
              typeof s.query === "string" &&
              parseWebPlan(new URLSearchParams(s.query), locale),
          )
          .slice(0, 100)
      : [];
  } catch {
    return [];
  }
}
function RollingNumber({ value }: { value: number }) {
  return (
    <span className="wc-rolling" aria-hidden="true">
      {String(value)
        .split("")
        .map((digit, index) => (
          <span className="wc-rolling-digit" key={index}>
            <span
              className="wc-rolling-track"
              style={
                {
                  "--end": `${-Number(digit) * 1.1}em`,
                  "--delay": `${index * 40}ms`,
                } as React.CSSProperties
              }
            >
              {Array.from({ length: Number(digit) + 1 }, (_, n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ))}
    </span>
  );
}

export function BacktestApp({
  locale,
  initialQuery = "",
  initialView = "result",
}: {
  locale: Locale;
  initialQuery?: string;
  initialView?: "result" | "compare";
}) {
  const t = resultCopy[locale],
    fmt = getFormatter(locale);
  const [plan, setPlan] = useState<WebPlan>(
    () =>
      parseWebPlan(new URLSearchParams(initialQuery), locale) ||
      defaultWebPlan(locale),
  );
  const [screen, setScreen] = useState<Screen>("input"),
    [calculation, setCalculation] = useState<WebCalculation | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null),
    [saved, setSaved] = useState<Saved[]>([]),
    [editing, setEditing] = useState(false),
    [notice, setNotice] = useState(""),
    [fallbackLink, setFallbackLink] = useState("");
  const request = useRef(0),
    header = useRef<HTMLDivElement>(null),
    lastAttempt = useRef<WebPlan | null>(null);
  const go = useCallback(
    (next: Screen, p?: WebPlan, replace = false) => {
      let query = "";
      if (p?.holdings.length) {
        try {
          query = webPlanQuery(p, locale);
        } catch {
          /* An invalid draft stays editable without a share URL. */
        }
      }
      const url = `${localeHref(locale, "/")}${query ? "?" + query : ""}#${next}`;
      window.history[replace ? "replaceState" : "pushState"]({}, "", url);
      setScreen(next);
      setNotice("");
      setFallbackLink("");
      window.scrollTo({ top: 0, behavior: "instant" });
      requestAnimationFrame(() =>
        header.current?.focus({ preventScroll: true }),
      );
    },
    [locale],
  );
  const compute = useCallback(
    async (
      p: WebPlan,
      next: "result" | "compare" = "result",
      updateUrl = true,
    ) => {
      const token = ++request.current;
      lastAttempt.current = p;
      setBusy(true);
      setError(null);
      setNotice("");
      try {
        const [entries, cpi] = await Promise.all([
          Promise.all(
            p.holdings.map(
              async (h) =>
                [h.ticker, await loadWebRows(h.ticker, locale)] as const,
            ),
          ),
          p.infl ? loadWebCpi(locale) : Promise.resolve(undefined),
        ]);
        if (token !== request.current) return;
        // Let the loading state paint before the CPU calculation, without an artificial delay.
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
        if (token !== request.current) return;
        const nextCalculation = calculateWebPlan(
          Object.fromEntries(entries) as Record<string, Row[]>,
          p,
          locale,
          { cpi },
        );
        if (!nextCalculation.result.series.length)
          throw new Error("NO_PURCHASES");
        setCalculation(nextCalculation);
        setPlan(p);
        if (updateUrl) go(next, p);
        else setScreen(next);
      } catch (cause) {
        if (token === request.current)
          setError(
            cause instanceof Error && cause.message === "NO_PURCHASES"
              ? t.noPurchases
              : t.error,
          );
      } finally {
        if (token === request.current) setBusy(false);
      }
    },
    [locale, go, t.error, t.noPurchases],
  );
  useEffect(() => {
    setSaved(readSaved(locale));
    const restore = () => {
      ++request.current;
      setBusy(false);
      setError(null);
      const hash = window.location.hash.slice(1),
        p = parseWebPlan(new URLSearchParams(window.location.search), locale);
      if (hash === "saved") {
        setSaved(readSaved(locale));
        setScreen("saved");
        return;
      }
      if (hash === "input") {
        if (p) setPlan(p);
        setScreen("input");
        return;
      }
      if (p)
        void compute(
          p,
          hash === "compare"
            ? "compare"
            : hash === "result"
              ? "result"
              : initialView,
          false,
        );
      else setScreen("input");
    };
    restore();
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    const sync = () => setSaved(readSaved(locale));
    window.addEventListener("storage", sync);
    return () => {
      ++request.current;
      window.removeEventListener("popstate", restore);
      window.removeEventListener("hashchange", restore);
      window.removeEventListener("storage", sync);
    };
  }, [locale, initialView, compute]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  const save = () => {
    const query = webPlanQuery(plan, locale),
      key = webPlanKey(plan),
      items = readSaved(locale),
      existing = items.find((s) => {
        const p = parseWebPlan(new URLSearchParams(s.query), locale);
        return p && webPlanKey(p) === key;
      });
    const item = {
        id: existing?.id ?? (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`),
        query,
        updatedAt: new Date().toISOString(),
      },
      next = [item, ...items.filter((s) => s.id !== item.id)].slice(0, 100);
    try {
      localStorage.setItem(storageKey(locale), JSON.stringify(next));
      setSaved(next);
      setNotice(t.saved);
    } catch {
      setNotice(t.saveFail);
    }
  };
  const remove = (id: string) => {
    const next = readSaved(locale).filter((s) => s.id !== id);
    try {
      localStorage.setItem(storageKey(locale), JSON.stringify(next));
      setSaved(next);
    } catch {
      setNotice(t.saveFail);
    }
  };
  const share = async () => {
    const url = new URL(
      `${localeHref(locale, "/")}?${webPlanQuery(plan, locale)}#result`,
      window.location.origin,
    ).href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "10-eok",
          text: plan.holdings.map((h) => h.ticker).join(" · "),
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNotice(t.copied);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setFallbackLink(url);
      setNotice(t.copyFail);
    }
  };
  const frequency = t[plan.freq],
    goal = fmt.milestone(plan.target),
    r = calculation?.result,
    last = r?.series.at(-1)?.date;
  return (
    <main className="wc-app" data-screen={screen} aria-busy={busy}>
      <div ref={header} tabIndex={-1} className="wc-focus-target" />
      {screen === "input" && (
        <CalculatorInput
          locale={locale}
          plan={plan}
          onChange={setPlan}
          onCalculate={() => void compute(plan, "result")}
          busy={busy}
          error={error}
          savedCount={saved.length}
          onSaved={() => go("saved")}
        />
      )}
      {screen !== "input" && busy && (
        <div className="wc-loading" role="status">
          <span className="wc-spinner" />
          {t.loading}
        </div>
      )}
      {screen !== "input" && error && (
        <div className="wc-error" role="alert">
          {error}
          <button
            className="wc-button"
            onClick={() =>
              lastAttempt.current &&
              void compute(
                lastAttempt.current,
                screen === "compare" ? "compare" : "result",
              )
            }
          >
            {t.retry}
          </button>
          <button className="wc-text-button" onClick={() => go("input", plan)}>
            {t.edit}
          </button>
        </div>
      )}
      {!busy && !error && screen === "compare" && calculation && (
        <CalculatorCompare
          locale={locale}
          plan={plan}
          calculation={calculation}
          onBack={() => go("result", plan)}
        />
      )}
      {screen === "saved" && !busy && (
        <section className="wc-saved">
          <button className="wc-back" onClick={() => go("input", plan)}>
            ‹ {t.back}
          </button>
          <div className="wc-section-head">
            <h1>{t.savedTitle}</h1>
            {saved.length > 0 && (
              <button
                className="wc-text-button"
                onClick={() => setEditing((v) => !v)}
              >
                {editing ? t.done : t.manage}
              </button>
            )}
          </div>
          <p className="wc-muted">{t.local}</p>
          {!saved.length && (
            <div className="wc-empty">
              <h2>{t.empty}</h2>
              <p>{t.emptyHelp}</p>
              <button className="wc-button" onClick={() => go("input", plan)}>
                {t.start}
              </button>
            </div>
          )}
          <div className="wc-saved-list">
            {saved.map((item) => {
              const p = parseWebPlan(new URLSearchParams(item.query), locale)!;
              return (
                <article className="wc-saved-card" key={item.id}>
                  <button
                    className="wc-saved-open"
                    onClick={() => void compute(p)}
                  >
                    <span className="wc-saved-symbols">
                      {p.holdings.map((h) => (
                        <TickerLogo
                          key={h.ticker}
                          symbol={h.ticker}
                          size={32}
                        />
                      ))}
                    </span>
                    <strong>
                      {p.holdings.map((h) => h.ticker).join(" · ")}
                    </strong>
                    <span>
                      {p.mode === "amount"
                        ? `${p.years}${t.years} · ${fmt.milestone(p.target)}`
                        : `${t[p.freq]} ${fmt.amount(p.holdings.reduce((sum, h) => sum + h.amount, 0))}`}
                    </span>
                    {p.mode !== "amount" && (
                      <small>
                        {fmt.milestone(p.target)} ·{" "}
                        {p.startDate ? fmt.ymd(p.startDate) : t.basis}
                      </small>
                    )}
                    {p.lump > 0 && (
                      <span>
                        {t.initialMoney} {fmt.amount(p.lump)}
                      </span>
                    )}
                    <small>{p.reinvest ? t.reinvest : t.noReinvest}</small>
                    <span className="wc-card-arrow" aria-hidden>
                      ›
                    </span>
                  </button>
                  {editing && (
                    <button
                      className="wc-delete"
                      onClick={() => remove(item.id)}
                      aria-label={`${p.holdings.map((h) => h.ticker).join(" ")} ${t.delete}`}
                    >
                      {t.delete}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
      {!busy && !error && screen === "result" && calculation && r && last && (
        <section className="wc-result" key={webPlanKey(plan)}>
          <button className="wc-back" onClick={() => go("input", plan)}>
            ‹ {t.edit}
          </button>
          <div className="wc-result-intro">
            <div className="wc-result-tickers">
              {plan.holdings.map((h) => (
                <span key={h.ticker}>
                  <TickerLogo symbol={h.ticker} size={28} />
                  {h.ticker}
                </span>
              ))}
            </div>
            <p>
              {t.condition(
                frequency,
                fmt.amount(calculation.contribution),
                plan.holdings.length > 1,
              )}
            </p>
            {plan.lump > 0 && (
              <small>
                {t.lump(
                  fmt.ymd(calculation.calculationStart),
                  fmt.amount(plan.lump),
                )}
              </small>
            )}
          </div>
          <div className="wc-result-hero">
            <p>
              {plan.mode === "amount"
                ? t.required
                : plan.startDate
                  ? t.end
                  : calculation.reach
                    ? t.first(goal)
                    : t.end}
            </p>
            {calculation.reach && !plan.startDate && plan.mode === "time" ? (
              <h1
                className="wc-duration"
                aria-label={`${r.years}${t.years} ${r.monthsRem}${t.months}`}
              >
                <span>
                  <RollingNumber value={r.years} />
                  <small>{t.years}</small>
                </span>
                <span>
                  <RollingNumber value={r.monthsRem} />
                  <small>{t.months}</small>
                </span>
              </h1>
            ) : (
              <h1 className="wc-value-hero">
                {plan.mode === "amount"
                  ? fmt.amount(calculation.contribution)
                  : fmt.money(r.value)}
              </h1>
            )}
            <p className="wc-hero-caption">
              {plan.mode === "amount"
                ? `${fmt.ymd(calculation.calculationStart)} — ${fmt.ymd(last)}`
                : plan.startDate
                  ? `${fmt.ymd(calculation.calculationStart)} — ${fmt.ymd(last)}`
                  : calculation.reach
                    ? t.period(
                        fmt.ym(calculation.calculationStart),
                        fmt.ymd(calculation.reach.date),
                      )
                    : t.missed(goal)}
            </p>
          </div>
          {calculation.reach && plan.mode === "time" && !plan.startDate && (
            <div className="wc-latest">
              <p>
                {t.continued} <strong>{fmt.money(r.value)}</strong>
              </p>
              <small>
                {t.date(fmt.ymd(last))}
                {r.value < plan.target ? ` · ${t.below(goal)}` : ""}
              </small>
            </div>
          )}
          {calculation.adjusted && <p className="wc-muted">{t.adjusted}</p>}
          <CalculatorChart
            locale={locale}
            calculation={calculation}
            plan={plan}
          />
          <div className="wc-result-actions">
            <button className="wc-button" onClick={() => void share()}>
              {t.share}
            </button>
            <button className="wc-button wc-secondary" onClick={save}>
              {t.save}
            </button>
          </div>
          {fallbackLink && (
            <label className="wc-link-fallback">
              {t.copyFail}
              <input
                aria-label={t.share}
                readOnly
                value={fallbackLink}
                onFocus={(e) => e.target.select()}
              />
            </label>
          )}
          {plan.holdings.length > 1 && calculation.holdings && (
            <div className="wc-breakdown">
              {calculation.holdings.map((h) => (
                <div key={h.ticker}>
                  <span>{h.ticker}</span>
                  <strong>{fmt.money(h.value)}</strong>
                </div>
              ))}
            </div>
          )}
          <div className="wc-result-links">
            <button onClick={() => go("input", plan)}>
              {t.edit}
              <span aria-hidden="true">›</span>
            </button>
            <button onClick={() => go("compare", plan)}>
              {t.compare}
              <span aria-hidden="true">›</span>
            </button>
            <button onClick={() => go("saved")}>
              {t.savedTitle}
              <span aria-hidden="true">›</span>
            </button>
          </div>
          <details className="wc-basis">
            <summary>
              {t.basis}
              <span aria-hidden>›</span>
            </summary>
            <div>
              {!plan.startDate && plan.mode === "time" && <p>{t.basisText}</p>}
              <dl>
                <dt>{t.range}</dt>
                <dd>
                  {fmt.ymd(calculation.calculationStart)} — {fmt.ymd(last)}
                </dd>
                <dt>{t.schedule}</dt>
                <dd>
                  {frequency} · {fmt.amount(calculation.contribution)}
                  {plan.freq === "monthly"
                    ? ` · ${plan.buyDay >= 29 ? t.monthEnd : t.day(plan.buyDay)}`
                    : plan.freq === "weekly"
                      ? ` · ${t.weekdays[plan.weekday - 1]}`
                      : ""}
                </dd>
              </dl>
              <p>
                {plan.reinvest ? t.reinvest : t.noReinvest}{" "}
                {plan.tax ? t.tax : t.fees}
              </p>
              {plan.infl && <p>{t.inflation}</p>}
              <p>{t.history}</p>
              <p>{t.sources}</p>
            </div>
          </details>
          <p className="wc-disclaimer">{t.disclaimer}</p>
        </section>
      )}
      {notice && (
        <div role="status" className="wc-toast">
          {notice}
        </div>
      )}
    </main>
  );
}
