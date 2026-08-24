export function getScrollVideoTime(progress: number, duration: number): number {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return clampedProgress * duration;
}
