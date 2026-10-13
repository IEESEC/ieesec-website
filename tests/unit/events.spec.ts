import { expect, test } from "@playwright/test";
import {
  getEventCarouselItems,
  getEventEndAt,
  getEventPhase,
  getFeaturedUpcoming,
  getRemainingTime,
  parseEventDuration,
} from "@/lib/events";
import type { Event } from "@/types/event";

test.describe("event timing", () => {
  test("parses supported hour and minute durations", () => {
    expect(parseEventDuration("30m")).toBe(30 * 60 * 1000);
    expect(parseEventDuration("1h")).toBe(60 * 60 * 1000);
    expect(parseEventDuration("1.5h")).toBe(90 * 60 * 1000);
    expect(parseEventDuration("2h")).toBe(2 * 60 * 60 * 1000);
  });

  test("calculates an event end timestamp from an ISO start and duration", () => {
    const startsAt = "2026-10-17T10:00:00+03:00";

    expect(getEventEndAt(startsAt, "1.5h")).toBe(new Date("2026-10-17T11:30:00+03:00").getTime());
  });

  test("classifies the exact start as started and the exact end as past", () => {
    const startsAt = "2026-10-17T10:00:00+03:00";
    const endAt = getEventEndAt(startsAt, "1h");

    expect(getEventPhase(startsAt, "1h", new Date("2026-10-17T09:59:59+03:00").getTime())).toBe(
      "upcoming",
    );
    expect(getEventPhase(startsAt, "1h", new Date(startsAt).getTime())).toBe("started");
    expect(getEventPhase(startsAt, "1h", endAt)).toBe("past");
  });

  test("returns zero-padded countdown parts", () => {
    const remaining = getRemainingTime(
      new Date("2026-10-18T12:34:56+03:00").getTime(),
      new Date("2026-10-17T10:00:00+03:00").getTime(),
    );

    expect(remaining).toEqual({ days: 1, hours: 2, minutes: 34, seconds: 56 });
  });

  test("selects only the nearest active event as the featured event", () => {
    const events: readonly Event[] = [
      {
        id: "later-upcoming",
        titleKey: "items.futureWorkshop.title",
        descriptionKey: "items.futureWorkshop.description",
        locationKey: "items.futureWorkshop.location",
        image: "/images/hero/campus1.jpg",
        imageAltKey: "items.futureWorkshop.imageAlt",
        startsAt: "2026-11-14T10:00:00+02:00",
        duration: "1h",
      },
      {
        id: "nearest-upcoming",
        titleKey: "items.futureMeetup.title",
        descriptionKey: "items.futureMeetup.description",
        locationKey: "items.futureMeetup.location",
        image: "/images/hero/campus2.jpg",
        imageAltKey: "items.futureMeetup.imageAlt",
        startsAt: "2026-10-17T10:00:00+03:00",
        duration: "1h",
      },
      {
        id: "past-event",
        titleKey: "items.pastTalk.title",
        descriptionKey: "items.pastTalk.description",
        locationKey: "items.pastTalk.location",
        image: "/images/hero/campus3.jpg",
        imageAltKey: "items.pastTalk.imageAlt",
        startsAt: "2026-04-18T10:00:00+03:00",
        duration: "1h",
      },
    ];
    const now = new Date("2026-09-21T12:00:00+03:00").getTime();

    expect(getFeaturedUpcoming(events, now)?.id).toBe("nearest-upcoming");
    expect(getEventCarouselItems(events, now).map(({ event }) => event.id)).toEqual([
      "past-event",
      "nearest-upcoming",
    ]);
    expect(getEventCarouselItems(events, now).filter(({ phase }) => phase !== "past")).toHaveLength(
      1,
    );
  });
});
