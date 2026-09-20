import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditor } from "@/features/content/posts/post-editor";
import { mediaRepository, membersRepository, postsRepository } from "@/mocks/admin-repositories";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, members, mediaPage] = await Promise.all([
    postsRepository.getById(id),
    membersRepository.list(),
    mediaRepository.list(),
  ]);
  if (!post) notFound();
  return <PostEditor initialPost={post} members={members} media={mediaPage.items} />;
}
