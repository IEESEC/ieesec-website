import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export function SectionPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <span className="mb-5 grid size-14 place-items-center rounded-2xl border border-border bg-muted text-muted-foreground">
        <Construction size={24} />
      </span>
      <p className="mb-2 font-mono text-xs font-semibold tracking-[0.14em] text-primary uppercase">
        MVP foundation
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
      <Link
        href="/admin"
        className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft size={16} /> Back to overview
      </Link>
    </section>
  );
}
