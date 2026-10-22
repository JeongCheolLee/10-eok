작업 전에 다음을 먼저 읽을 것.
- 비공개 폴더 `~/Documents/develop/10-eok-private/SHARED_CONTEXT.md` — Claude·Codex 공용 작업 메모. 작업하다 다음 작업자(다른 에이전트 포함)가 몰라서 같은 삽질을 할 만한 걸 배우면 거기에 직접 적는다(형식은 파일 맨 위).
- 같은 폴더의 `CLAUDE.md`(현재 상태 블록)·`TOSS_MASTERPLAN.md` — 토스 미니앱 진행 상태·결정·일정.
- 이 리포의 `CLAUDE.md` — UX 라이팅 규칙(모든 한국어 UI 문구에 적용)과 용어 사전, `toss/UX_WRITING.md`.

이 리포는 ETF 적립 백테스트 계산기다. 웹(`app/`, Next.js, jeongcheol.cloud)과 토스 미니앱(`toss/`, Vite+TDS, '주식으로 10억 부자되기')이 `lib/`(엔진·포맷터·종목)를 공유한다. 데이터는 `generator/`가 매일 만들어 `public/data`로 배포하고, 미니앱은 그 JSON을 받아 기기에서 계산한다(계산 서버 없음).

- 검증: `node_modules/.bin/vitest run`, `node_modules/.bin/tsc --noEmit`(웹)·`-p toss/tsconfig.json`(미니앱), `node_modules/.bin/next build`, `cd toss && node_modules/.bin/vite build`, 웹 e2e `node_modules/.bin/playwright test`.
- main에 push하면 Vercel이 바로 운영 배포한다. main에는 매일 데이터 갱신 봇 커밋이 쌓인다.
- **이 저장소는 공개다.** 상호·사업자 정보·수익 가정·일정·개인정보는 커밋하지 말고 비공개 폴더에만 둔다.
- 같은 워크트리를 다른 세션이 동시에 고칠 수 있다. 커밋 전 `git status`로 내가 만들지 않은 변경이 섞이지 않았는지 확인한다.
