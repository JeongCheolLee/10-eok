import { test, expect } from "@playwright/test";

// 핵심 플로: 대화식 입력 → 결과 리빌 → 칩 수정 시 재계산.
test("대화식 입력 → 결과 → 칩 수정 재계산", async ({ page }) => {
  await page.goto("/");

  // 인트로
  await expect(page.getByRole("button", { name: "내 결과 보기" })).toBeVisible();
  await page.getByRole("button", { name: "내 결과 보기" }).click();

  // 대화식: 종목 → 금액 → 매수일
  await expect(page.getByText("어떤 종목으로 해볼까요?")).toBeVisible();
  await page.getByRole("button", { name: "다음" }).click();

  await expect(page.getByText("매달 얼마씩 넣을까요?")).toBeVisible();
  await page.getByRole("button", { name: "다음" }).click();

  await expect(page.getByText("매달 며칠에 살까요?")).toBeVisible();
  await page.getByRole("button", { name: "결과 보기" }).click();

  // 결과: hero(년/개월) + 통계 표시 (로딩 800ms 후)
  await expect(page.locator(".hero .num")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(".hero .num")).toContainText("년");
  await expect(page.getByText("최종 금액")).toBeVisible();

  const before = await page.locator(".hero .num").innerText();

  // 칩 수정: 매달 금액 올리면 도달 기간이 바뀐다
  await page.getByText("매달", { exact: false }).first().click();
  await expect(page.locator(".editbar")).toBeVisible();
  for (let i = 0; i < 5; i++) await page.locator(".editbar .stepper button").last().click();
  await page.getByRole("button", { name: "완료" }).click();

  // 금액이 늘면 기간(hero)이 달라져야 함
  await expect(async () => {
    const after = await page.locator(".hero .num").innerText();
    expect(after).not.toBe(before);
  }).toPass({ timeout: 10_000 });
});
