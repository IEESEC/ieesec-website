export function getScrollVideoTime(progress: number, duration: number): number {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

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
