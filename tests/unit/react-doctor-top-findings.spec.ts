import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

test("pnpm workspace enables the two React Doctor supply-chain safeguards", () => {
  const workspace = readProjectFile("pnpm-workspace.yaml");

  expect(workspace).toContain("minimumReleaseAge: 10080");
  expect(workspace).toContain("trustPolicy: no-downgrade");
});

test("the application route makes its outbound Discord webhook explicit", () => {
  const route = readProjectFile("src/app/api/join-application/route.ts");

  expect(route).toContain("const webhookUrl = process.env.DISCORD_JOIN_WEBHOOK_URL;");
  expect(route).not.toContain("process.env[DISCORD_WEBHOOK_ENV]");
});

test("the hero carousel lazily initializes its autoplay ref", () => {
  const carousel = readProjectFile("src/components/hero-carousel.tsx");

  expect(carousel).toContain("React.useRef<ReturnType<typeof Autoplay> | null>(null)");
  expect(carousel).toContain("if (autoplayPlugin.current === null)");
  expect(carousel).not.toMatch(/React\.useRef\(\s*Autoplay\(/);
});
