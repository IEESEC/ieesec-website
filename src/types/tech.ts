import type { IconType } from "react-icons";

export type TechCategory = "Frontend" | "Backend" | "DevOps" | "Tools" | "Languages";

export interface TechItem {
  name: string;
  icon: IconType;
  category: TechCategory;
}
