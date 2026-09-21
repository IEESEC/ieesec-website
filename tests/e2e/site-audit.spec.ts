import { expect, test } from "@playwright/test";

test("localized layouts remain within the viewport and have no runtime errors", async ({
  page,
}, testInfo) => {
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
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);
    await page.screenshot({ path: testInfo.outputPath(`${locale}-home.png`) });
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

test("hero stays left aligned, vertically centered, and starts typing after its load animation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.emulateMedia({ reducedMotion: "reduce" });

  const fontSizes: string[] = [];
  for (const locale of ["en", "el"]) {
    await page.goto(`/${locale}`);
    const heroCopy = page.getByTestId("hero-copy");
    const metrics = await heroCopy.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const heading = element.querySelector("h1");
      return {
        centerOffset: Math.abs(rect.top + rect.height / 2 - innerHeight / 2),
        fontSize: heading ? getComputedStyle(heading).fontSize : "",
        textAlign: getComputedStyle(element).textAlign,
      };
    });
    expect(metrics.centerOffset).toBeLessThanOrEqual(1);
    expect(metrics.textAlign).toBe("start");
    fontSizes.push(metrics.fontSize);
  }
  expect(fontSizes[0]).toBe(fontSizes[1]);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const timing = await page.evaluate(() => {
    const mediaAnimation = document.querySelector(".hero-slide-image")?.getAnimations()[0];
    const typingAnimation = document.querySelector(".hero-typewriter-reveal")?.getAnimations()[0];
    return {
      mediaDuration: Number(mediaAnimation?.effect?.getComputedTiming().duration ?? 0),
      typingDelay: Number(typingAnimation?.effect?.getComputedTiming().delay ?? 0),
    };
  });
  expect(timing.mediaDuration).toBeGreaterThan(0);
  expect(timing.typingDelay).toBeGreaterThanOrEqual(timing.mediaDuration);
});

test("mobile hero headline stays inside the viewport in both locales", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "desktop");
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const locale of ["el", "en"]) {
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator("html")).toHaveCSS("-webkit-text-size-adjust", "100%");
    await expect(page.locator("h1")).toHaveCSS("font-family", /Inter/);

    const metrics = await page.locator(".hero-typewriter-line").evaluateAll((lines) =>
      lines.map((line) => {
        const rect = line.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          width: rect.width,
          scrollWidth: line.scrollWidth,
          clientWidth: line.clientWidth,
          viewportWidth: window.innerWidth,
        };
      }),
    );

    for (const line of metrics) {
      expect(line.left, `${locale} headline left`).toBeGreaterThanOrEqual(-1);
      expect(line.right, `${locale} headline right`).toBeLessThanOrEqual(line.viewportWidth + 1);
      expect(line.scrollWidth, `${locale} headline scroll width`).toBeLessThanOrEqual(
        line.clientWidth + 1,
      );
      expect(line.width, `${locale} headline width`).toBeGreaterThan(0);
    }
  }
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

test("places the FAQ section below Discord", async ({ page }) => {
  await page.goto("/en");

  await expect
    .poll(() =>
      page.locator("#discord").evaluate((discord) => {
        const faq = document.getElementById("faq");
        return faq
          ? Boolean(discord.compareDocumentPosition(faq) & Node.DOCUMENT_POSITION_FOLLOWING)
          : false;
      }),
    )
    .toBe(true);
});

test("Discord member count and join button stay inline", async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);

    for (const locale of ["el", "en"]) {
      await page.goto(`/${locale}`);
      const card = page.locator("#discord > div > div > div").last();

      // Keep programmatic scrolling synchronous so both geometry reads use one viewport position.
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
      });
      await card.scrollIntoViewIfNeeded();
      const { countBox, joinBox } = await card.evaluate((element) => {
        const getBox = (node: Element | null) => {
          if (!node) return null;
          const { x, y, width, height } = node.getBoundingClientRect();
          return { x, y, width, height };
        };

        return {
          countBox: getBox(element.querySelector('[data-testid="discord-member-count"]')),
          joinBox: getBox(element.querySelector("a")),
        };
      });

      expect(countBox, `${locale} member count should be measurable`).not.toBeNull();
      expect(joinBox, `${locale} join button should be measurable`).not.toBeNull();
      expect(await card.locator("h3").count()).toBe(0);
      expect(joinBox!.x).toBeLessThan(countBox!.x);
      expect(joinBox!.y).toBeLessThan(countBox!.y + countBox!.height);
      expect(countBox!.y).toBeLessThan(joinBox!.y + joinBox!.height);
    }
  }
});

test("Discord CTA reveals on entry and starts the counter on entry", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");

  const section = page.locator("#discord");
  const card = page.locator("#discord > div > div > div").last();
  const count = section.getByTestId("discord-member-count");

  await page.waitForTimeout(1400);
  const beforeEntry = await count.textContent();
  if (beforeEntry !== "—") expect(beforeEntry).toBe("0");

  await section.scrollIntoViewIfNeeded();
  await expect
    .poll(async () => {
      const value = await count.textContent();
      return value === "—" ? 0 : Number(value?.replaceAll(",", "") ?? 0);
    })
    .toBeGreaterThan(0);
  await expect
    .poll(() => card.evaluate((element) => element.getAnimations().length))
    .toBeGreaterThan(0);
});

test("Discord section leaves room for the footbar in the final viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/en");

  const metrics = await page.locator("#discord").evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      minHeight: styles.minHeight,
      flexDirection: styles.flexDirection,
    };
  });

  expect(metrics.minHeight).toBe("540px");
  expect(metrics.flexDirection).toBe("column");
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
