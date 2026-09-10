import { expect, test } from "@playwright/test";
import {
  getScrollVideoTime,
  getSmoothedVideoTime,
  shouldWarmScrollVideo,
  VIDEO_SEEK_TOLERANCE_SECONDS,
} from "../../src/components/sections/join/scroll-video-progress";

test("scroll progress is clamped to the visible video range", () => {
  expect(getScrollVideoTime(-1, 10)).toBe(0);
  expect(getScrollVideoTime(0.5, 10)).toBeCloseTo(4.1);
  expect(getScrollVideoTime(2, 10)).toBeCloseTo(8.2);
});

test("seeking converges without jumping past the target", () => {
  const next = getSmoothedVideoTime(0, 5);

  expect(next).toBeGreaterThan(0);
  expect(next).toBeLessThanOrEqual(1.2);
  expect(getSmoothedVideoTime(2, 2 + VIDEO_SEEK_TOLERANCE_SECONDS / 2)).toBeCloseTo(
    2 + VIDEO_SEEK_TOLERANCE_SECONDS / 2,
  );
});

test("video warming respects reduced motion and data saver", () => {
  expect(shouldWarmScrollVideo({ reduceMotion: false, saveData: false })).toBe(true);
  expect(shouldWarmScrollVideo({ reduceMotion: true, saveData: false })).toBe(false);
  expect(shouldWarmScrollVideo({ reduceMotion: false, saveData: true })).toBe(false);
});
