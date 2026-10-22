---
name: local-up
description: 10-eok 로컬 화면을 최신 코드로 띄운다 — 토스 미니앱 개발 서버(:5173, 기본)와 필요하면 웹(:3000). "로컬에서 켜봐", "로컬 띄워줘", "최신으로 띄워줘", "화면 보여줘" 같은 요청에 사용. 인자 `toss`(기본)·`web`·`all`.
---

# 10-eok 로컬 기동

## 0. 먼저 확인(묻지 않고 stash·checkout 하지 않는다)
- 지금 워크트리에서 `git status --short`. 내가 만들지 않은 변경·새 파일이 있으면 **다른 세션이 작업 중일 수 있다** — pull 하지 말고 사용자에게 알린 뒤, 현재 코드 그대로 띄울지 묻는다.
- 깨끗하면 `git fetch -q origin && git pull --ff-only`(main 기준). 실패하면 멈추고 알린다.
- 이미 떠 있는지: `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/`(미니앱), `:3000`(웹). 떠 있으면 다시 띄우지 않는다 — Vite·Next 개발 서버는 코드 변경을 바로 반영한다.

## 1. 미니앱(:5173) — `toss`(기본)
```
cd toss && node_modules/.bin/vite --port 5173      # 백그라운드로 실행
```
- 데이터는 `toss/.env`의 `VITE_DATA_BASE=https://jeongcheol.cloud/data`(운영, CORS 허용)에서 받는다. 운영 데이터가 아니라 로컬 `public/data`로 보고 싶으면 `vite build` 후 `toss/store/make-assets.cjs`의 정적 서버 방식(`/data` → `public/data`)을 쓴다 — `vite build`는 `toss/dist`를 비우므로 dist에 data가 없다.
- 준비 확인: 200 응답까지 0.5초 간격으로 최대 10초.
- 콘솔의 `SafeAreaInsets … TypeError`는 토스 밖에서 나는 무해한 에러.

## 2. 웹(:3000) — `web`
```
node_modules/.bin/next dev -p 3000                  # 백그라운드로 실행
```
- 로컬 pnpm 11이 의존성 검사에서 막히면 `node_modules/.bin/*`를 직접 실행한다.

## 3. 열어 주기
- macOS `open`으로 브라우저를 연다. 미니앱은 홈 `http://localhost:5173/`, 그리고 방금 바꾼 화면이 있으면 그 딥링크도:
  결과 `/?t=SPY&m=100&d=1&f=m`, 분산 `/?h=QQQ:50,SCHD:30&d=1&f=m`, 비교 `/?page=compare`, 시계 `/?page=clock`(저장본 필요).
- 사용자에게: 연 주소, 토스 밖이라 다른 점(상단 바·광고는 브라우저용 대체, 진짜는 QR 실기기), 서버를 끄려면 말하라는 것.
