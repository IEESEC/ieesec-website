import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/features/projects/project-editor";
import { membersRepository, projectsRepository } from "@/mocks/admin-repositories";

export const metadata: Metadata = { title: "Edit project" };

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, members] = await Promise.all([
    projectsRepository.getById(id),
    membersRepository.list(),
  ]);
  if (!project) notFound();
  return <ProjectEditor initialProject={project} members={members} />;
}
