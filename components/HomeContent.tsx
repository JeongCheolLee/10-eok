import type { ReactNode } from "react";
import Link from "next/link";
import { computeTickerResults } from "@/lib/etfResults";
import { getMarket } from "@/lib/i18n/markets";
import { getFormatter } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";
import { localeHref } from "@/lib/i18n/seo";
import { ResultsTable } from "@/components/ResultsTable";
import { HOME_EN } from "@/lib/content/pages/en";
import { HOME_JA } from "@/lib/content/pages/ja";
import { HOME_DE } from "@/lib/content/pages/de";

// 홈("/")에 서버 렌더되는 본문. 계산기(BacktestApp, 클라이언트)만으로는 크롤러/심사자에게
// 보이는 텍스트가 거의 없으므로, 이 도구의 고유 가치(실제 과거 데이터로 계산한 결과)를
// 읽을 수 있는 콘텐츠 + 비교표로 노출한다. 모든 숫자는 요청 시 서버에서 실제 계산한 값.

function KoBody({ rows, dataEnd }: { rows: Awaited<ReturnType<typeof computeTickerResults>>["rows"]; dataEnd: string | null }) {
  const fmt = getFormatter("ko");
  const M = 100, D = 1;
  return (
    <>
      <h2 id="intro">매달 모았다면 10억까지, 얼마나 걸렸을까</h2>
      <p>
        10-eok은 흔한 수익률 계산기와 질문의 방향이 반대입니다. 대부분의 계산기는 "지금 얼마를 넣으면
        나중에 얼마가 될까?"를 묻지만, 10-eok은 <strong>"내가 정한 목표(10억 원)에 닿으려면 과거에 얼마나
        걸렸을까?"</strong>를 묻습니다. 막연한 가정 수익률이 아니라, <strong>실제 과거의 일별 종가와 그날의
        원/달러 환율</strong>로 계산하기 때문에 "그때 시작했더라면"을 구체적인 숫자로 확인할 수 있습니다.
      </p>
      <p>
        계산 방식은 단순합니다. 고른 ETF를 <strong>매달 같은 날 같은 금액</strong>만큼(휴장일이면 다음
        거래일) 그날의 실제 가격과 환율로 사 모았다고 가정하고, 쌓인 평가액이 처음으로 10억 원을 넘는
        지점을 찾습니다. 달러 자산을 원화로 살 때 빠지기 쉬운 <strong>환율 효과</strong>까지 매수·평가
        시점의 실제 환율로 반영합니다.
      </p>

      <h2 id="compare">실제 데이터로 계산한 종목별 결과</h2>
      <p>
        아래 표는 <strong>매달 {M}만원씩, 매달 {D}일에</strong> 적립했다고 가정했을 때 각
        ETF가 10억 원에 닿기까지 걸린 기간입니다. "걸린 기간"은 <strong>오늘 시점에서 거꾸로 계산</strong>한
        값입니다 — 즉 "약 몇 년 전부터 모았더라면 지금 10억이 되는가"를 뜻합니다. 배당은 재투자, 세금·수수료는
        제외한 기본 가정입니다.
      </p>

      <div className="cmp-wrap">
        <table className="cmp">
          <thead>
            <tr>
              <th>종목</th>
              <th>매달 {M}만원 → 10억까지</th>
              <th>연평균 수익률</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.symbol}>
                <td>
                  <Link href={`/etf/${row.symbol.toLowerCase()}`} className="cmp-sym">{row.label}</Link>
                  <span className="cmp-sub">{row.sub}</span>
                </td>
                <td>
                  {row.r.reached ? (
                    <strong>약 {row.r.years}년 {row.r.monthsRem}개월</strong>
                  ) : (
                    <span className="cmp-miss">전 구간 모아도 미달 · 현재 약 {fmt.rough(row.r.value)}</span>
                  )}
                </td>
                <td className="cmp-cagr">{fmt.pct(row.r.cagr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cmp-note">
        ※ {dataEnd ? `${fmt.ym(dataEnd)} 기준 데이터. ` : ""}각 종목의 데이터 시작 시점이 달라
        기간을 단순 비교하긴 어렵습니다. 구성·위험까지 함께 본 <Link href="/compare">{rows.length}개 ETF 비교</Link>를
        참고하거나, 종목을 눌러 상세·직접 계산으로 넘어갈 수 있습니다.
      </p>

      <h2 id="read">이 숫자를 어떻게 읽어야 하나</h2>
      <p>
        가장 먼저 기억할 점은, 위 기간이 <strong>"시작 시점을 가장 잘 잡았을 때"에 가까운 값</strong>이라는
        것입니다. 같은 종목·같은 적립액이라도 <strong>언제 시작했느냐</strong>에 따라 결과는 크게 달라집니다.
        특히 QLD(2배)·TQQQ(3배) 같은 레버리지 ETF는 상승장에서 폭발적이지만, 하락·횡보장에서는 손실과
        이른바 <Link href="/guides/leverage-etf-risk">변동성 끌림(decay)</Link>이 매우 커서 같은 구간이라도
        시작 시점에 따라 결과가 천차만별입니다. 표에서 레버리지 종목이 빨라 보이는 것은 "그만큼 위험을 더
        졌다"는 뜻이기도 합니다.
      </p>
      <p>
        그래서 10-eok의 계산기에는 <strong>"타이밍 리스크"</strong>를 함께 보여주는 기능이 있습니다. 같은
        플랜을 과거 모든 시작 시점에 대입해 최악·중앙값·최선의 결과 폭을 알려줍니다. 위 표의 단일 숫자보다,
        "운에 따라 결과가 얼마나 벌어지는가"를 보는 편이 훨씬 현실적입니다.
      </p>

      <h2 id="how">데이터와 계산 방법</h2>
      <ul>
        <li><strong>가격:</strong> Yahoo Finance의 일별 수정주가(adjusted close). 배당 재투자·액면분할·운용보수가 반영된 값입니다.</li>
        <li><strong>환율:</strong> 미국 세인트루이스 연방준비은행(FRED)의 일별 원/달러(DEXKOUS) 시계열. 한국 상장 ETF(KODEX 200)는 원화 자산이라 환율을 적용하지 않습니다.</li>
        <li><strong>가정:</strong> 배당 재투자 ON, 매달 지정일 적립, 평가액 기준(미실현). 기본값에서는 세금·수수료를 빼지 않으며, 계산기에서 양도세·물가연동 적립을 켜 볼 수 있습니다.</li>
        <li><strong>갱신:</strong> 시장 데이터는 매일 한 번 자동으로 새로 받아 반영합니다.</li>
      </ul>
      <p>
        계산 절차의 전제와 단순화, 자주 묻는 질문은 <Link href="/how-it-works">계산 방법 &amp; FAQ</Link>에서
        투명하게 공개합니다.
      </p>

      <h2 id="more">더 알아보기</h2>
      <ul>
        <li><Link href="/compare">{rows.length}개 ETF 비교</Link> — 구성·성격·위험과 10억 도달 결과를 한눈에</li>
        <li><Link href="/guides/dca">적립식 투자(DCA)의 원리</Link> — 매달 꾸준히 사는 방식이 왜 마음 편한지</li>
        <li><Link href="/guides/leverage-etf-risk">레버리지 ETF의 위험</Link> — 2·3배의 수익만큼 큰 손실과 변동성 끌림</li>
        <li><Link href="/guides/fx-impact">환율이 수익률에 미치는 영향</Link> — 원화로 달러 자산을 살 때</li>
        <li><Link href="/guides">전체 투자 가이드</Link> · <Link href="/about">10-eok 소개</Link></li>
      </ul>

      <p className="note">
        10-eok은 실제 과거 데이터를 이용한 <strong>교육·정보 제공 도구</strong>이며, 특정 종목의 매수를
        권유하거나 투자·금융 자문을 제공하지 않습니다. 과거 수익률은 미래 수익을 보장하지 않으며, 레버리지
        상품은 원금 손실 위험이 큽니다. 투자 결정과 그 결과의 책임은 이용자 본인에게 있습니다.
      </p>
    </>
  );
}

// en/ja/de 홈 본문: 번역 산문(lib/content/pages)의 Body에 라이브 결과 표를 주입.
// KoBody와 동일한 표 구조를 ResultsTable로 렌더하고 fmt/market만 로케일별로 연결한다.
type Rows = Awaited<ReturnType<typeof computeTickerResults>>["rows"];
type HomeEntry = {
  tableHeaders: { ticker: string; timeToGoal: string; cagr: string };
  missLabel: (rough: string) => string;
  asOf: (ym: string) => string;
  Body: (p: { table: ReactNode; asOf: string }) => ReactNode;
};
const HOME_CONTENT: Record<Exclude<Locale, "ko">, HomeEntry> = { en: HOME_EN, ja: HOME_JA, de: HOME_DE };

function LocaleBody({ locale, rows, dataEnd }: { locale: Exclude<Locale, "ko">; rows: Rows; dataEnd: string | null }) {
  const fmt = getFormatter(locale);
  const content = HOME_CONTENT[locale];
  const table = (
    <ResultsTable rows={rows} fmt={fmt} locale={locale} headers={content.tableHeaders} missLabel={content.missLabel} showDataStart={false} />
  );
  const asOf = dataEnd ? content.asOf(fmt.ym(dataEnd)) : "";
  return <>{content.Body({ table, asOf })}</>;
}

export async function HomeContent({ locale }: { locale: Locale }) {
  const market = getMarket(locale);
  const { rows, dataEnd } = await computeTickerResults(market);

  return (
    <section className="home-editorial">
      <div className="content">
        <article className="prose">
          {locale === "ko" ? <KoBody rows={rows} dataEnd={dataEnd} /> : <LocaleBody locale={locale} rows={rows} dataEnd={dataEnd} />}
        </article>
      </div>
    </section>
  );
}
