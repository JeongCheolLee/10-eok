"use client";
import { useEffect, useRef, useState } from "react";
import { bundleToRows, type Bundle, type Row, type BacktestResult } from "@/lib/backtest/types";
import { runToToday } from "@/lib/backtest/simulate";
import { TickerLogo } from "@/components/TickerLogo";
import { TICKERS, tickerTitle, tickerSubtitle } from "@/lib/tickers";
import { eok } from "@/lib/format";

const TARGET = 1_000_000_000;

type Row2 = { symbol: string; res: BacktestResult | null };

export function Compare({
  initial, amount, buyDay, onBack, onChange,
}: {
  initial: string[];
  amount: number;
  buyDay: number;
  onBack: () => void;
  onChange?: (s: string[]) => void;
}) {
  const [symbols, setSymbols] = useState<string[]>(initial.slice(0, 4));
  const [rowsBySym, setRowsBySym] = useState<Record<string, Row[]>>({});
  const cacheRef = useRef<Record<string, Row[]>>({});

  // 선택 종목 번들 로드
  useEffect(() => {
    let cancel = false;
    symbols.forEach((s) => {
      if (cacheRef.current[s]) return;
      fetch(`/data/${s.toLowerCase()}.json`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((b: Bundle) => {
          if (cancel) return;
          cacheRef.current[s] = bundleToRows(b);
          setRowsBySym({ ...cacheRef.current });
        })
        .catch(() => {});
    });
    return () => { cancel = true; };
  }, [symbols]);

  const results: Row2[] = symbols.map((s) => ({
    symbol: s,
    res: rowsBySym[s] ? runToToday(rowsBySym[s], { monthlyKRW: amount * 10000, buyDay, targetKRW: TARGET }) : null,
  }));

  // 빠른 순 정렬: 도달한 것 우선(기간 짧은 순), 미달은 뒤로
  const sorted = [...results].sort((a, b) => {
    const ar = a.res, br = b.res;
    if (!ar || !br) return 0;
    if (ar.reached !== br.reached) return ar.reached ? -1 : 1;
    return ar.months - br.months;
  });
  const maxMonths = Math.max(1, ...results.map((r) => r.res?.months ?? 0));

  function toggle(sym: string) {
    setSymbols((cur) => {
      const next = cur.includes(sym) ? (cur.length > 2 ? cur.filter((s) => s !== sym) : cur) : cur.length < 4 ? [...cur, sym] : cur;
      onChange?.(next);
      return next;
    });
  }

  return (
    <div className="reveal">
      <div className="cmp-head">
        <button className="back" onClick={onBack} aria-label="뒤로">←</button>
        <div className="cmp-title">종목 비교</div>
        <div className="cmp-sub">매달 {amount}만원 · {buyDay}일</div>
      </div>

      <div className="ticker-scroll cmp-pick">
        {TICKERS.map((t) => (
          <button key={t.symbol} className={"pick logo-pick" + (symbols.includes(t.symbol) ? " sel" : "")} onClick={() => toggle(t.symbol)}>
            <TickerLogo symbol={t.symbol} size={20} />{tickerTitle(t.symbol)}
          </button>
        ))}
      </div>

      <div className="cmp-list">
        {sorted.map((r, i) => (
          <div className="cmp-row" key={r.symbol}>
            <div className="cmp-rank">{r.res?.reached ? i + 1 : "—"}</div>
            <TickerLogo symbol={r.symbol} size={34} />
            <div className="cmp-name">
              <div className="cmp-sym">{tickerTitle(r.symbol)}</div>
              <div className="cmp-kr">{tickerSubtitle(r.symbol)}</div>
            </div>
            <div className="cmp-right">
              {!r.res ? (
                <div className="cmp-dur muted">계산 중…</div>
              ) : r.res.reached ? (
                <>
                  <div className="cmp-dur">{r.res.years}년 {r.res.monthsRem}개월</div>
                  <div className="cmp-bar"><span style={{ width: `${(r.res.months / maxMonths) * 100}%` }} /></div>
                  <div className="cmp-val">지금 {eok(r.res.valueKRW)}</div>
                </>
              ) : (
                <div className="cmp-dur muted">기간 내 미달 · {eok(r.res.valueKRW)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="cmp-note">오늘 기준 10억까지 걸린 기간이 짧은 순. 과거 수익률이며 미래를 보장하지 않아요.</p>
    </div>
  );
}
