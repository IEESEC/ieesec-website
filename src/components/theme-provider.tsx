"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { MotionConfig } from "framer-motion";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <MotionConfig reducedMotion="user">
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </MotionConfig>
  );
}
