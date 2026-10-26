/** Website adapter. Money is always expressed in the selected market's base currency. */
import { composeRows, type PxBundle, type FxBundle } from "./backtest/compose";
import { runBacktest, monthsBetween, lowerBound } from "./backtest/simulate";
import type { BacktestResult, Row, BuySchedule } from "./backtest/types";
import { getMarket } from "./i18n/markets";
import type { Locale } from "./i18n/locales";
import { tickerCurrency, tickerInfo, tickerTax } from "./tickers";

export type WebPlan = {
  holdings: { ticker: string; amount: number }[];
  freq: "monthly" | "weekly" | "daily";
  buyDay: number;
  weekday: 1 | 2 | 3 | 4 | 5;
  lump: number;
  target: number;
  reinvest: boolean;
  mode: "time" | "amount";
  years: number;
  startDate?: string;
  tax?: boolean;
  infl?: boolean;
};
export type WebHoldingResult = {
  ticker: string;
  amount: number;
  value: number;
  principal: number;
  cagr: number;
  dataStart: string;
  dataEnd: string;
};
export type WebCalculation = {
  result: BacktestResult;
  calculationStart: string;
  contribution: number;
  reach: { date: string; value: number; principal: number } | null;
  holdings: WebHoldingResult[];
  /** Ticker whose history moves a requested start forward. */
  adjusted?: string;
};
export type WebCpi = { ym: string; idx: number }[];
export const WEB_REAL_START: Record<string, string> = {
  QQQM: "2020-10-13",
  JEPI: "2020-05-21",
  "360750.KS": "2020-08-07",
  "458730.KS": "2023-06-20",
};

export function defaultWebPlan(locale: Locale): WebPlan {
  const m = getMarket(locale);
  return {
    holdings: [],
    freq: "monthly",
    buyDay: 1,
    weekday: 1,
    lump: 0,
    target: m.goal.default * m.goal.unit,
    reinvest: true,
    mode: "time",
    years: 10,
  };
}
async function json<T>(path: string): Promise<T> {
  const response = await fetch(`/data/${path}`);
  if (!response.ok)
    throw new Error(`Unable to load ${path}: ${response.status}`);
  return response.json() as Promise<T>;
}
export async function loadWebRows(
  ticker: string,
  locale: Locale,
  options: { estimated?: boolean } = {},
): Promise<Row[]> {
  const key = ticker.toUpperCase();
  if (!getMarket(locale).tickers.includes(key))
    throw new Error(`Unavailable ticker: ${key}`);
  const market = getMarket(locale);
  const [px, fx] = await Promise.all([
    json<PxBundle>(`px/${key.toLowerCase()}.json`),
    tickerCurrency(key) === market.currency || !market.fxFile
      ? Promise.resolve(null)
      : json<FxBundle>(market.fxFile),
  ]);
  const full = composeRows(px, fx);
  const boundary = WEB_REAL_START[key];
  if (tickerInfo(key).splice && !boundary)
    throw new Error(`Missing actual history boundary: ${key}`);
  const rows =
    !options.estimated && boundary
      ? full.filter((r) => r.date >= boundary)
      : full;
  if (!rows.length) throw new Error(`No trading history: ${key}`);
  return rows;
}
export async function loadWebCpi(locale: Locale): Promise<WebCpi> {
  const path = getMarket(locale).cpiFile;
  if (!path) throw new Error(`Inflation data unavailable: ${locale}`);
  const data = await json<{ series: [string, number][] }>(path);
  return data.series.map(([ym, idx]) => ({ ym, idx }));
}

/** Full series continues after first crossing. Tax is applied to each day's gains,
 * with the Korean overseas exemption shared across US holdings. */
export function calculateWebPlan(
  rowsBy: Record<string, Row[]>,
  plan: WebPlan,
  locale: Locale,
  options: { cpi?: WebCpi } = {},
): WebCalculation {
  validate(plan, locale);
  if (
    plan.infl &&
    (!options.cpi?.length ||
      options.cpi.some((p) => !Number.isFinite(p.idx) || p.idx <= 0))
  ) {
    throw new Error("Inflation-adjusted contributions require CPI data");
  }
  const rows = plan.holdings.map((h) => {
    const r = rowsBy[h.ticker];
    if (!r?.length) throw new Error(`No trading history: ${h.ticker}`);
    return r;
  });
  const commonStart = rows
    .map((r) => r[0].date)
    .sort()
    .at(-1)!;
  const end = rows.map((r) => r.at(-1)!.date).sort()[0];
  if (commonStart > end)
    throw new Error("Holdings have no shared trading period");
  const total = plan.holdings.reduce((a, h) => a + h.amount, 0);
  const weights = plan.holdings.map((h) => h.amount / total);
  const schedule: BuySchedule =
    plan.freq === "monthly"
      ? { kind: "monthly", day: plan.buyDay }
      : plan.freq === "weekly"
        ? { kind: "weekly", weekday: plan.weekday }
        : { kind: "daily" };
  const taxOn = (values: number[], principals: number[]) => {
    if (!plan.tax) return 0;
    let usGain = 0,
      domesticTax = 0;
    plan.holdings.forEach((h, i) => {
      const gain = values[i] - principals[i];
      if (tickerTax(h.ticker) === "us") usGain += gain;
      if (tickerTax(h.ticker) === "kr-foreign")
        domesticTax += 0.154 * Math.max(0, gain);
    });
    return 0.22 * Math.max(0, usGain - 2_500_000) + domesticTax;
  };
  const simulate = (requested: string, scale = 1): WebCalculation => {
    const start = requested > commonStart ? requested : commonStart;
    const parts = plan.holdings.map((h, i) =>
      runBacktest(rows[i], {
        monthly: h.amount * scale,
        initial: plan.lump * weights[i],
        schedule,
        buyDay: plan.buyDay,
        startDate: start,
        endDate: end,
        target: Infinity,
        reinvestDividends: plan.reinvest,
        cpi: plan.infl ? options.cpi : undefined,
      }),
    );
    const dates = [
      ...new Set(parts.flatMap((p) => p.series.map((s) => s.date))),
    ].sort();
    const pointers = parts.map(() => -1);
    const series = dates.map((date) => {
      const values: number[] = [],
        principals: number[] = [];
      parts.forEach((p, i) => {
        while (
          pointers[i] + 1 < p.series.length &&
          p.series[pointers[i] + 1].date <= date
        )
          pointers[i]++;
        const point = p.series[pointers[i]];
        values.push(point?.value ?? 0);
        principals.push(point?.principal ?? 0);
      });
      return {
        date,
        value: values.reduce((a, b) => a + b, 0) - taxOn(values, principals),
        principal: principals.reduce((a, b) => a + b, 0),
      };
    });
    const reach =
      series.find((p) => p.value >= plan.target * (1 - 1e-12)) ?? null;
    const last = series.at(-1);
    const months = series.length
      ? monthsBetween(series[0].date, reach?.date ?? last!.date)
      : 0;
    // Same buy-and-hold asset CAGR definition as the shared engine, weighted by contribution.
    const endMonths = series.length
      ? monthsBetween(series[0].date, last!.date)
      : 0;
    const growth = parts.reduce((sum, p, i) => {
      if (!p.series.length) return sum;
      const first = rows[i][lowerBound(rows[i], p.series[0].date)];
      const after = lowerBound(rows[i], end);
      const last =
        after < 0
          ? rows[i].at(-1)!
          : rows[i][rows[i][after].date === end ? after : after - 1];
      const assetValue = (r: Row) =>
        (plan.reinvest ? r.price : (r.raw ?? r.price)) * r.fx;
      return sum + (weights[i] * assetValue(last)) / assetValue(first);
    }, 0);
    const limited = rows.findIndex((r) => r[0].date === commonStart);
    return {
      result: {
        reached: !!reach,
        reachedDate: reach?.date ?? null,
        months,
        years: Math.floor(months / 12),
        monthsRem: months % 12,
        series,
        principal: last?.principal ?? 0,
        value: last?.value ?? 0,
        cagr: endMonths > 0 ? Math.pow(growth, 12 / endMonths) - 1 : 0,
      },
      calculationStart: start,
      contribution: total * scale,
      reach,
      holdings: parts.map((p, i) => ({
        ticker: plan.holdings[i].ticker,
        amount: plan.holdings[i].amount * scale,
        value: p.value,
        principal: p.principal,
        cagr: p.cagr,
        dataStart: rows[i][0].date,
        dataEnd: rows[i].at(-1)!.date,
      })),
      ...(commonStart > requested
        ? { adjusted: plan.holdings[limited].ticker }
        : {}),
    };
  };
  if (plan.mode === "amount") {
    const requested =
      plan.startDate ?? shiftMonths(end, -Math.round(plan.years * 12));
    let lo = 0,
      hi = 1;
    if (simulate(requested, 0).result.value >= plan.target)
      return simulate(requested, 0);
    while (simulate(requested, hi).result.value < plan.target && hi < 1e15)
      hi *= 2;
    if (simulate(requested, hi).result.value < plan.target)
      throw new Error("No purchases in the requested period");
    for (let i = 0; i < 70; i++) {
      const mid = (lo + hi) / 2;
      if (simulate(requested, mid).result.value >= plan.target) hi = mid;
      else lo = mid;
    }
    return simulate(requested, hi);
  }
  if (plan.startDate) return simulate(plan.startDate);
  const starts: string[] = [];
  for (
    let start = commonStart.slice(0, 7) + "-01";
    start <= end;
    start = shiftMonths(start, 1)
  )
    starts.push(start);
  let chosen = -1;
  if (plan.lump > 0 || plan.infl) {
    for (let i = starts.length - 1; i >= 0; i--)
      if (simulate(starts[i]).reach) {
        chosen = i;
        break;
      }
  } else {
    let lo = 0,
      hi = starts.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (simulate(starts[mid]).reach) {
        chosen = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
  }
  return simulate(starts[Math.max(0, chosen)]);
}
function shiftMonths(iso: string, offset: number): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + offset, 1)).toISOString().slice(0, 10);
}
function validDate(s: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(s) &&
    Number.isFinite(Date.parse(s)) &&
    new Date(s).toISOString().slice(0, 10) === s
  );
}
function validate(p: WebPlan, locale: Locale): void {
  const m = getMarket(locale);
  if (
    p.holdings.length < 1 ||
    p.holdings.length > 5 ||
    new Set(p.holdings.map((h) => h.ticker)).size !== p.holdings.length ||
    p.holdings.some(
      (h) =>
        !m.tickers.includes(h.ticker) ||
        !Number.isFinite(h.amount) ||
        h.amount <= 0 ||
        h.amount > m.monthly.max * m.monthly.unit,
    ) ||
    !["monthly", "weekly", "daily"].includes(p.freq) ||
    !Number.isInteger(p.buyDay) ||
    p.buyDay < 1 ||
    p.buyDay > 31 ||
    !Number.isInteger(p.weekday) ||
    p.weekday < 1 ||
    p.weekday > 5 ||
    !Number.isFinite(p.lump) ||
    p.lump < 0 ||
    p.lump > m.lump.max * m.lump.unit ||
    !Number.isFinite(p.target) ||
    p.target < m.goal.min * m.goal.unit ||
    p.target > m.goal.max * m.goal.unit ||
    !Number.isFinite(p.years) ||
    p.years < 1 ||
    p.years > 100 ||
    !["time", "amount"].includes(p.mode) ||
    typeof p.reinvest !== "boolean" ||
    (p.startDate !== undefined && !validDate(p.startDate)) ||
    (p.tax && !m.tax) ||
    (p.infl && !m.cpiFile)
  ) {
    throw new Error("Invalid website calculation conditions");
  }
}

/** h amounts use base currency. Legacy m/i/g retain market input units. */
export function webPlanQuery(plan: WebPlan, locale: Locale): string {
  validate(plan, locale);
  const m = getMarket(locale);
  const q = new URLSearchParams({
    h: plan.holdings.map((h) => `${h.ticker}:${h.amount}`).join(","),
    t: plan.holdings[0].ticker,
    m: String(plan.holdings[0].amount / m.monthly.unit),
    i: String(plan.lump / m.lump.unit),
    g: String(plan.target / m.goal.unit),
    d: String(plan.buyDay),
    f: plan.freq,
    wd: String(plan.weekday),
    mode: plan.mode === "amount" ? "amt" : "time",
    y: String(plan.years),
  });
  if (plan.startDate) q.set("s", plan.startDate);
  if (!plan.reinvest) q.set("div", "0");
  if (plan.tax) q.set("tax", "1");
  if (plan.infl) q.set("infl", "1");
  return q.toString();
}
export function parseWebPlan(
  query: URLSearchParams,
  locale: Locale,
): WebPlan | null {
  try {
    const m = getMarket(locale);
    const p = defaultWebPlan(locale);
    const number = (key: string, fallback: number) =>
      query.has(key) ? Number(query.get(key) || NaN) : fallback;
    p.mode =
      query.get("mode") === "amt" || query.get("mode") === "amount"
        ? "amount"
        : "time";
    if (
      query.has("mode") &&
      !["amt", "amount", "time"].includes(query.get("mode")!)
    )
      return null;
    p.holdings = query.has("h")
      ? query
          .get("h")!
          .split(",")
          .map((h) => {
            const pair = h.split(":");
            return {
              ticker: pair.length === 2 ? pair[0].toUpperCase() : "",
              amount: Number(pair[1] || NaN),
            };
          })
      : [
          {
            ticker: (query.get("t") ?? "").toUpperCase(),
            amount: number("m", m.monthly.default) * m.monthly.unit,
          },
        ];
    p.lump = number("i", 0) * m.lump.unit;
    p.target = number("g", m.goal.default) * m.goal.unit;
    p.buyDay = number("d", 1);
    p.weekday = number("wd", 1) as WebPlan["weekday"];
    p.freq = (query.get("f") ?? "monthly") as WebPlan["freq"];
    p.years = number("y", 10);
    p.reinvest = query.get("div") !== "0";
    p.tax = ["1", "true"].includes(query.get("tax") ?? "");
    p.infl = ["1", "true"].includes(query.get("infl") ?? "");
    if (query.has("s")) p.startDate = query.get("s")!;
    validate(p, locale);
    return p;
  } catch {
    return null;
  }
}
export function webPlanKey(plan: WebPlan): string {
  return JSON.stringify({
    holdings: [...plan.holdings].sort((a, b) =>
      a.ticker.localeCompare(b.ticker),
    ),
    freq: plan.freq,
    day:
      plan.freq === "monthly"
        ? plan.buyDay
        : plan.freq === "weekly"
          ? plan.weekday
          : null,
    lump: plan.lump,
    target: plan.target,
    reinvest: plan.reinvest,
    mode: plan.mode,
    years: plan.mode === "amount" ? plan.years : null,
    start: plan.startDate ?? null,
    tax: !!plan.tax,
    infl: !!plan.infl,
  });
}
