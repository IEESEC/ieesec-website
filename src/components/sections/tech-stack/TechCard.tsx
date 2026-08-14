import {
  Atom,
  Container,
  Database,
  GitBranch,
  Palette,
  Server,
  Workflow,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { TechItem } from "@/types/tech";

const ICON_MAP: Record<string, LucideIcon> = {
  Atom,
  Container,
  Database,
  GitBranch,
  Palette,
  Server,
  Workflow,
  Code2,
};

export function TechCard({ item }: { item: TechItem }) {
  const Icon = ICON_MAP[item.icon];

  return (
    <Card
      tabIndex={0}
      className="group/tech h-full p-0 rounded-2xl border border-border bg-card overflow-hidden outline-none transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_24px_-6px_var(--accent)] focus-within:-translate-y-1 focus-within:border-accent/60 focus-within:shadow-[0_0_24px_-6px_var(--accent)]"
    >
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 ring-1 ring-foreground/5">
            {Icon ? (
              <Icon className="h-6 w-6 text-primary" />
            ) : (
              <span className="text-sm font-bold text-primary">{item.icon}</span>
            )}
          </div>
          <span className="inline-block shrink-0 rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary-foreground">
            {item.category}
          </span>
        </div>

        <h3 className="text-base font-semibold text-foreground">{item.name}</h3>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover/tech:grid-rows-[1fr] group-focus-within/tech:grid-rows-[1fr]">
          <p className="overflow-hidden text-sm text-primary/70">{item.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
