import { expect, test } from "@playwright/test";

test("updates the active section after returning from the join page", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/en");
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
