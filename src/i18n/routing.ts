import { defineRouting } from "next-intl/routing";

export const locales = ["el", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "el";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
});

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizePathname(pathname: string, locale: Locale): string {
  const hashIndex = pathname.indexOf("#");
  const hash = hashIndex >= 0 ? pathname.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? pathname.slice(0, hashIndex) : pathname;
  const queryIndex = withoutHash.indexOf("?");
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const unprefixed = path.replace(/^\/(?:el|en)(?=\/|$)/, "") || "/";
  const localizedPath =
    unprefixed === "/"
      ? `/${locale}${path !== "/" && path.endsWith("/") ? "/" : ""}`
      : `/${locale}${unprefixed}`;

  return `${localizedPath}${query}${hash}`;
}
