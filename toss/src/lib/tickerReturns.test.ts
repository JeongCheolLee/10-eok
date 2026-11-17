import { describe, it, expect, vi, beforeEach } from "vitest";
import snapshot from "@/public/data/summary/returns.json";
vi.mock("./platform", () => ({ DATA_BASE: "/data" }));
vi.mock("./request", () => ({ requestJson: vi.fn() }));
import { requestJson } from "./request";
beforeEach(() => { vi.resetModules(); vi.mocked(requestJson).mockReset(); });
describe("종목 선택 수익률 자료 전환", () => {
  it("서버가 이전 복리 요약을 주면 빌드에 포함한 산술평균을 사용한다", async () => {
    vi.mocked(requestJson).mockResolvedValue({version:1,asOf:"2026-11-09",rows:{SOXL:{5:{cagr:.011}}}});
    const {loadTickerReturns}=await import("./tickerReturns");
    const result=await loadTickerReturns();
    expect(result).toEqual(snapshot);
    expect(result.rows.SOXL[5]?.meanAnnualReturn).not.toBe(result.rows.SOXL[5]?.cagr);
  });
  it("새 방식의 최신 서버 자료를 사용하고 반복 요청은 캐시한다", async () => {
    const remote={...snapshot,asOf:"2099-01-01"};
    vi.mocked(requestJson).mockResolvedValue(remote);
    const {loadTickerReturns}=await import("./tickerReturns");
    expect(await loadTickerReturns()).toEqual(remote);
    await loadTickerReturns();
    expect(requestJson).toHaveBeenCalledOnce();
  });
  it("오래된 자료와 통신 실패에는 빌드의 기준일 자료를 유지한다", async () => {
    vi.mocked(requestJson).mockResolvedValue({...snapshot,asOf:"2000-01-01"});
    let loader=await import("./tickerReturns");
    expect(await loader.loadTickerReturns()).toEqual(snapshot);
    vi.resetModules();
    vi.mocked(requestJson).mockRejectedValue(Error("offline"));
    loader=await import("./tickerReturns");
    expect(await loader.loadTickerReturns()).toEqual(snapshot);
  });
});
