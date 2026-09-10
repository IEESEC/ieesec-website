"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type LightRayStyle = React.CSSProperties & Record<`--ray-${string}`, string>;

export type LightRaysProps = {
  count?: number;
  color?: string;
  blur?: number;
  opacity?: number;
  speed?: number;
  length?: string | number;
  className?: string;
  style?: React.CSSProperties;
};

function getRayStyle(index: number, count: number, speed: number): LightRayStyle {
  const progress = count > 1 ? index / (count - 1) : 0.5;
  const width = 9 + ((index * 13) % 17);
  const angle = (progress - 0.5) * 22;
  const delay = -((index * Math.max(speed / Math.max(count, 1), 1.8)) % speed);
  const rayOpacity = 0.72 + ((index * 19) % 25) / 100;

  return {
    "--ray-left": `${8 + progress * 84}%`,
    "--ray-width": `${width}rem`,
    "--ray-angle": `${angle}deg`,
    "--ray-delay": `${delay}s`,
    "--ray-opacity": `${rayOpacity}`,
  };
}

export function LightRays({
  count = 7,
  color = "var(--light-rays-theme-color)",
  blur = 36,
  opacity = 0.65,
  speed = 14,
  length = "70vh",
  className,
  style,
}: LightRaysProps) {
  const rayCount = Math.max(0, Math.floor(count));
  const raySpeed = Math.max(speed, 1);

  const wrapperStyle = {
    ...style,
    "--light-rays-color": color,
    "--light-rays-blur": `${Math.max(0, blur)}px`,
    "--light-rays-opacity": `${Math.min(Math.max(opacity, 0), 1)}`,
    "--light-rays-speed": `${raySpeed}s`,
    "--light-rays-length": typeof length === "number" ? `${length}px` : length,
  } as React.CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={cn("light-rays absolute inset-0 overflow-hidden", className)}
      data-testid="light-rays"
      style={wrapperStyle}
    >
      <div className="light-rays-glow" />
      <div className="light-rays-source" />
      <div className="light-rays-rays">
        {Array.from({ length: rayCount }, (_, index) => (
          <span
            aria-hidden="true"
            className="light-rays-ray"
            key={index}
            style={getRayStyle(index, rayCount, raySpeed)}
          />
        ))}
      </div>
    </div>
  );
}
