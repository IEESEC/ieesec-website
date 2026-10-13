"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <NextThemesProvider {...props}>{children}</NextThemesProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
