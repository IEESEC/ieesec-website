import { expect, test } from "@playwright/test";
import { POST } from "../../src/app/api/join-application/route";

test("returns a stable code for unsupported request content", async () => {
  const response = await POST(
    new Request("http://localhost/api/join-application", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "not-json",
    }),
  );

  expect(response.status).toBe(415);
  expect(await response.json()).toEqual({ ok: false, code: "unsupported-media-type" });
});

test("returns a stable code for an invalid application", async () => {
  const response = await POST(
    new Request("http://localhost/api/join-application", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }),
  );

  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ ok: false, code: "invalid-application" });
});
