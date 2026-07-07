"use client";
import { useMemo } from "react";
import type { MonthPoint } from "@/lib/backtest/monthly";
import { milestoneMonths } from "@/lib/backtest/monthly";
import { won, growth } from "@/lib/format";

/** 이정표 후보(억). 목표보다 낮은 것만 "돌파" 배지로 쓰고, 목표 자체는 "달성" 행으로 표시. */
const NICE_EOK = [1, 5, 10, 50, 100, 500];
const milLabel = (krw: number) => `${krw / 1e8}억`;

export function MonthlyLog({ months, targetKRW }: { months: MonthPoint[]; targetKRW: number }) {
  const model = useMemo(() => {
    const thresholds = NICE_EOK.map((n) => n * 1e8).filter((t) => t < targetKRW);
    const mileMap = milestoneMonths(months, thresholds); // ym → 그 달 최고 돌파액
    const targetHit = months.find((m) => m.valueKRW >= targetKRW);
    const targetYm = targetHit?.ym ?? null;

    const years: string[] = [];
    const byYear = new Map<string, MonthPoint[]>();
    for (const m of months) {
      const y = m.ym.slice(0, 4);
      if (!byYear.has(y)) { byYear.set(y, []); years.push(y); }
      byYear.get(y)!.push(m);
    }
    // 연도별 배지: 그 해에 목표 달성 or 이정표 돌파가 있으면 최고 금액 라벨.
    const yearBadge = new Map<string, string>();
    for (const y of years) {
      if (targetYm && targetYm.slice(0, 4) === y) yearBadge.set(y, `${targetKRW / 1e8}억 달성`);
      else {
        let best = 0;
        for (const [ym, amt] of mileMap) if (ym.slice(0, 4) === y) best = Math.max(best, amt);
        if (best > 0) yearBadge.set(y, `${milLabel(best)} 돌파`);
      }
    }
    return { years, byYear, mileMap, yearBadge, targetYm };
  }, [months, targetKRW]);

  const { years, byYear, mileMap, yearBadge, targetYm } = model;
  const lastYear = years[years.length - 1];

  return (
    <div className="mlog">
      {years.map((y) => {
        const rows = byYear.get(y)!;
        const last = rows[rows.length - 1];
        return (
          <details className="yr" key={y} open={y === lastYear}>
            <summary>
              <span className="yname">{y}년</span>
              {yearBadge.has(y) && <span className="ymile">{yearBadge.get(y)}</span>}
              <span className="ysum">
                <b>{won(last.valueKRW)}</b> · <span className={last.valueKRW >= last.principalKRW ? "pos" : "negv"}>{growth(last.principalKRW, last.valueKRW)}</span>
              </span>
              <span className="caret" aria-hidden="true">▶</span>
            </summary>
            <div className="mrows">
              <div className="mhead"><span>월</span><span>원금</span><span>금액</span><span>수익</span></div>
              {rows.map((m) => {
                const mm = Number(m.ym.slice(5));
                const isTarget = m.ym === targetYm;
                const mileAmt = isTarget ? targetKRW : mileMap.get(m.ym);
                const up = m.valueKRW >= m.principalKRW;
                return (
                  <div key={m.ym}>
                    {mileAmt != null && (
                      <div className="mile">{isTarget ? `${targetKRW / 1e8}억 달성 — 목표 도달` : `${milLabel(mileAmt)} 돌파`}</div>
                    )}
                    <div className={"mrow" + (isTarget ? " hit" : "")}>
                      <span className="mm">{mm}월</span>
                      <span className="pr">{won(m.principalKRW)}</span>
                      <span className="va">{won(m.valueKRW)}</span>
                      <span className={"rt " + (up ? "pos" : "negv")}>{growth(m.principalKRW, m.valueKRW)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
