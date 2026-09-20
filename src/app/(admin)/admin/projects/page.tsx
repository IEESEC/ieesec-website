import type { Metadata } from "next";
import { ProjectsPanel } from "@/features/projects/projects-panel";
import { membersRepository, projectsRepository } from "@/mocks/admin-repositories";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projectPage, members] = await Promise.all([
    projectsRepository.list(),
    membersRepository.list(),
  ]);
  return <ProjectsPanel projects={projectPage.items} members={members} />;
}
