// 앱인토스 배포 설정 (ait build → dist/ → 10-eok.ait). appName은 콘솔 등록값과 같아야 하고 등록 후 변경 불가.
import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "10-eok",
  brand: { primaryColor: "#02a262" },
  permissions: [],
  navigationBar: {
    // 토스가 그리는 상단 바: 좌측 로고+앱 이름, 우측 ⋯·X. 뒤로가기는 WebView history를 따르므로
    // 홈(첫 화면)에서는 미니앱 종료, 결과·비교 화면에서는 이전 화면으로 돌아간다.
    withBackButton: true,
    withHomeButton: false,
    withTitle: true,
    theme: "light",
  },
  webView: { bounces: false, pullToRefreshEnabled: false, allowsBackForwardNavigationGestures: true },
  webBundleDir: "dist",
});
