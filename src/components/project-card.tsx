import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LuGlobe } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const title = t(project.titleKey);

  return (
    <article aria-labelledby={`project-${project.id}-title`} className="group h-full">
      <Card
        data-testid="project-card"
        className="h-full overflow-hidden rounded-2xl border border-border bg-card p-0 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-sm motion-reduce:transform-none dark:hover:shadow-lg"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.image}
            alt={t(project.imageAltKey)}
            fill
            quality={65}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>

        <CardContent className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 id={`project-${project.id}-title`} className="text-xl font-semibold leading-tight">
              {title}
            </h3>
            <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {t(`status.${project.status}`)}
            </span>
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {t(project.descriptionKey)}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.techStack.map((technology) => (
              <span
                key={technology}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {technology}
              </span>
            ))}
          </div>
        </CardContent>

        {(project.githubUrl || project.liveUrl) && (
          <CardFooter className="mt-auto flex flex-wrap gap-4 border-t border-border/70 px-6 py-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={t("links.githubLabel", { project: title })}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <SiGithub aria-hidden="true" className="size-4" />
                {t("links.github")}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={t("links.liveLabel", { project: title })}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <LuGlobe aria-hidden="true" className="size-4" />
                {t("links.live")}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            )}
          </CardFooter>
        )}
      </Card>
    </article>
  );
}
