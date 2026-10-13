"use client";

import { MOTION_DURATION_HOVER } from "@/components/ui/motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/animations/fade-up";
import * as m from "framer-motion/m";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center"
      >
        <Reveal direction="none">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground/50">
            404
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md">{t("description")}</p>
          <m.div whileHover={{ y: -2 }} transition={{ duration: MOTION_DURATION_HOVER }}>
            <Link
              href="/"
              className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-(--motion-duration-hover) hover:bg-primary/85"
            >
              {t("back")}
            </Link>
          </m.div>
        </Reveal>
      </main>
    </div>
  );
}
