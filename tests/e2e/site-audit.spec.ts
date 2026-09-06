import { expect, test } from "@playwright/test";

test("localized layouts remain within the viewport and have no runtime errors", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["el", "en"]) {
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    for (const selector of ["#home", "#team", "#tech-stack", "#blog", "footer"]) {
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      const overflow = await section.evaluate((root) =>
        [...root.querySelectorAll("h1, h2, h3, p, a, button, .hero-typewriter-reveal")]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
          })
          .map((element) => element.textContent),
      );
      expect(overflow, `${locale} ${selector}`).toEqual([]);
    }
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);
    await page.screenshot({ path: testInfo.outputPath(`${locale}-home.png`) });
  }
  expect(errors).toEqual([]);
});

test("content remains readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("/en");
  await expect(page.locator("#team h2")).toHaveCSS("opacity", "1");
  await expect(page.locator("#team h2").locator("..")).toHaveCSS("opacity", "1");
  await context.close();
});

test("section reveals animate and footer contact spacing stays consistent", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/el");

  const teamHeadingReveal = page.locator("#team h2").locator("..");
  await expect(teamHeadingReveal).toHaveCSS("opacity", "0");
  await teamHeadingReveal.scrollIntoViewIfNeeded();
  await expect
    .poll(() => teamHeadingReveal.evaluate((element) => element.getAnimations().length))
    .toBeGreaterThan(0);
  await expect(teamHeadingReveal).toHaveCSS("opacity", "1");

  const locationItems = page.locator("footer ul").nth(1).locator("li");
  await locationItems.last().scrollIntoViewIfNeeded();
  const gaps = await locationItems.evaluateAll((items) =>
    items.slice(1).map((item, index) => {
      const previous = items[index].getBoundingClientRect();
      const current = item.getBoundingClientRect();
      return current.top - previous.bottom;
    }),
  );
  expect(gaps[2]).toBeCloseTo(gaps[1], 0);
});

test("tablet headings and navigation fit in both languages", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [640, 768, 1024]) {
    await page.setViewportSize({ width, height: 720 });
    for (const locale of ["el", "en"]) {
      await page.goto(`/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page
          .locator(".hero-typewriter-reveal")
          .evaluateAll((lines) =>
            lines.every((line) => line.getBoundingClientRect().right <= innerWidth),
          ),
      ).toBe(true);
      if (width < 1024)
        await expect(
          page.locator('header button[aria-controls="mobile-navigation"]'),
        ).toBeVisible();
    }
  }
});

test("home content is readable at every viewport", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Pause/ })).toBeVisible();
  await page.locator("footer").scrollIntoViewIfNeeded();
  expect(
    await page.locator("footer").evaluate((footer) =>
      [...footer.querySelectorAll("a, p")].every((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= innerWidth + 1;
      }),
    ),
  ).toBe(true);
});

test("mobile navigation traps focus and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 720 });
  await page.goto("/en");
  const open = page.getByRole("button", { name: "Open menu" });
  await open.click();
  const menu = page.locator("#mobile-navigation");
  await expect(menu.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(menu.getByRole("link", { name: "Join us", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(open).toBeFocused();
  await expect(menu).toHaveAttribute("aria-hidden", "true");
});

test("join sharing metadata identifies the join page", async ({ page }) => {
  await page.goto("/en/join");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", /\/en\/join$/);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    (await page.locator('meta[name="description"]').getAttribute("content")) ?? "",
  );
});

test("crawler endpoints enumerate only available localized pages", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Sitemap:");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  for (const path of ["/el", "/en", "/el/join", "/en/join"]) {
    expect(xml).toContain(`${path}</loc>`);
  }
});
