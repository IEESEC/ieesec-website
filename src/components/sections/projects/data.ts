import type { Project } from "@/types/project";

export const projects: readonly Project[] = [
  {
    id: "study-mate",
    image: "/images/hero/campus1.jpg",
    titleKey: "items.studyMate.title",
    descriptionKey: "items.studyMate.description",
    imageAltKey: "items.studyMate.imageAlt",
    techStack: ["Next.js", "TypeScript", "Supabase"],
    githubUrl: "https://github.com/IEESEC/ieesec-website",
    liveUrl: "https://ieesec-website.vercel.app",
    status: "in-progress",
  },
  {
    id: "rover-kit",
    image: "/images/hero/campus2.jpg",
    titleKey: "items.roverKit.title",
    descriptionKey: "items.roverKit.description",
    imageAltKey: "items.roverKit.imageAlt",
    techStack: ["Arduino", "C++", "OpenCV"],
    githubUrl: "https://github.com/IEESEC/ieesec-website",
    status: "completed",
  },
  {
    id: "event-hub",
    image: "/images/hero/campus3.jpg",
    titleKey: "items.eventHub.title",
    descriptionKey: "items.eventHub.description",
    imageAltKey: "items.eventHub.imageAlt",
    techStack: ["React", "Node.js", "PostgreSQL"],
    githubUrl: "https://github.com/IEESEC/ieesec-website",
    status: "maintained",
  },
];
