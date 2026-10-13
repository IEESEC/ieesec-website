export type EventDuration = `${number}m` | `${number}h`;
export type EventPhase = "upcoming" | "started" | "past";

export interface Event {
  id: string;
  titleKey: string;
  descriptionKey: string;
  locationKey: string;
  image: string;
  imageAltKey: string;
  startsAt: string;
  duration: EventDuration;
  registrationUrl?: string;
}
