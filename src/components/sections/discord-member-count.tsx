"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";

export function DiscordMemberCount({ locale, value }: { locale: Locale; value: number | null }) {
  const [displayValue, setDisplayValue] = useState(value);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (value === null) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      setDisplayValue(value);
      return;
    }

    setDisplayValue(0);

    let frame = 0;
    const duration = 1300;

    const startAnimation = () => {
      const startedAt = performance.now();
      const tick = (timestamp: number) => {
        const progress = Math.min((timestamp - startedAt) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setDisplayValue(Math.round(value * easedProgress));

        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const element = countRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      startAnimation();
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        startAnimation();
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  if (value === null) {
    return (
      <span data-testid="discord-member-count" aria-live="polite" aria-atomic="true">
        —
      </span>
    );
  }

  return (
    <span ref={countRef} data-testid="discord-member-count" aria-live="polite" aria-atomic="true">
      {new Intl.NumberFormat(locale).format(displayValue ?? value)}
    </span>
  );
}
