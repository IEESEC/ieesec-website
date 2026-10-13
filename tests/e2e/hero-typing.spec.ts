import { expect, test } from "@playwright/test";

for (const locale of ["el", "en"]) {
  for (const width of [320, 390, 1280]) {
    test(`hero typing leaves every letter unclipped in ${locale} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 720 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(`/${locale}`);
      const lines = page.locator("h1 .hero-typewriter-reveal");
      await expect(lines).toHaveCount(3);

      for (const line of await lines.all()) {
        await expect(line).toHaveCSS("clip-path", "none");
        await expect(line).toBeVisible();
      }
    });
  }

  test(`hero typing shows complete text immediately with reduced motion in ${locale}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}`);
    const lines = page.locator("h1 .hero-typewriter-reveal");
    await expect(lines).toHaveCount(3);

    for (const line of await lines.all()) {
      await expect(line).toHaveCSS("animation-name", "none");
      await expect(line).toHaveCSS("clip-path", "none");
      await expect(line).toBeVisible();
    }
  });
}
