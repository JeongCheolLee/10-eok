# 토스 미니앱 배포

검증부터 콘솔 업로드까지 한 명령으로 실행한다. 공식 CLI 업로드는 **테스트 버전 생성**이며 운영 출시를 뜻하지 않는다.

```sh
# 테스트, 타입 검사, Vite 빌드, AIT 패키징
pnpm release:toss
# 위 검증 후 콘솔 업로드, 테스트용 앱스킴 출력
pnpm release:toss --upload
# 출시 메모 파일도 함께 첨부
pnpm release:toss --upload --memo-file /path/to/release-note.txt
```

최초 인증은 `cd toss && pnpm exec ait token add`로 등록한다. 키는 채팅이나 Git에 넣지 않는다. 이름을 지정해 등록했다면 `AIT_PROFILE=프로필명 pnpm release:toss --upload`로 실행한다. CI에서는 GitHub Actions secret `AIT_API_KEY`를 사용한다. 업로드는 테스트용 앱스킴을 받은 경우에만 성공으로 처리한다.

운영 광고 설정은 로컬의 Git 제외 파일 `toss/.env.production.local` 또는 CI 환경변수에 둔다. 기본 계산은 `VITE_REWARDED_ADS_ENABLED=false`, 상세 분석은 `VITE_ANALYSIS_REWARDED_ADS_ENABLED=true`, 배너와 리워드는 각각 `VITE_AD_BANNER_ID`와 `VITE_AD_REWARDED_ID`를 설정한다. 배포 명령은 운영 광고 ID 누락을 차단한다.

GitHub의 **Build Toss release** workflow를 수동 실행할 수도 있다. 저장소 Variables에 두 광고 ID를 등록하고, 업로드할 때만 `upload`를 선택한다. 완료한 AIT와 SHA-256 검증 기록은 Actions artifact에 남는다. 자동으로 심사를 신청하거나 운영 버전을 바꾸지는 않는다.

## 무엇이 바로 반영되는가

- 가격, 환율, 수익률 요약: 서버 JSON 갱신 후 캐시가 갱신될 때 반영된다. 앱 내부 데이터 캐시는 5분이며 CDN 캐시는 별도다.
- 종목 목록, 문구, 화면, 계산 로직: 현재는 앱 번들에 포함한다. 새 AIT 업로드 후 **검토 요청 → 승인 → 출시**가 필요하다.
- 일반 웹: Git push에 연결된 Vercel 배포로 별도 반영된다. 토스 번들을 바꾸지는 않는다.

원격 JavaScript 교체나 외부 사이트로 앱 전체를 바꾸는 방식은 사용하지 않는다. 종목 목록을 서버 설정으로 옮기는 작업도 제공 범위 변경에 대한 토스 확인 후 별도로 진행한다. 긴급 오류는 콘솔의 이전 출시 버전으로 롤백하거나 공식 긴급 지원 경로를 이용한다.

공식 문서: [CLI 업로드](https://developers-apps-in-toss.toss.im/guide/operation/toss), [버전 관리와 심사](https://developers-apps-in-toss.toss.im/guide/operation/deploy).
