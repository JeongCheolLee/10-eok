# 10-eok

"과거에 매달 모았다면, 10억까지 얼마나 걸렸을까?"

QLD를 매달 일정 금액씩 샀다고 가정하고, **실제 과거 가격 + 그날 USD/KRW 환율**로
원화 기준 10억 도달까지 걸린 시간을 백테스트해 보여주는 웹앱.

## 구조
- `lib/backtest/` — 순수 시뮬레이션 엔진 (`simulate.ts`) + 거래일 정렬·환율 forward-fill·검증 (`align.ts`). UI/프레임워크 비의존.
- `generator/build-bundle.ts` — EC2 cron이 하루 한 번 실행하는 데이터 파이프라인. Yahoo 차트(가격) + FRED DEXKOUS(환율)를 받아 정렬·검증 후 `public/data/<ticker>.json` 파생 번들 생성 → git 커밋 → Vercel 자동 배포. (사용자 트래픽 안 받음)
- `app/` — Next.js App Router. 대화식 입력 → 결과(단일 숫자 + 자산 그래프) → 칩 수정 시 즉시 재계산. 애니메이션 + `prefers-reduced-motion` 폴백.
- 디자인 언어: `DESIGN.md` (Spotify 다크 + 형광 그린, 쉬운 말 카피).

## 데이터 소스
- 가격: Yahoo 차트 API (adjusted close). 추후 교체 가능하도록 생성기에서 추상화.
- 환율: FRED `DEXKOUS` 일별 (1981~, 공공데이터).

## 개발
```bash
pnpm install
pnpm gen     # 번들 생성 (public/data/qld.json)
pnpm test    # 엔진 단위 + golden 테스트
pnpm dev     # 개발 서버
pnpm build   # 프로덕션 빌드
```

## 범위 (v1)
QLD 단일 종목, 배당 재투자 ON 고정(수정주가), 세금 제외(평가액 기준 미실현).
종목 비교 · 공유 카드 · 물가연동 적립은 post-v1.
