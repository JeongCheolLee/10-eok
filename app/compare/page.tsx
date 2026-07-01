import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd, articleLd, pageBreadcrumbLd } from "@/components/JsonLd";
import { computeTickerResults, dataEndLabel, yearOf, COMPARE_MONTHLY as MONTHLY } from "@/lib/etfResults";
import { TICKERS } from "@/lib/tickers";
import { eok1, pct } from "@/lib/format";

const TITLE = `${TICKERS.length}개 ETF 비교 — 매달 100만원이면 10억까지 누가 빨랐나`;
const DESC = "QLD·TQQQ·QQQ·SPY·VOO·SCHD·VT·KODEX 200을 매달 100만원씩 적립했다고 가정해, 10억 도달 기간·연평균 수익률을 실제 과거 데이터로 비교하고 각 종목의 성격과 위험을 정리합니다.";

export const metadata: Metadata = {
  title: `${TITLE} · 10-eok`,
  description: DESC,
  alternates: { canonical: "/compare" },
  openGraph: { title: TITLE, description: DESC, type: "article", images: [{ url: "/api/og", width: 1200, height: 630 }] },
};

export default async function ComparePage() {
  const { rows, dataEnd } = await computeTickerResults();

  return (
    <ContentShell
      title={`${TICKERS.length}개 ETF, 10억까지 비교`}
      desc={`매달 ${MONTHLY}만원씩 적립했다면 — 실제 과거 데이터로 본 종목별 결과와 성격`}
      crumb="종목 비교"
    >
      <JsonLd data={articleLd({ path: "/compare", title: TITLE, description: DESC })} />
      <JsonLd data={pageBreadcrumbLd("종목 비교", "/compare")} />

      <p>
        같은 금액을 매달 똑같이 모았더라도 어떤 ETF에 넣었느냐에 따라 결과는 크게 달라집니다. 아래는
        10-eok이 지원하는 {TICKERS.length}개 ETF를 <strong>매달 {MONTHLY}만원씩, 매달 1일</strong>에 적립했다고 가정하고,
        실제 과거의 일별 종가와 환율로 10억 원에 닿기까지 걸린 기간을 계산한 결과입니다. 기간은 <strong>오늘
        시점에서 거꾸로 계산</strong>한 값으로, "약 몇 년 전부터 모았더라면 지금 10억이 되는가"를 뜻합니다.
      </p>

      <div className="cmp-wrap">
        <table className="cmp">
          <thead>
            <tr>
              <th>종목</th>
              <th>10억까지</th>
              <th>연평균</th>
              <th>데이터 시작</th>
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
                    <span className="cmp-miss">전 구간 미달 · 약 {eok1(row.r.valueKRW)}</span>
                  )}
                </td>
                <td className="cmp-cagr">{pct(row.r.cagr)}</td>
                <td className="cmp-sub" style={{ display: "table-cell" }}>{yearOf(row.r.series[0]?.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cmp-note">
        ※ {dataEnd ? `${dataEndLabel(dataEnd)} 기준. ` : ""}데이터 시작 시점이 종목마다 달라 기간을 1:1로
        비교하긴 어렵습니다. 배당 재투자 ON, 세금·수수료 제외 기본 가정입니다.
      </p>

      <h2>레버리지가 빨라 보이는 이유</h2>
      <p>
        표에서 QLD(나스닥100 2배)·TQQQ(3배) 같은 레버리지 ETF가 도달 기간이 짧게 나오는 경우가 많습니다.
        하지만 이는 "더 좋은 상품"이라기보다 <strong>그만큼 더 큰 위험을 졌다</strong>는 뜻입니다. 레버리지
        ETF는 하루 수익률을 배수로 맞추는 구조라, 상승장에서는 폭발적이지만 하락·횡보장에서는 손실과{" "}
        <Link href="/guides/leverage-etf-risk">변동성 끌림(decay)</Link>이 누적됩니다. 같은 종목이라도 시작
        시점이 조금만 달라지면 결과가 천차만별이며, 깊은 하락에서의 회복은 산술적으로 훨씬 어렵습니다.
      </p>

      <h2>레버리지 없는 지수형 — QQQ와 SPY</h2>
      <p>
        QQQ(나스닥100)와 SPY(S&amp;P 500)는 레버리지 없이 지수를 1배로 따라갑니다. QQQ는 기술주 비중이 높아
        성장성과 변동성이 함께 크고, SPY는 500개 대형주로 더 넓게 분산돼 상대적으로 변동이 완만한 편입니다.
        도달 기간은 레버리지 상품보다 길게 나오는 경향이 있지만, 그만큼 보유 중 겪는 등락의 폭이 작아 장기
        적립으로 마음 편히 가져가기엔 더 무난한 선택일 수 있습니다. 두 지수의 차이는{" "}
        <Link href="/guides/nasdaq100-vs-sp500">나스닥100 vs S&amp;P 500</Link>에서 자세히 다룹니다.
      </p>

      <h2>미국 ETF vs 한국 ETF (KODEX 200)</h2>
      <p>
        KODEX 200(코스피200)은 유일한 원화 자산이라 <strong>환율의 영향을 받지 않습니다.</strong> 반면
        미국 ETF는 원화로 달러 자산을 사고파는 셈이라, 같은 주가라도 원/달러 환율이 결과를 더하거나 깎습니다
        (<Link href="/guides/fx-impact">환율의 영향</Link> 참고). 세금도 다릅니다 — 국내 상장 주식형 ETF의
        매매차익은 개인투자자에게 비과세지만, 미국 ETF 양도차익에는 양도소득세가 붙습니다
        (<Link href="/guides/overseas-tax">해외주식·ETF 세금</Link> 참고).
      </p>

      <h2>단일 숫자보다 "시작 시점의 운"을 보세요</h2>
      <p>
        이 표의 도달 기간은 시작 시점을 가장 잘 잡았을 때에 가까운, 하나의 시나리오일 뿐입니다. 현실에서는
        언제 시작했느냐가 결과를 크게 좌우합니다. 그래서 <Link href="/">계산기</Link>에서는 같은 플랜을 과거
        모든 시작 시점에 대입해 최악·중앙값·최선의 폭을 보여주는 <strong>타이밍 리스크</strong>를 함께
        제공합니다. 적립액·매수일·목표 금액·세금·환헤지 여부를 내 상황에 맞춰 넣으면, 같은 종목이라도
        결과가 얼마나 달라지는지 직접 가늠해 볼 수 있습니다.
      </p>

      <p className="note">
        본 비교는 실제 과거 데이터를 이용한 <strong>교육·정보 제공</strong>이며 특정 종목의 매수 권유나
        투자 자문이 아닙니다. 과거 수익률은 미래를 보장하지 않으며, 레버리지 상품은 원금 손실 위험이 큽니다.
        투자 결정과 그 결과의 책임은 이용자 본인에게 있습니다.
      </p>
    </ContentShell>
  );
}
