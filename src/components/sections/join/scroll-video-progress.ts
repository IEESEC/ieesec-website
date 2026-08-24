const FINAL_SCREEN_VIDEO_PROGRESS = 0.82;
const FINAL_SCREEN_PROGRESS_THRESHOLD = 0.98;

export function getScrollVideoTime(progress: number, duration: number): number {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  if (clampedProgress >= FINAL_SCREEN_PROGRESS_THRESHOLD) {
    return duration * FINAL_SCREEN_VIDEO_PROGRESS;
  }

  return clampedProgress * duration;
}

const SMOOTHING_FACTOR = 0.5;
const MAX_SEEK_STEP_SECONDS = 1.2;
const MIN_SEEK_STEP_SECONDS = 0.08;
export const VIDEO_SEEK_TOLERANCE_SECONDS = 0.025;

export function getSmoothedVideoTime(currentTime: number, targetTime: number): number {
  const difference = targetTime - currentTime;
  const distance = Math.abs(difference);

  if (distance <= VIDEO_SEEK_TOLERANCE_SECONDS) return targetTime;

  const step = Math.min(
    distance,
    MAX_SEEK_STEP_SECONDS,
    Math.max(distance * SMOOTHING_FACTOR, MIN_SEEK_STEP_SECONDS),
  );

  return currentTime + Math.sign(difference) * step;
}
