import type { Metadata } from "next";
import { SectionPlaceholder } from "@/features/admin-shell/section-placeholder";

const sections: Record<string, { title: string; description: string }> = {
  projects: {
    title: "Projects workspace",
    description:
      "Project search, filtering, progress controls and member management belong to the next focused MVP slice. The route and role-aware shell are ready.",
  },
  "content/posts": {
    title: "Editorial workspace",
    description:
      "The bilingual post list, editor and review workflow will plug into the typed post repository already included in this prototype.",
  },
  "content/homepage": {
    title: "Homepage manager",
    description:
      "A schema-driven manager for featured posts, projects and events is prepared as the next content-focused slice.",
  },
  media: {
    title: "Media library",
    description:
      "The media grid, bilingual alt-text workflow and editor picker will reuse the existing deterministic media repository.",
  },
  members: {
    title: "Members workspace",
    description:
      "Member roles and project assignments will be represented here without connecting real identity or authentication services.",
  },
  settings: {
    title: "Prototype settings",
    description:
      "Only settings that provide demonstrable prototype value will be added. Role switching and demo scenarios already live in the shell.",
  },
};

export const metadata: Metadata = { title: "Workspace" };

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  const exactKey = segments.join("/");
  const rootKey = segments[0] ?? "";
  const section = sections[exactKey] ??
    sections[rootKey] ?? {
      title: "Prototype workspace",
      description: "This route is reserved for a future frontend-only prototype slice.",
    };

  return <SectionPlaceholder {...section} />;
}
