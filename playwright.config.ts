import { defineConfig } from "@playwright/test";

const mobileProjects = [
  { name: "mobile-compact", viewport: { width: 320, height: 568 } },
  { name: "mobile-standard", viewport: { width: 390, height: 844 } },
  { name: "mobile-short", viewport: { width: 390, height: 500 } },
  { name: "mobile-landscape", viewport: { width: 844, height: 390 } },
];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "line",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "unit",
      testMatch: /tests\/unit\/.*\.spec\.ts/,
    },
    {
      name: "desktop",
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: { viewport: { width: 1280, height: 720 } },
    },
    ...mobileProjects.map(({ name, viewport }) => ({
      name,
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: { viewport, hasTouch: true, isMobile: true },
    })),
  ],
  webServer: process.argv.includes("--project=unit")
    ? undefined
    : {
        command: `"${process.execPath}" node_modules/next/dist/bin/next dev`,
        url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
