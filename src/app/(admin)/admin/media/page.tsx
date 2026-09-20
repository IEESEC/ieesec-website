import type { Metadata } from "next";
import { MediaPanel } from "@/features/media/media-panel";
import { mediaRepository } from "@/mocks/admin-repositories";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const mediaPage = await mediaRepository.list();
  return <MediaPanel initialAssets={mediaPage.items} />;
}
