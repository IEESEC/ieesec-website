import { expect, test } from "@playwright/test";
import {
  defaultLocale,
  isLocale,
  localizePathname,
  locales,
} from "../../src/i18n/routing";

test("supports only Greek and English with Greek as the default", () => {
  expect(locales).toEqual(["el", "en"]);
  expect(defaultLocale).toBe("el");
  expect(isLocale("el")).toBe(true);
  expect(isLocale("en")).toBe(true);
  expect(isLocale("fr")).toBe(false);
});

test("switches locale while preserving pathname, query and hash", () => {
  expect(localizePathname("/el/#team", "en")).toBe("/en/#team");
  expect(localizePathname("/en/join?from=navbar#application", "el")).toBe(
    "/el/join?from=navbar#application",
  );
});

test("adds a locale to legacy and unprefixed paths", () => {
  expect(localizePathname("/", "el")).toBe("/el");
  expect(localizePathname("/join", "el")).toBe("/el/join");
});
