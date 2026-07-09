// UI 문자열 사전. 타입 Dict로 전 로케일 강제(en 미완성 시 tsc가 잡아줌). ko가 기준.
//  · 서버 컴포넌트(SiteHeader/Footer)는 getDict(locale)를 직접 호출.
//  · 클라이언트(BacktestApp·GrowthChart·MonthlyLog)도 getMarket/getFormatter와 동일하게 getDict(locale) 조회.
//  · 숫자/날짜 "포맷"(억/만·$·년월)은 여기 두지 않고 format.ts(getFormatter)에 위임. 여기엔 "카피"만.
//  · 보간·어순은 함수 엔트리로, <b> 강조가 든 문장은 {pre,bold,post} 파츠로(컴포넌트가 <b>로 감쌈 — 사전은 순수 데이터).
// ⚠️ ko 값은 현재 렌더 문자열과 바이트 단위로 동일해야 한다(LOCALES=ko만 공개 중). en은 P3-b에서 채우되 활성화(LOCALES)는 검증 후.
import type { Locale } from "./locales";

/** <b> 강조가 문장 중간에 든 카피. 컴포넌트가 {pre}<b>{bold}</b>{post}로 렌더. */
type BoldParts = { pre: string; bold: string; post: string };

export type Dict = {
  nav: {
    compare: string;
    guides: string;
    howItWorks: string;
    about: string;
    contact: string;
    home: string;
    privacy: string;
    terms: string;
  };
  a11y: { brandHome: string; siteMenu: string; language: string };
  footerDisclaimer: string;

  /** BacktestApp(계산기) UI 카피 */
  calc: {
    day: { last: string; nth: (d: number) => string };
    timing: {
      title: string;
      lead: (amount: string, years: number) => BoldParts;
      worst: string;
      median: string;
      best: string;
      note: (worst: string, best: string, samples: number) => string;
      bridge: {
        reachedMedianBelow: (value: string, medRough: string, goal: string) => string;
        reachedMedianAbove: (medRough: string, goal: string, min: string) => string;
        notReached: (medRough: string, min: string, max: string) => string;
      };
    };
    share: {
      lumpOnly: (name: string, goal: string) => string;
      amountMode: (name: string, years: number, goal: string, monthly: string) => string;
      timeReached: (name: string, lumpStr: string, monthly: string, goal: string, years: number, months: number) => string;
      timeNotReached: (name: string, goal: string) => string;
    };
    toast: { linkCopied: string };
    error: { loadFailed: { line1: string; line2: string }; retry: string };
    result: { tapToEdit: string; shareButton: string };
    loading: { calculating: string };
    mode: {
      timeTab: string;
      amountTab: string;
      capTime: (goal: string) => BoldParts;
      capAmount: (goal: string) => BoldParts;
    };
    chip: {
      ticker: string;
      monthly: string;
      period: string;
      lump: string;
      buyDay: string;
      goal: string;
      none: string;
      periodValue: (y: number) => string;
    };
    dropdown: {
      monthlyLabel: string;
      yearsLabel: (max: number) => string;
      lumpLabel: string;
      buyDayLabel: string;
      goalLabel: string;
    };
    units: { years: string; day: string };
    hero: {
      lumpOnlyLead: string;
      achieved: string;
      lumpOnlySpan: (years: number, value: string) => string;
      amountLead: (years: number, goal: string) => string;
      amountSpan: (name: string, lumpStr: string, principal: string, value: string) => string;
      timeLeadReached: (lumpStr: string, monthly: string) => string;
      timeLeadUnder: string;
      durYear: string;
      durMonth: string;
      durIn: string;
      timeSpanReached: (goal: string, from: string, value: string) => string;
      timeSpanUnder: (from: string, rough: string, goal: string) => string;
    };
    card: {
      growthTitle: (currency: string) => string;
      goalLabel: (goal: string) => string;
      monthlyLogTitle: string;
      buyDaySummary: (day: string, monthly: string) => string;
      monthlyLogLead: string;
    };
    stat: { principal: string; finalValue: string; cagr: string };
    tip: { cagr: (pct: string) => string; reinvest: string };
    opt: { inflationLabel: string; inflationDesc: string; reinvestLabel: string; reinvestDesc: string };
    stepper: { decrease: string; increase: string };
    intro: {
      titleBold: string;
      titleRest: string;
      sub: BoldParts;
      disclaimer: string;
      startButton: string;
      hint: (count: number) => string;
    };
    form: {
      capTime: BoldParts;
      capAmount: BoldParts;
      tickerLabel: string;
      lumpLabel: string;
      monthlyLabel: string;
      yearsLabel: (max: number) => string;
      buyDayLabel: string;
      submitAmount: string;
      submitTime: string;
    };
    select: { searchPlaceholder: string; empty: string };
    /** 데이터 특성 안내 — 합성 접합(상장 이전 근사)·짧은 이력. */
    dataNote: { synthetic: (label: string) => string; short: string };
  };

  /** GrowthChart(자산 성장 차트) */
  chart: { readoutPrincipal: string; hoverHint: string };

  /** MonthlyLog(월별 기록) */
  monthlyLog: {
    reached: (label: string) => string;
    reachedGoal: (label: string) => string;
    breakthrough: (label: string) => string;
    header: { month: string; principal: string; value: string; return: string };
  };

  /** /etf/[symbol] 종목 상세 페이지 */
  etf: {
    metaTitle: (label: string, monthly: string, goal: string) => string;
    metaDesc: (display: string, monthly: string, goal: string) => string;
    pageTitle: (label: string) => string;
    pageDesc: (monthly: string, goal: string) => string;
    crumb: (label: string) => string;
    reachedHeadline: (monthly: string, years: number, months: number, goal: string) => string;
    reachedDetail: (from: string, value: string, principal: string, cagr: string) => string;
    notReachedHeadline: (goal: string) => string;
    notReachedDetail: (value: string, principal: string, cagr: string) => string;
    note: (buyDay: string, goal: string, priceBasis: string) => string;
    priceBasisFx: string;
    priceBasisPlain: string;
    cta: string;
    fallbackHeading: string;
    fallbackBody: (from: string) => string;
    editHint: string;
    relatedHeading: string;
    compareLink: (n: number) => string;
    howItWorksLink: string;
    legalNote: string;
    fallbackBlurb: (name: string) => string;
  };
};

// ─────────────────────────────────────────────────────────────
// ko — 현재 렌더 문자열 그대로(바이트 불변 기준)
// ─────────────────────────────────────────────────────────────
const ko: Dict = {
  nav: {
    compare: "종목 비교",
    guides: "투자 가이드",
    howItWorks: "계산 방법",
    about: "소개",
    contact: "문의",
    home: "홈",
    privacy: "개인정보처리방침",
    terms: "이용약관",
  },
  a11y: { brandHome: "10-eok 홈", siteMenu: "사이트 메뉴", language: "언어" },
  footerDisclaimer:
    "10-eok은 실제 과거 데이터를 이용한 백테스트 결과를 보여주는 정보 제공 서비스입니다. " +
    "과거 수익률은 미래 수익을 보장하지 않으며, 본 서비스의 어떤 내용도 투자 권유나 투자 " +
    "자문이 아닙니다. 투자 결정과 그 결과에 대한 책임은 이용자 본인에게 있습니다. " +
    "가격 데이터는 Yahoo Finance, 환율은 미국 세인트루이스 연방준비은행(FRED)에서 가져옵니다.",

  calc: {
    day: { last: "말일", nth: (d) => `${d}일` },
    timing: {
      title: "시작한 달에 따라 이렇게 달라져요",
      lead: (amount, years) => ({
        pre: `매달 같은 ${amount}을 똑같이 ${years}년 넣어도, `,
        bold: "시작한 달",
        post: "이 언제였냐에 따라 최종 금액이 이만큼 갈렸어요.",
      }),
      worst: "운 나빴다면",
      median: "보통이면",
      best: "운 좋았다면",
      note: (worst, best, samples) => `최악: ${worst} 시작 · 최선: ${best} · 과거 시작 시점 ${samples}개 비교`,
      bridge: {
        reachedMedianBelow: (value, medRough, goal) =>
          `위의 ${value}은 이 중 운이 좋았던 편이에요. 보통이면 ${medRough}으로, ${goal}엔 조금 못 미쳐요.`,
        reachedMedianAbove: (medRough, goal, min) =>
          `보통이면 ${medRough}으로 ${goal}을 넘겨요. 다만 시작이 나빴다면 ${min}까지 낮아졌어요.`,
        notReached: (medRough, min, max) =>
          `보통이면 ${medRough}이고, 시작한 달에 따라 ${min}~${max}까지 갈렸어요.`,
      },
    },
    share: {
      lumpOnly: (name, goal) => `${name} · 초기 투자금만으로 ${goal} 달성!`,
      amountMode: (name, years, goal, monthly) => `${name}로 ${years}년 안에 ${goal} 모으려면 매달 ${monthly}!`,
      timeReached: (name, lumpStr, monthly, goal, years, months) =>
        `${name}에${lumpStr ? ` ${lumpStr}으로 시작해` : ""} 매달 ${monthly}씩 모았다면 ${goal}까지 ${years}년 ${months}개월!`,
      timeNotReached: (name, goal) => `${name} 적립 백테스트 — ${goal}까지 얼마나 걸릴까?`,
    },
    toast: { linkCopied: "링크가 복사됐어요" },
    error: {
      loadFailed: { line1: "데이터를 못 불러왔어요.", line2: "잠시 후 다시 시도해 주세요." },
      retry: "다시 시도",
    },
    result: { tapToEdit: "탭하면 변경", shareButton: "결과 공유하기" },
    loading: { calculating: "계산 중…" },
    mode: {
      timeTab: "기간이 궁금",
      amountTab: "금액이 궁금",
      capTime: (goal) => ({ pre: "매달 정한 금액으로 ", bold: `${goal}까지 몇 년`, post: " 걸리는지" }),
      capAmount: (goal) => ({ pre: `정한 기간 안에 ${goal}을 모으려면 `, bold: "매달 얼마씩", post: " 넣을지" }),
    },
    chip: {
      ticker: "종목",
      monthly: "매달",
      period: "기간",
      lump: "초기금",
      buyDay: "매수일",
      goal: "목표",
      none: "없음",
      periodValue: (y) => `${y}년 안에`,
    },
    dropdown: {
      monthlyLabel: "매달 적립 금액",
      yearsLabel: (max) => `목표 기간 (최대 ${max}년)`,
      lumpLabel: "초기 투자금",
      buyDayLabel: "매수일 (매달 며칠 · 29일은 말일)",
      goalLabel: "목표 금액",
    },
    units: { years: "년", day: "일" },
    hero: {
      lumpOnlyLead: "초기 투자금만으로",
      achieved: "달성",
      lumpOnlySpan: (years, value) => `${years}년 전 초기 투자금만으로 이미 ${value} · 매달 적립 없이도 OK`,
      amountLead: (years, goal) => `${years}년 안에 ${goal}, 매달`,
      amountSpan: (name, lumpStr, principal, value) =>
        `${name} 기준${lumpStr ? ` · 초기 ${lumpStr} 포함` : ""} · 원금 ${principal} 넣어 ${value} 만들기`,
      timeLeadReached: (lumpStr, monthly) => `${lumpStr ? `${lumpStr}으로 시작해 ` : ""}매달 ${monthly}씩이면`,
      timeLeadUnder: "전 구간 모아도",
      durYear: "년",
      durMonth: "개월",
      durIn: " 만에",
      timeSpanReached: (goal, from, value) => `${goal}을 모을 수 있어요 · ${from}부터 모았다면 지금 ${value}`,
      timeSpanUnder: (from, rough, goal) => `${from}부터 모아도 지금 ${rough} · ${goal}까진 멀어요`,
    },
    card: {
      growthTitle: (currency) => `자산 성장 (${currency})`,
      goalLabel: (goal) => `목표 ${goal}`,
      monthlyLogTitle: "월별 기록",
      buyDaySummary: (day, monthly) => `매수일 ${day} · ${monthly}`,
      monthlyLogLead: "달마다 계좌가 얼마였는지 연도별로 접어뒀어요. 연도를 누르면 펼쳐져요.",
    },
    stat: { principal: "원금", finalValue: "최종 금액", cagr: "연평균" },
    tip: {
      cagr: (pct) => `연평균 ${pct}는 1년에 평균 이만큼씩 늘었다는 뜻이에요. (과거 수익률 기준)`,
      reinvest: "받은 배당으로 같은 종목을 다시 사 모으는 방식이에요. 끄면 배당을 뺀 주가만의 수익(가격수익)으로 계산합니다.",
    },
    opt: { inflationLabel: "물가만큼 매년 인상", inflationDesc: "적립액을 물가지수만큼 올림", reinvestLabel: "배당 재투자", reinvestDesc: "끄면 주가만(가격수익), 배당 제외" },
    stepper: { decrease: "줄이기", increase: "늘리기" },
    intro: {
      titleBold: "10억 모으기",
      titleRest: "얼마나 걸릴까?",
      sub: {
        pre: "QLD·QQQ·SPY 같은 ETF를 매달 일정 금액씩 모았다면 목표 10억 원까지 얼마나 걸렸을지, 가정 수익률이 아니라 ",
        bold: "실제 과거의 일별 주가와 그날의 원/달러 환율",
        post: "로 계산해 드려요.",
      },
      disclaimer: "교육·정보 제공용 백테스트입니다. 투자 권유가 아니며, 과거 수익은 미래를 보장하지 않습니다.",
      startButton: "계산 시작하기",
      hint: (count) => `종목·금액·날짜만 정하면 끝 · 아래에서 ${count}개 ETF 결과 비교와 투자 가이드도 볼 수 있어요`,
    },
    form: {
      capTime: { pre: "매달 정한 금액으로 ", bold: "10억까지 몇 년", post: " 걸리는지 계산해요" },
      capAmount: { pre: "정한 기간 안에 10억을 모으려면 ", bold: "매달 얼마씩", post: " 넣을지 계산해요" },
      tickerLabel: "어떤 종목을 모을까요?",
      lumpLabel: "시작할 때 넣을 목돈이 있나요? (없으면 0)",
      monthlyLabel: "매달 얼마씩 넣을까요?",
      yearsLabel: (max) => `몇 년 안에 모을까요? (최대 ${max}년)`,
      buyDayLabel: "매달 며칠에 살까요? (29일은 말일)",
      submitAmount: "필요 금액 계산하기",
      submitTime: "10억까지 계산하기",
    },
    select: { searchPlaceholder: "종목 검색 (이름·티커)", empty: "검색 결과 없음" },
    dataNote: {
      synthetic: (label) =>
        `상장 이전 구간은 ${label}로 대체한 근사치입니다. 같은 전략의 지수를 이어 붙인 것이라 실제 운용 결과와는 다를 수 있어요.`,
      short: "상장한 지 얼마 되지 않아 데이터 기간이 짧습니다. 장기 적립 결과로 해석할 때 유의하세요.",
    },
  },

  chart: { readoutPrincipal: "원금", hoverHint: "차트를 짚으면 그때의 결과가 보여요" },

  monthlyLog: {
    reached: (label) => `${label} 달성`,
    reachedGoal: (label) => `${label} 달성 — 목표 도달`,
    breakthrough: (label) => `${label} 돌파`,
    header: { month: "월", principal: "원금", value: "금액", return: "수익" },
  },

  etf: {
    metaTitle: (label, monthly, goal) => `${label} 적립식 백테스트 — 매달 ${monthly}이면 ${goal}까지? · 10-eok`,
    metaDesc: (display, monthly, goal) =>
      `${display}에 매달 ${monthly}씩 적립했다면 ${goal}까지 얼마나 걸렸을지, 실제 과거 가격으로 계산한 결과와 직접 계산하는 도구를 제공합니다.`,
    pageTitle: (label) => `${label} 적립식 백테스트`,
    pageDesc: (monthly, goal) => `매달 ${monthly}씩 모았다면 ${goal}까지 얼마나 걸렸을까`,
    crumb: (label) => `종목 · ${label}`,
    reachedHeadline: (monthly, years, months, goal) => `매달 ${monthly}씩이면 약 ${years}년 ${months}개월 만에 ${goal}`,
    reachedDetail: (from, value, principal, cagr) => `${from}부터 모았다면 지금 약 ${value} · 원금 ${principal} · 연평균 ${cagr}`,
    notReachedHeadline: (goal) => `아직 ${goal}까지는 더 걸려요`,
    notReachedDetail: (value, principal, cagr) => `전 구간 모아도 지금 약 ${value} · 원금 ${principal} · 연평균 ${cagr}`,
    note: (buyDay, goal, priceBasis) =>
      `※ 매수일 ${buyDay} · 목표 ${goal} · 실제 과거 ${priceBasis} 기준. 과거 수익률은 미래를 보장하지 않습니다.`,
    priceBasisFx: "가격과 그날 환율",
    priceBasisPlain: "가격",
    cta: "내 조건으로 직접 계산해보기 →",
    fallbackHeading: "이 결과를 어떻게 읽어야 하나",
    fallbackBody: (from) =>
      `위 숫자는 ${from ? `${from}부터 ` : ""}매달 같은 날 같은 금액을 적립했다고 가정한 과거 시뮬레이션입니다. 실제로는 매수 타이밍·세금·수수료·심리적 요인이 모두 다르게 작용합니다. 특히 레버리지 상품은 같은 구간이라도 시작 시점에 따라 결과가 크게 달라집니다.`,
    editHint: "금액·매수일·목표 금액을 바꿔 보고 싶다면 위 버튼으로 직접 계산해 보세요.",
    relatedHeading: "함께 읽어보세요",
    compareLink: (n) => `${n}개 ETF 비교`,
    howItWorksLink: "계산 방법 & 자주 묻는 질문",
    legalNote: "본 내용은 정보 제공이며 투자 권유나 자문이 아닙니다. 투자 결정은 스스로 판단하셔야 합니다.",
    fallbackBlurb: (name) => `${name} 적립식 백테스트 결과입니다.`,
  },
};

// ─────────────────────────────────────────────────────────────
// en — USD 시장. 예시 숫자 $ 현지화, 환율(원/달러) 언급 제거(원자산 USD). 활성화는 검증 후.
// ─────────────────────────────────────────────────────────────
const en: Dict = {
  nav: {
    compare: "Compare",
    guides: "Guides",
    howItWorks: "How it works",
    about: "About",
    contact: "Contact",
    home: "Home",
    privacy: "Privacy Policy",
    terms: "Terms",
  },
  a11y: { brandHome: "10-eok home", siteMenu: "Site menu", language: "Language" },
  footerDisclaimer:
    "10-eok is an informational service that shows backtest results from real historical data. " +
    "Past returns do not guarantee future results, and nothing here is investment advice or a " +
    "solicitation. You alone are responsible for your investment decisions and their outcomes. " +
    "Price data is from Yahoo Finance, and economic data from the Federal Reserve Bank of St. Louis (FRED).",

  calc: {
    day: { last: "Last day", nth: (d) => `Day ${d}` },
    timing: {
      title: "It depends on when you started",
      lead: (amount, years) => ({
        pre: `Investing the same ${amount} for the same ${years} years, `,
        bold: "the month you started",
        post: " alone swung the final value this much.",
      }),
      worst: "Unlucky start",
      median: "Typical",
      best: "Lucky start",
      note: (worst, best, samples) => `Worst: started ${worst} · Best: ${best} · ${samples} past start points compared`,
      bridge: {
        reachedMedianBelow: (value, medRough, goal) =>
          `The ${value} above was on the lucky side. A typical start lands around ${medRough}, a bit short of ${goal}.`,
        reachedMedianAbove: (medRough, goal, min) =>
          `A typical start clears ${goal} at around ${medRough}. A bad start, though, fell as low as ${min}.`,
        notReached: (medRough, min, max) =>
          `A typical start lands around ${medRough}, ranging from ${min} to ${max} depending on the month you began.`,
      },
    },
    share: {
      lumpOnly: (name, goal) => `${name} · reached ${goal} from the lump sum alone!`,
      amountMode: (name, years, goal, monthly) => `With ${name}, reaching ${goal} in ${years} years takes ${monthly}/month!`,
      timeReached: (name, lumpStr, monthly, goal, years, months) =>
        `Investing ${monthly}/month in ${name}${lumpStr ? ` starting with ${lumpStr}` : ""} reached ${goal} in ${years}y ${months}m!`,
      timeNotReached: (name, goal) => `${name} DCA backtest — how long to ${goal}?`,
    },
    toast: { linkCopied: "Link copied" },
    error: {
      loadFailed: { line1: "Couldn't load the data.", line2: "Please try again in a moment." },
      retry: "Retry",
    },
    result: { tapToEdit: "Tap to edit", shareButton: "Share result" },
    loading: { calculating: "Calculating…" },
    mode: {
      timeTab: "How long?",
      amountTab: "How much?",
      capTime: (goal) => ({ pre: "Investing a fixed amount monthly, ", bold: `how many years to ${goal}`, post: "" }),
      capAmount: (goal) => ({ pre: `To reach ${goal} within a set time, `, bold: "how much per month", post: "" }),
    },
    chip: {
      ticker: "Ticker",
      monthly: "Monthly",
      period: "Period",
      lump: "Lump",
      buyDay: "Buy day",
      goal: "Goal",
      none: "None",
      periodValue: (y) => `within ${y}y`,
    },
    dropdown: {
      monthlyLabel: "Monthly contribution",
      yearsLabel: (max) => `Target period (max ${max}y)`,
      lumpLabel: "Initial lump sum",
      buyDayLabel: "Buy day (day of month · 29 = last day)",
      goalLabel: "Goal amount",
    },
    units: { years: "yr", day: "" },
    hero: {
      lumpOnlyLead: "From the lump sum alone",
      achieved: "reached",
      lumpOnlySpan: (years, value) => `Already ${value} from the lump sum ${years} years ago · no monthly needed`,
      amountLead: (years, goal) => `${goal} in ${years} years, monthly`,
      amountSpan: (name, lumpStr, principal, value) =>
        `Based on ${name}${lumpStr ? ` · incl. ${lumpStr} lump` : ""} · invest ${principal} to build ${value}`,
      timeLeadReached: (lumpStr, monthly) => `${lumpStr ? `Starting with ${lumpStr}, ` : ""}investing ${monthly} monthly`,
      timeLeadUnder: "Even over the full period",
      durYear: "y",
      durMonth: "m",
      durIn: " to reach",
      timeSpanReached: (goal, from, value) => `you can reach ${goal} · starting from ${from}, that's ${value} today`,
      timeSpanUnder: (from, rough, goal) => `from ${from} it's ${rough} today · still far from ${goal}`,
    },
    card: {
      growthTitle: (currency) => `Asset growth (${currency})`,
      goalLabel: (goal) => `Goal ${goal}`,
      monthlyLogTitle: "Month by month",
      buyDaySummary: (day, monthly) => `Buy day ${day} · ${monthly}`,
      monthlyLogLead: "How much your account held each month, folded by year. Tap a year to expand.",
    },
    stat: { principal: "Invested", finalValue: "Final value", cagr: "Annualized" },
    tip: {
      cagr: (pct) => `Annualized ${pct} means it grew about this much per year on average. (Based on past returns.)`,
      reinvest: "Reinvesting means buying more of the same fund with the dividends you receive. Turn it off to calculate price-only returns, without dividends.",
    },
    opt: { inflationLabel: "Raise yearly with inflation", inflationDesc: "Increase contributions by the CPI", reinvestLabel: "Reinvest dividends", reinvestDesc: "Off = price return only, dividends excluded" },
    stepper: { decrease: "Decrease", increase: "Increase" },
    intro: {
      titleBold: "Reaching $1M",
      titleRest: "how long does it take?",
      sub: {
        pre: "If you'd invested a fixed amount every month in an ETF like QQQ, SPY, or VOO toward a $1M goal — we compute it with ",
        bold: "real historical daily prices",
        post: ", not assumed returns.",
      },
      disclaimer: "An educational, informational backtest. Not investment advice; past returns don't guarantee the future.",
      startButton: "Start",
      hint: (count) => `Just pick a ticker, amount, and date · compare ${count} ETFs and read the guides below`,
    },
    form: {
      capTime: { pre: "Investing a fixed amount monthly — ", bold: "how many years to $1M", post: "" },
      capAmount: { pre: "To reach $1M within a set time — ", bold: "how much per month", post: "" },
      tickerLabel: "Which ticker?",
      lumpLabel: "Any starting lump sum? (0 if none)",
      monthlyLabel: "How much each month?",
      yearsLabel: (max) => `In how many years? (max ${max}y)`,
      buyDayLabel: "Which day each month? (29 = last day)",
      submitAmount: "Calculate the amount",
      submitTime: "Calculate to $1M",
    },
    select: { searchPlaceholder: "Search ticker (name or symbol)", empty: "No results" },
    dataNote: {
      synthetic: (label) =>
        `The period before this fund's inception is approximated with ${label}. It splices in a same-strategy index, so it may differ from the fund's actual results.`,
      short: "This fund launched recently, so its history is short. Interpret long-term accumulation results with care.",
    },
  },

  chart: { readoutPrincipal: "Invested", hoverHint: "Touch the chart to see the result at that point" },

  monthlyLog: {
    reached: (label) => `${label} reached`,
    reachedGoal: (label) => `${label} reached — goal met`,
    breakthrough: (label) => `${label} passed`,
    header: { month: "Month", principal: "Invested", value: "Value", return: "Return" },
  },

  etf: {
    metaTitle: (label, monthly, goal) => `${label} DCA Backtest — ${monthly}/month to ${goal}? · 10-eok`,
    metaDesc: (display, monthly, goal) =>
      `${display} DCA backtest: if you'd invested ${monthly} every month, see how long it took to reach ${goal} using real historical prices — plus a calculator to run your own numbers.`,
    pageTitle: (label) => `${label} DCA Backtest`,
    pageDesc: (monthly, goal) => `If you'd invested ${monthly} every month, how long to ${goal}?`,
    crumb: (label) => `Ticker · ${label}`,
    reachedHeadline: (monthly, years, months, goal) => `Investing ${monthly}/month reaches ${goal} in about ${years}y ${months}m`,
    reachedDetail: (from, value, principal, cagr) => `Investing since ${from}, that's about ${value} today · invested ${principal} · annualized ${cagr}`,
    notReachedHeadline: (goal) => `Still has a way to go to reach ${goal}`,
    notReachedDetail: (value, principal, cagr) => `Even over the full period, that's about ${value} today · invested ${principal} · annualized ${cagr}`,
    note: (buyDay, goal, priceBasis) =>
      `※ Buy day: ${buyDay} · Goal: ${goal} · Based on actual past ${priceBasis}. Past returns don't guarantee the future.`,
    priceBasisFx: "prices and that day's exchange rate",
    priceBasisPlain: "prices",
    cta: "Try it with your own numbers →",
    fallbackHeading: "How to read this result",
    fallbackBody: (from) =>
      `The figures above are a historical simulation assuming you invested the same amount on the same day every month${from ? ` starting ${from}` : ""}. In reality, timing, taxes, fees, and psychology all play a role. Leveraged products in particular can produce very different results depending on when you start, even over the same period.`,
    editHint: "Want to change the amount, buy day, or goal? Use the button above to calculate it yourself.",
    relatedHeading: "Related reading",
    compareLink: (n) => `Compare ${n} ETFs`,
    howItWorksLink: "How it works & FAQ",
    legalNote: "This content is for informational purposes and is not investment advice or a recommendation. You are solely responsible for your investment decisions.",
    fallbackBlurb: (name) => `${name} DCA backtest results.`,
  },
};

// ─────────────────────────────────────────────────────────────
// ja — JPY 시장. 億/万円, ドル/円 환율(ja/de엔 환율이 핵심 가치). です・ます 친근체. 활성화는 검증 후.
// ─────────────────────────────────────────────────────────────
const ja: Dict = {
  nav: {
    compare: "銘柄比較",
    guides: "投資ガイド",
    howItWorks: "計算方法",
    about: "サービス紹介",
    contact: "お問い合わせ",
    home: "ホーム",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
  },
  a11y: { brandHome: "10-eok ホーム", siteMenu: "サイトメニュー", language: "言語" },
  footerDisclaimer:
    "10-eok は、実際の過去データを使ったバックテスト結果をお見せする情報提供サービスです。" +
    "過去のリターンは将来の収益を保証するものではなく、本サービスのいかなる内容も投資勧誘や投資" +
    "助言ではありません。投資の判断とその結果についての責任は利用者ご自身にあります。" +
    "価格データは Yahoo Finance、為替・経済データは米セントルイス連邦準備銀行(FRED)から取得しています。",

  calc: {
    day: { last: "末日", nth: (d) => `${d}日` },
    timing: {
      title: "始めた月によって、こんなに変わります",
      lead: (amount, years) => ({
        pre: `同じ${amount}を同じように${years}年間積み立てても、`,
        bold: "始めた月",
        post: "がいつだったかで、最終評価額がこれだけ変わりました。",
      }),
      worst: "運が悪いと",
      median: "普通なら",
      best: "運が良いと",
      note: (worst, best, samples) => `最悪: ${worst}スタート · 最良: ${best} · 過去の開始時点${samples}件を比較`,
      bridge: {
        reachedMedianBelow: (value, medRough, goal) =>
          `上の${value}は運が良かったほうです。普通なら${medRough}ほどで、${goal}には少し届きません。`,
        reachedMedianAbove: (medRough, goal, min) =>
          `普通なら${medRough}ほどで${goal}を超えます。ただ、始めた時期が悪いと${min}まで下がりました。`,
        notReached: (medRough, min, max) =>
          `普通なら${medRough}ほどで、始めた月によって${min}〜${max}まで変わりました。`,
      },
    },
    share: {
      lumpOnly: (name, goal) => `${name} · 初期資金だけで${goal}達成!`,
      amountMode: (name, years, goal, monthly) => `${name}で${years}年以内に${goal}を貯めるには毎月${monthly}!`,
      timeReached: (name, lumpStr, monthly, goal, years, months) =>
        `${name}に${lumpStr ? `${lumpStr}で始めて` : ""}毎月${monthly}ずつ積み立てたら${goal}まで${years}年${months}か月!`,
      timeNotReached: (name, goal) => `${name}積立バックテスト — ${goal}まで何年かかる?`,
    },
    toast: { linkCopied: "リンクをコピーしました" },
    error: {
      loadFailed: { line1: "データを読み込めませんでした。", line2: "しばらくしてからもう一度お試しください。" },
      retry: "再試行",
    },
    result: { tapToEdit: "タップで変更", shareButton: "結果をシェア" },
    loading: { calculating: "計算中…" },
    mode: {
      timeTab: "期間を知りたい",
      amountTab: "金額を知りたい",
      capTime: (goal) => ({ pre: "毎月決めた金額で ", bold: `${goal}まで何年`, post: "かかるか" }),
      capAmount: (goal) => ({ pre: `決めた期間内に${goal}を貯めるには `, bold: "毎月いくらずつ", post: "入れるか" }),
    },
    chip: {
      ticker: "銘柄",
      monthly: "毎月",
      period: "期間",
      lump: "初期資金",
      buyDay: "買付日",
      goal: "目標",
      none: "なし",
      periodValue: (y) => `${y}年以内`,
    },
    dropdown: {
      monthlyLabel: "毎月の積立額",
      yearsLabel: (max) => `目標期間 (最大${max}年)`,
      lumpLabel: "初期投資額",
      buyDayLabel: "買付日 (毎月何日 · 29日は末日)",
      goalLabel: "目標金額",
    },
    units: { years: "年", day: "" },
    hero: {
      lumpOnlyLead: "初期資金だけで",
      achieved: "達成",
      lumpOnlySpan: (years, value) => `${years}年前の初期資金だけで、すでに${value} · 毎月の積立なしでもOK`,
      amountLead: (years, goal) => `${years}年で${goal}、毎月`,
      amountSpan: (name, lumpStr, principal, value) =>
        `${name}基準${lumpStr ? ` · 初期${lumpStr}を含む` : ""} · 元本${principal}を入れて${value}をつくる`,
      timeLeadReached: (lumpStr, monthly) => `${lumpStr ? `${lumpStr}で始めて ` : ""}毎月${monthly}ずつなら`,
      timeLeadUnder: "全期間積み立てても",
      durYear: "年",
      durMonth: "か月",
      durIn: "で",
      timeSpanReached: (goal, from, value) => `${goal}に到達できます · ${from}から積み立てたら今は${value}`,
      timeSpanUnder: (from, rough, goal) => `${from}から積み立てても今は${rough} · ${goal}にはまだ遠いです`,
    },
    card: {
      growthTitle: (currency) => `資産の成長 (${currency})`,
      goalLabel: (goal) => `目標 ${goal}`,
      monthlyLogTitle: "月ごとの記録",
      buyDaySummary: (day, monthly) => `買付日 ${day} · ${monthly}`,
      monthlyLogLead: "毎月口座がいくらだったかを年ごとにまとめてあります。年をタップすると開きます。",
    },
    stat: { principal: "元本", finalValue: "最終評価額", cagr: "年平均" },
    tip: {
      cagr: (pct) => `年平均${pct}は、1年で平均このくらい増えたという意味です。(過去のリターン基準)`,
      reinvest: "受け取った配当で同じ銘柄を買い増すことです。オフにすると配当を除いた株価だけのリターン(価格リターン)で計算します。",
    },
    opt: { inflationLabel: "物価に合わせて毎年増額", inflationDesc: "積立額を物価指数(CPI)の分だけ引き上げ", reinvestLabel: "配当を再投資", reinvestDesc: "オフにすると株価のみ(価格リターン)、配当を除外" },
    stepper: { decrease: "減らす", increase: "増やす" },
    intro: {
      titleBold: "1億円を貯めるのに",
      titleRest: "何年かかる?",
      sub: {
        pre: "QQQ・SPY・VOO のような ETF を毎月一定額ずつ積み立てたら、目標の1億円までどれくらいかかったか。仮定のリターンではなく、",
        bold: "実際の過去の日次株価と、その日のドル/円 為替レート",
        post: "で計算します。",
      },
      disclaimer: "教育・情報提供のためのバックテストです。投資勧誘ではなく、過去のリターンは将来を保証しません。",
      startButton: "計算をはじめる",
      hint: (count) => `銘柄・金額・日付を決めるだけ · 下では${count}件のETF結果の比較や投資ガイドも見られます`,
    },
    form: {
      capTime: { pre: "毎月決めた金額で ", bold: "1億円まで何年", post: "かかるか計算します" },
      capAmount: { pre: "決めた期間内に1億円を貯めるには ", bold: "毎月いくらずつ", post: "入れるか計算します" },
      tickerLabel: "どの銘柄を積み立てますか?",
      lumpLabel: "始めるときに入れる初期資金はありますか?(なければ0)",
      monthlyLabel: "毎月いくらずつ入れますか?",
      yearsLabel: (max) => `何年で貯めますか?(最大${max}年)`,
      buyDayLabel: "毎月何日に買いますか?(29日は末日)",
      submitAmount: "必要な金額を計算する",
      submitTime: "1億円まで計算する",
    },
    select: { searchPlaceholder: "銘柄検索 (名前・ティッカー)", empty: "検索結果なし" },
    dataNote: {
      synthetic: (label) =>
        `上場前の期間は${label}で代用した近似値です。同じ戦略の指数をつないでいるため、実際の運用結果とは異なる場合があります。`,
      short: "上場してから日が浅く、データ期間が短めです。長期積立の結果として解釈する際はご注意ください。",
    },
  },

  chart: { readoutPrincipal: "元本", hoverHint: "チャートをなぞると、その時点の結果が見られます" },

  monthlyLog: {
    reached: (label) => `${label}達成`,
    reachedGoal: (label) => `${label}達成 — 目標到達`,
    breakthrough: (label) => `${label}突破`,
    header: { month: "月", principal: "元本", value: "評価額", return: "リターン" },
  },

  etf: {
    metaTitle: (label, monthly, goal) => `${label}積立バックテスト — 毎月${monthly}なら${goal}まで何年? · 10-eok`,
    metaDesc: (display, monthly, goal) =>
      `${display}に毎月${monthly}ずつ積み立てていたら、${goal}まで何年かかったかを実際の過去の価格で計算した結果と、自分で計算できるツールを提供します。`,
    pageTitle: (label) => `${label}積立バックテスト`,
    pageDesc: (monthly, goal) => `毎月${monthly}ずつ積み立てたら、${goal}までどれくらいかかる?`,
    crumb: (label) => `銘柄 · ${label}`,
    reachedHeadline: (monthly, years, months, goal) => `毎月${monthly}ずつなら約${years}年${months}か月で${goal}`,
    reachedDetail: (from, value, principal, cagr) => `${from}から積み立てたら、今は約${value} · 元本${principal} · 年平均${cagr}`,
    notReachedHeadline: (goal) => `まだ${goal}までは時間がかかります`,
    notReachedDetail: (value, principal, cagr) => `全期間積み立てても、今は約${value} · 元本${principal} · 年平均${cagr}`,
    note: (buyDay, goal, priceBasis) =>
      `※買付日 ${buyDay} · 目標 ${goal} · 実際の過去の${priceBasis}基準。過去のリターンは将来を保証しません。`,
    priceBasisFx: "価格とその日の為替レート",
    priceBasisPlain: "価格",
    cta: "自分の条件で計算してみる →",
    fallbackHeading: "この結果をどう読むか",
    fallbackBody: (from) =>
      `上の数字は${from ? `${from}から` : ""}毎月同じ日に同じ金額を積み立てたと仮定した過去のシミュレーションです。実際には買付のタイミング・税金・手数料・心理的な要因がすべて異なる形で影響します。特にレバレッジ商品は同じ期間でも開始時点によって結果が大きく変わります。`,
    editHint: "金額・買付日・目標金額を変えてみたい場合は、上のボタンから自分で計算してみてください。",
    relatedHeading: "あわせて読みたい",
    compareLink: (n) => `${n}銘柄のETF比較`,
    howItWorksLink: "計算方法 & よくある質問",
    legalNote: "本内容は情報提供であり、投資勧誘や助言ではありません。投資判断はご自身の責任で行ってください。",
    fallbackBlurb: (name) => `${name}積立バックテストの結果です。`,
  },
};

// ─────────────────────────────────────────────────────────────
// de — EUR 시장. du체·€(접미사), Euro/Dollar 환율. EUR 데이터 1999~. 활성화는 검증 후.
// ─────────────────────────────────────────────────────────────
const de: Dict = {
  nav: {
    compare: "Vergleichen",
    guides: "Ratgeber",
    howItWorks: "So funktioniert's",
    about: "Über uns",
    contact: "Kontakt",
    home: "Start",
    privacy: "Datenschutz",
    terms: "AGB",
  },
  a11y: { brandHome: "10-eok Startseite", siteMenu: "Menü", language: "Sprache" },
  footerDisclaimer:
    "10-eok ist ein Informationsdienst, der Backtest-Ergebnisse auf Basis echter historischer Daten zeigt. " +
    "Vergangene Renditen sind keine Garantie für zukünftige Ergebnisse, und nichts hier ist eine Anlageberatung " +
    "oder -empfehlung. Für deine Anlageentscheidungen und deren Ergebnisse bist allein du verantwortlich. " +
    "Die Kursdaten stammen von Yahoo Finance, der Euro/Dollar-Wechselkurs von der Federal Reserve Bank of St. Louis (FRED).",

  calc: {
    day: { last: "Letzter Tag", nth: (d) => `Tag ${d}` },
    timing: {
      title: "Es hängt davon ab, wann du gestartet bist",
      lead: (amount, years) => ({
        pre: `Selbst mit demselben ${amount} über dieselben ${years} Jahre hat `,
        bold: "der Startmonat",
        post: " allein den Endwert so stark schwanken lassen.",
      }),
      worst: "Ungünstiger Start",
      median: "Normalfall",
      best: "Glücklicher Start",
      note: (worst, best, samples) =>
        `Am schlechtesten: Start ${worst} · Am besten: ${best} · ${samples} vergangene Startpunkte verglichen`,
      bridge: {
        reachedMedianBelow: (value, medRough, goal) =>
          `Die ${value} oben waren eher Glückssache. Ein normaler Start landet bei rund ${medRough}, knapp unter ${goal}.`,
        reachedMedianAbove: (medRough, goal, min) =>
          `Ein normaler Start knackt ${goal} bei rund ${medRough}. Ein schlechter Start fiel dagegen auf bis zu ${min}.`,
        notReached: (medRough, min, max) =>
          `Ein normaler Start landet bei rund ${medRough} und reichte je nach Startmonat von ${min} bis ${max}.`,
      },
    },
    share: {
      lumpOnly: (name, goal) => `${name} · ${goal} allein mit dem Startkapital erreicht!`,
      amountMode: (name, years, goal, monthly) =>
        `Mit ${name} brauchst du ${monthly}/Monat, um in ${years} Jahren ${goal} zu erreichen!`,
      timeReached: (name, lumpStr, monthly, goal, years, months) =>
        `${monthly}/Monat in ${name}${lumpStr ? ` mit ${lumpStr} zum Start` : ""} erreichten ${goal} in ${years}J ${months}M!`,
      timeNotReached: (name, goal) => `${name} Sparplan-Backtest — wie lange bis ${goal}?`,
    },
    toast: { linkCopied: "Link kopiert" },
    error: {
      loadFailed: { line1: "Daten konnten nicht geladen werden.", line2: "Bitte versuch es gleich noch einmal." },
      retry: "Erneut versuchen",
    },
    result: { tapToEdit: "Zum Ändern tippen", shareButton: "Ergebnis teilen" },
    loading: { calculating: "Wird berechnet…" },
    mode: {
      timeTab: "Wie lange?",
      amountTab: "Wie viel?",
      capTime: (goal) => ({ pre: "Mit einem festen Betrag pro Monat, ", bold: `wie viele Jahre bis ${goal}`, post: "" }),
      capAmount: (goal) => ({ pre: `Um ${goal} in einer festen Zeit zu erreichen, `, bold: "wie viel pro Monat", post: "" }),
    },
    chip: {
      ticker: "ETF",
      monthly: "Monatlich",
      period: "Zeitraum",
      lump: "Startkapital",
      buyDay: "Kauftag",
      goal: "Ziel",
      none: "Keins",
      periodValue: (y) => `in ${y} J`,
    },
    dropdown: {
      monthlyLabel: "Monatliche Sparrate",
      yearsLabel: (max) => `Zielzeitraum (max. ${max} J)`,
      lumpLabel: "Anfängliches Startkapital",
      buyDayLabel: "Kauftag (Tag im Monat · 29 = letzter Tag)",
      goalLabel: "Zielbetrag",
    },
    units: { years: "J", day: "" },
    hero: {
      lumpOnlyLead: "Allein mit dem Startkapital",
      achieved: "erreicht",
      lumpOnlySpan: (years, value) => `Schon ${value} allein aus dem Startkapital vor ${years} Jahren · ganz ohne monatliches Sparen`,
      amountLead: (years, goal) => `${goal} in ${years} Jahren, monatlich`,
      amountSpan: (name, lumpStr, principal, value) =>
        `Basierend auf ${name}${lumpStr ? ` · inkl. ${lumpStr} Startkapital` : ""} · ${principal} einzahlen, um ${value} aufzubauen`,
      timeLeadReached: (lumpStr, monthly) => `${lumpStr ? `Mit ${lumpStr} zum Start, ` : ""}${monthly} monatlich angelegt`,
      timeLeadUnder: "Selbst über den gesamten Zeitraum",
      durYear: "J",
      durMonth: "M",
      durIn: " später",
      timeSpanReached: (goal, from, value) => `erreichst du ${goal} · seit ${from} wären das heute ${value}`,
      timeSpanUnder: (from, rough, goal) => `sind es seit ${from} heute ${rough} · noch weit von ${goal} entfernt`,
    },
    card: {
      growthTitle: (currency) => `Vermögensentwicklung (${currency})`,
      goalLabel: (goal) => `Ziel ${goal}`,
      monthlyLogTitle: "Monat für Monat",
      buyDaySummary: (day, monthly) => `Kauftag ${day} · ${monthly}`,
      monthlyLogLead: "Wie viel dein Depot in jedem Monat wert war, nach Jahren zusammengefaltet. Tippe auf ein Jahr, um es aufzuklappen.",
    },
    stat: { principal: "Eingezahlt", finalValue: "Endwert", cagr: "Jährlich" },
    tip: {
      cagr: (pct) => `Jährlich ${pct} heißt, es ist im Schnitt etwa so viel pro Jahr gewachsen. (Auf Basis vergangener Renditen.)`,
      reinvest: "Mit den erhaltenen Dividenden werden weitere Anteile desselben Fonds gekauft. Aus: Berechnung nur mit dem Kurs (Kursrendite), ohne Dividenden.",
    },
    opt: { inflationLabel: "Jährlich mit der Inflation erhöhen", inflationDesc: "Sparrate um den Verbraucherpreisindex erhöhen", reinvestLabel: "Dividenden reinvestieren", reinvestDesc: "Aus = nur Kursrendite, ohne Dividenden" },
    stepper: { decrease: "Verringern", increase: "Erhöhen" },
    intro: {
      titleBold: "1 Mio. € ansparen —",
      titleRest: "wie lange dauert das?",
      sub: {
        pre: "Hättest du jeden Monat einen festen Betrag in einen ETF wie QQQ, SPY oder VOO gesteckt — wie lange bis zum Ziel von 1 Mio. €? Wir rechnen es nicht mit angenommenen Renditen, sondern mit ",
        bold: "echten historischen Tageskursen und dem Euro/Dollar-Wechselkurs von damals",
        post: ".",
      },
      disclaimer: "Ein Backtest zu Bildungs- und Informationszwecken. Keine Anlageberatung; vergangene Renditen garantieren nicht die Zukunft.",
      startButton: "Los geht's",
      hint: (count) => `Nur ETF, Betrag und Datum wählen · unten kannst du ${count} ETFs vergleichen und die Ratgeber lesen`,
    },
    form: {
      capTime: { pre: "Mit einem festen Betrag pro Monat — ", bold: "wie viele Jahre bis 1 Mio. €", post: "" },
      capAmount: { pre: "Um 1 Mio. € in einer festen Zeit zu erreichen — ", bold: "wie viel pro Monat", post: "" },
      tickerLabel: "Welchen ETF möchtest du besparen?",
      lumpLabel: "Hast du ein Startkapital zum Loslegen? (0 wenn nicht)",
      monthlyLabel: "Wie viel möchtest du monatlich anlegen?",
      yearsLabel: (max) => `In wie vielen Jahren? (max. ${max} J)`,
      buyDayLabel: "An welchem Tag im Monat kaufst du? (29 = letzter Tag)",
      submitAmount: "Betrag berechnen",
      submitTime: "Bis 1 Mio. € berechnen",
    },
    select: { searchPlaceholder: "ETF suchen (Name oder Symbol)", empty: "Keine Ergebnisse" },
    dataNote: {
      synthetic: (label) =>
        `Der Zeitraum vor Auflegung des Fonds wird mit ${label} angenähert. Es wird ein Index derselben Strategie angefügt und kann daher vom tatsächlichen Fondsergebnis abweichen.`,
      short: "Dieser Fonds wurde erst kürzlich aufgelegt, daher ist die Historie kurz. Interpretieren Sie langfristige Sparergebnisse mit Vorsicht.",
    },
  },

  chart: { readoutPrincipal: "Eingezahlt", hoverHint: "Fahre über den Chart, um das Ergebnis an diesem Punkt zu sehen" },

  monthlyLog: {
    reached: (label) => `${label} erreicht`,
    reachedGoal: (label) => `${label} erreicht — Ziel geschafft`,
    breakthrough: (label) => `${label} überschritten`,
    header: { month: "Monat", principal: "Eingezahlt", value: "Wert", return: "Rendite" },
  },

  etf: {
    metaTitle: (label, monthly, goal) => `${label} Sparplan-Backtest — ${monthly}/Monat bis ${goal}? · 10-eok`,
    metaDesc: (display, monthly, goal) =>
      `${display}: Wenn du monatlich ${monthly} investiert hättest, siehst du hier, wie lange es bis ${goal} gedauert hätte — berechnet mit echten historischen Kursen, plus ein Rechner für deine eigenen Zahlen.`,
    pageTitle: (label) => `${label} Sparplan-Backtest`,
    pageDesc: (monthly, goal) => `Wenn du monatlich ${monthly} angelegt hättest — wie lange bis ${goal}?`,
    crumb: (label) => `ETF · ${label}`,
    reachedHeadline: (monthly, years, months, goal) => `Mit ${monthly}/Monat erreichst du ${goal} nach etwa ${years} J. ${months} M.`,
    reachedDetail: (from, value, principal, cagr) => `Seit ${from} angelegt, wären das heute etwa ${value} · eingezahlt ${principal} · jährlich ${cagr}`,
    notReachedHeadline: (goal) => `Bis ${goal} ist es noch ein Stück`,
    notReachedDetail: (value, principal, cagr) => `Selbst über den gesamten Zeitraum sind es heute etwa ${value} · eingezahlt ${principal} · jährlich ${cagr}`,
    note: (buyDay, goal, priceBasis) =>
      `※ Kauftag ${buyDay} · Ziel ${goal} · Basierend auf echten historischen ${priceBasis}. Vergangene Renditen garantieren nicht die Zukunft.`,
    priceBasisFx: "Kursen und dem damaligen Wechselkurs",
    priceBasisPlain: "Kursen",
    cta: "Mit deinen eigenen Zahlen rechnen →",
    fallbackHeading: "Wie du dieses Ergebnis liest",
    fallbackBody: (from) =>
      `Die Zahlen oben sind eine historische Simulation${from ? ` ab ${from}` : ""}, bei der jeden Monat am selben Tag derselbe Betrag angelegt wurde. In der Praxis spielen Timing, Steuern, Gebühren und Psychologie ebenfalls eine Rolle. Besonders bei gehebelten Produkten können die Ergebnisse je nach Startzeitpunkt selbst im gleichen Zeitraum stark variieren.`,
    editHint: "Möchtest du Betrag, Kauftag oder Ziel ändern? Nutze den Button oben, um es selbst zu berechnen.",
    relatedHeading: "Weiterlesen",
    compareLink: (n) => `${n} ETFs vergleichen`,
    howItWorksLink: "So funktioniert's & FAQ",
    legalNote: "Dieser Inhalt dient nur der Information und ist keine Anlageberatung oder -empfehlung. Deine Anlageentscheidungen triffst du eigenverantwortlich.",
    fallbackBlurb: (name) => `${name} Sparplan-Backtest-Ergebnisse.`,
  },
};

const DICTS: Partial<Record<Locale, Dict>> = { ko, en, ja, de };

export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? ko;
}
