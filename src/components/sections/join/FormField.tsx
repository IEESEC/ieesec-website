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
        {optional && <span className="text-muted-foreground font-normal"> — optional</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

interface PillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  prefix?: string;
}

export function Pill({ label, selected, onClick, prefix }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
      )}
    >
      {selected && prefix ? `${prefix} ${label}` : label}
    </button>
  );
}

interface OptionRowProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionRow({ label, selected, onClick }: OptionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-2xl border px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
