import { VscVscode } from "react-icons/vsc";
import {
  SiDocker,
  SiFigma,
  SiGit,
  SiGithubactions,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import type { TechItem } from "@/types/tech";

export const techStack: TechItem[] = [
  {
    name: "React",
    icon: SiReact,
    category: "Frontend",
  },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    category: "Frontend",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    category: "Frontend",
  },
  {
    name: "Node.js",
    icon: SiNodedotjs,
    category: "Backend",
  },
  {
    name: "PostgreSQL",
    icon: SiPostgresql,
    category: "Backend",
  },
  {
    name: "Docker",
    icon: SiDocker,
    category: "DevOps",
  },
  {
    name: "Git",
    icon: SiGit,
    category: "DevOps",
  },
  {
    name: "GitHub Actions",
    icon: SiGithubactions,
    category: "DevOps",
  },
  {
    name: "Figma",
    icon: SiFigma,
    category: "Tools",
  },
  {
    name: "VS Code",
    icon: VscVscode,
    category: "Tools",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    category: "Languages",
  },
  {
    name: "Python",
    icon: SiPython,
    category: "Languages",
  },
];
