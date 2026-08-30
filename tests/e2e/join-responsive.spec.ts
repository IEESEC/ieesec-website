import { expect, test } from "@playwright/test";

const isMobileProject = (name: string) => name.startsWith("mobile-");

test.beforeEach(async ({ page }) => {
  await page.goto("/join");
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

test("logos use the supplied SVG artwork", async ({ page }) => {
  await expect(page.getByRole("img", { name: "IEESEC" }).first()).toHaveAttribute(
    "src",
    "/images/brand/ieesec-navbar.svg",
  );

  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("footer-logo-black")).toHaveAttribute(
    "src",
    "/images/brand/ieesec-logo-black.svg",
  );
  await expect(page.getByTestId("footer-logo-white")).toHaveAttribute(
    "src",
    "/images/brand/ieesec-logo-white.svg",
  );
});

test("mobile wizard stays in normal document flow", async ({ page }, testInfo) => {
  test.skip(!isMobileProject(testInfo.project.name));

  await page.getByRole("link", { name: "Scroll to get started" }).click();

  const shell = page.getByTestId("join-form-shell");
  const card = page.getByTestId("join-form-card");
  await expect(shell).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Who's applying" })).toBeVisible();

  const layout = await page.evaluate(() => {
    const shellElement = document.querySelector<HTMLElement>('[data-testid="join-form-shell"]');
    const cardElement = document.querySelector<HTMLElement>('[data-testid="join-form-card"]');
    const footer = document.querySelector("footer");

    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      shellTop: shellElement?.getBoundingClientRect().top ?? -1,
      cardScrolls: cardElement ? cardElement.scrollHeight > cardElement.clientHeight + 1 : true,
      footerTop: footer?.getBoundingClientRect().top ?? 0,
      viewportHeight: window.innerHeight,
    };
  });

  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.shellTop).toBeGreaterThanOrEqual(0);
  expect(layout.cardScrolls).toBe(false);
  expect(layout.footerTop).toBeGreaterThanOrEqual(layout.viewportHeight);
});

test("mobile wizard advances, goes back, and retains values", async ({ page }, testInfo) => {
  test.skip(!isMobileProject(testInfo.project.name));

  await page.getByRole("link", { name: "Scroll to get started" }).click();
  await page.getByLabel("Full name").fill("Test User");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Your links" })).toBeVisible();
  await page.getByLabel("GitHub").fill("github.com/test-user");
  await page.getByLabel("Discord").fill("test-user");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "What you want to build" })).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByLabel("GitHub")).toHaveValue("github.com/test-user");
  await expect(page.getByLabel("Discord")).toHaveValue("test-user");
});

test("desktop keeps scroll snapping and validation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.getByRole("link", { name: "Scroll to get started" }).click();
  const timeline = page.locator("[data-scroll-video-timeline]");
  await expect(timeline).toHaveCSS("scroll-snap-type", /y mandatory/);
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
});
