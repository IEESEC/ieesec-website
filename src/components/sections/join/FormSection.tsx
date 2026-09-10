import { Card } from "@/components/ui/card";

interface FormSectionProps {
  step: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function FormSection({ step, eyebrow, title, description, children }: FormSectionProps) {
  return (
    <Card
      id={`join-step-${step}`}
      data-join-step-scroll
      data-testid="join-form-card"
      className="join-form-card w-full scroll-mt-24 overflow-visible rounded-2xl border-border/80 bg-card p-5 shadow-sm md:rounded-3xl md:p-8 dark:border-white/15 dark:bg-card/95 dark:backdrop-blur-md"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8">
        <header>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="font-mono text-[0.7rem] tabular-nums leading-none text-primary">
              {step}
            </span>
            <span aria-hidden className="h-px w-8 bg-primary/45" />
            <p className="text-[0.72rem] font-medium leading-none tracking-[0.08em]">{eyebrow}</p>
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground text-balance">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </header>

        <div className="flex flex-col gap-5">{children}</div>
      </div>
    </Card>
  );
}
