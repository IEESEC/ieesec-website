export type TechCategory = "Frontend" | "Backend" | "DevOps" | "Tools" | "Languages";

export interface TechItem {
  name: string;
  icon: string;
  category: TechCategory;
  description: string;
}
