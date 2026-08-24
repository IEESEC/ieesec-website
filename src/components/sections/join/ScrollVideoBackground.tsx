"use client";

import { useEffect, useRef } from "react";

import {
  getScrollVideoTime,
  getSmoothedVideoTime,
  VIDEO_SEEK_TOLERANCE_SECONDS,
} from "./scroll-video-progress";

const ENCODED_VIDEO_DURATION = 13.37;

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

      if (!timeline) return;

      const scrollRange = Math.max(timeline.scrollHeight - timeline.clientHeight, 1);
      const progress = timeline.scrollTop / scrollRange;
      targetTime = getScrollVideoTime(progress, videoDuration);
      requestSeek();
    };

    const requestTargetUpdate = () => {
      if (scrollAnimationFrame || reduceMotion) return;

      scrollAnimationFrame = window.requestAnimationFrame(updateTargetTime);
    };

    const updateTimelineBounds = () => {
      requestTargetUpdate();
    };

    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        videoDuration = video.duration;
      }

      video.pause();
      video.currentTime = 0;
      updateTimelineBounds();
    };

    const timeline = document.querySelector<HTMLElement>("[data-scroll-video-timeline]");
    const resizeObserver = timeline ? new ResizeObserver(updateTimelineBounds) : null;

    if (timeline) resizeObserver?.observe(timeline);
    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("loadeddata", requestSeek);
    video.addEventListener("seeked", handleSeeked);
    timeline?.addEventListener("scroll", requestTargetUpdate, { passive: true });
    window.addEventListener("scroll", requestTargetUpdate, { passive: true });
    window.addEventListener("resize", updateTimelineBounds);
    updateTimelineBounds();

    return () => {
      resizeObserver?.disconnect();
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("loadeddata", requestSeek);
      video.removeEventListener("seeked", handleSeeked);
      timeline?.removeEventListener("scroll", requestTargetUpdate);
      window.removeEventListener("scroll", requestTargetUpdate);
      window.removeEventListener("resize", updateTimelineBounds);
      window.cancelAnimationFrame(scrollAnimationFrame);
      window.cancelAnimationFrame(seekAnimationFrame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster="/images/join/join-scroll-poster.jpg"
        disablePictureInPicture
        tabIndex={-1}
        className="h-full w-full object-cover"
      >
        <source
          src="/videos/join-scroll-background-mobile.mp4"
          type="video/mp4"
          media="(max-width: 767px)"
        />
        <source src="/videos/join-scroll-background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-950/58" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.48),transparent_55%,rgba(2,6,23,0.3))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-slate-950/65 to-transparent" />
    </div>
  );
}
