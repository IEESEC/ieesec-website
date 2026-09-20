import type { Metadata } from "next";
import { MembersPanel } from "@/features/members/members-panel";
import { membersRepository, projectsRepository } from "@/mocks/admin-repositories";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage() {
  const [members, projectPage] = await Promise.all([
    membersRepository.list(),
    projectsRepository.list(),
  ]);
  return <MembersPanel initialMembers={members} projects={projectPage.items} />;
}
