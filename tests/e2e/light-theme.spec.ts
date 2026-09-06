import { expect, test, type Locator, type Page } from "@playwright/test";

type Rgba = [number, number, number, number];

async function forceTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
}

async function renderedColor(locator: Locator, property: "backgroundColor" | "borderTopColor") {
  return locator.evaluate((element, cssProperty) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas context is unavailable");

    context.clearRect(0, 0, 1, 1);
    context.fillStyle = getComputedStyle(element)[cssProperty];
    context.fillRect(0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data] as Rgba;
  }, property);
}

async function contrastRatio(locator: Locator, pseudoElement?: "::placeholder") {
  return locator.evaluate((element, pseudo) => {
    type Color = [number, number, number, number];

    const parseColor = (value: string): Color => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Canvas context is unavailable");
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return [red, green, blue, alpha / 255];
    };

    const composite = (foreground: Color, background: Color): Color => {
      const alpha = foreground[3] + background[3] * (1 - foreground[3]);
      if (alpha === 0) return [0, 0, 0, 0];
      return [
        (foreground[0] * foreground[3] + background[0] * background[3] * (1 - foreground[3])) /
          alpha,
        (foreground[1] * foreground[3] + background[1] * background[3] * (1 - foreground[3])) /
          alpha,
        (foreground[2] * foreground[3] + background[2] * background[3] * (1 - foreground[3])) /
          alpha,
        alpha,
      ];
    };

    let background: Color = [255, 255, 255, 1];
    const layers: Color[] = [];
    let current: Element | null = element;
    while (current) {
      layers.push(parseColor(getComputedStyle(current).backgroundColor));
      current = current.parentElement;
    }
    for (const layer of layers.reverse()) background = composite(layer, background);

    const foreground = composite(
      parseColor(getComputedStyle(element, pseudo || null).color),
      background,
    );
    const luminance = ([red, green, blue]: Color) => {
      const channels = [red, green, blue].map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  }, pseudoElement);
}

test("dark supporting text and primary controls meet WCAG AA", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await forceTheme(page, "dark");
  await page.goto("/en");
  for (const sample of [
    page.locator("#team p").first(),
    page.locator("#team [data-slot='card'] p").last(),
    page.getByRole("banner").getByRole("link", { name: "Join us", exact: true }),
  ]) {
    await expect(sample).toBeVisible();
    expect(await contrastRatio(sample)).toBeGreaterThanOrEqual(4.5);
  }
});

test("one click switches a system-resolved dark theme to light", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.removeItem("theme"));
  await page.goto("/en");

  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(page.locator("html")).toHaveClass(/light/);
});

test("light hero and navbar use artifact-free terminal surfaces", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await forceTheme(page, "light");
  await page.goto("/en");

  const navbar = page.getByRole("banner").locator(":scope > div > div");
  const [, , , navbarAlpha] = await renderedColor(navbar, "backgroundColor");
  expect(navbarAlpha / 255).toBeGreaterThan(0.55);
  expect(navbarAlpha / 255).toBeLessThan(0.9);
  await expect(navbar).toHaveCSS("backdrop-filter", /blur/);

  const heroOverlay = page.locator(".hero-overlay").first();
  const [overlayRed, overlayGreen, overlayBlue] = await renderedColor(
    heroOverlay,
    "backgroundColor",
  );
  expect(Math.min(overlayRed, overlayGreen, overlayBlue)).toBeGreaterThan(180);

  const contentWash = page.locator(".hero-content-wash").first();
  const contentWashGradient = await contentWash.evaluate(
    (element) => getComputedStyle(element).backgroundImage,
  );
  expect(contentWashGradient).toMatch(/lab\(9[0-9]/);
  expect(contentWashGradient).not.toMatch(/lab\((?:[0-8]?[0-9]|90)\./);

  const fadeProbe = page.locator(".hero-fade").first();
  const gradient = await fadeProbe.evaluate((element) => {
    const value = getComputedStyle(element).backgroundImage;
    return value.match(/,\s*([^,]+)\s+100%\)$/)?.[1] ?? "";
  });
  expect(gradient).not.toBe("");

  const fadeLuminance = await fadeProbe.evaluate((element, terminalColor) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas context is unavailable");
    context.fillStyle = terminalColor;
    context.fillRect(0, 0, 1, 1);
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    const convert = (channel: number) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    return convert(red) * 0.2126 + convert(green) * 0.7152 + convert(blue) * 0.0722;
  }, gradient);
  expect(fadeLuminance).toBeGreaterThan(0.75);
});

test("light theme supporting text and controls meet WCAG AA", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await forceTheme(page, "light");
  await page.goto("/en");

  const textSamples = [
    page.locator("#team p").first(),
    page.locator("#tech-stack p").first(),
    page.locator("#blog p.text-muted-foreground").first(),
    page.locator("footer p").first(),
  ];
  for (const sample of textSamples) {
    await expect(sample).toBeVisible();
    expect(await contrastRatio(sample)).toBeGreaterThanOrEqual(4.5);
  }
  const footerAccentHeading = page.locator("footer h2").first();
  await expect(footerAccentHeading).toBeVisible();
  expect(await contrastRatio(footerAccentHeading)).toBeGreaterThanOrEqual(3);

  await page.goto("/en/join");
  await page.getByRole("link", { name: "Scroll to get started" }).click();
  const nameInput = page.getByLabel("Full name");
  await expect(nameInput).toBeVisible();
  expect(await contrastRatio(nameInput, "::placeholder")).toBeGreaterThanOrEqual(4.5);

  const inputBackground = await renderedColor(nameInput, "backgroundColor");
  const inputBorder = await renderedColor(nameInput, "borderTopColor");
  expect(inputBackground).not.toEqual(inputBorder);
});
