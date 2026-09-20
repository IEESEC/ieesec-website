import type { Metadata } from "next";
import { HomepagePanel } from "@/features/homepage/homepage-panel";
import {
  homepageRepository,
  postsRepository,
  projectsRepository,
} from "@/mocks/admin-repositories";

export const metadata: Metadata = { title: "Homepage" };

export default async function HomepagePage() {
  const [placements, postPage, projectPage] = await Promise.all([
    homepageRepository.list(),
    postsRepository.list(),
    projectsRepository.list(),
  ]);
  return (
    <HomepagePanel
      initialPlacements={placements}
      posts={postPage.items}
      projects={projectPage.items}
    />
  );
}
