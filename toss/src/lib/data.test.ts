import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FxBundle, PxBundle } from "@/lib/backtest/compose";

vi.mock("./platform", () => ({ DATA_BASE: "/data" }));

const price = (ticker: string, rows: PxBundle["rows"], currency: "USD" | "KRW" = "USD"): PxBundle => ({
  ticker, rows, currency, start: rows[0][0], generatedAt: "2026-10-22",
});
const fx: FxBundle = {
  pair: "USDKRW", source: "DEXKOUS", generatedAt: "2026-10-22",
  rows: [["2020-05-20", 1200], ["2020-05-21", 1210], ["2020-05-22", 0], ["2020-05-25", 1250]],
};
function mockBundles(bundles: Record<string, unknown>) {
  return vi.fn(async (path: string) => ({ ok: path in bundles, status: path in bundles ? 200 : 404, json: async () => bundles[path] }));
}

beforeEach(() => { vi.resetModules(); });
afterEach(() => { vi.unstubAllGlobals(); });

describe("미니앱 실제 거래 이력 로더", () => {
  it("추정치를 제거하고 종가일에 쓴 직전 유효 환율 날짜를 제공한다", async () => {
    const fetcher = mockBundles({
      "/data/px/jepi.json": price("JEPI", [["2020-05-20", 90, 91], ["2020-05-21", 100, 101], ["2020-05-22", 110, 111]]),
      "/data/fx/krw.json": fx,
    });
    vi.stubGlobal("fetch", fetcher);
    const { loadRows, loadDataInfo, getLoadedDataInfo } = await import("./data");
    expect(getLoadedDataInfo("JEPI")).toBeNull();
    const rows = await loadRows("jepi");
    expect(rows.map((r) => r.date)).toEqual(["2020-05-21", "2020-05-22"]);
    expect(rows[1]).toMatchObject({ price: 110, raw: 111, fx: 1210 });
    expect(await loadDataInfo("JEPI")).toEqual({ ticker: "JEPI", actualStart: "2020-05-21", priceAsOf: "2020-05-22", fxAsOf: "2020-05-21" });
    expect(await loadRows("JEPI")).toBe(rows);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("원화 종목은 환율 없이 실제 첫날부터 반환한다", async () => {
    const fetcher = mockBundles({
      "/data/px/458730.ks.json": price("458730.KS", [["2023-06-19", 9000, 9000], ["2023-06-20", 10000, 10000]], "KRW"),
    });
    vi.stubGlobal("fetch", fetcher);
    const { loadRowsBy, getLoadedDataInfo } = await import("./data");
    const rowsBy = await loadRowsBy(["458730.KS"]);
    expect(rowsBy["458730.KS"]).toEqual([{ date: "2023-06-20", price: 10000, raw: 10000, fx: 1 }]);
    expect(getLoadedDataInfo("458730.ks")).toEqual({ ticker: "458730.KS", actualStart: "2023-06-20", priceAsOf: "2023-06-20", fxAsOf: null });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("실제 이력이 없는 번들은 실패하고 다음 요청에서 다시 받는다", async () => {
    const bundles = {
      "/data/px/jepi.json": price("JEPI", [["2020-05-20", 90, 91]]),
      "/data/fx/krw.json": fx,
    };
    vi.stubGlobal("fetch", mockBundles(bundles));
    const { loadRows, getLoadedDataInfo } = await import("./data");
    await expect(loadRows("JEPI")).rejects.toThrow("No actual trading history");
    expect(getLoadedDataInfo("JEPI")).toBeNull();
    bundles["/data/px/jepi.json"] = price("JEPI", [["2020-05-21", 100, 101]]);
    await expect(loadRows("JEPI")).resolves.toHaveLength(1);
  });
});

describe("comparison-only estimated history", () => {
  it.each([true, false])("does not leak estimates into standard results regardless of load order: comparison first=%s", async (comparisonFirst) => {
    vi.stubGlobal("fetch", mockBundles({
      "/data/px/jepi.json": price("JEPI", [["2020-05-20", 90, 91], ["2020-05-21", 100, 101]]),
      "/data/fx/krw.json": fx,
    }));
    const { loadRows, loadComparisonHistory, getLoadedDataInfo } = await import("./data");
    if (!comparisonFirst) await loadRows("JEPI");
    const history = await loadComparisonHistory("jepi");
    expect(history.rows.map((r) => r.date)).toEqual(["2020-05-20", "2020-05-21"]);
    expect(history.estimate).toEqual({ proxy: "^BXM", actualStart: "2020-05-21", convertedToKrw: false });
    expect((await loadRows("JEPI")).map((r) => r.date)).toEqual(["2020-05-21"]);
    expect(getLoadedDataInfo("JEPI")?.actualStart).toBe("2020-05-21");
  });
  it("does not apply FX twice to an already converted domestic proxy bundle", async () => {
    const fetcher = mockBundles({
      "/data/px/458730.ks.json": price("458730.KS", [["2023-06-19", 9000, 8990], ["2023-06-20", 10000, 10000]], "KRW"),
    });
    vi.stubGlobal("fetch", fetcher);
    const { loadComparisonHistory } = await import("./data");
    const history = await loadComparisonHistory("458730.KS");
    expect(history.rows[0]).toMatchObject({ price: 9000, raw: 8990, fx: 1 });
    expect(history.estimate).toEqual({ proxy: "SCHD", actualStart: "2023-06-20", convertedToKrw: true });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("does not label real-only bundles as estimated just because a proxy is configured", async () => {
    vi.stubGlobal("fetch", mockBundles({
      "/data/px/jepi.json": price("JEPI", [["2020-05-21", 100, 101]]),
      "/data/fx/krw.json": fx,
    }));
    const { loadComparisonHistory } = await import("./data");
    expect(await loadComparisonHistory("JEPI")).not.toHaveProperty("estimate");
  });
});
