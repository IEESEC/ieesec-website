"use client";

import { MOTION_DURATION_REVEAL, MOTION_EASE_SECTION_REVEAL } from "@/components/ui/motion";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export type FadeDirection = "up" | "down" | "left" | "right" | "none";
export interface RevealProps {
  children: React.ReactNode;
  direction?: FadeDirection;
  delay?: number;
  duration?: number;
  className?: string;
}
const OFFSET: Record<FadeDirection, { x?: number; y?: number }> = {
  up: { y: 124 },
  down: { y: -124 },
  left: { x: -124 },
  right: { x: 124 },
  none: {},
};
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = MOTION_DURATION_REVEAL,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        reducedMotion || isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...OFFSET[direction] }
      }
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: MOTION_EASE_SECTION_REVEAL,
      }}
    >
      {children}
    </motion.div>
  );
}
