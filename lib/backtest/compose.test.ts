import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { composeRows, type PxBundle, type FxBundle } from "./compose";
import { bundleToRows, type Bundle } from "./types";
import { TICKERS, tickerCurrency } from "../tickers";

const DATA = join(process.cwd(), "public", "data");

// 골든 동일성: px/fx 분리 파일 합성 결과가 구 번들(fx 내장)과 전 종목·전 행 완전히 같아야 한다.
// 레거시 {ticker}.json 병행 생성이 끝나 파일이 사라지면 이 테스트는 함께 제거한다.
describe("composeRows 골든 동일성 (구 번들 대비)", () => {
  const fx = JSON.parse(readFileSync(join(DATA, "fx", "krw.json"), "utf8")) as FxBundle;

  for (const t of TICKERS) {
    const legacyFile = join(DATA, `${t.symbol.toLowerCase()}.json`);
    it(`${t.symbol}: 합성 == 구 번들`, () => {
      if (!existsSync(legacyFile)) return; // 레거시 제거 후엔 skip
      const legacy = bundleToRows(JSON.parse(readFileSync(legacyFile, "utf8")) as Bundle);
      const px = JSON.parse(readFileSync(join(DATA, "px", `${t.symbol.toLowerCase()}.json`), "utf8")) as PxBundle;
      const composed = composeRows(px, tickerCurrency(t.symbol) === "KRW" ? null : fx);
      expect(composed.length).toBe(legacy.length);
      for (let i = 0; i < legacy.length; i++) {
        const a = legacy[i], b = composed[i];
        if (a.date !== b.date || a.price !== b.price || a.fx !== b.fx || a.raw !== b.raw) {
          throw new Error(`${t.symbol} 행 ${i} 불일치: legacy=${JSON.stringify(a)} composed=${JSON.stringify(b)}`);
        }
      }
    });
  }

  it("fx 파일은 단조 증가·양수", () => {
    let prev = "";
    for (const [date, rate] of fx.rows) {
      expect(date > prev).toBe(true);
      expect(rate).toBeGreaterThan(0);
      prev = date;
    }
  });
});
