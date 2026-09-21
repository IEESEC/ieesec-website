import { expect, test } from "@playwright/test";

test("does not report a hydration mismatch from the theme control", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  const hydrationErrors: string[] = [];
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("Hydration failed")) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto("/en");

  expect(hydrationErrors).toEqual([]);
});

test("updates the active section after returning from the join page", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/en");
  await expect(page).toHaveURL(/\/en\/?#home$/);
  await page.getByRole("banner").getByRole("link", { name: "Join us", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/join$/);

  const homeLink = page.getByRole("link", { name: "Home", exact: true });
  const teamLink = page.getByRole("link", { name: "Team", exact: true });

  await expect(homeLink).not.toHaveClass(/(?:^|\s)bg-primary(?:\s|$)/);
  await teamLink.click();

  await expect(page).toHaveURL(/\/en\/?#team$/);
  await expect(teamLink).toHaveClass(/(?:^|\s)bg-primary(?:\s|$)/);
  await expect(homeLink).not.toHaveClass(/(?:^|\s)bg-primary(?:\s|$)/);
});

test("keeps the URL anchor in sync with the section under the scroll focus", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/en");
  await page
    .locator("#team")
    .evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "center" }));

  await expect(page).toHaveURL(/\/en\/?#team$/);
  await expect(page.getByRole("link", { name: "Team", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );
});

test("exposes the Discord section in the navbar", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/en");
  const discordLink = page.getByRole("banner").getByRole("link", { name: "Discord", exact: true });

  await expect(discordLink).toBeVisible();
  await expect(discordLink).toHaveAttribute("href", "/en#discord");
});

test("groups language and theme controls under the settings menu", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/en");

  const banner = page.getByRole("banner");
  const settings = banner.getByRole("button", { name: "Open settings" });
  await expect(settings).toBeVisible();

  await settings.click();

  await expect(page.getByRole("menuitem", { name: "Switch language" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Toggle theme" })).toBeVisible();
  await expect(banner.getByRole("button", { name: "Switch language" })).toHaveCount(0);
  await expect(banner.getByRole("button", { name: "Toggle theme" })).toHaveCount(0);
});

test("keeps settings available in the mobile navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop");

  await page.goto("/en");
  await page.getByRole("banner").getByRole("button", { name: "Open menu" }).click();

  const sidebar = page.locator("#mobile-navigation");
  await sidebar.getByRole("button", { name: "Open settings" }).click();

  await expect(page.getByRole("menuitem", { name: "Switch language" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Toggle theme" })).toBeVisible();
});

test("makes mobile settings actions interactive", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop");

  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en");
  await page.getByRole("banner").getByRole("button", { name: "Open menu" }).click();

  const sidebar = page.locator("#mobile-navigation");
  await sidebar.getByRole("button", { name: "Open settings" }).click();
  await page.getByRole("menuitem", { name: "Toggle theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await sidebar.getByRole("button", { name: "Open settings" }).click();
  await page.getByRole("menuitem", { name: "Switch language" }).click();
  await expect(page).toHaveURL(/\/el(?:#home)?$/);
});

test("keeps the mobile drawer hidden until opened and anchored inside the viewport", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "desktop");

  await page.goto("/en");
  const menu = page.locator("#mobile-navigation");
  const open = page.getByRole("button", { name: "Open menu" });

  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    /width=device-width/,
  );
  await expect(menu).not.toBeVisible();
  await open.click();
  await expect(menu).toBeVisible();

  await expect
    .poll(
      () =>
        menu.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= window.innerWidth;
        }),
      { timeout: 1000 },
    )
    .toBe(true);

  const bounds = await menu.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  });

  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth);
  expect(bounds.top).toBeGreaterThanOrEqual(0);
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewportHeight);
});
