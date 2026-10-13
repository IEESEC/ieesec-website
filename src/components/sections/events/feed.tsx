"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { getEventCarouselItems } from "@/lib/events";
import { useTranslations } from "next-intl";
import type { Event } from "@/types/event";

function useCountdown(initialNow: number) {
  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const interval = window.setInterval(tick, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return now;
}

export function EventsFeed({
  events,
  initialNow,
}: {
  events: readonly Event[];
  initialNow: number;
}) {
  const t = useTranslations("events");
  const now = useCountdown(initialNow);
  const carouselItems = getEventCarouselItems(events, now);
  const hasFeaturedEvent = carouselItems.some(({ phase }) => phase !== "past");
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true, startIndex: 1 });
  const [selectedIndex, setSelectedIndex] = useState(1);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="mt-8 space-y-14">
      <div>
        {hasFeaturedEvent ? (
          <div
            data-testid="event-carousel"
            aria-label={t("carouselLabel")}
            aria-roledescription="carousel"
            className="relative"
          >
            <div ref={emblaRef} className="overflow-hidden px-1 py-3">
              <div className="flex touch-pan-y">
                {carouselItems.map(({ event, phase }, index) => (
                  <div
                    key={event.id}
                    aria-label={t("slideLabel", {
                      current: index + 1,
                      total: carouselItems.length,
                    })}
                    aria-roledescription="slide"
                    className="min-w-0 shrink-0 grow-0 basis-full px-3 sm:basis-1/2 md:basis-1/3 md:px-5"
                    role="group"
                  >
                    <EventCard
                      event={event}
                      phase={phase}
                      now={now}
                      isFocused={index === selectedIndex}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                aria-label={t("previousEvent")}
                onClick={scrollPrev}
                className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:border-primary/50 hover:bg-muted disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                aria-label={t("nextEvent")}
                onClick={scrollNext}
                className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:border-primary/50 hover:bg-muted disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-5 rounded-2xl border border-dashed border-border px-6 py-8 text-muted-foreground">
            {t("emptyUpcoming")}
          </p>
        )}
      </div>
    </div>
  );
}
