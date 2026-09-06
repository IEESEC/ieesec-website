"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/animations/fade-up";
import { cn } from "@/lib/utils";
import type { TechCategory } from "@/types/tech";
import { techStack } from "./tech-stack/data";
import { TechCard } from "./tech-stack/TechCard";
import { useTranslations } from "next-intl";

const CATEGORIES: TechCategory[] = ["Frontend", "Backend", "DevOps", "Tools", "Languages"];

type Filter = TechCategory | "All";

export function TechStackSection() {
  const t = useTranslations("sections");
  const [filter, setFilter] = useState<Filter>("All");
  const [showAllOnMobile, setShowAllOnMobile] = useState(false);

  const filtered = useMemo(
    () => (filter === "All" ? techStack : techStack.filter((item) => item.category === filter)),
    [filter],
  );

  return (
    <section
      id="tech-stack"
      className="min-h-screen w-full flex flex-col pt-24 pb-16 sm:pt-32 sm:pb-20 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mb-12">
          <Reveal direction="left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("techTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("techDescription")}</p>
          </Reveal>

          <Reveal direction="right" className="mt-8">
            <div className="flex flex-wrap gap-2">
              {(["All", ...CATEGORIES] as Filter[]).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  aria-pressed={filter === category}
                  className={cn(
                    "min-h-11 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    filter === category
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground",
                  )}
                >
                  {category === "All" ? t("filters.all") : t(`filters.${category}`)}
                </button>
              ))}
            </div>
          </Reveal>

          <div
            id="tech-stack-grid"
            className="mt-8 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filtered.map((item, i) => (
              <Reveal
                key={item.name}
                direction="up"
                delay={i * 0.05}
                className={cn("h-full", i >= 3 && !showAllOnMobile && "hidden md:block")}
              >
                <TechCard item={item} />
              </Reveal>
            ))}
          </div>

          {!showAllOnMobile && filtered.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllOnMobile(true)}
              aria-controls="tech-stack-grid"
              className="mt-6 min-h-11 w-full rounded-full border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground md:hidden"
            >
              {t("showMore")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
