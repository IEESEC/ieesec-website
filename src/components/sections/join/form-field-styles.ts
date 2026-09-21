import { cn } from "@/lib/utils";

export const fieldInputClass = cn(
  "min-h-11 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-base text-foreground md:min-h-0 md:text-sm",
  "placeholder:text-muted-foreground transition-colors",
  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
);
