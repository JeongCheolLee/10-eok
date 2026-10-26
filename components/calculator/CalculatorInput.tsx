"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { getMarket } from "@/lib/i18n/markets";
import { getFormatter } from "@/lib/i18n/format";
import { getCalculatorCopy } from "@/lib/i18n/calculator";
import { tickerDesc } from "@/lib/i18n/tickerNames";
import { tickerInfo, tickerTitle } from "@/lib/tickers";
import type { WebPlan } from "@/lib/web-calculator";
import "./input.css";

type Frequency = WebPlan["freq"];
type Props = {
  locale: Locale;
  plan: WebPlan;
  onChange: (plan: WebPlan) => void;
  onCalculate: () => void;
  busy: boolean;
  error?: string | null;
  savedCount: number;
  onSaved: () => void;
};

function NumberField({
  id,
  label,
  value,
  unit,
  min,
  max,
  step,
  chips,
  format,
  invalid,
  onChange,
  onValidity,
}: {
  id: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  chips: number[];
  format: (n: number) => string;
  invalid: string;
  onChange: (n: number) => void;
  onValidity: (id: string, valid: boolean) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  const previous = useRef(value);
  useEffect(() => {
    if (previous.current !== value) {
      setDraft(String(value));
      previous.current = value;
    }
  }, [value]);
  const valid =
    draft.trim() !== "" &&
    /^\d+(?:\.\d+)?$/.test(draft) &&
    Number.isFinite(Number(draft)) &&
    Number(draft) >= min &&
    Number(draft) <= max;
  useEffect(() => {
    onValidity(id, valid);
    return () => onValidity(id, true);
  }, [id, valid, onValidity]);
  const update = (next: number) => {
    setDraft(String(next));
    onChange(next);
  };
  return (
    <div className="wc-number-field">
      <label htmlFor={id} className="wc-field-label">
        {label}
      </label>
      <div className="wc-number-line">
        <button
          type="button"
          className="wc-step"
          aria-label={`${label} − ${format(step)}`}
          onClick={() =>
            update(Math.max(min, (valid ? Number(draft) : value) - step))
          }
        >
          −
        </button>
        <div className="wc-number-value">
          <input
            id={id}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={draft}
            aria-invalid={!valid}
            aria-describedby={!valid ? `${id}-error` : undefined}
            onChange={(event) => {
              const next = event.target.value;
              setDraft(next);
              const n = Number(next);
              if (
                next.trim() !== "" &&
                /^\d+(?:\.\d+)?$/.test(next) &&
                Number.isFinite(n) &&
                n >= min &&
                n <= max
              )
                onChange(n);
            }}
          />
          <span>{unit}</span>
        </div>
        <button
          type="button"
          className="wc-step"
          aria-label={`${label} + ${format(step)}`}
          onClick={() =>
            update(Math.min(max, (valid ? Number(draft) : value) + step))
          }
        >
          +
        </button>
      </div>
      <div className="wc-chips">
        {chips.map((n) => (
          <button
            type="button"
            key={n}
            aria-pressed={valid && Number(draft) === n}
            onClick={() => update(n)}
          >
            {format(n)}
          </button>
        ))}
      </div>
      {!valid && (
        <p className="wc-error" id={`${id}-error`} role="status">
          {invalid} ({format(min)}–{format(max)})
        </p>
      )}
    </div>
  );
}

function TickerDialog({
  locale,
  current,
  taken,
  onPick,
  onClose,
}: {
  locale: Locale;
  current?: string;
  taken: string[];
  onPick: (symbol: string) => void;
  onClose: () => void;
}) {
  const copy = getCalculatorCopy(locale);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const element = dialog.current;
    element?.showModal();
    close.current?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = oldOverflow;
      if (previous?.isConnected) previous.focus();
      else document.querySelector<HTMLElement>(".wc-holding-pick")?.focus();
    };
  }, []);
  const order = [
    "SPY",
    "VOO",
    "QQQ",
    "VT",
    "SCHD",
    "JEPI",
    "JEPQ",
    "SOXX",
    "VGT",
    "VNQ",
    "TLT",
    "AGG",
    "GLD",
    "069500.KS",
    "QLD",
    "TQQQ",
  ];
  const symbols = [...getMarket(locale).tickers]
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .filter((symbol) =>
      `${symbol} ${tickerTitle(symbol)} ${tickerDesc(symbol, locale)}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
    );
  return (
    <dialog
      ref={dialog}
      className="wc-picker"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onClose();
          return;
        }
        if (event.key !== "Tab") return;
        const items = dialog.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input",
        );
        if (!items?.length) return;
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items[items.length - 1].focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === items[items.length - 1]
        ) {
          event.preventDefault();
          items[0].focus();
        }
      }}
    >
      <div className="wc-picker-inner">
        <header>
          <h2 id={titleId}>{copy.choose}</h2>
          <button
            type="button"
            ref={close}
            className="wc-close"
            aria-label={copy.close}
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <label className="wc-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.search}
            aria-label={copy.search}
          />
        </label>
        <div className="wc-picker-list">
          {symbols.map((symbol) => {
            const disabled = taken.includes(symbol) && symbol !== current;
            return (
              <button
                type="button"
                className="wc-ticker-option"
                key={symbol}
                disabled={disabled}
                aria-pressed={symbol === current}
                onClick={() => onPick(symbol)}
              >
                <span
                  className="wc-avatar"
                  style={{ backgroundColor: tickerInfo(symbol).color }}
                >
                  {tickerInfo(symbol).short ?? symbol}
                </span>
                <span>
                  <strong>{tickerTitle(symbol)}</strong>
                  <small>{tickerDesc(symbol, locale)}</small>
                  {["QLD", "TQQQ"].includes(symbol) && (
                    <small className="wc-risk">{copy.leverage}</small>
                  )}
                </span>
                {disabled ? (
                  <small>{copy.alreadySelected}</small>
                ) : (
                  <span aria-hidden="true">›</span>
                )}
              </button>
            );
          })}
          {!symbols.length && <p className="wc-no-results">{copy.noResults}</p>}
        </div>
      </div>
    </dialog>
  );
}

export default function CalculatorInput({
  locale,
  plan,
  onChange,
  onCalculate,
  busy,
  error,
  savedCount,
  onSaved,
}: Props) {
  const c = getCalculatorCopy(locale);
  const market = getMarket(locale);
  const fmt = getFormatter(locale);
  const [sheet, setSheet] = useState<number | null>(null);
  const [hasLump, setHasLump] = useState(plan.lump > 0);
  const rememberedLump = useRef(plan.lump);
  const [emptyAmounts, setEmptyAmounts] = useState<
    Partial<Record<Frequency, number>>
  >({});
  const amounts = useRef<Partial<Record<Frequency, Record<string, number>>>>(
    {},
  );
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  // Stable identity keeps child validation effects from re-running on each keystroke.
  const [reportValidity] = useState(
    () => (id: string, valid: boolean) =>
      setInvalid((fields) => {
        if (!!fields[id] === !valid) return fields;
        const next = { ...fields };
        if (valid) delete next[id];
        else next[id] = true;
        return next;
      }),
  );
  const set = (patch: Partial<WebPlan>) => onChange({ ...plan, ...patch });
  const goalInputUnit =
    locale === "en" || locale === "de" ? 1 : market.goal.unit;
  const goalInputScale = market.goal.unit / goalInputUnit;
  const base = market.monthly.default * market.monthly.unit;
  const defaultAmount = (freq: Frequency) =>
    Math.max(
      market.monthly.unit,
      Math.round(
        base /
          (freq === "monthly" ? 1 : freq === "weekly" ? 4 : 20) /
          market.monthly.unit,
      ) * market.monthly.unit,
    );
  const freqChange = (freq: Frequency) => {
    amounts.current[plan.freq] = Object.fromEntries(
      plan.holdings.map((h) => [h.ticker, h.amount]),
    );
    set({
      freq,
      holdings: plan.holdings.map((h) => ({
        ...h,
        amount: amounts.current[freq]?.[h.ticker] ?? defaultAmount(freq),
      })),
    });
  };
  const pick = (ticker: string) => {
    const holdings =
      sheet === -1 || !plan.holdings.length
        ? [
            ...plan.holdings,
            {
              ticker,
              amount: !plan.holdings.length
                ? (emptyAmounts[plan.freq] ?? defaultAmount(plan.freq))
                : defaultAmount(plan.freq),
            },
          ]
        : plan.holdings.map((h, i) => (i === sheet ? { ...h, ticker } : h));
    set({ holdings, mode: holdings.length > 1 ? "time" : plan.mode });
    setSheet(null);
  };
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const dateInvalid =
    plan.startDate !== undefined &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(plan.startDate) ||
      plan.startDate < "1990-01-01" ||
      plan.startDate > todayISO ||
      Number.isNaN(Date.parse(plan.startDate)) ||
      new Date(`${plan.startDate}T00:00:00Z`).toISOString().slice(0, 10) !==
        plan.startDate);
  const valid =
    plan.holdings.length > 0 &&
    !Object.values(invalid).some(Boolean) &&
    !dateInvalid &&
    (!hasLump || plan.lump > 0);
  const numberProps = { invalid: c.invalid, onValidity: reportValidity };
  const total = plan.holdings.reduce((sum, h) => sum + h.amount, 0);
  const contributionField = (index: number) => {
    const h = plan.holdings[index] ?? {
      ticker: "",
      amount: emptyAmounts[plan.freq] ?? defaultAmount(plan.freq),
    };
    const unit = market.monthly.unit;
    const step =
      plan.freq === "monthly"
        ? market.monthly.step
        : Math.max(
            1,
            Math.round(market.monthly.step / (plan.freq === "weekly" ? 4 : 20)),
          );
    const d = defaultAmount(plan.freq) / unit;
    const min =
      plan.freq === "monthly"
        ? market.monthly.min
        : Math.max(
            1,
            Math.floor(market.monthly.min / (plan.freq === "weekly" ? 4 : 20)),
          );
    return (
      <NumberField
        key={`amount-${index === 0 ? "first" : h.ticker}-${plan.freq}`}
        {...numberProps}
        id={`wc-amount-${index === 0 ? "first" : h.ticker}`}
        label={`${plan.holdings.length > 1 ? tickerTitle(h.ticker) + " · " : ""}${c.freq[plan.freq]} ${c.contribution}`}
        value={h.amount / unit}
        unit={market.monthly.unitLabel}
        min={min}
        max={market.monthly.max}
        step={step}
        chips={
          locale === "ko" && plan.freq === "monthly"
            ? [10, 50, 100, 200]
            : [0.5, 1, 2, 3]
                .map((n) => Math.max(min, Math.round(d * n)))
                .filter((n, i, list) => list.indexOf(n) === i)
        }
        format={(n) => fmt.unitAmount(n, market.monthly.unitLabel)}
        onChange={(amount) => {
          if (!plan.holdings.length) {
            setEmptyAmounts((previous) => ({
              ...previous,
              [plan.freq]: Math.round(amount * unit),
            }));
            return;
          }
          set({
            holdings: plan.holdings.map((item, i) =>
              i === index
                ? { ...item, amount: Math.round(amount * unit) }
                : item,
            ),
          });
        }}
      />
    );
  };
  return (
    <form
      className="wc-input"
      onSubmit={(event) => {
        event.preventDefault();
        if (valid && !busy) onCalculate();
      }}
    >
      <header className="wc-input-hero">
        <p>
          {plan.startDate !== undefined
            ? c.trackingEyebrow
            : plan.freq === "monthly"
              ? c.eyebrowMonthly
              : plan.freq === "weekly"
                ? c.eyebrowWeekly
                : c.eyebrowDaily}
        </p>
        <h1>
          {plan.startDate !== undefined ? (
            c.trackingHero
          ) : (
            <>
              <span className="wc-target-line">
                <strong>{fmt.milestone(plan.target)}</strong>
                <span>{c.targetSuffix}</span>
              </span>
              <span>{plan.mode === "amount" ? c.amountHero : c.hero}</span>
            </>
          )}
        </h1>
      </header>
      {savedCount > 0 && (
        <button type="button" className="wc-saved-link" onClick={onSaved}>
          <span>
            {c.savedTitle} <b>{savedCount}</b>
          </span>
          <span>{c.view} ›</span>
        </button>
      )}
      {plan.mode === "amount" && (
        <button
          type="button"
          className="wc-text-button"
          onClick={() => set({ mode: "time" })}
        >
          {c.autoStart}
        </button>
      )}
      <section className="wc-etfs" aria-labelledby="wc-etf-title">
        <h2 id="wc-etf-title">
          {plan.holdings.length ? c.selected : c.chooseQuestion}
        </h2>
        {!plan.holdings.length ? (
          <button
            type="button"
            className="wc-empty-select"
            aria-haspopup="dialog"
            onClick={() => setSheet(0)}
          >
            <span aria-hidden="true">+</span>
            {c.choose}
          </button>
        ) : (
          plan.holdings.map((h, i) => (
            <div key={h.ticker} className="wc-holding">
              <button
                type="button"
                className="wc-holding-pick"
                aria-haspopup="dialog"
                onClick={() => setSheet(i)}
              >
                <span
                  className="wc-avatar"
                  style={{ backgroundColor: tickerInfo(h.ticker).color }}
                >
                  {tickerInfo(h.ticker).short ?? h.ticker}
                </span>
                <span>
                  <strong>{tickerTitle(h.ticker)}</strong>
                  <small>{tickerDesc(h.ticker, locale)}</small>
                </span>
                <span className="wc-chevron" aria-hidden="true">
                  ›
                </span>
              </button>
              <button
                type="button"
                className="wc-remove"
                aria-label={`${tickerTitle(h.ticker)} ${c.remove}`}
                onClick={() =>
                  set({ holdings: plan.holdings.filter((_, j) => j !== i) })
                }
              >
                ×
              </button>
            </div>
          ))
        )}
        {plan.holdings.length > 0 && plan.holdings.length < 5 && (
          <button
            type="button"
            className="wc-add"
            aria-haspopup="dialog"
            onClick={() => setSheet(-1)}
          >
            ＋ {c.add}
          </button>
        )}
      </section>
      <section className="wc-primary" aria-labelledby="wc-primary-title">
        <h2 id="wc-primary-title">
          {plan.mode === "amount" ? c.cycleYears : c.cycleAmount}
        </h2>
        <div className="wc-frequency" role="group" aria-label={c.cycleAmount}>
          {(["monthly", "weekly", "daily"] as Frequency[]).map((freq) => (
            <button
              type="button"
              key={freq}
              aria-pressed={plan.freq === freq}
              onClick={() => freqChange(freq)}
            >
              {c.freq[freq]}
            </button>
          ))}
        </div>
        {plan.mode === "amount" ? (
          <NumberField
            {...numberProps}
            id="wc-years"
            label={c.years}
            value={plan.years}
            unit={c.yearsUnit}
            min={1}
            max={40}
            step={1}
            chips={[5, 10, 15, 20]}
            format={(n) => `${n} ${c.yearsUnit}`}
            onChange={(years) => set({ years })}
          />
        ) : plan.holdings.length ? (
          plan.holdings.map((_, i) => contributionField(i))
        ) : (
          [contributionField(0)]
        )}
        {plan.holdings.length > 1 && (
          <p className="wc-total">
            <span>
              {c.freq[plan.freq]} {c.total}
            </span>
            <strong>{fmt.amount(total)}</strong>
          </p>
        )}
      </section>
      <fieldset className="wc-lump">
        <legend>{c.lumpQuestion}</legend>
        <div className="wc-radio-group">
          {[false, true].map((enabled) => (
            <label key={String(enabled)}>
              <input
                type="radio"
                name="wc-lump"
                checked={hasLump === enabled}
                onChange={() => {
                  if (!enabled) rememberedLump.current = plan.lump;
                  setHasLump(enabled);
                  set({ lump: enabled ? rememberedLump.current : 0 });
                }}
              />
              <span>{enabled ? c.yes : c.no}</span>
            </label>
          ))}
        </div>
        {hasLump && (
          <>
            <p className="wc-help">{c.lumpHelp}</p>
            <NumberField
              {...numberProps}
              id="wc-lump-amount"
              label={c.lump}
              value={plan.lump / market.lump.unit}
              unit={market.lump.unitLabel}
              min={1}
              max={market.lump.max}
              step={market.lump.step}
              chips={[1, 3, 5, 10].map((n) => n * market.lump.step * 10)}
              format={(n) => fmt.unitAmount(n, market.lump.unitLabel)}
              onChange={(n) => {
                rememberedLump.current = Math.round(n * market.lump.unit);
                set({ lump: rememberedLump.current });
              }}
            />
          </>
        )}
      </fieldset>
      <div className="wc-schedule">
        {plan.freq !== "daily" && (
          <label>
            <span>{plan.freq === "monthly" ? c.day : c.weekday}</span>
            <select
              value={plan.freq === "monthly" ? plan.buyDay : plan.weekday}
              onChange={(event) =>
                plan.freq === "monthly"
                  ? set({ buyDay: Number(event.target.value) })
                  : set({
                      weekday: Number(event.target.value) as WebPlan["weekday"],
                    })
              }
            >
              {plan.freq === "monthly" ? (
                <>
                  {Array.from({ length: 28 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {locale === "ko"
                        ? `${i + 1}일`
                        : locale === "ja"
                          ? `${i + 1}日`
                          : i + 1}
                    </option>
                  ))}
                  <option value={29}>{c.monthEnd}</option>
                </>
              ) : (
                c.weekdays.map((day, i) => (
                  <option key={day} value={i + 1}>
                    {day}
                  </option>
                ))
              )}
            </select>
          </label>
        )}
        <p className="wc-help">
          {plan.freq === "daily" ? c.dailyHelp : c.scheduleHelp}
        </p>
      </div>
      {plan.startDate !== undefined && (
        <section className="wc-legacy">
          <label htmlFor="wc-start-date">{c.startDate}</label>
          <input
            id="wc-start-date"
            type="date"
            min="1990-01-01"
            max={todayISO}
            value={plan.startDate}
            aria-invalid={dateInvalid}
            onChange={(e) => set({ startDate: e.target.value })}
          />
          <p className="wc-help">{c.startHelp}</p>
          {dateInvalid && (
            <p className="wc-error" role="status">
              {c.invalidDate}
            </p>
          )}
          <button
            type="button"
            className="wc-text-button"
            onClick={() => set({ startDate: undefined, mode: "time" })}
          >
            {c.autoStart}
          </button>
        </section>
      )}
      <details className="wc-advanced">
        <summary>{c.advanced}</summary>
        <label className="wc-switch-row">
          <span>
            <strong>{c.reinvest}</strong>
            <small>{c.reinvestHelp}</small>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={plan.reinvest}
            onChange={(e) => set({ reinvest: e.target.checked })}
          />
        </label>
        {market.tax && (
          <label className="wc-switch-row">
            <span>
              <strong>{c.tax}</strong>
              <small>{c.taxHelp}</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={!!plan.tax}
              onChange={(e) => set({ tax: e.target.checked })}
            />
          </label>
        )}
        {market.cpiFile && (
          <label className="wc-switch-row">
            <span>
              <strong>{c.inflation}</strong>
              <small>{c.inflationHelp}</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={!!plan.infl}
              onChange={(e) => set({ infl: e.target.checked })}
            />
          </label>
        )}
        <NumberField
          {...numberProps}
          id="wc-target"
          label={c.target}
          value={plan.target / goalInputUnit}
          unit={market.goal.unitLabel}
          min={market.goal.min * goalInputScale}
          max={market.goal.max * goalInputScale}
          step={market.goal.step * goalInputScale}
          chips={[
            market.goal.default,
            market.goal.default * 2,
            market.goal.default * 5,
          ]
            .filter((n) => n <= market.goal.max)
            .map((n) => n * goalInputScale)}
          format={(n) => fmt.milestone(n * goalInputUnit)}
          onChange={(n) => set({ target: Math.round(n * goalInputUnit) })}
        />
      </details>
      {error && (
        <p className="wc-error" role="alert">
          {error}
        </p>
      )}
      <div className="wc-input-cta">
        <button
          type="submit"
          className="wc-calculate"
          disabled={!valid || busy}
        >
          {busy
            ? c.calculating
            : locale === "ko"
              ? `${fmt.milestone(plan.target)}까지 계산하기`
              : c.calculate}
        </button>
      </div>
      {sheet !== null && (
        <TickerDialog
          locale={locale}
          current={sheet >= 0 ? plan.holdings[sheet]?.ticker : undefined}
          taken={plan.holdings.map((h) => h.ticker)}
          onPick={pick}
          onClose={() => setSheet(null)}
        />
      )}
    </form>
  );
}

export { CalculatorInput };
