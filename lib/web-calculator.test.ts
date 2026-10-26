import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { composeRows, type PxBundle } from "./backtest/compose";
import { runFirstReach } from "./backtest/simulate";
import type { Row } from "./backtest/types";
import {
  calculateWebPlan,
  defaultWebPlan,
  loadWebCpi,
  loadWebRows,
  parseWebPlan,
  webPlanKey,
  webPlanQuery,
  type WebPlan,
} from "./web-calculator";

const point = (date: string, price = 1): Row => ({
  date,
  price,
  fx: 1,
  raw: price,
});
const plan = (extra: Partial<WebPlan> = {}): WebPlan => ({
  ...defaultWebPlan("en"),
  holdings: [{ ticker: "QQQ", amount: 10_000 }],
  target: 100_000,
  ...extra,
});
afterEach(() => vi.unstubAllGlobals());

describe("website calculation", () => {
  it("keeps each market currency and starts with no selected ETF", () => {
    expect(
      ["ko", "en", "ja", "de"].map((l) => defaultWebPlan(l as "ko").target),
    ).toEqual([1e9, 1e6, 1e8, 1e6]);
    expect(defaultWebPlan("ko").holdings).toEqual([]);
  });
  it("finds the latest start that crossed once, even after a subsequent fall", () => {
    const rows = [
      point("2020-01-01"),
      point("2020-02-01", 20),
      point("2020-03-01"),
    ];
    const r = calculateWebPlan({ QQQ: rows }, plan(), "en");
    expect(r.calculationStart).toBe("2020-01-01");
    expect(r.reach).toEqual({
      date: "2020-02-01",
      value: 210_000,
      principal: 20_000,
    });
    expect(r.result.series.at(-1)?.date).toBe("2020-03-01");
    expect(r.result.value).toBe(20_500);
    expect(r.result.months).toBe(1);
  });
  it("matches shared first reach engine on the real QQQ history", () => {
    const px = JSON.parse(
      readFileSync("public/data/px/qqq.json", "utf8"),
    ) as PxBundle;
    const rows = composeRows(px, null);
    const p = plan({ holdings: [{ ticker: "QQQ", amount: 700 }], target: 1e6 });
    const actual = calculateWebPlan({ QQQ: rows }, p, "en");
    const oracle = runFirstReach(rows, {
      monthly: 700,
      buyDay: 1,
      target: 1e6,
    });
    expect(actual.result.reachedDate).toBe(oracle.reachedDate);
    expect(actual.result.months).toBe(oracle.months);
    expect(actual.result.value).toBeCloseTo(oracle.value, 6);
  });
  it("uses the common end and forwards values across different exchange calendars", () => {
    const r = calculateWebPlan(
      {
        QQQ: [point("2020-01-01"), point("2020-01-02"), point("2020-01-03")],
        SPY: [point("2020-01-02"), point("2020-01-04")],
      },
      plan({
        freq: "daily",
        holdings: [
          { ticker: "QQQ", amount: 100 },
          { ticker: "SPY", amount: 100 },
        ],
        startDate: "2020-01-01",
      }),
      "en",
    );
    expect(r.calculationStart).toBe("2020-01-02");
    expect(r.adjusted).toBe("SPY");
    expect(r.result.series).toEqual([
      { date: "2020-01-02", value: 200, principal: 200 },
      { date: "2020-01-03", value: 300, principal: 300 },
    ]);
  });
  it("uses actual asset growth for a holding whose elapsed months round to zero", () => {
    const r = calculateWebPlan(
      {
        QQQ: [point("2020-01-01"), point("2020-01-15"), point("2020-02-15")],
        SPY: [point("2020-01-01"), point("2020-01-31"), point("2020-02-15", 2)],
      },
      plan({
        holdings: [
          { ticker: "QQQ", amount: 100 },
          { ticker: "SPY", amount: 100 },
        ],
        buyDay: 15,
        startDate: "2020-01-01",
      }),
      "en",
    );
    // First basket purchase Jan 15, valuation Feb 15: one month. Second
    // holding still doubled even though Jan 31 → Feb 15 is zero full months.
    expect(r.result.cagr).toBeCloseTo(Math.pow(1.5, 12) - 1, 8);
  });
  it("preserves a requested weekly start date, and raw prices for dividends off", () => {
    const rows = [
      { ...point("2020-01-06", 10), raw: 10 },
      { ...point("2020-01-13", 20), raw: 10 },
    ];
    const p = plan({
      freq: "weekly",
      weekday: 1,
      startDate: "2020-01-05",
      reinvest: false,
    });
    const r = calculateWebPlan({ QQQ: rows }, p, "en");
    expect(r.result.value).toBe(20_000);
    expect(r.calculationStart).toBe("2020-01-06");
  });
  it("solves amount mode at period end while retaining the first crossing", () => {
    const rows = [
      point("2020-01-01"),
      point("2020-02-01", 20),
      point("2021-01-01"),
    ];
    const r = calculateWebPlan(
      { QQQ: rows },
      plan({ mode: "amount", years: 1 }),
      "en",
    );
    expect(r.contribution).toBeCloseTo(100_000 / 12.05, 7);
    expect(r.result.value).toBeCloseTo(100_000, 6);
    expect(r.reach?.date).toBe("2020-02-01");
  });
  it("shares the US tax exemption across holdings and reflects tax in reach", () => {
    const rows = [point("2020-01-01"), point("2020-02-01", 100)];
    const p = {
      ...defaultWebPlan("ko"),
      holdings: [
        { ticker: "QQQ", amount: 1e6 },
        { ticker: "SPY", amount: 1e6 },
      ],
      startDate: "2020-01-01",
      tax: true,
    };
    const r = calculateWebPlan({ QQQ: rows, SPY: rows }, p, "ko");
    expect(r.result.value).toBe(202e6 - 0.22 * (198e6 - 2.5e6));
    expect(r.result.series.at(-1)?.value).toBe(r.result.value);
  });
  it("uses CPI for contribution growth and fails explicitly if not loaded", () => {
    const p = plan({ infl: true, startDate: "2020-01-01" });
    const rows = [point("2020-01-01"), point("2020-02-01")];
    expect(() => calculateWebPlan({ QQQ: rows }, p, "en")).toThrow(
      "require CPI",
    );
    const r = calculateWebPlan({ QQQ: rows }, p, "en", {
      cpi: [
        { ym: "2020-01", idx: 100 },
        { ym: "2020-02", idx: 110 },
      ],
    });
    expect(r.result.principal).toBe(21_000);
  });
  it("rejects empty, duplicate, unavailable and non-overlapping histories", () => {
    expect(() => calculateWebPlan({}, defaultWebPlan("en"), "en")).toThrow();
    expect(() =>
      calculateWebPlan(
        {},
        plan({
          holdings: [
            { ticker: "QQQ", amount: 10 },
            { ticker: "QQQ", amount: 10 },
          ],
        }),
        "en",
      ),
    ).toThrow();
    expect(() =>
      calculateWebPlan(
        { QQQ: [point("2020-01-01")], SPY: [point("2021-01-01")] },
        plan({
          holdings: [
            { ticker: "QQQ", amount: 100 },
            { ticker: "SPY", amount: 100 },
          ],
        }),
        "en",
      ),
    ).toThrow("shared trading period");
  });
});

describe("share conditions", () => {
  it.each(["ko", "en", "ja", "de"] as const)(
    "round trips base currency multi holdings for %s",
    (locale) => {
      const p: WebPlan = {
        ...defaultWebPlan(locale),
        holdings: [
          { ticker: "QQQ", amount: 100_000 },
          { ticker: "SPY", amount: 50_000 },
        ],
        freq: "weekly",
        weekday: 3,
        lump: 20_000,
        startDate: "2020-02-29",
        mode: "amount",
        years: 5,
      };
      const restored = parseWebPlan(
        new URLSearchParams(webPlanQuery(p, locale)),
        locale,
      )!;
      expect(webPlanKey(restored)).toBe(webPlanKey(p));
    },
  );
  it("reads legacy count units according to locale", () => {
    const q = new URLSearchParams(
      "t=QQQ&m=100&i=500&g=10&d=15&div=0&tax=1&infl=1",
    );
    const p = parseWebPlan(q, "ko")!;
    expect(p.holdings).toEqual([{ ticker: "QQQ", amount: 1e6 }]);
    expect(p.lump).toBe(5e6);
    expect(p.target).toBe(1e9);
    expect(p.reinvest).toBe(false);
    expect(p.tax).toBe(true);
    expect(p.infl).toBe(true);
    const en = parseWebPlan(
      new URLSearchParams("t=QQQ&m=700&g=10&mode=amt&y=20"),
      "en",
    )!;
    expect(en.target).toBe(1e6);
    expect(en.mode).toBe("amount");
    expect(en.years).toBe(20);
  });
  it.each([
    "",
    "t=QQQ&m=NaN",
    "t=QQQ&m=-1",
    "t=QQQ&s=2020-02-31",
    "t=QQQ&f=yearly",
    "t=QQQ&d=32",
    "t=SOXL",
    "h=QQQ:100,QQQ:50",
    "h=QQQ:100&wd=6",
    "t=QQQ&tax=1",
  ])("rejects invalid links: %s", (query) => {
    expect(parseWebPlan(new URLSearchParams(query), "en")).toBeNull();
  });
  it("condition keys ignore holding order and irrelevant schedule fields", () => {
    const p = plan({
      holdings: [
        { ticker: "QQQ", amount: 100 },
        { ticker: "SPY", amount: 200 },
      ],
      freq: "daily",
    });
    expect(webPlanKey(p)).toBe(
      webPlanKey({
        ...p,
        holdings: [...p.holdings].reverse(),
        buyDay: 31,
        weekday: 5,
      }),
    );
  });
});

describe("website data", () => {
  it("composes local FX and strips estimated JEPI history by default", async () => {
    const fetch = vi.fn(async (url: string) => ({
      ok: true,
      json: async () =>
        url.includes("/fx/")
          ? { rows: [["2020-01-01", 1000]] }
          : {
              ticker: "JEPI",
              currency: "USD",
              rows: [
                ["2020-01-01", 1, 1],
                ["2020-05-21", 2, 2],
              ],
            },
    }));
    vi.stubGlobal("fetch", fetch);
    const actual = await loadWebRows("JEPI", "ko");
    expect(actual).toEqual([
      { date: "2020-05-21", price: 2, raw: 2, fx: 1000 },
    ]);
    expect(await loadWebRows("JEPI", "ko", { estimated: true })).toHaveLength(
      2,
    );
  });
  it("does not fetch FX for USD or Korean local assets", async () => {
    const fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ rows: [["2020-01-01", 1, 1]] }),
    }));
    vi.stubGlobal("fetch", fetch);
    expect((await loadWebRows("QQQ", "en"))[0].fx).toBe(1);
    expect((await loadWebRows("069500.KS", "ko"))[0].fx).toBe(1);
    expect(fetch.mock.calls).toHaveLength(2);
  });
  it("loads the real CPI bundle format and reports fetch errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ series: [["2020-01", 100]] }),
      })),
    );
    expect(await loadWebCpi("en")).toEqual([{ ym: "2020-01", idx: 100 }]);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 503 })),
    );
    await expect(loadWebRows("QQQ", "en")).rejects.toThrow("503");
  });
});
