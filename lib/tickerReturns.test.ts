import { describe, it, expect } from "vitest";
import { buildTickerReturns } from "./tickerReturns";
import type { PxBundle, FxBundle } from "./backtest/compose";
const fx: FxBundle = { pair: "USDKRW", source: "test", generatedAt: "", rows: [["2019-01-02", 1000], ["2024-01-02", 2000]] };
const px = (ticker: string, rows: PxBundle["rows"]): PxBundle => ({ ticker, currency: ticker.endsWith(".KS") ? "KRW" : "USD", generatedAt: "", start: rows[0][0], rows });
const rows: PxBundle["rows"] = [["2019-01-02",100,100],["2021-01-04",100,100],["2023-01-02",100,100],["2024-01-02",200,200]];
describe("선택 목록의 같은 기간 수익률", () => {
  it("미국 종목에 환율을 적용하고 한국 종목은 환율을 적용하지 않는다", () => {
    const result = buildTickerReturns([px("AAPL",rows),px("005930.KS",rows)],fx);
    expect(result.rows.AAPL[1]?.cagr).toBeCloseTo(3,2);
    expect(result.rows["005930.KS"][1]?.cagr).toBeCloseTo(1,2);
    expect(result.rows.AAPL[5]?.cagr).toBeCloseTo(4 ** (1/5)-1,3);
  });
  it("분할 조정 가격에는 분할 배수를 다시 곱하지 않고 배당 조정 가격을 사용한다", () => {
    const result = buildTickerReturns([px("AAPL",[["2023-01-02",80,100],["2024-01-02",100,100]])], {...fx,rows:[["2019-01-02",1000]]});
    expect(result.rows.AAPL[1]?.cagr).toBeCloseTo(.25,2);
    expect(result.rows.AAPL[3]).toBeNull();
  });
  it("같은 기준일을 사용하며 회사 재편 이전 이력을 포함하지 않는다", () => {
    const result = buildTickerReturns([px("035720.KS",[["2000-01-04",1,1],["2014-10-14",100,100],["2015-10-14",150,150]]),px("AAPL",[["2000-01-04",10,10],["2014-10-14",100,100],["2015-10-14",150,150],["2015-10-15",300,300]])],{...fx,rows:[["1999-01-01",1000]]});
    expect(result.asOf).toBe("2015-10-14");
    expect(result.rows["035720.KS"][3]).toBeNull();
    expect(result.rows.AAPL[1]?.end).toBe("2015-10-14");
  });
  it("오래된 자료 때문에 공통 기준일이 과거로 크게 밀리면 실패한다", () => {
    expect(() => buildTickerReturns([px("AAPL",rows),px("MSFT",rows.slice(0,-1))],fx)).toThrow("7일");
  });
});
