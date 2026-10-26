"use client";
import { useId, useMemo, useState } from "react";
import type { WebCalculation, WebPlan } from "@/lib/web-calculator";
import type { Locale } from "@/lib/i18n/locales";
import { getFormatter } from "@/lib/i18n/format";
import { resultCopy } from "./result-copy";
export function CalculatorChart({
  calculation,
  plan,
  locale,
}: {
  calculation: WebCalculation;
  plan: WebPlan;
  locale: Locale;
}) {
  const t = resultCopy[locale],
    fmt = getFormatter(locale),
    id = useId().replace(/:/g, ""),
    [active, setActive] = useState<number | null>(null);
  const series = calculation.result.series;
  const pts = useMemo(() => {
    const step = Math.max(1, Math.floor(series.length / 180));
    return series.filter(
      (p, i) =>
        i % step === 0 ||
        i === series.length - 1 ||
        p.date === calculation.reach?.date,
    );
  }, [series, calculation.reach]);
  if (!pts.length) return null;
  const W = 600,
    H = 240,
    P = 12,
    max =
      Math.max(plan.target, ...pts.map((p) => Math.max(p.value, p.principal))) *
      1.12;
  const time = (s: string) => Date.parse(s + "T00:00:00Z"),
    first = time(pts[0].date),
    span = Math.max(1, time(pts.at(-1)!.date) - first);
  const x = (s: string) => P + ((time(s) - first) / span) * (W - 2 * P),
    y = (n: number) => H - P - (n / max) * (H - 2 * P);
  const path = (field: "value" | "principal") =>
    pts
      .map(
        (p, i) =>
          `${i ? "L" : "M"}${x(p.date).toFixed(1)},${y(p[field]).toFixed(1)}`,
      )
      .join(" ");
  const view =
    active === null ? pts.at(-1)! : pts[Math.min(active, pts.length - 1)];
  const hit = calculation.reach;
  return (
    <section className="wc-chart" aria-label={t.chart}>
      <div className="wc-chart-heading">
        <span>{t.chart}</span>
        <span>
          <i />
          {t.value} <i className="principal-dot" />
          {t.principal}
        </span>
      </div>
      <div className="wc-chart-readout">
        <span>{fmt.ymd(view.date)}</span>
        <strong>{fmt.money(view.value)}</strong>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${t.chart}: ${fmt.money(pts[0].value)} → ${fmt.money(pts.at(-1)!.value)}`}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#00a56b" stopOpacity=".18" />
            <stop offset="1" stopColor="#00a56b" stopOpacity=".02" />
          </linearGradient>
        </defs>
        {[0, plan.target / 2, plan.target].map((n) => (
          <g key={n}>
            <line
              x1={P}
              x2={W - P}
              y1={y(n)}
              y2={y(n)}
              stroke="#dce2e7"
              strokeDasharray={n === plan.target ? "5 5" : undefined}
            />
            {n === plan.target && (
              <text x={P + 6} y={y(n) - 9} fill="#6b7684" fontSize="13">
                {fmt.milestone(n)}
              </text>
            )}
          </g>
        ))}
        <path
          d={`${path("value")} L${x(pts.at(-1)!.date)},${H - P} L${P},${H - P} Z`}
          fill={`url(#${id})`}
        />
        <path
          d={path("principal")}
          fill="none"
          stroke="#8b95a1"
          strokeWidth="2"
        />
        <path
          className="wc-chart-line"
          d={path("value")}
          fill="none"
          stroke="#00a56b"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {hit && (
          <circle
            cx={x(hit.date)}
            cy={y(hit.value)}
            r="6"
            stroke="#008a59"
            strokeWidth="3"
            fill="white"
          >
            <title>
              {t.first(fmt.milestone(plan.target))}: {fmt.ymd(hit.date)}
            </title>
          </circle>
        )}
        <circle
          cx={x(view.date)}
          cy={y(view.value)}
          r="5"
          fill="#00a56b"
          stroke="white"
          strokeWidth="2"
        />
      </svg>
      <div className="wc-axis">
        <span>{fmt.ym(pts[0].date)}</span>
        <span>{fmt.ym(pts.at(-1)!.date)}</span>
      </div>
      <input
        className="wc-chart-slider"
        type="range"
        min="0"
        max={pts.length - 1}
        value={active ?? pts.length - 1}
        onChange={(e) => setActive(Number(e.target.value))}
        aria-label={t.chart}
        aria-valuetext={`${fmt.ymd(view.date)} ${fmt.money(view.value)}`}
      />
      <div className="wc-stats">
        <div>
          <span>{t.principal}</span>
          <strong>{fmt.money(calculation.result.principal)}</strong>
        </div>
        <div>
          <span>{t.value}</span>
          <strong>{fmt.money(calculation.result.value)}</strong>
        </div>
        <div>
          <span>
            {t.annual} <abbr title={t.annualHelp}>ⓘ</abbr>
          </span>
          <strong
            className={calculation.result.cagr >= 0 ? "wc-up" : "wc-down"}
          >
            {fmt.pct(calculation.result.cagr)}
          </strong>
        </div>
      </div>
    </section>
  );
}
