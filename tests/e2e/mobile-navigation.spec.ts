import { expect, test } from "@playwright/test";

test("mobile settings actions are interactive", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en");
  await page.getByRole("banner").getByRole("button", { name: "Open menu" }).click();

  const sidebar = page.locator("#mobile-navigation");
  await sidebar.getByRole("button", { name: "Toggle theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await sidebar.getByRole("button", { name: "Switch language" }).click();
  await expect(page).toHaveURL(/\/el(?:#home)?$/);
});
