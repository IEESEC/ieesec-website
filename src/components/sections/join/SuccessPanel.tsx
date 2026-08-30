import { Reveal } from "@/components/ui/animations/fade-up";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface SuccessPanelProps {
  fullName: string;
  email: string;
  onReset: () => void;
}

export function SuccessPanel({ fullName, email, onReset }: SuccessPanelProps) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  return (
    <Reveal direction="none">
      <div className="rounded-4xl border border-border bg-card p-8 sm:p-10">
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Thanks, {firstName}. We&apos;ve got it.
        </h2>

        <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
          Someone on the team reads every application. Expect a reply at{" "}
          {email ? <span className="text-primary">{email}</span> : "your email"} within about a
          week.
        </p>
        <p className="mt-2 max-w-xl text-muted-foreground leading-relaxed">
          Don&apos;t wait for us, though. Discord is where the projects, workshop announcements and
          questions live.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <a href="https://discord.gg/2xHBsHMKy7" target="_blank" rel="noopener noreferrer">
              Join us on Discord
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={onReset}>
            Submit another application
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
