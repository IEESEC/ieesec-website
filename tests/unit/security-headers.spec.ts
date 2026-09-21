import { expect, test } from "@playwright/test";
import nextConfig from "../../next.config";

test("applies security headers to every route", async () => {
  const routes = await nextConfig.headers?.();
  const route = routes?.find(({ source }) => source === "/:path*");
  const headers = new Map(route?.headers.map(({ key, value }) => [key, value]));

  expect(route).toBeDefined();
  expect(headers.get("Content-Security-Policy")).toContain("default-src 'self'");
  expect(headers.get("Content-Security-Policy")).toContain("script-src 'self' 'unsafe-inline'");
  expect(headers.get("Content-Security-Policy")).toContain("style-src 'self' 'unsafe-inline'");
  expect(headers.get("Content-Security-Policy")).toContain("img-src 'self' data: blob:");
  expect(headers.get("Content-Security-Policy")).toContain("font-src 'self'");
  expect(headers.get("Content-Security-Policy")).toContain("media-src 'self'");
  expect(headers.get("Content-Security-Policy")).toContain("connect-src 'self'");
  expect(headers.get("Content-Security-Policy")).toContain("object-src 'none'");
  expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
  expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  expect(headers.get("Permissions-Policy")).toBe(
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  );
});
