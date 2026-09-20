import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AdminPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[92rem] px-4 py-7 sm:px-6 lg:px-7 lg:py-9", className)}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <p className="font-mono text-[0.66rem] font-semibold tracking-[0.12em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="rounded-none border-0 py-0 shadow-none ring-0">
      <CardContent className="px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.7rem] font-medium text-muted-foreground">{label}</p>
          <Icon className="size-4 text-primary" />
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="font-mono text-2xl font-semibold tracking-tight">{value}</p>
          {detail ? <p className="text-[0.65rem] text-muted-foreground">{detail}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricsGrid({ children }: { children: ReactNode }) {
  return (
    <section
      aria-label="Workspace metrics"
      className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4"
    >
      {children}
    </section>
  );
}

export function StateBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-md px-2 text-[0.66rem] font-semibold",
        tone === "info" && "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
        tone === "success" &&
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        tone === "warning" &&
          "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        tone === "danger" && "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
      )}
    >
      {children}
    </Badge>
  );
}

export function EmptyPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-xl border border-dashed py-0 text-center shadow-none ring-0">
      <CardContent className="px-5 py-14">
        <Icon className="mx-auto size-7 text-muted-foreground/55" />
        <h2 className="mt-4 text-sm font-semibold">{title}</h2>
        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
