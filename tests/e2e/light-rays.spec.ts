import { expect, test } from "@playwright/test";

test("homepage ambient light rays adapt to the active theme", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  const rayLayer = page.locator('[data-testid="light-rays"]');

  await page.goto("/en");
  await page.evaluate(() => localStorage.setItem("theme", "light"));
  await page.reload();
  await expect(rayLayer).toBeVisible();
  await expect(rayLayer).toHaveAttribute("aria-hidden", "true");
  const lightColor = await rayLayer.evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--light-rays-color").trim(),
  );

  await page.evaluate(() => localStorage.setItem("theme", "dark"));
  await page.reload();
  const darkColor = await rayLayer.evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--light-rays-color").trim(),
  );

  expect(lightColor).not.toBe("");
  expect(darkColor).not.toBe("");
  expect(darkColor).not.toBe(lightColor);
  await expect(page.locator("#team h2")).toBeVisible();
});

test("hero fade bleeds upward from the first content section", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/en");

  const overlap = await page.locator(".hero-carousel").evaluate((hero) => {
    const fade = hero.querySelector<HTMLElement>('[data-testid="hero-fade"]');
    if (!fade) throw new Error("Hero fade is missing");

    const fadeTop = fade.getBoundingClientRect().top;
    const heroBottom = hero.getBoundingClientRect().bottom;
    const fadeBottom = fade.getBoundingClientRect().bottom;
    return {
      fadeTop,
      heroBottom,
      fadeBottom,
      backgroundImage: getComputedStyle(fade).backgroundImage,
    };
  });

  expect(overlap.fadeTop).toBeLessThan(overlap.heroBottom);
  expect(overlap.fadeBottom).toBeCloseTo(overlap.heroBottom, 0);
  expect(overlap.backgroundImage).toMatch(/to top/);
});
