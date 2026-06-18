"use client";
import { useEffect, useMemo, useState } from "react";
import { bundleToRows, type Bundle, type Row } from "@/lib/backtest/types";
import { runBacktest } from "@/lib/backtest/simulate";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";
import { GrowthChart } from "@/components/GrowthChart";
import { eok, eok1, pct, ym } from "@/lib/format";

const TARGET = 1_000_000_000;
const DAYS = [1, 5, 10, 15, 25];

type Screen = "intro" | "chat" | "loading" | "result";

export default function Home() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [screen, setScreen] = useState<Screen>("intro");
  const [answers, setAnswers] = useState<string[]>([]);
  const [amount, setAmount] = useState(100); // 만원
  const [buyDay, setBuyDay] = useState(1);
  const [editMode, setEditMode] = useState<null | "amount" | "day">(null);
  const [tipOpen, setTipOpen] = useState(false);

  useEffect(() => {
    fetch("/data/qld.json")
      .then((r) => {
        if (!r.ok) throw new Error("bundle");
        return r.json();
      })
      .then((b: Bundle) => setRows(bundleToRows(b)))
      .catch(() => setLoadErr(true));
  }, []);

  const result = useMemo(
    () => (rows ? runBacktest(rows, { monthlyKRW: amount * 10000, buyDay, targetKRW: TARGET }) : null),
    [rows, amount, buyDay],
  );

  // 미달 시 hero는 경과 기간을 보여줌(엔진의 months가 곧 경과 개월)
  const months = result?.months ?? 0;
  const animMonths = useAnimatedNumber(months, screen === "result" ? 700 : 0);
  const animPrincipal = useAnimatedNumber(result?.principalKRW ?? 0, screen === "result" ? 700 : 0);

  const reached = !!result?.reached;
  const heroMonths = Math.round(animMonths);
  const heroY = Math.floor(heroMonths / 12);
  const heroM = heroMonths % 12;

  function answer(label: string) {
    const next = [...answers, label];
    setAnswers(next);
    if (next.length === 3) {
      setScreen("loading");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() => setScreen("result"), reduce ? 0 : 800);
    }
  }
  function bump(dir: number) {
    if (editMode === "amount") setAmount((a) => Math.max(10, a + dir * 10));
    else if (editMode === "day") {
      setBuyDay((d) => {
        const i = DAYS.indexOf(d);
        return DAYS[Math.max(0, Math.min(DAYS.length - 1, i + dir))];
      });
    }
  }

  if (loadErr) {
    return (
      <div className="overlay">
        <div className="ov-msg">데이터를 못 불러왔어요.<br />잠시 후 다시 시도해 주세요.</div>
        <button className="btn" style={{ width: "auto", padding: "14px 28px" }} onClick={() => location.reload()}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <main className="app">
      {/* 헤더 */}
      <div className="top">
        <div className="logo" />
        <div className="brand">10-eok</div>
        {screen === "result" && <div className="tag">탭하면 수정</div>}
        {screen === "chat" && <div className="tag">질문 {answers.length + 1}/3</div>}
      </div>

      {screen === "intro" && <Intro onStart={() => setScreen("chat")} />}

      {screen === "chat" && (
        <Chat
          answers={answers}
          amount={amount}
          buyDay={buyDay}
          onAmount={setAmount}
          onDay={setBuyDay}
          onAnswer={answer}
        />
      )}

      {(screen === "loading" || (screen === "result" && !result)) && (
        <div className="overlay">
          <div className="spinner" />
          <div className="ov-msg">계산 중…</div>
        </div>
      )}

      {screen === "result" && result && (
        <>
          <div className="chips">
            <div className="chip"><div className="k">종목</div><div className="v">QLD</div></div>
            <button className="chip" onClick={() => setEditMode("amount")}>
              <div className="k">매달</div><div className="v">{amount}만원</div>
            </button>
            <button className="chip" onClick={() => setEditMode("day")}>
              <div className="k">매수일</div><div className="v">{buyDay}일</div>
            </button>
          </div>

          <div className="hero">
            <div className={"lead" + (reached ? "" : " under")}>
              {reached ? "10억 모으기까지" : "아직 10억은 멀어요"}
            </div>
            <div className="num">
              {heroY}<span className="u">년</span> {heroM}<span className="u">개월</span>
            </div>
            <div className="span">
              {reached && result.reachedDate
                ? `2006년 6월부터 모았다면, ${ym(result.reachedDate)}에 달성`
                : `지금까지 ${eok1(result.valueKRW)} · 계속 모으는 중`}
            </div>
          </div>

          <div className="card">
            <div className="clab"><span>자산 성장 (KRW)</span><span>목표 10억</span></div>
            <GrowthChart
              series={reached ? sliceToReached(result.series, result.reachedDate!) : result.series}
              target={TARGET}
              reached={reached}
            />
            <div className="stats">
              <div className="stat"><div className="k">원금</div><div className="v">{eok(animPrincipal)}</div></div>
              <div className="stat"><div className="k">최종 금액</div><div className={"v" + (reached ? " up" : "")}>{eok(result.valueKRW)}</div></div>
              <div className="stat" style={{ cursor: "help" }} onClick={() => setTipOpen((v) => !v)}>
                <div className="k">연평균 ⓘ</div><div className="v up">{pct(result.cagr)}</div>
              </div>
            </div>
          </div>

          {tipOpen && (
            <div id="tip">연평균 {pct(result.cagr)}는 1년에 평균 이만큼씩 늘었다는 뜻이에요. (QLD 과거 수익률 기준)</div>
          )}

          <button className="btn share">결과 공유하기</button>

          {editMode && (
            <div className="editbar">
              <span className="lab">{editMode === "amount" ? "매달" : "매수일"}</span>
              <div className="stepper" style={{ flex: 1, background: "transparent", padding: 0 }}>
                <button onClick={() => bump(-1)}>−</button>
                <div className="val">{editMode === "amount" ? `${amount}만원` : `${buyDay}일`}</div>
                <button onClick={() => bump(1)}>+</button>
              </div>
              <button className="pick sel" onClick={() => setEditMode(null)}>완료</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

function sliceToReached(series: { date: string; valueKRW: number }[], reachedDate: string) {
  const i = series.findIndex((s) => s.date === reachedDate);
  return i >= 0 ? series.slice(0, i + 1) : series;
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <>
      <div className="intro-mid">
        <div className="kick">만약에, 10억</div>
        <h1>과거에 매달 모았다면,<br /><b>10억까지 얼마나</b> 걸렸을까?</h1>
        <div className="sub">QLD를 매달 일정 금액씩 샀다고 가정하고,<br />실제 과거 가격과 그날 환율로 계산해 드려요.</div>
      </div>
      <div className="cta">
        <button className="btn" onClick={onStart}>내 결과 보기</button>
        <div className="hint">3가지만 정하면 끝나요 · 약 20초</div>
      </div>
    </>
  );
}

function Chat({
  answers, amount, buyDay, onAmount, onDay, onAnswer,
}: {
  answers: string[];
  amount: number;
  buyDay: number;
  onAmount: (v: number) => void;
  onDay: (v: number) => void;
  onAnswer: (label: string) => void;
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
            <div className="chips-row">
              <button className="pick sel">QLD</button>
              <button className="pick" disabled>준비 중</button>
            </div>
            <button className="btn" onClick={() => onAnswer("QLD")}>다음</button>
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
