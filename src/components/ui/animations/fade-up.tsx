"use client";

import { useLayoutEffect, useRef } from "react";

export type FadeDirection = "up" | "down" | "left" | "right" | "none";
export interface RevealProps {
  children: React.ReactNode;
  direction?: FadeDirection;
  delay?: number;
  duration?: number;
  className?: string;
}
const OFFSET: Record<FadeDirection, string> = {
  up: "translateY(124px)",
  down: "translateY(-124px)",
  left: "translateX(-124px)",
  right: "translateX(124px)",
  none: "none",
};
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const showElement = () => {
      element.style.opacity = "1";
      element.style.transform = "none";
      element.style.removeProperty("will-change");
    };

    // Apply the initial state before paint while keeping server and no-JavaScript HTML visible.
    if (reducedMotion.matches || document.hidden) {
      showElement();
      return;
    }
    element.style.opacity = "0";
    element.style.transform = OFFSET[direction];
    element.style.willChange = "opacity, transform";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animation = element.animate(
          [
            { opacity: 0, transform: OFFSET[direction] },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: "cubic-bezier(0.21,0.47,0.32,0.98)",
            fill: "forwards",
          },
        );
        void animation.finished
          .then(() => {
            showElement();
            animation?.cancel();
          })
          .catch(() => undefined);
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    );
    const stopMotion = () => {
      if (!reducedMotion.matches && !document.hidden) return;
      observer.disconnect();
      animation?.cancel();
      showElement();
    };
    observer.observe(element);
    reducedMotion.addEventListener("change", stopMotion);
    document.addEventListener("visibilitychange", stopMotion);
    return () => {
      observer.disconnect();
      animation?.cancel();
      showElement();
      reducedMotion.removeEventListener("change", stopMotion);
      document.removeEventListener("visibilitychange", stopMotion);
    };
  }, [direction, delay, duration]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
