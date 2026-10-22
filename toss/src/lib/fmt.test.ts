import { describe, expect, it } from "vitest";
import { eulReul, euroRo } from "./fmt";

describe("조사", () => {
  it("을/를 — 티커·한글·숫자", () => {
    expect(eulReul("QQQ")).toBe("QQQ를");
    expect(eulReul("QQQM")).toBe("QQQM을");
    expect(eulReul("SOXL")).toBe("SOXL을");
    expect(eulReul("SPYM")).toBe("SPYM을");
    expect(eulReul("QLD")).toBe("QLD를");
    expect(eulReul("TIGER 미국S&P500")).toBe("TIGER 미국S&P500을");
    expect(eulReul("TIGER 미국나스닥100")).toBe("TIGER 미국나스닥100을");
    expect(eulReul("TIGER 미국배당다우존스")).toBe("TIGER 미국배당다우존스를");
    expect(eulReul("KODEX 200")).toBe("KODEX 200을");
    expect(eulReul("QQQ·SCHD")).toBe("QQQ·SCHD를");
  });
  it("으로/로 — ㄹ 받침은 로", () => {
    expect(euroRo("QQQ")).toBe("QQQ로");
    expect(euroRo("SOXL")).toBe("SOXL로");
    expect(euroRo("QQQM")).toBe("QQQM으로");
    expect(euroRo("TIGER 미국S&P500")).toBe("TIGER 미국S&P500으로");
  });
});
