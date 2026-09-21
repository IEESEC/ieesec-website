import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/en/join");
});

test("desktop keeps scroll snapping and validation", async ({ page }) => {
  await page.getByRole("link", { name: "Scroll to get started" }).click();
  const timeline = page.locator("[data-scroll-video-timeline]");
  await expect(timeline).toHaveCSS("scroll-snap-type", /y mandatory/);
  await expect(page.getByRole("slider", { name: "Year of study" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
});

test("reduced motion keeps the background on its poster frame", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.getByRole("link", { name: "Scroll to get started" }).click();
  await page.getByLabel("Full name").fill("Test User");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  const currentTime = await page
    .locator("video")
    .evaluate((element: HTMLVideoElement) => element.currentTime);
  expect(currentTime).toBeLessThan(0.05);
});
