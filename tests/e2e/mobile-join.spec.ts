import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/en/join");
});

test("mobile wizard stays in normal document flow", async ({ page }) => {
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

test("mobile wizard advances, goes back, and retains values", async ({ page }) => {
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

test("touch layouts use the native year selector", async ({ page }) => {
  await page.getByRole("link", { name: "Scroll to get started" }).click();
  await expect(page.getByRole("combobox", { name: "Year of study" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Year of study" })).toBeHidden();
});

test("mobile wizard completes all five steps", async ({ page }) => {
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
