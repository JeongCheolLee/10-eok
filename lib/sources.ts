// 데이터·출처 레지스트리. 각 페이지가 id로 골라 <Sources>로 인용한다.
// YMYL(금융) 신뢰(E-E-A-T): 사이트의 숫자를 실제로 뒷받침하는 출처만 등록한다.
// (등록 URL은 모두 응답 200 확인. 링크가 죽으면 신뢰에 오히려 해가 되므로 추가 시 검증할 것.)
export type Source = { label: string; href: string };

export const SOURCES = {
  yahoo: {
    label: "가격(수정 종가): Yahoo Finance",
    href: "https://finance.yahoo.com",
  },
  fredFx: {
    label: "원/달러 환율(일별, DEXKOUS): 미국 세인트루이스 연방준비은행(FRED)",
    href: "https://fred.stlouisfed.org/series/DEXKOUS",
  },
  fredCpi: {
    label: "한국 소비자물가지수(월별, KORCPIALLMINMEI): FRED",
    href: "https://fred.stlouisfed.org/series/KORCPIALLMINMEI",
  },
  ntsTax: {
    label: "해외주식 양도소득세·기본공제 기준: 국세청",
    href: "https://www.nts.go.kr/",
  },
  prosharesQld: {
    label: "QLD 상품 개요(나스닥100 하루 2배 목표): ProShares",
    href: "https://www.proshares.com/our-etfs/leveraged-and-inverse/qld",
  },
  prosharesTqqq: {
    label: "TQQQ 상품 개요(나스닥100 하루 3배 목표): ProShares",
    href: "https://www.proshares.com/our-etfs/leveraged-and-inverse/tqqq",
  },
  vanguardVoo: {
    label: "VOO 상품 개요(S&P 500 추종·운용보수): Vanguard",
    href: "https://investor.vanguard.com/investment-products/etfs/profile/voo",
  },
  schwabSchd: {
    label: "SCHD 상품 개요(다우존스 미국 배당 100 추종): Charles Schwab",
    href: "https://www.schwab.com/research/etfs/quotes/summary/schd",
  },
  vanguardVt: {
    label: "VT 상품 개요(FTSE 글로벌 올캡·전 세계 주식): Vanguard",
    href: "https://investor.vanguard.com/investment-products/etfs/profile/vt",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;
