import type { Metadata } from "next";
import { ProjectEditor } from "@/features/projects/project-editor";
import { membersRepository, projectsRepository } from "@/mocks/admin-repositories";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  const [project, members] = await Promise.all([
    projectsRepository.createDraft(),
    membersRepository.list(),
  ]);
  return <ProjectEditor initialProject={project} members={members} />;
}
