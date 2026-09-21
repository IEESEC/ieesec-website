export type ProjectStatus = "in-progress" | "completed" | "maintained";

export interface Project {
  id: string;
  image: string;
  titleKey: string;
  descriptionKey: string;
  imageAltKey: string;
  techStack: readonly string[];
  githubUrl?: string;
  liveUrl?: string;
  status: ProjectStatus;
}
