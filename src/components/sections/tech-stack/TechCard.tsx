import { Card, CardContent } from "@/components/ui/card";
import type { TechItem } from "@/types/tech";

export function TechCard({ item }: { item: TechItem }) {
  return (
    <Card
      tabIndex={0}
      data-testid="tech-card"
      className="group/tech h-full overflow-hidden rounded-2xl border border-border bg-card p-0 outline-none transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-sm focus-within:-translate-y-1 focus-within:border-accent/60 focus-within:shadow-sm dark:hover:shadow-[0_0_24px_-6px_var(--accent)] dark:focus-within:shadow-[0_0_24px_-6px_var(--accent)]"
    >
      <CardContent className="flex h-full items-center gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary ring-1 ring-border">
          <item.icon aria-hidden="true" className="h-6 w-6 text-primary" />
        </div>

        <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
      </CardContent>
    </Card>
  );
}
