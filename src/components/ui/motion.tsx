"use client";

import * as m from "framer-motion/m";

// Keep these values aligned with the CSS motion tokens in globals.css.
export const MOTION_EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const MOTION_EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const MOTION_EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const MOTION_DURATION_PRESS = 0.16;
export const MOTION_DURATION_HOVER = 0.2;
export const MOTION_DURATION_STANDARD = 0.3;
export const MOTION_DURATION_EMPHASIS = 0.45;
export const MOTION_DURATION_MEDIA = 0.5;
export const MOTION_DURATION_REVEAL = 0.8;

// Preserve the existing section/event entrances and slower photographic hover treatment.
// These intentional exceptions avoid retiming animations during token consolidation.
export const MOTION_EASE_SECTION_REVEAL = [0.21, 0.47, 0.32, 0.98] as const;
export const MOTION_EASE_EVENT_REVEAL = [0.22, 1, 0.36, 1] as const;
export const MOTION_DURATION_PHOTO_HOVER = 0.7;

export const MotionA = m.a;
export const MotionDiv = m.div;
export const MotionSpan = m.span;
