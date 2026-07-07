// UI 문자열 사전. 타입 Dict로 전 로케일 강제. ko가 기준이며, en/ja/de는 번역 완료 전까지
// ko로 폴백(현재 LOCALES=ko만이라 실제로 ko만 조회됨). P3-b부터 en 채움.
import type { Locale } from "./locales";

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
  a11y: { brandHome: string; siteMenu: string };
  footerDisclaimer: string;
};

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
  a11y: { brandHome: "10-eok 홈", siteMenu: "사이트 메뉴" },
  footerDisclaimer:
    "10-eok은 실제 과거 데이터를 이용한 백테스트 결과를 보여주는 정보 제공 서비스입니다. " +
    "과거 수익률은 미래 수익을 보장하지 않으며, 본 서비스의 어떤 내용도 투자 권유나 투자 " +
    "자문이 아닙니다. 투자 결정과 그 결과에 대한 책임은 이용자 본인에게 있습니다. " +
    "가격 데이터는 Yahoo Finance, 환율은 미국 세인트루이스 연방준비은행(FRED)에서 가져옵니다.",
};

const DICTS: Partial<Record<Locale, Dict>> = { ko };

export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? ko;
}
