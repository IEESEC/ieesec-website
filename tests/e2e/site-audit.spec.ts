import { expect, test } from "@playwright/test";

test("localized layouts remain within the viewport and have no runtime errors", async ({ page }) => {
  const errors: string[] = [];
  const scriptWarnings: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      message.text().includes("Encountered a script tag while rendering React component")
    ) {
      scriptWarnings.push(message.text());
    }
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["el", "en"]) {
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    for (const selector of ["#home", "#team", "#tech-stack", "#blog", "#faq", "footer"]) {
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
  }
  expect(errors).toEqual([]);
  expect(scriptWarnings).toEqual([]);
});

test("content remains readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("/en");
  await expect(page.locator("#team h2")).toHaveCSS("opacity", "1");
  await expect(page.locator("#team h2").locator("..")).toHaveCSS("opacity", "1");
  await context.close();
});

test("FAQ accordion supports keyboard interaction and keeps one answer open", async ({ page }) => {
  for (const locale of ["el", "en"]) {
    await page.goto(`/${locale}`);
    const faq = page.locator("#faq");
    const triggers = faq.getByRole("button");
    const contents = faq.locator(".faq-accordion-content");

    await expect(faq.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(triggers).toHaveCount(8);

    await triggers.first().focus();
    await page.keyboard.press("Enter");
    await expect(triggers.first()).toHaveAttribute("aria-expanded", "true");
    await expect(contents.first()).toBeVisible();

    await triggers.nth(1).click();
    await expect(triggers.first()).toHaveAttribute("aria-expanded", "false");
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");

    await triggers.nth(1).click();
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "false");
  }
});

test("FAQ accordion remains stable after a mobile touch tap", async ({ page }, testInfo) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile"),
    "Touch regression coverage is mobile-only",
  );

  await page.goto("/el");
  const faq = page.locator("#faq");
  const trigger = faq.getByRole("button").first();
  const content = faq.locator(".faq-accordion-content").first();

  await trigger.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const before = await faq.boundingBox();
  const scrollY = await page.evaluate(() => window.scrollY);

  await trigger.tap();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(content).toBeVisible();
  await expect.poll(() => content.boundingBox().then((box) => box?.height ?? 0)).toBeGreaterThan(0);

  const after = await faq.boundingBox();
  expect(after?.y).toBeCloseTo(before?.y ?? 0, 0);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollY);
});

test("homepage ends with a localized Discord community CTA", async ({ page }) => {
  for (const locale of ["el", "en"]) {
    await page.goto(`/${locale}`);
    const section = page.locator("#discord");
    const title =
      locale === "el" ? "Τα πρότζεκτς συνεχίζονται στο Discord." : "Projects continue on Discord.";
    const description =
      locale === "el"
        ? "Εκεί μοιραζόμαστε updates, οργανώνουμε workshops και μένουμε κοντά σε ό,τι χτίζει η κοινότητα."
        : "That is where we share updates, organise workshops and stay close to what the community is building.";
    const card = page.locator("#discord > div > div > div").last();

    await expect(section).toBeVisible();
    await expect(section.locator("#discord-title")).toHaveText(title);
    await expect(card.getByText(description, { exact: true })).toBeVisible();
    const [descriptionBox, controlsBox] = await Promise.all([
      card.getByText(description, { exact: true }).boundingBox(),
      card.getByRole("link").boundingBox(),
    ]);
    expect(descriptionBox, `${locale} description should be measurable`).not.toBeNull();
    expect(controlsBox, `${locale} controls should be measurable`).not.toBeNull();
    expect(descriptionBox!.y + descriptionBox!.height).toBeLessThan(controlsBox!.y);
    await expect(
      section.locator("#discord-title").locator("..").getByText(description, { exact: true }),
    ).toHaveCount(0);
    await expect(section.getByTestId("discord-member-count")).toHaveText(/^(\d+|—)$/);
    await expect(section.getByRole("link")).toHaveAttribute(
      "href",
      "https://discord.gg/2xHBsHMKy7",
    );
    await expect(section.getByTestId("discord-member-count")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  }
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
