import assert from "node:assert/strict";
import { describe, it } from "node:test";

// @ts-expect-error Node's type-stripping test runner requires the explicit TypeScript extension.
import { getScrollVideoTime } from "./scroll-video-progress.ts";

describe("getScrollVideoTime", () => {
  it("keeps the opening frame still before the form enters the viewport", () => {
    assert.equal(getScrollVideoTime(-0.25, 13.37), 0);
  });

  it("maps the form's scroll progress across the full video timeline", () => {
    assert.equal(getScrollVideoTime(0.5, 13.37), 6.685);
  });

  it("holds the final frame after the last section", () => {
    assert.equal(getScrollVideoTime(1.4, 13.37), 13.37);
  });
});
