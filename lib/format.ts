// 한국어 표시 포맷 — 이제 로케일 포맷터(lib/i18n/format.ts)의 ko 구현에 위임(단일 소스).
// 기존 API(eok/won/…)는 그대로 유지해 KO 호출부 무변경. 출력은 format.test.ts가 골든 검증.
import { getFormatter } from "./i18n/format";

const ko = getFormatter("ko");

/** KRW → "1.63억" */
export const eok = ko.money;
/** KRW → "6.2억" (한 자리) */
export const eok1 = ko.rough;
/** 0.21 → "+21%" */
export const pct = ko.pct;
/** ISO "2020-01-15" → "2020년 1월" */
export const ym = ko.ym;
/** ISO "2021-05-03" → "2021년 5월 3일" */
export const ymd = ko.ymd;
/** 금액 압축표기: 1억 이상 "1.63억"(10억↑ 한 자리), 미만 "205만". 월별 표·스크럽용. */
export const won = ko.compact;
/** 원금 대비 증감: 원금 0이면 "". 2배 이상은 "6.2배", 그 미만은 "+21%"/"-8%". */
export const growth = ko.growth;
