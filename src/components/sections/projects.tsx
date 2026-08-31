import { Reveal } from "@/components/ui/animations/fade-up";
import { useTranslations } from "next-intl";

export function ProjectsSection() {
  const t = useTranslations("sections");
  return (
    <section id="projects" className="min-h-screen w-full flex flex-col pt-32 pb-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mb-12">
          <Reveal direction="left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("projectsTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("projectsDescription")}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
