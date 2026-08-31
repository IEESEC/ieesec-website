"use client";

import { useEffect, useRef } from "react";
import { getJoinStepProgress } from "./join-form-flow";
import {
  getScrollVideoTime,
  getSmoothedVideoTime,
  shouldWarmScrollVideo,
  VIDEO_SEEK_TOLERANCE_SECONDS,
} from "./scroll-video-progress";

const ENCODED_VIDEO_DURATION = 13.37;
const DESKTOP_SCROLL_MODE = "(min-width: 768px) and (pointer: fine)";

interface ScrollVideoBackgroundProps {
  activeStep: number;
}

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function ScrollVideoBackground({ activeStep }: ScrollVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as NavigatorWithConnection).connection?.saveData);

    if (!shouldWarmScrollVideo({ reduceMotion, saveData })) return;

    const abortController = new AbortController();
    const requestIdle = (
      window as unknown as {
        requestIdleCallback?: Window["requestIdleCallback"];
      }
    ).requestIdleCallback;
    const cancelIdle = (
      window as unknown as {
        cancelIdleCallback?: Window["cancelIdleCallback"];
      }
    ).cancelIdleCallback;
    let timeoutId = 0;
    let idleId = 0;

    const warmSelectedSource = () => {
      if (!video.currentSrc || document.visibilityState === "hidden") return;

      void fetch(video.currentSrc, {
        cache: "force-cache",
        signal: abortController.signal,
      }).catch(() => undefined);
    };

    const scheduleWarmup = () => {
      if (requestIdle) {
        idleId = requestIdle.call(window, warmSelectedSource, { timeout: 2_000 });
      } else {
        timeoutId = window.setTimeout(warmSelectedSource, 1_200);
      }
    };

    if (video.readyState >= 1) scheduleWarmup();
    else video.addEventListener("loadedmetadata", scheduleWarmup, { once: true });

    return () => {
      abortController.abort();
      video.removeEventListener("loadedmetadata", scheduleWarmup);
      if (idleId) cancelIdle?.call(window, idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopScrollMode = window.matchMedia(DESKTOP_SCROLL_MODE);
    let scrollAnimationFrame = 0;
    let seekAnimationFrame = 0;
    let videoDuration = ENCODED_VIDEO_DURATION;
    let targetTime = 0;

    const seekTowardsTarget = () => {
      seekAnimationFrame = 0;

      if (reduceMotion || video.readyState < 2 || video.seeking) return;

      const nextTime = getSmoothedVideoTime(video.currentTime, targetTime);

      if (nextTime === video.currentTime) return;
      video.currentTime = nextTime;
    };

    const requestSeek = () => {
      if (seekAnimationFrame || video.seeking || reduceMotion) return;
      seekAnimationFrame = window.requestAnimationFrame(seekTowardsTarget);
    };

    const handleSeeked = () => {
      if (Math.abs(targetTime - video.currentTime) <= VIDEO_SEEK_TOLERANCE_SECONDS) return;
      requestSeek();
    };

    const updateTargetTime = () => {
      scrollAnimationFrame = 0;
      const timeline = document.querySelector<HTMLElement>("[data-scroll-video-timeline]");
      const progress =
        desktopScrollMode.matches && timeline
          ? timeline.scrollTop / Math.max(timeline.scrollHeight - timeline.clientHeight, 1)
          : getJoinStepProgress(activeStep);

      targetTime = getScrollVideoTime(progress, videoDuration);
      requestSeek();
    };

    const requestTargetUpdate = () => {
      if (scrollAnimationFrame || reduceMotion) return;
      scrollAnimationFrame = window.requestAnimationFrame(updateTargetTime);
    };

    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        videoDuration = video.duration;
      }

      video.pause();
      requestTargetUpdate();
    };

    const timeline = document.querySelector<HTMLElement>("[data-scroll-video-timeline]");
    const resizeObserver = timeline ? new ResizeObserver(requestTargetUpdate) : null;

    if (timeline) resizeObserver?.observe(timeline);
    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("loadeddata", requestSeek);
    video.addEventListener("seeked", handleSeeked);
    timeline?.addEventListener("scroll", requestTargetUpdate, { passive: true });
    window.addEventListener("scroll", requestTargetUpdate, { passive: true });
    window.addEventListener("resize", requestTargetUpdate);
    desktopScrollMode.addEventListener("change", requestTargetUpdate);

    if (video.readyState >= 1) handleMetadata();
    else requestTargetUpdate();

    return () => {
      resizeObserver?.disconnect();
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("loadeddata", requestSeek);
      video.removeEventListener("seeked", handleSeeked);
      timeline?.removeEventListener("scroll", requestTargetUpdate);
      window.removeEventListener("scroll", requestTargetUpdate);
      window.removeEventListener("resize", requestTargetUpdate);
      desktopScrollMode.removeEventListener("change", requestTargetUpdate);
      window.cancelAnimationFrame(scrollAnimationFrame);
      window.cancelAnimationFrame(seekAnimationFrame);
    };
  }, [activeStep]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        poster="/images/join/join-scroll-poster.jpg"
        disablePictureInPicture
        tabIndex={-1}
        className="h-full w-full object-cover"
      >
        <source
          src="/videos/join-scroll-background-large.mp4"
          type="video/mp4"
          media="(min-width: 1200px)"
        />
        <source
          src="/videos/join-scroll-background-mobile.mp4"
          type="video/mp4"
          media="(max-width: 767px), (pointer: coarse)"
        />
        <source src="/videos/join-scroll-background.mp4" type="video/mp4" />
      </video>
      <div data-testid="join-video-overlay" className="join-video-overlay absolute inset-0" />
      <div data-testid="join-video-wash" className="join-video-wash absolute inset-0" />
      <div
        data-testid="join-video-fade"
        className="join-video-fade absolute inset-x-0 bottom-0 h-48"
      />
    </div>
  );
}
