import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("10eok-consent-v1", "denied"),
  );
});

for (const width of [320, 390, 768, 1280]) {
  test(`ETF picker stays positioned and usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const [locale, choose] of [
      ["ko", "ETF 선택하기"],
      ["en", "Choose an ETF"],
      ["ja", "ETFを選ぶ"],
      ["de", "ETF auswählen"],
    ]) {
      await page.goto(locale === "ko" ? "/" : `/${locale}`);
      const trigger = page.getByRole("button", { name: choose, exact: true });
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const box = (await dialog.boundingBox())!;
      const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(Math.abs(box.x + box.width / 2 - viewportWidth / 2)).toBeLessThanOrEqual(1);
      if (width > 480) {
        expect(Math.abs(box.y + box.height / 2 - 450)).toBeLessThanOrEqual(1);
      } else {
        expect(Math.abs(box.y + box.height - 900)).toBeLessThanOrEqual(1);
      }
      const search = dialog.locator("input");
      await expect(search).not.toBeFocused();
      await search.fill("no-such-etf");
      await expect(dialog.locator(".wc-no-results")).toBeVisible();
      const filteredBox = (await dialog.boundingBox())!;
      expect(filteredBox).toEqual(box);
      await search.fill("SPY");
      await expect(dialog.getByRole("button", { name: /SPY/ })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.mouse.click(width / 2, 5);
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
  });
}

for (const [locale, choose, monthly, target] of [
  ["ko", "ETF 선택하기", "100", "10억"],
  ["en", "Choose an ETF", "700", "$1M"],
  ["ja", "ETFを選ぶ", "10", "1億"],
  ["de", "ETF auswählen", "600", "1 Mio. €"],
]) {
  test(`${locale}: mobile selection, validation, result and shared reload`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(locale === "ko" ? "/" : `/${locale}`);
    await expect(page.locator(".wc-target-line")).toContainText(target);
    await expect(page.locator(".wc-calculate")).toBeDisabled();
    await page.getByRole("button", { name: choose, exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("input")).not.toBeFocused();
    const before = await dialog.locator("input").boundingBox();
    await dialog.locator("input").fill("SPY");
    const after = await dialog.locator("input").boundingBox();
    expect(after?.width).toBe(before?.width);
    await dialog.getByRole("button", { name: /SPY/ }).click();
    const amount = page.locator('[id="wc-amount-first"]');
    await expect(amount).toHaveValue(monthly);
    await amount.fill("");
    await expect(page.locator(".wc-calculate")).toBeDisabled();
    await amount.fill(monthly);
    await page.locator(".wc-calculate").click();
    await expect(page.locator(".wc-result")).toBeVisible();
    await expect(page.locator(".wc-chart")).toBeVisible();
    const duration = await page
      .locator(".wc-duration")
      .getAttribute("aria-label");
    await page.reload();
    await expect(page.locator(".wc-duration")).toHaveAttribute(
      "aria-label",
      duration!,
    );
    await expect(page.locator(".wc-app")).toHaveAttribute(
      "data-screen",
      "result",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("saved conditions survive reload, open full detail and delete in edit mode", async ({
  page,
}) => {
  await page.goto("/?t=SPY&m=100&d=1&g=10");
  await expect(page.locator(".wc-result")).toBeVisible();
  await page
    .getByRole("button", { name: "계산 저장하기", exact: true })
    .click();
  await page.getByRole("button", { name: "저장한 계산", exact: true }).click();
  await expect(page.locator(".wc-saved-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".wc-saved-card")).toHaveCount(1);
  await page.locator(".wc-saved-open").click();
  await expect(page.locator(".wc-chart")).toBeVisible();
  await page
    .getByRole("button", { name: "계산 저장하기", exact: true })
    .click();
  await page.getByRole("button", { name: "저장한 계산", exact: true }).click();
  await expect(page.locator(".wc-saved-card")).toHaveCount(1);
  await page.getByRole("button", { name: "편집", exact: true }).click();
  await page.getByRole("button", { name: "SPY 삭제", exact: true }).click();
  await expect(page.locator(".wc-saved-card")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".wc-empty")).toBeVisible();
});

test("comparison preserves the original period and groups estimates separately", async ({
  page,
}) => {
  await page.goto("/?t=SPY&m=100&d=1&g=10#compare");
  await expect(
    page.getByRole("heading", { name: "실제 거래 자료로 계산한 결과" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "추정 자료를 포함한 결과" }),
  ).toBeVisible();
  await expect(page.getByText("추정 포함", { exact: true })).toBeVisible();
  await expect(page.getByRole("combobox")).toHaveValue("desc");
  await page.getByRole("combobox").selectOption("asc");
  await expect(page.getByRole("combobox")).toHaveValue("asc");
});

test("legacy inflation and amount links retain their settings", async ({
  page,
}) => {
  await page.goto("/?t=QLD&m=50&d=1&g=10");
  await expect(page.locator(".wc-duration")).toBeVisible();
  const before = await page.locator(".wc-duration").getAttribute("aria-label");
  await page.goto("/?t=QLD&m=50&d=1&g=10&infl=1");
  await expect(page.locator(".wc-duration")).toBeVisible();
  const after = await page.locator(".wc-duration").getAttribute("aria-label");
  expect(after).not.toBe(before);
  await page.goto("/en?t=SPY&mode=amt&y=10&d=1&g=10");
  await expect(page.locator(".wc-value-hero")).toBeVisible();
  await expect(page.locator(".wc-result-hero")).toContainText(
    "Contribution needed each time",
  );
  await expect(page.locator(".wc-stats")).toContainText("$1M");
});

test('a start after the data ends shows guidance instead of an empty result', async ({ page }) => {
  await page.goto('/?t=SPY&m=100&d=1&s=2099-01-01');
  await expect(page.locator('.wc-app').getByRole('alert')).toContainText('거래 자료가 없어요');
  await expect(page.locator('.wc-input')).toBeVisible();
  await expect(page.locator('.wc-app')).not.toHaveAttribute('data-screen', 'result');
});

test('explicit result route wins over a comparison page entry', async ({ page }) => {
  await page.goto('/compare?t=SPY&m=100&d=1#result');
  await expect(page.locator('.wc-app')).toHaveAttribute('data-screen', 'result');
  await page.getByRole('button', { name: '같은 조건으로 비교하기', exact: true }).click();
  await expect(page.locator('.wc-app')).toHaveAttribute('data-screen', 'compare');
  await page.goBack();
  await expect(page.locator('.wc-app')).toHaveAttribute('data-screen', 'result');
});

test('amount entered before choosing an ETF is retained and invalid drafts stay blocked', async ({ page }) => {
  await page.goto('/');
  const amount = page.locator('[id="wc-amount-first"]');
  await amount.fill('175');
  await page.getByRole('button', { name: 'ETF 선택하기', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: /SPY/ }).click();
  await expect(amount).toHaveValue('175');
  await expect(page.locator('.wc-calculate')).toBeEnabled();
  await page.reload();
  await amount.fill('');
  await page.getByRole('button', { name: 'ETF 선택하기', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: /SPY/ }).click();
  await expect(amount).toHaveValue('');
  await expect(page.locator('.wc-calculate')).toBeDisabled();
});
