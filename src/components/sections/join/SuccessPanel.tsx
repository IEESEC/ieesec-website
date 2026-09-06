import { Reveal } from "@/components/ui/animations/fade-up";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface SuccessPanelProps {
  fullName: string;
  email: string;
}

export function SuccessPanel({ fullName, email }: SuccessPanelProps) {
  const t = useTranslations("join.success");
  const firstName = fullName.trim().split(/\s+/)[0] || "IEESEC";

  return (
    <Reveal direction="none">
      <div className="rounded-4xl border border-border bg-card p-8 sm:p-10">
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title", { name: firstName })}
        </h2>

        <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
          {t.rich("reply", {
            address: email || t("fallbackEmail"),
            email: (chunks) => <span className="text-primary">{chunks}</span>,
          })}
        </p>
        <p className="mt-2 max-w-xl text-muted-foreground leading-relaxed">{t("discordText")}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <a href="https://discord.gg/2xHBsHMKy7" target="_blank" rel="noopener noreferrer">
              {t("discordCta")}
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
