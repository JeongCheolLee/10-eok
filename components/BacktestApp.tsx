"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { bundleToRows, type Bundle, type Row } from "@/lib/backtest/types";
import { runToToday } from "@/lib/backtest/simulate";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";
import { GrowthChart } from "@/components/GrowthChart";
import { TickerLogo } from "@/components/TickerLogo";
import { Compare } from "@/components/Compare";
import { eok, eok1, pct, ym } from "@/lib/format";
import { TICKERS, DEFAULT_TICKER, tickerName } from "@/lib/tickers";

const TARGET = 1_000_000_000;
const DAYS = [1, 5, 10, 15, 25];

type Screen = "intro" | "chat" | "loading" | "result" | "compare";
type Initial = { ticker: string; amount: number; buyDay: number } | null;

export function BacktestApp({ initial }: { initial: Initial }) {
  const [ticker, setTicker] = useState(initial?.ticker ?? DEFAULT_TICKER);
  const [amount, setAmount] = useState(initial?.amount ?? 100); // 만원
  const [buyDay, setBuyDay] = useState(initial?.buyDay ?? 1);
  const [screen, setScreen] = useState<Screen>(initial ? "result" : "intro");
  const [answers, setAnswers] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<null | "amount" | "day" | "ticker">(null);
  const [tipOpen, setTipOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [revealKey, setRevealKey] = useState(0);

  const [rows, setRows] = useState<Row[] | null>(initial ? null : null);
  const [loadErr, setLoadErr] = useState(false);
  const cacheRef = useRef<Record<string, Row[]>>({});

  // 선택 종목 번들 로드 (캐시)
  useEffect(() => {
    let cancel = false;
    const cached = cacheRef.current[ticker];
    if (cached) { setRows(cached); return; }
    setRows(null);
    fetch(`/data/${ticker.toLowerCase()}.json`)
      .then((r) => { if (!r.ok) throw new Error("bundle"); return r.json(); })
      .then((b: Bundle) => { if (cancel) return; const rw = bundleToRows(b); cacheRef.current[ticker] = rw; setRows(rw); })
      .catch(() => { if (!cancel) setLoadErr(true); });
    return () => { cancel = true; };
  }, [ticker]);

  const result = useMemo(
    () => (rows ? runToToday(rows, { monthlyKRW: amount * 10000, buyDay, targetKRW: TARGET }) : null),
    [rows, amount, buyDay],
  );

  // 결과 화면 진입/갱신 시 애니메이션 재트리거 + 공유용 URL 동기화
  useEffect(() => {
    if (screen === "result" && result) {
      setRevealKey((k) => k + 1);
      window.history.replaceState(null, "", `/?t=${ticker}&m=${amount}&d=${buyDay}`);
    }
  }, [screen, result?.reachedDate, result?.months]); // eslint-disable-line

  const months = result?.months ?? 0;
  const animMonths = useAnimatedNumber(months, screen === "result" ? 1000 : 0);
  const animPrincipal = useAnimatedNumber(result?.principalKRW ?? 0, screen === "result" ? 1000 : 0);
  const reached = !!result?.reached;
  const heroMonths = Math.round(animMonths);

  function answer(label: string) {
    const next = [...answers, label];
    setAnswers(next);
    if (next.length === 3) {
      setScreen("loading");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() => setScreen("result"), reduce ? 0 : 900);
    }
  }
  function bump(dir: number) {
    if (editMode === "amount") setAmount((a) => Math.max(10, a + dir * 10));
    else if (editMode === "day") setBuyDay((d) => { const i = DAYS.indexOf(d); return DAYS[Math.max(0, Math.min(DAYS.length - 1, i + dir))]; });
  }
  function share() {
    const url = `${location.origin}/?t=${ticker}&m=${amount}&d=${buyDay}`;
    const text = reached
      ? `${tickerName(ticker)}에 매달 ${amount}만원씩 모았다면 10억까지 ${result!.years}년 ${result!.monthsRem}개월!`
      : `${tickerName(ticker)} 적립 백테스트 — 10억까지 얼마나 걸릴까?`;
    if (navigator.share) { navigator.share({ title: "10-eok", text, url }).catch(() => {}); }
    else { navigator.clipboard?.writeText(`${text} ${url}`); setToast("링크가 복사됐어요"); window.setTimeout(() => setToast(""), 2000); }
  }

  if (loadErr) {
    return (
      <div className="overlay">
        <div className="ov-msg">데이터를 못 불러왔어요.<br />잠시 후 다시 시도해 주세요.</div>
        <button className="btn" style={{ width: "auto", padding: "14px 28px" }} onClick={() => location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <main className="app">
      <div className="top">
        <div className="logo" />
        <div className="brand">10-eok</div>
        {screen === "result" && <div className="tag">탭하면 수정</div>}
        {screen === "chat" && <div className="tag">질문 {answers.length + 1}/3</div>}
      </div>

      {screen === "intro" && <Intro onStart={() => setScreen("chat")} />}

      {screen === "compare" && (
        <Compare
          initial={[ticker, ...TICKERS.map((t) => t.symbol).filter((s) => s !== ticker)].slice(0, 3)}
          amount={amount}
          buyDay={buyDay}
          onBack={() => setScreen("result")}
        />
      )}

      {screen === "chat" && (
        <Chat
          answers={answers} ticker={ticker} amount={amount} buyDay={buyDay}
          onTicker={setTicker} onAmount={setAmount} onDay={setBuyDay} onAnswer={answer}
        />
      )}

      {(screen === "loading" || (screen === "result" && !result)) && (
        <div className="overlay">
          <div className="spinner" />
          <div className="ov-msg">계산 중…</div>
        </div>
      )}

      {screen === "result" && result && (
        <div className="reveal" key={revealKey}>
          <div className="chips">
            <button className="chip rv" style={{ ["--i" as string]: 0 }} onClick={() => setEditMode("ticker")}>
              <div className="k">종목</div><div className="v vrow"><TickerLogo symbol={ticker} size={18} />{ticker}</div>
            </button>
            <button className="chip rv" style={{ ["--i" as string]: 0 }} onClick={() => setEditMode("amount")}>
              <div className="k">매달</div><div className="v">{amount}만원</div>
            </button>
            <button className="chip rv" style={{ ["--i" as string]: 0 }} onClick={() => setEditMode("day")}>
              <div className="k">매수일</div><div className="v">{buyDay}일</div>
            </button>
          </div>

          <div className="hero">
            <div className="hero-glow" />
            <div className={"lead rv" + (reached ? "" : " under")} style={{ ["--i" as string]: 1 }}>
              {reached ? "지금 10억이 되려면" : "전 구간 모아도"}
            </div>
            <div className="num pop" style={{ ["--i" as string]: 2 }}>
              {Math.floor(heroMonths / 12)}<span className="u">년</span> {heroMonths % 12}<span className="u">개월</span>
              {reached && <span className="u"> 전부터</span>}
            </div>
            <div className="span rv" style={{ ["--i" as string]: 3 }}>
              {reached
                ? `${result.series[0] ? ym(result.series[0].date) : ""}부터 모았으면 지금 ${eok(result.valueKRW)}`
                : `${result.series[0] ? ym(result.series[0].date) : ""}부터 모아도 지금 ${eok1(result.valueKRW)} · 10억까진 멀어요`}
            </div>
            {reached && <Confetti />}
          </div>

          <div className="card rv" style={{ ["--i" as string]: 4 }}>
            <div className="clab"><span>자산 성장 (KRW)</span><span>목표 10억</span></div>
            <GrowthChart
              series={reached ? sliceToReached(result.series, result.reachedDate!) : result.series}
              target={TARGET} reached={reached}
            />
            <div className="stats">
              <div className="stat"><div className="k">원금</div><div className="v">{eok(animPrincipal)}</div></div>
              <div className="stat"><div className="k">최종 금액</div><div className={"v" + (reached ? " up" : "")}>{eok(result.valueKRW)}</div></div>
              <div className="stat" style={{ cursor: "help" }} onClick={() => setTipOpen((v) => !v)}>
                <div className="k">연평균 ⓘ</div><div className="v up">{pct(result.cagr)}</div>
              </div>
            </div>
          </div>

          {tipOpen && <div id="tip">연평균 {pct(result.cagr)}는 1년에 평균 이만큼씩 늘었다는 뜻이에요. (과거 수익률 기준)</div>}

          <button className="btn share rv" style={{ ["--i" as string]: 5 }} onClick={share}>결과 공유하기</button>
          <button className="btn ghost rv" style={{ ["--i" as string]: 6, marginTop: 10, marginBottom: 24 }} onClick={() => setScreen("compare")}>다른 종목과 비교하기</button>

          {editMode && (
            <div className="editbar">
              {editMode === "ticker" ? (
                <div className="ticker-scroll">
                  {TICKERS.map((t) => (
                    <button key={t.symbol} className={"pick logo-pick" + (t.symbol === ticker ? " sel" : "")} onClick={() => setTicker(t.symbol)}>
                      <TickerLogo symbol={t.symbol} size={20} />{t.symbol}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <span className="lab">{editMode === "amount" ? "매달" : "매수일"}</span>
                  <div className="stepper" style={{ flex: 1, background: "transparent", padding: 0 }}>
                    <button onClick={() => bump(-1)}>−</button>
                    <div className="val">{editMode === "amount" ? `${amount}만원` : `${buyDay}일`}</div>
                    <button onClick={() => bump(1)}>+</button>
                  </div>
                </>
              )}
              <button className="pick sel" onClick={() => setEditMode(null)}>완료</button>
            </div>
          )}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function sliceToReached(series: { date: string; valueKRW: number }[], reachedDate: string) {
  const i = series.findIndex((s) => s.date === reachedDate);
  return i >= 0 ? series.slice(0, i + 1) : series;
}

function Confetti() {
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} style={{ ["--n" as string]: i }} />
      ))}
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <>
      <div className="intro-mid">
        <div className="kick">만약에, 10억</div>
        <h1>과거에 매달 모았다면,<br /><b>10억까지 얼마나</b> 걸렸을까?</h1>
        <div className="sub">고른 종목을 매달 일정 금액씩 샀다고 가정하고,<br />실제 과거 가격과 그날 환율로 계산해 드려요.</div>
      </div>
      <div className="cta">
        <button className="btn" onClick={onStart}>내 결과 보기</button>
        <div className="hint">3가지만 정하면 끝나요 · 약 20초</div>
      </div>
    </>
  );
}

function Chat({
  answers, ticker, amount, buyDay, onTicker, onAmount, onDay, onAnswer,
}: {
  answers: string[]; ticker: string; amount: number; buyDay: number;
  onTicker: (v: string) => void; onAmount: (v: number) => void; onDay: (v: number) => void; onAnswer: (label: string) => void;
}) {
  const QS = ["어떤 종목으로 해볼까요?", "매달 얼마씩 넣을까요?", "매달 며칠에 살까요?"];
  const step = answers.length;
  return (
    <>
      <div className="log">
        {QS.slice(0, step + 1).map((q, i) => (
          <div key={"q" + i}>
            <div className="bub q">{q}</div>
            {i < answers.length && <div className="bub a">{answers[i]}</div>}
          </div>
        ))}
      </div>
      <div className="answer">
        {step === 0 && (
          <>
            <div className="ticker-scroll">
              {TICKERS.map((t) => (
                <button key={t.symbol} className={"pick tall" + (t.symbol === ticker ? " sel" : "")} onClick={() => onTicker(t.symbol)}>
                  <TickerLogo symbol={t.symbol} size={32} />
                  <span className="pcol"><span className="pn">{t.symbol}</span><span className="ps">{t.name}</span></span>
                </button>
              ))}
            </div>
            <button className="btn" onClick={() => onAnswer(ticker)}>다음</button>
          </>
        )}
        {step === 1 && (
          <>
            <div className="stepper">
              <button onClick={() => onAmount(Math.max(10, amount - 10))}>−</button>
              <div className="val">{amount}만원</div>
              <button onClick={() => onAmount(amount + 10)}>+</button>
            </div>
            <button className="btn" onClick={() => onAnswer(`${amount}만원`)}>다음</button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="chips-row">
              {DAYS.map((d) => (
                <button key={d} className={"pick" + (d === buyDay ? " sel" : "")} onClick={() => onDay(d)}>{d}일</button>
              ))}
            </div>
            <button className="btn" onClick={() => onAnswer(`${buyDay}일`)}>결과 보기 →</button>
          </>
        )}
      </div>
    </>
  );
}
