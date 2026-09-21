import { expect, test } from "@playwright/test";

const isMobileProject = (name: string) => name.startsWith("mobile-");

test.beforeEach(async ({ page }) => {
  await page.goto("/en/join");
});

test("selects a responsive, seek-friendly video tier", async ({ page }, testInfo) => {
  const video = page.locator("video");

  await expect(video).toHaveAttribute("preload", "metadata");
  await expect(video.locator('source[media="(min-width: 1200px)"]')).toHaveAttribute(
    "src",
    "/videos/join-scroll-background-large.mp4",
  );

  const currentSource = await video.evaluate((element: HTMLVideoElement) => element.currentSrc);
  expect(currentSource).toContain(
    isMobileProject(testInfo.project.name)
      ? "join-scroll-background-mobile.mp4"
      : "join-scroll-background-large.mp4",
  );
});
