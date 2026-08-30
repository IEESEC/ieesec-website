import { cn } from "@/lib/utils";

export const fieldInputClass = cn(
  "w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground",
  "placeholder:text-muted-foreground/60 transition-colors",
  "focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20",
);

interface FieldProps {
  label: string;
  optional?: boolean;
  required?: boolean;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, optional, required, htmlFor, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
        {optional && <span className="text-muted-foreground font-normal"> (optional)</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
