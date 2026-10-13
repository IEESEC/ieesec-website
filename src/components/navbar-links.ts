import type { MouseEvent } from "react";

export const navbarItems = [
  { labelKey: "home", href: "/#home", sectionId: "home" },
  { labelKey: "team", href: "/#team", sectionId: "team" },
  { labelKey: "projects", href: "/#projects", sectionId: "projects" },
  { labelKey: "stack", href: "/#tech-stack", sectionId: "tech-stack" },
  { labelKey: "events", href: "/#events", sectionId: "events" },
  { labelKey: "blog", href: "/#blog", sectionId: "blog" },
  { labelKey: "discord", href: "/#discord", sectionId: "discord" },
] as const;

export type NavbarClickHandler = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
