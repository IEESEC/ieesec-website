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

test("logos use the supplied SVG artwork", async ({ page }) => {
  const navbarLogo = page.getByRole("img", { name: "IEESEC" }).first();
  await expect(navbarLogo).toHaveAttribute("src", "/images/brand/ieesec-navbar.svg");
  await expect(navbarLogo).toHaveAttribute("fetchpriority", "high");
  await expect(navbarLogo).toHaveAttribute("decoding", "sync");

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

test("footer keeps the original opaque surface", async ({ page }) => {
  const footer = page.locator("footer");

  const backgroundColor = await footer.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );

  expect(backgroundColor).not.toMatch(/transparent|rgba?\(0,\s*0,\s*0(?:,|\s*\/).*0\)/);
});

test("light join hero uses a light video wash and page fade", async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.reload();

  const overlay = page.getByTestId("join-video-overlay");
  await expect(overlay).toBeAttached();
  const overlayColor = await overlay.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(overlayColor).toMatch(/lab\(9[0-9]/);

  const wash = page.getByTestId("join-video-wash");
  const washGradient = await wash.evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(washGradient).toMatch(/255|lab\(9[0-9]/);
  expect(washGradient).not.toContain("2, 6, 23");

  const fade = page.getByTestId("join-video-fade");
  const fadeGradient = await fade.evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(fadeGradient).toMatch(/lab\(9[0-9]/);
  expect(fadeGradient).not.toContain("2, 6, 23");

  await expect(page.getByRole("heading", { name: "Join our community!" })).toHaveCSS(
    "color",
    /lab\([0-9]/,
  );

  if (!isMobileProject(testInfo.project.name)) {
    const warning = page.getByText("Experimental feature", { exact: true });
    await expect(warning).toBeVisible();
    const warningStyles = await warning.evaluate((element) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Canvas context is unavailable");
      context.fillStyle = getComputedStyle(element).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return { red, green, blue, alpha: alpha / 255 };
    });
    expect(warningStyles.alpha).toBeGreaterThan(0.75);
    expect(Math.max(warningStyles.red, warningStyles.green, warningStyles.blue)).toBeGreaterThan(
      120,
    );
  }
});

test("join progress chrome stays transparent in both themes", async ({ page }) => {
  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((value) => localStorage.setItem("theme", value), theme);
    await page.reload();

    const progressColor = await page
      .getByTestId("join-progress")
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    const progressMetaColor = await page
      .locator(".join-form-progress-meta")
      .evaluate((element) => getComputedStyle(element).backgroundColor);

    expect(progressColor).toMatch(/transparent|rgba?\(0,\s*0,\s*0(?:,|\s*\/).*0\)/);
    expect(progressMetaColor).toMatch(/transparent|rgba?\(0,\s*0,\s*0(?:,|\s*\/).*0\)/);
  }
});

test("mobile wizard stays in normal document flow", async ({ page }, testInfo) => {
  test.skip(!isMobileProject(testInfo.project.name));

  await page.getByRole("link", { name: "Scroll to get started" }).click();

  const shell = page.getByTestId("join-form-shell");
  await expect(shell).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Who is applying" })).toBeVisible();

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

  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByLabel("GitHub")).toHaveValue("github.com/test-user");
  await expect(page.getByLabel("Discord")).toHaveValue("test-user");
});

test("desktop keeps scroll snapping and validation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.getByRole("link", { name: "Scroll to get started" }).click();
  const timeline = page.locator("[data-scroll-video-timeline]");
  await expect(timeline).toHaveCSS("scroll-snap-type", /y mandatory/);
  await expect(page.getByRole("slider", { name: "Year of study" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
});

test("touch layouts use the native year selector", async ({ page }, testInfo) => {
  test.skip(!isMobileProject(testInfo.project.name));

  await page.getByRole("link", { name: "Scroll to get started" }).click();
  await expect(page.getByRole("combobox", { name: "Year of study" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Year of study" })).toBeHidden();
});

test("mobile wizard completes all five steps", async ({ page }, testInfo) => {
  test.skip(!["mobile-standard", "mobile-compact"].includes(testInfo.project.name));

  await page.route("**/api/join-application", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }),
  );

  await page.getByRole("link", { name: "Scroll to get started" }).click();
  await page.getByLabel("Full name").fill("Test User");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await page.getByLabel("GitHub").fill("github.com/test-user");
  await page.getByLabel("Discord").fill("test-user");
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await page
    .getByRole("button", { name: "Web Development (Frontend/Backend)", exact: true })
    .click();
  await page.getByRole("radio", { name: "Experience level 3" }).click();
  await page.getByRole("radio", { name: "Participate as a regular member: Moderately" }).click();
  await page.getByRole("radio", { name: "Help organise events: A little" }).click();
  await page.getByRole("radio", { name: "Volunteer or present workshops: Not at all" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await expect(page.getByRole("heading", { name: "In your words" })).toBeVisible();
  await page
    .getByLabel(
      "Do you have a specific idea for a project or an initiative that you would like us to carry out together?",
    )
    .fill("To build with the team.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Send it" })).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByRole("heading", { name: /Thanks, Test/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit another application" })).toHaveCount(0);
});

test("reduced motion keeps the background on its poster frame", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

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
