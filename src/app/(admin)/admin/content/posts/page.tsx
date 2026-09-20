import type { Metadata } from "next";
import { PostsWorkspace } from "@/features/content/posts/posts-workspace";
import { membersRepository, postsRepository } from "@/mocks/admin-repositories";

export const metadata: Metadata = { title: "Posts" };

export default async function PostsPage() {
  const [postPage, members] = await Promise.all([postsRepository.list(), membersRepository.list()]);
  return <PostsWorkspace posts={postPage.items} members={members} />;
}
