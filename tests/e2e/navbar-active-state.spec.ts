import { expect, test } from "@playwright/test";

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
