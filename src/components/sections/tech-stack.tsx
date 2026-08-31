"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/animations/fade-up";
import { cn } from "@/lib/utils";
import type { TechCategory } from "@/types/tech";
import { techStack } from "./tech-stack/data";
import { TechCard } from "./tech-stack/TechCard";

const CATEGORIES: TechCategory[] = ["Frontend", "Backend", "DevOps", "Tools", "Languages"];

type Filter = TechCategory | "All";

export function TechStackSection() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(
    () => (filter === "All" ? techStack : techStack.filter((item) => item.category === filter)),
    [filter],
  );

  return (
    <section id="tech-stack" className="min-h-screen w-full flex flex-col pt-32 pb-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mb-12">
          <Reveal direction="left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Our Tech Stack
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              The languages, frameworks, and tools we use to build and ship our projects.
            </p>
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
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    filter === category
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch">
            {filtered.map((item, i) => (
              <Reveal key={item.name} direction="up" delay={i * 0.05} className="h-full">
                <TechCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
