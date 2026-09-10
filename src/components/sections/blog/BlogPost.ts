export type BlogPostId = "open-source" | "workshops" | "student-projects";

export interface BlogPost {
  id: BlogPostId;
  slug: string;
  image: string;
  date: string;
  readTimeMinutes: number;
}

export const posts: BlogPost[] = [
  {
    id: "open-source",
    slug: "open-source-projects",
    image: "/images/hero/campus1.jpg",
    date: "2026-06-12",
    readTimeMinutes: 4,
  },
  {
    id: "workshops",
    slug: "practical-workshops",
    image: "/images/hero/campus2.jpg",
    date: "2026-05-03",
    readTimeMinutes: 3,
  },
  {
    id: "student-projects",
    slug: "useful-student-projects",
    image: "/images/hero/campus3.jpg",
    date: "2026-03-21",
    readTimeMinutes: 5,
  },
];
