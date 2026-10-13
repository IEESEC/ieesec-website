import type { Event, EventDuration, EventPhase } from "@/types/event";

const DURATION_PATTERN = /^(\d+(?:\.\d+)?)(m|h)$/;

export function parseEventDuration(duration: EventDuration | string): number {
  const match = DURATION_PATTERN.exec(duration);
  if (!match) {
    throw new RangeError(`Invalid event duration: ${duration}`);
  }

  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new RangeError(`Invalid event duration: ${duration}`);
  }

  return amount * (match[2] === "h" ? 60 * 60 * 1000 : 60 * 1000);
}

export function getEventEndAt(startsAt: string, duration: EventDuration | string): number {
  const startAt = Date.parse(startsAt);
  if (Number.isNaN(startAt)) {
    throw new RangeError(`Invalid event start timestamp: ${startsAt}`);
  }

  return startAt + parseEventDuration(duration);
}

export function getEventPhase(
  startsAt: string,
  duration: EventDuration | string,
  now = Date.now(),
): EventPhase {
  const startAt = Date.parse(startsAt);
  const endAt = getEventEndAt(startsAt, duration);

  if (now < startAt) return "upcoming";
  if (now < endAt) return "started";
  return "past";
}

export interface EventWithPhase {
  event: Event;
  phase: EventPhase;
}

export function getFeaturedUpcoming(events: readonly Event[], now = Date.now()): Event | undefined {
  return events
    .filter((event) => getEventPhase(event.startsAt, event.duration, now) !== "past")
    .slice()
    .sort((first, second) => Date.parse(first.startsAt) - Date.parse(second.startsAt))[0];
}

export function getEventCarouselItems(
  events: readonly Event[],
  now = Date.now(),
): EventWithPhase[] {
  const featured = getFeaturedUpcoming(events, now);
  const past = events
    .filter((event) => getEventPhase(event.startsAt, event.duration, now) === "past")
    .slice()
    .sort((first, second) => Date.parse(second.startsAt) - Date.parse(first.startsAt));

  const pastItems = past.map((event) => ({ event, phase: "past" as const }));
  if (!featured) return pastItems;

  const featuredItem = {
    event: featured,
    phase: getEventPhase(featured.startsAt, featured.duration, now),
  } satisfies EventWithPhase;

  return [pastItems[0], featuredItem, ...pastItems.slice(1)].filter(
    (item): item is EventWithPhase => Boolean(item),
  );
}

export interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function getRemainingTime(targetAt: number, now = Date.now()): RemainingTime {
  const totalSeconds = Math.max(0, Math.floor((targetAt - now) / 1000));

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}
