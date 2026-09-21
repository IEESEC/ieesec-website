import { expect, test } from "@playwright/test";

test("shows three technologies first and reveals the rest on mobile", async ({ page }) => {
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
