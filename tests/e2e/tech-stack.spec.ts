import { test, expect } from "@playwright/test";

test("keeps every technology visible and hides the disclosure on desktop", async ({ page }) => {
  await page.goto("/en#tech-stack");

  await expect(page.locator('#tech-stack [data-testid="tech-card"]')).toHaveCount(12);
  await expect(page.getByRole("button", { name: "Show more" })).toBeHidden();
});
