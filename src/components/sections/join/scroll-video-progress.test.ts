import assert from "node:assert/strict";
import { describe, it } from "node:test";

// @ts-expect-error Node's type-stripping test runner requires the explicit TypeScript extension.
import { getScrollVideoTime } from "./scroll-video-progress.ts";

describe("getScrollVideoTime", () => {
  it("starts at the opening frame", () => {
    assert.equal(getScrollVideoTime(0, 13.37), 0);
  });

  it("reaches the last decodable frame on the fifth screen", () => {
    assert.ok(Math.abs(getScrollVideoTime(1, 13.37) - 10.9634) < 0.000001);
  });

  it("clamps progress before mapping it to the video", () => {
    assert.equal(getScrollVideoTime(-0.25, 13.37), 0);
    assert.ok(Math.abs(getScrollVideoTime(1.25, 13.37) - 10.9634) < 0.000001);
  });
});
