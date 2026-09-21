import { Reveal } from "@/components/ui/animations/fade-up";
import { useTranslations } from "next-intl";
import { ProjectCard } from "@/components/project-card";
import { projects } from "./projects/data";

export function ProjectsSection() {
  const t = useTranslations("sections");
  return (
    <section
      id="projects"
      className="home-section-lazy min-h-screen w-full flex flex-col pt-24 pb-16 sm:pt-32 sm:pb-20 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mb-12">
          <Reveal direction="left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("projectsTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("projectsDescription")}
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.id} direction="up" delay={index * 0.06} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
