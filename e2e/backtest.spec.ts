import { test, expect, type Locator } from "@playwright/test";
import { TICKERS } from "../lib/tickers";

// hero 숫자는 데이터 로드 시 0→목표로 카운트업 애니메이션(useAnimatedNumber)이 돈다.
// 애니메이션 도중 값을 읽으면 안정값이 아니므로, 연속 두 번 같은 값이 나올 때까지 기다려 안정값을 읽는다.
async function settledText(locator: Locator): Promise<string> {
  let prev = "";
  await expect
    .poll(
      async () => {
        const cur = (await locator.innerText()).trim();
        const stable = cur !== "" && cur === prev;
        prev = cur;
        return stable;
      },
      { timeout: 15_000, intervals: [250] }
    )
    .toBe(true);
  return prev;
}

// 핵심 플로: 인트로 → 단일 화면 폼 입력 → 결과 리빌 → 칩 수정 시 재계산.
test("입력 폼 → 결과 → 칩 수정 재계산", async ({ page }) => {
  await page.goto("/");

  // 인트로 (BacktestApp의 Intro): CTA "계산 시작하기"
  await page.getByRole("button", { name: "계산 시작하기" }).click();

  // 폼은 단계형 챗이 아니라 모든 필드를 한 화면에 보여준다(Form). 기본 모드=기간이 궁금.
  await expect(page.getByText("어떤 종목을 모을까요?")).toBeVisible();
  await page.getByRole("button", { name: "10억까지 계산하기" }).click();

  // 결과: hero(년/개월) + 통계 표시 (로딩 900ms + 데이터 로드 후)
  const heroNum = page.locator(".hero .num");
  await expect(heroNum).toBeVisible({ timeout: 15_000 });
  await expect(heroNum).toContainText("년");
  await expect(page.getByText("최종 금액", { exact: true })).toBeVisible();

  const before = await settledText(heroNum);

  // 칩 수정: "매달" 칩을 눌러 드롭다운을 열고, 스테퍼 +로 적립액을 올리면 도달 기간이 바뀐다.
  await page.locator(".chip", { hasText: "매달" }).click();
  await expect(page.locator(".chip-dropdown")).toBeVisible();
  const plus = page.locator(".chip-dropdown .stepper button").last();
  for (let i = 0; i < 5; i++) await plus.click();

  // 매달 금액이 늘면 도달 기간(hero)이 짧아져 달라져야 함
  const after = await settledText(heroNum);
  expect(after).not.toBe(before);
});

test("종목 비교 페이지가 종목별 결과 표를 보여준다", async ({ page }) => {
  await page.goto("/compare");
  await expect(page.getByRole("heading", { name: /10억까지 비교/ })).toBeVisible({ timeout: 15_000 });
  // 표는 번들이 있는 종목마다 한 행(tr). 현재 전 종목 번들이 존재하므로 TICKERS 수와 일치.
  await expect(page.locator("table.cmp tbody tr")).toHaveCount(TICKERS.length);
});

test("물가연동 토글이 결과를 바꾼다", async ({ page }) => {
  // 딥링크로 초기값을 주면 인트로/폼을 건너뛰고 바로 결과 화면으로 진입한다.
  await page.goto("/?t=QLD&m=50&d=1&g=10");
  const heroNum = page.locator(".hero .num");
  await expect(heroNum).toBeVisible({ timeout: 15_000 });
  const before = await settledText(heroNum);

  await page.locator(".opt").filter({ hasText: "물가만큼 매년 인상" }).click();

  const after = await settledText(heroNum);
  expect(after).not.toBe(before);
});
