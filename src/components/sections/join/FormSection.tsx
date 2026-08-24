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
      data-scroll-video-section
      className="scroll-mt-24 rounded-4xl border-white/15 bg-card/92 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8"
    >
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
