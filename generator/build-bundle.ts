// EC2 cron이 하루 한 번 실행하는 데이터 파이프라인 (서버 아님, 배치 스크립트).
// 1) Yahoo 차트에서 종목 일별 수정주가  2) FRED DEXKOUS 일별 USD/KRW
// 3) align.ts(공유)로 거래일 정렬+forward-fill+검증  4) public/data/<ticker>.json 파생 번들 생성
// 가격 소스는 PRICE_SOURCE로 추상화 — 추후 교체 용이(Stooq가 봇 차단되어 Yahoo 채택).
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { alignSeries, type PricePoint, type FxPoint } from "../lib/backtest/align";
import type { Bundle } from "../lib/backtest/types";
import type { PxBundle, FxBundle } from "../lib/backtest/compose";
import { TICKERS, tickerCurrency } from "../lib/tickers";

// TICKER env 지정 시 그 종목만, 없으면 레지스트리 전체.
const ONLY = process.env.TICKER;
const UA = "Mozilla/5.0 (compatible; 10-eok-bot/0.1)";

// 데이터 무결성 가드 임계값. 잘린/부분 응답(HTTP 200이지만 몇 달치만 온 경우)이
// alignSeries 검증(길이>0·단조·양수)만 통과해 정상 번들을 덮어쓰는 것을 막는다.
const MIN_PRICE_ROWS = 200; // 종목당 최소 거래일 수 (약 10개월 미만이면 이상)
// fx 파일 시작 하한: 최초 상장 종목(SPY 1993)보다 충분히 이전이면 forward-fill에 지장 없음.
const FX_FILE_START = "1990-01-01";
const MIN_CPI_ROWS = 100; // CPI 최소 개월 수
const MIN_FX_ROWS = 1000; // DEXKOUS 일별은 수천 개 — 그 미만이면 잘린 응답
const FX_STALE_DAYS = 14; // 환율 마지막일이 가격 최신일보다 이만큼 뒤처지면 이상(잘림/중단)
const MAX_ROW_DROP = 0.02; // 기존 대비 행 수 2% 초과 감소면 거부

async function fetchPrices(ticker: string): Promise<PricePoint[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=0&period2=9999999999&interval=1d&events=div%2Csplit`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Yahoo ${ticker} HTTP ${res.status}`);
  const json: any = await res.json();
  const r = json?.chart?.result?.[0];
  const ts: number[] | undefined = r?.timestamp;
  const adj: (number | null)[] | undefined = r?.indicators?.adjclose?.[0]?.adjclose;
  const close: (number | null)[] | undefined = r?.indicators?.quote?.[0]?.close;
  if (!ts || !adj) throw new Error(`Yahoo ${ticker}: adjclose 없음`);
  const out: PricePoint[] = [];
  for (let i = 0; i < ts.length; i++) {
    const v = adj[i];
    if (v == null || !Number.isFinite(v)) continue;
    const rawV = close?.[i];
    out.push({ date: isoUTC(ts[i]), price: round(v, 4), raw: rawV != null && Number.isFinite(rawV) ? round(rawV, 4) : round(v, 4) });
  }
  return out;
}

async function fetchFx(): Promise<FxPoint[]> {
  const url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DEXKOUS";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`FRED DEXKOUS HTTP ${res.status}`);
  const text = await res.text();
  const out: FxPoint[] = [];
  for (const line of text.split("\n").slice(1)) {
    const [date, val] = line.split(",");
    if (!date || val == null) continue;
    const rate = Number(val.trim());
    if (!Number.isFinite(rate) || rate <= 0) continue; // FRED 결측은 "."
    out.push({ date: date.trim(), rate: round(rate, 2) });
  }
  return out;
}

async function fetchCpiKr(): Promise<{ ym: string; idx: number }[]> {
  // FRED 한국 CPI(월별, 키 없는 CSV). 물가연동 적립 옵션에 사용.
  const url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=KORCPIALLMINMEI";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`FRED CPI HTTP ${res.status}`);
  const text = await res.text();
  const out: { ym: string; idx: number }[] = [];
  for (const line of text.split("\n").slice(1)) {
    const [date, val] = line.split(",");
    if (!date || val == null) continue;
    const idx = Number(val.trim());
    if (!Number.isFinite(idx) || idx <= 0) continue;
    out.push({ ym: date.trim().slice(0, 7), idx: round(idx, 3) }); // YYYY-MM
  }
  return out;
}

/**
 * 새 번들이 기존 정상 번들을 안전하게 대체할 수 있는지 검증. 이상 시 throw → 커밋 차단.
 * - 절대 하한: 행 수가 MIN_PRICE_ROWS 미만이면 잘린 응답으로 간주.
 * - 기존 번들 대비: 행 수 급감(MAX_ROW_DROP 초과)·시작일 후퇴·마지막일 후퇴를 거부.
 * 기존 파일이 없거나 깨졌으면 절대 하한만 검사(최초 생성/복구 허용).
 */
function guardBundle(file: string, next: Bundle): void {
  const n = next.rows.length;
  if (n < MIN_PRICE_ROWS) throw new Error(`${next.ticker}: 행 ${n}개 < 최소 ${MIN_PRICE_ROWS}개 — 잘린 응답 의심`);
  if (!existsSync(file)) return;
  let prev: Bundle;
  try {
    prev = JSON.parse(readFileSync(file, "utf8")) as Bundle;
  } catch {
    return; // 기존 파일 손상 → 새 번들로 교체 허용
  }
  const p = prev.rows?.length ?? 0;
  if (p === 0) return;
  if (n < p * (1 - MAX_ROW_DROP)) {
    throw new Error(`${next.ticker}: 행 급감 ${p}→${n} (>${MAX_ROW_DROP * 100}% 감소) — 잘린 응답 의심, 이전 번들 유지`);
  }
  if (next.start > prev.start) {
    throw new Error(`${next.ticker}: 시작일 후퇴 ${prev.start}→${next.start} — 앞부분 유실 의심`);
  }
  const prevEnd = prev.rows[p - 1]?.[0];
  const nextEnd = next.rows[n - 1]?.[0];
  if (prevEnd && nextEnd && nextEnd < prevEnd) {
    throw new Error(`${next.ticker}: 마지막일 후퇴 ${prevEnd}→${nextEnd} — 최신분 유실 의심`);
  }
}

function isoUTC(epochSec: number): string {
  return new Date(epochSec * 1000).toISOString().slice(0, 10);
}
function round(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

async function main() {
  const symbols = ONLY ? [ONLY] : TICKERS.map((t) => t.symbol);
  console.log(`[build-bundle] 환율(FRED) 수집…`);
  const fx = await fetchFx();
  console.log(`  fx=${fx.length}`);
  if (fx.length < MIN_FX_ROWS) throw new Error(`FRED DEXKOUS: ${fx.length}개 < 최소 ${MIN_FX_ROWS}개 — 잘린 응답 의심`);
  const fxEnd = fx[fx.length - 1].date;

  const dir = join(process.cwd(), "public", "data");
  mkdirSync(dir, { recursive: true });
  mkdirSync(join(dir, "px"), { recursive: true });
  mkdirSync(join(dir, "fx"), { recursive: true });
  mkdirSync(join(dir, "cpi"), { recursive: true });

  // 모든 종목을 먼저 만들고 가드까지 통과시킨 뒤에만 디스크에 쓴다.
  // (중간에 한 종목이라도 실패하면 어떤 파일도 안 써 부분 갱신을 원천 차단)
  const pending: { file: string; bundle: Bundle }[] = [];
  // 신규 분리 포맷: px(원통화 가격)는 종목별, fx는 통화별 1파일 — 프론트가 compose.ts로 합성.
  // 레거시 {ticker}.json은 전환기 동안 병행 생성(외부 참조 대비), 이후 제거 예정.
  const pendingPx: { file: string; px: PxBundle }[] = [];
  for (const ticker of symbols) {
    const prices = await fetchPrices(ticker);
    // 한국 종목은 원화 자산 → 환율=1 (1900년 더미 1점을 forward-fill). 미국은 실제 환율.
    const rows =
      tickerCurrency(ticker) === "KRW"
        ? alignSeries(prices, [{ date: "1900-01-01", rate: 1 }])
        : alignSeries(prices, fx); // 정렬+forward-fill+검증 (이상 시 throw → 빌드 실패)
    const bundle: Bundle = {
      ticker,
      currencyTarget: "KRW",
      start: rows[0].date,
      generatedAt: new Date().toISOString(),
      rows: rows.map((r) => [r.date, r.price, r.fx, r.raw ?? r.price] as [string, number, number, number]),
    };
    const file = join(dir, `${ticker.toLowerCase()}.json`);
    guardBundle(file, bundle); // 잘린/부분 응답이 정상 번들을 덮어쓰지 못하게 (이상 시 throw)
    pending.push({ file, bundle });
    // px는 정렬된 가격만 담는다(합성 시 다시 align하므로 결과는 레거시와 동일).
    pendingPx.push({
      file: join(dir, "px", `${ticker.toLowerCase()}.json`),
      px: {
        ticker,
        currency: tickerCurrency(ticker),
        start: rows[0].date,
        generatedAt: bundle.generatedAt,
        rows: rows.map((r) => [r.date, r.price, r.raw ?? r.price] as [string, number, number]),
      },
    });
    console.log(`  ${ticker}: ${rows.length}행, ${bundle.start} ~ ${rows[rows.length - 1].date} (가드 통과)`);
  }

  // 환율 신선도 가드: 잘린 DEXKOUS는 행 수(forward-fill로 유지)로는 안 잡혀 최근 날짜에
  // 오래된 환율이 조용히 적용된다 → 미국 종목 가격 최신일과 환율 마지막일 격차로 검출.
  const usdEnds = pending
    .filter((p) => tickerCurrency(p.bundle.ticker) === "USD")
    .map((p) => p.bundle.rows[p.bundle.rows.length - 1][0]);
  if (usdEnds.length > 0) {
    const maxUsdEnd = usdEnds.reduce((a, b) => (a > b ? a : b));
    const stale = new Date(maxUsdEnd);
    stale.setUTCDate(stale.getUTCDate() - FX_STALE_DAYS);
    const threshold = stale.toISOString().slice(0, 10);
    if (fxEnd < threshold) {
      throw new Error(`환율 정체: 마지막 환율 ${fxEnd} 가 가격 최신일 ${maxUsdEnd} 보다 ${FX_STALE_DAYS}일 넘게 뒤처짐 — 잘린/중단된 DEXKOUS 의심`);
    }
  }

  // 한국 CPI (물가연동 적립용) — 종목 무관, 1회
  const cpi = await fetchCpiKr();
  if (cpi.length < MIN_CPI_ROWS) throw new Error(`cpi-kr: ${cpi.length}개월 < 최소 ${MIN_CPI_ROWS}개월 — 잘린 응답 의심`);

  // 여기까지 오면 모두 정상 → 일괄 쓰기 (레거시 + 분리 포맷 동시)
  for (const { file, bundle } of pending) writeFileSync(file, JSON.stringify(bundle));
  for (const { file, px } of pendingPx) writeFileSync(file, JSON.stringify(px));
  const fxBundle: FxBundle = {
    pair: "USDKRW",
    source: "DEXKOUS",
    generatedAt: new Date().toISOString(),
    rows: fx.filter((p) => p.date >= FX_FILE_START).map((p) => [p.date, p.rate] as [string, number]),
  };
  writeFileSync(join(dir, "fx", "krw.json"), JSON.stringify(fxBundle));
  const cpiJson = JSON.stringify({ base: cpi[0]?.ym, series: cpi.map((c) => [c.ym, c.idx]) });
  writeFileSync(join(dir, "cpi-kr.json"), cpiJson);
  writeFileSync(join(dir, "cpi", "kr.json"), cpiJson);
  console.log(`  fx/krw: ${fxBundle.rows.length}행 (${FX_FILE_START}~)`);
  console.log(`  cpi-kr: ${cpi.length}개월, ${cpi[0]?.ym} ~ ${cpi[cpi.length - 1]?.ym}`);
  console.log(`[build-bundle] 완료: ${pending.length}개 종목(레거시+px) + fx + cpi 기록`);
}

main().catch((e) => {
  console.error("[build-bundle] 실패:", e.message);
  process.exit(1); // 나쁜 번들 push 차단
});
