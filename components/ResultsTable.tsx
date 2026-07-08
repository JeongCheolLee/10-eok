import Link from "next/link";
import type { TickerResult } from "@/lib/etfResults";
import type { Formatter } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";
import { localeHref } from "@/lib/i18n/seo";

// 홈·/compare가 공유하는 종목 결과 표(서버 컴포넌트). ko는 각 페이지의 KoBody가 자체 렌더하고,
// 이 컴포넌트는 en/ja/de 로케일에서 KoBody와 동일한 구조로 fmt/market만 로케일별로 연결한다.
// 숫자/기간/증감 포맷은 전부 getFormatter(locale)에 위임(약 N년 M개월 = fmt.dur, 연평균 = fmt.pct 등).

type Headers = { ticker: string; timeToGoal: string; cagr: string; dataStart?: string };

export function ResultsTable({
  rows,
  fmt,
  locale,
  headers,
  missLabel,
  showDataStart,
}: {
  rows: TickerResult[];
  fmt: Formatter;
  locale: Locale;
  headers: Headers;
  missLabel: (rough: string) => string;
  /** true면 "데이터 시작" 4번째 열 표시(/compare). false면 3열(홈). */
  showDataStart: boolean;
}) {
  return (
    <div className="cmp-wrap">
      <table className="cmp">
        <thead>
          <tr>
            <th>{headers.ticker}</th>
            <th>{headers.timeToGoal}</th>
            <th>{headers.cagr}</th>
            {showDataStart && <th>{headers.dataStart}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.symbol}>
              <td>
                <Link href={localeHref(locale, `/etf/${row.symbol.toLowerCase()}`)} className="cmp-sym">
                  {row.label}
                </Link>
                <span className="cmp-sub">{row.sub}</span>
              </td>
              <td>
                {row.r.reached ? (
                  <strong>{fmt.dur(row.r.years, row.r.monthsRem)}</strong>
                ) : (
                  <span className="cmp-miss">{missLabel(fmt.rough(row.r.value))}</span>
                )}
              </td>
              <td className="cmp-cagr">{fmt.pct(row.r.cagr)}</td>
              {showDataStart && (
                <td className="cmp-sub" style={{ display: "table-cell" }}>
                  {row.r.series[0] ? fmt.yearLabel(Number(row.r.series[0].date.slice(0, 4))) : ""}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
