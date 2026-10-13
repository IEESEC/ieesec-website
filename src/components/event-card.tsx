"use client";

import {
  MOTION_DURATION_EMPHASIS,
  MOTION_DURATION_MEDIA,
  MOTION_EASE_EVENT_REVEAL,
} from "@/components/ui/motion";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EventCountdown } from "@/components/event-countdown";
import { cn } from "@/lib/utils";
import type { Event, EventPhase } from "@/types/event";

export function EventCard({
  event,
  phase,
  now,
  isFocused = false,
}: {
  event: Event;
  phase: EventPhase;
  now: number;
  isFocused?: boolean;
}) {
  const t = useTranslations("events");
  const format = useFormatter();
  const reducedMotion = useReducedMotion();
  const title = t(event.titleKey);

  return (
    <motion.article
      data-testid="event-card"
      data-event-id={event.id}
      data-focused={isFocused}
      aria-labelledby={`event-${event.id}-title`}
      className={cn("group h-full", isFocused && "relative z-10")}
      initial={false}
      animate={{
        scale: isFocused ? 1.04 : 0.88,
        opacity: isFocused ? 1 : 0.75,
      }}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      transition={{
        duration: reducedMotion ? 0 : MOTION_DURATION_EMPHASIS,
        ease: MOTION_EASE_EVENT_REVEAL,
      }}
    >
      <Card
        className={cn(
          "h-full gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 hover:border-primary/50 hover:shadow-sm dark:hover:shadow-lg",
          phase === "past" && "hover:border-border",
          isFocused && "border-primary/60 ring-1 ring-primary/20",
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.div
            className={cn("absolute inset-0", phase === "past" && "grayscale")}
            whileHover={reducedMotion ? undefined : { scale: 1.05 }}
            transition={{ duration: MOTION_DURATION_MEDIA }}
          >
            <Image
              src={event.image}
              alt={t(event.imageAltKey)}
              fill
              quality={65}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
            <span
              className={cn(
                "rounded-full border border-white/30 bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm",
                phase === "past" && "bg-slate-700/90 text-white",
                phase === "started" && "bg-accent text-accent-foreground",
              )}
            >
              {t(`status.${phase}`)}
            </span>
            <time
              dateTime={event.startsAt}
              className="rounded-xl bg-background/95 px-3 py-2 text-right text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm dark:bg-card/95"
            >
              {format.dateTime(new Date(event.startsAt), {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-5 p-6">
          <div>
            <h4 id={`event-${event.id}-title`} className="text-xl font-semibold leading-tight">
              {title}
            </h4>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />
                {t(event.locationKey)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-primary" />
                {format.dateTime(new Date(event.startsAt), {
                  weekday: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 aria-hidden="true" className="size-4 shrink-0 text-primary" />
                {t("duration", { value: event.duration })}
              </span>
            </div>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {t(event.descriptionKey)}
          </p>

          {phase === "upcoming" && <EventCountdown startsAt={event.startsAt} now={now} />}
          {phase === "started" && (
            <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-foreground">
              {t("eventStarted")}
            </p>
          )}
        </CardContent>

        {phase === "upcoming" && event.registrationUrl && (
          <CardFooter className="mt-auto border-t border-border/70 px-6 py-4">
            <motion.a
              href={event.registrationUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t("registerLabel", { event: title })}
              className="transition-colors duration-(--motion-duration-hover) inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {t("register")}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </motion.a>
          </CardFooter>
        )}
        {phase === "past" && <div className="min-h-4" aria-hidden="true" />}
      </Card>
    </motion.article>
  );
}
