import { describe, expect, it } from "vitest";
import {
  compareWebEtf,
  webComparisonWindow,
  type ComparisonWindow,
} from "./web-comparison";
import type { WebCalculation, WebPlan } from "@/lib/web-calculator";
import type { Row } from "./backtest/types";
const rows = (dates: string[], price = 10): Row[] =>
  dates.map((date) => ({ date, price, fx: 1 }));
const plan: WebPlan = {
  holdings: [{ ticker: "SPY", amount: 100 }],
  freq: "monthly",
  buyDay: 1,
  weekday: 1,
  lump: 50,
  target: 100,
  reinvest: true,
  mode: "amount",
  years: 1,
};
const window: ComparisonWindow = {
  anchor: "2024-01-01",
  start: "2024-01-02",
  end: "2024-02-01",
  coverageStart: "2024-01-01",
  contribution: 300,
};
describe("website ETF comparison", () => {
  it("uses the solved contribution and original final date after passing the target", () => {
    const comparison = compareWebEtf(
      plan,
      window,
      "SPY",
      rows(["2023-12-29", "2024-01-02", "2024-02-01"]),
    );
    expect(comparison).toMatchObject({
      status: "available",
      principal: 650,
      value: 650,
    });
  });
  it("does not calculate a partial period when the ETF has insufficient history", () => {
    expect(
      compareWebEtf(plan, window, "SPY", rows(["2024-01-02", "2024-02-01"])),
    ).toMatchObject({ status: "unavailable" });
    expect(
      compareWebEtf(plan, window, "SPY", rows(["2023-12-29", "2024-01-31"])),
    ).toMatchObject({ status: "unavailable" });
  });
  it("preserves the baseline history boundary without losing a holiday purchase", () => {
    const comparison = compareWebEtf(
      plan,
      { ...window, coverageStart: "2024-01-02" },
      "SPY",
      rows(["2023-12-29", "2024-01-01", "2024-01-02", "2024-02-01"]),
    );
    expect(comparison).toMatchObject({ status: "available", principal: 650 });
    const daily = compareWebEtf(
      { ...plan, freq: "daily" },
      { ...window, coverageStart: "2024-01-02" },
      "SPY",
      rows(["2023-12-29", "2024-01-01", "2024-01-02", "2024-02-01"]),
    );
    expect(daily).toMatchObject({ status: "available", principal: 650 });
  });
  it("labels estimated data only when the comparison actually uses it", () => {
    const history = rows([
      "2020-04-01",
      "2020-05-01",
      "2020-05-20",
      "2020-05-21",
      "2020-06-01",
    ]);
    expect(
      compareWebEtf(
        plan,
        {
          ...window,
          anchor: "2020-04-01",
          coverageStart: "2020-04-01",
          end: "2020-06-01",
        },
        "JEPI",
        history,
      ),
    ).toMatchObject({
      status: "available",
      estimate: { proxy: "^BXM", from: "2020-04-01", to: "2020-05-20" },
    });
    const actual = compareWebEtf(
      plan,
      {
        ...window,
        anchor: "2020-06-01",
        coverageStart: "2020-06-01",
        end: "2020-06-01",
      },
      "JEPI",
      history,
    );
    expect(actual.status).toBe("available");
    expect(actual).not.toHaveProperty("estimate");
  });
  it("uses the original inflation-linked contribution schedule", () => {
    const comparison = compareWebEtf(
      { ...plan, infl: true },
      window,
      "SPY",
      rows(["2023-12-29", "2024-01-02", "2024-02-01"]),
      [
        { ym: "2024-01", idx: 100 },
        { ym: "2024-02", idx: 200 },
      ],
    );
    expect(comparison).toMatchObject({
      status: "available",
      principal: 950,
      value: 950,
    });
  });
  it("applies the selected US tax rule to the final gain", () => {
    const history: Row[] = [
      { date: "2023-12-29", price: 10, fx: 1 },
      { date: "2024-01-02", price: 10, fx: 1 },
      { date: "2024-02-01", price: 20, fx: 1 },
    ];
    const comparison = compareWebEtf(
      { ...plan, tax: true, lump: 0 },
      { ...window, contribution: 3_000_000 },
      "SPY",
      history,
    );
    expect(comparison).toMatchObject({
      status: "available",
      principal: 6_000_000,
      value: 8_890_000,
    });
  });
  it("keeps the original schedule anchor independently of the first purchase date", () => {
    const calculation = {
      calculationStart: "2024-01-01",
      contribution: 300,
      result: { series: [{ date: "2024-01-02" }, { date: "2024-02-01" }] },
    } as WebCalculation;
    expect(
      webComparisonWindow(plan, calculation, [
        rows(["2023-12-29", "2024-02-01"]),
      ]),
    ).toEqual(window);
  });
});
