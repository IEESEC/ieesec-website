"use client";

import { useEffect, useRef } from "react";

import { getScrollVideoTime } from "./scroll-video-progress";

const ENCODED_VIDEO_DURATION = 13.37;

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let videoDuration = ENCODED_VIDEO_DURATION;
    let lastRequestedTime = -1;

    const updateVideoTime = () => {
      animationFrame = 0;

      if (reduceMotion) return;

      const timeline = document.querySelector<HTMLElement>("[data-scroll-video-timeline]");

      if (!timeline) return;

      const bounds = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const documentTop = window.scrollY + bounds.top;
      const documentBottom = documentTop + bounds.height;
      const scrollStart = documentTop - viewportHeight * 0.78;
      const scrollEnd = documentBottom - viewportHeight * 0.35;
      const progress = (window.scrollY - scrollStart) / Math.max(scrollEnd - scrollStart, 1);
      const requestedTime = getScrollVideoTime(progress, videoDuration);

      if (Math.abs(requestedTime - lastRequestedTime) < 0.025 || video.readyState < 1) return;

      lastRequestedTime = requestedTime;
      video.currentTime = requestedTime;
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateVideoTime);
    };

    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        videoDuration = video.duration;
      }

      video.pause();
      video.currentTime = 0;
      requestUpdate();
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.cancelAnimationFrame(animationFrame);
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
        <source src="/videos/join-scroll-background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-950/58" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.48),transparent_55%,rgba(2,6,23,0.3))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-slate-950/65 to-transparent" />
    </div>
  );
}
