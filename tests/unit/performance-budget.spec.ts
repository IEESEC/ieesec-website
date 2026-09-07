import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sourcePath = (path: string) => resolve(process.cwd(), path);

test("homepage initial media stays within the Safari performance budget", () => {
  const hero = readFileSync(sourcePath("src/components/hero-carousel.tsx"), "utf8");
  const styles = readFileSync(sourcePath("src/app/globals.css"), "utf8");
  const nextConfig = readFileSync(sourcePath("next.config.ts"), "utf8");

  expect(hero).toContain("quality={60}");
  expect(nextConfig).toContain("qualities: [60, 65, 75]");
  expect(styles).toContain(".home-section-lazy");
  expect(styles).toContain(".light-rays-ray:nth-child(n + 5)");
  expect(styles).not.toMatch(/\.hero-slide-image\s*\{[^}]*filter:/s);
});
