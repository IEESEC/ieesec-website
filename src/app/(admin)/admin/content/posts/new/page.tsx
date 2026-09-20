import type { Metadata } from "next";
import { PostEditor } from "@/features/content/posts/post-editor";
import { mediaRepository, membersRepository, postsRepository } from "@/mocks/admin-repositories";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  const [post, members, mediaPage] = await Promise.all([
    postsRepository.createDraft(),
    membersRepository.list(),
    mediaRepository.list(),
  ]);
  return <PostEditor initialPost={post} members={members} media={mediaPage.items} />;
}
