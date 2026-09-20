import { useTranslations } from "next-intl";

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
