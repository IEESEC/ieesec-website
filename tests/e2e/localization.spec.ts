import { expect, test } from "@playwright/test";

test("defaults to Greek and exposes localized metadata", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/");

  await expect(page).toHaveURL(/\/el$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "el");
  await expect(
    page.getByRole("heading", { name: "Μετατρέπουμε τη θεωρία σε λογισμικό που λειτουργεί." }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/Κοινότητα Μηχανικής Λογισμικού/);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    "href",
    /\/en$/,
  );

  await page.goto("/join");
  await expect(page).toHaveURL(/\/el\/join$/);
  await expect(page.getByRole("heading", { name: "Έλα στην κοινότητά μας!" })).toBeVisible();
});

test("switches language while preserving route, query and hash", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/el/?source=test#team");
  const toggle = page.getByRole("button", { name: "Αλλαγή γλώσσας στα Αγγλικά" });

  await expect(toggle).toHaveAttribute("data-language-icon", "el");
  await toggle.click();

  await expect(page).toHaveURL(/\/en\?source=test#team$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Join us", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch language to Greek" })).toHaveAttribute(
    "data-language-icon",
    "en",
  );
});

test("serves the join experience in Greek", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/el/join");
  await expect(page.getByRole("heading", { name: "Έλα στην κοινότητά μας!" })).toBeVisible();
  await page.getByRole("link", { name: "Κύλησε για να ξεκινήσεις" }).click();
  await expect(page.getByRole("heading", { name: "Ποιος κάνει αίτηση" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Έτος σπουδών" })).toBeVisible();
});
