import { describe, expect, it } from "vitest";
import { hasNewSavedData, readDataDates } from "./savedData";
const before = { SPY: { price: "2026-11-02", fx: "2026-10-30" } };
describe("saved data freshness", () => {
  it("requires a known baseline and a strictly newer price or FX date", () => {
    expect(hasNewSavedData(undefined, before)).toBe(false);
    expect(hasNewSavedData(before, {})).toBe(false);
    expect(hasNewSavedData(before, before)).toBe(false);
    expect(hasNewSavedData(before, { SPY: { price: "2026-11-03", fx: "2026-10-30" } })).toBe(true);
    expect(hasNewSavedData(before, { SPY: { price: "2026-11-02", fx: "2026-11-02" } })).toBe(true);
  });
  it("validates dates for all holdings and ignores malformed legacy metadata", () => {
    expect(readDataDates(before, ["SPY"])).toEqual(before);
    expect(readDataDates(before, ["SPY", "QQQ"])).toBeUndefined();
    expect(readDataDates({ SPY: { price: "nonsense", fx: null } }, ["SPY"])).toBeUndefined();
  });
});
