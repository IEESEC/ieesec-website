import { getRemainingTime } from "@/lib/events";
import type { RemainingTime } from "@/lib/events";
import { useTranslations } from "next-intl";

type CountdownUnit = keyof RemainingTime;

const UNITS: readonly CountdownUnit[] = ["days", "hours", "minutes", "seconds"];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function EventCountdown({ startsAt, now }: { startsAt: string; now: number }) {
  const t = useTranslations("events");
  const countdown = getRemainingTime(new Date(startsAt).getTime(), now);

  return (
    <div
      data-testid="event-countdown"
      role="timer"
      aria-live="off"
      aria-label={t("countdownLabel", {
        days: countdown.days,
        hours: countdown.hours,
        minutes: countdown.minutes,
        seconds: countdown.seconds,
      })}
      className="grid grid-cols-4 gap-2"
    >
      {UNITS.map((unit) => (
        <div
          key={unit}
          className="rounded-xl border border-border/80 bg-secondary/70 px-2 py-2 text-center dark:bg-secondary/40"
        >
          <span className="block font-mono text-lg font-semibold tabular-nums text-foreground sm:text-xl">
            {unit === "days" ? countdown[unit] : pad(countdown[unit])}
          </span>
          <span className="mt-0.5 block text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {t(`units.${unit}`)}
          </span>
        </div>
      ))}
    </div>
  );
}
