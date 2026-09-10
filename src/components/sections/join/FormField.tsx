import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const fieldInputClass = cn(
  "min-h-11 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-base text-foreground md:min-h-0 md:text-sm",
  "placeholder:text-muted-foreground transition-colors",
  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
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
  const t = useTranslations("join");
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
        {optional && <span className="text-muted-foreground font-normal"> ({t("optional")})</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
