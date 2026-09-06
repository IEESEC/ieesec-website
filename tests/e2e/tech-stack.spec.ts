import { test, expect } from "@playwright/test";

test.describe("tech stack responsive disclosure", () => {
  test("shows three technologies first and reveals the rest on mobile", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith("mobile"));

    await page.goto("/en#tech-stack");

    const cards = page.locator('#tech-stack [data-testid="tech-card"]');
    const showMore = page.getByRole("button", { name: "Show more" });

    await expect(cards).toHaveCount(12);
    await expect(cards.nth(0)).toBeVisible();
    await expect(cards.nth(2)).toBeVisible();
    await expect(cards.nth(3)).toBeHidden();
    await expect(showMore).toBeVisible();

    await showMore.click();

    await expect(cards).toHaveCount(12);
    await expect(showMore).toBeHidden();
  });

  test("keeps every technology visible and hides the disclosure on desktop", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop");

    await page.goto("/en#tech-stack");

    await expect(page.locator('#tech-stack [data-testid="tech-card"]')).toHaveCount(12);
    await expect(page.getByRole("button", { name: "Show more" })).toBeHidden();
  });
});
