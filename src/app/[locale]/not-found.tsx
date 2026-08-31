"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/animations/fade-up";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <Reveal direction="none">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground/50">
            404
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md">{t("description")}</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
          >
            {t("back")}
          </Link>
        </Reveal>
      </main>
    </div>
  );
}
