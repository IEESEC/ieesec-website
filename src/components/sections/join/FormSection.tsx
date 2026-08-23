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
    <Card className="rounded-4xl p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
            {step} — {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-col gap-5">{children}</div>
      </div>
    </Card>
  );
}
