export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image: string;
  author: string;
  date: string;
  readTimeMinutes: number;
  tags?: string[];
}

export function calculateReadTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

const rawPosts: Omit<BlogPost, "readTimeMinutes">[] = [
  {
    title: "Lorem Ipsum Dolor Sit Amet",
    slug: "lorem-ipsum-dolor-sit-amet",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fringilla, nunc sed placerat suscipit.",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fringilla, nunc sed placerat suscipit, " +
      "elit lorem dictum est, eget sodales sapien nunc et purus. Vestibulum ante ipsum primis in faucibus orci " +
      "luctus et ultrices posuere cubilia curae. Nulla facilisi. Sed vitae libero at nunc ullamcorper porttitor.",
    image: "/images/hero/campus1.jpg",
    author: "Author Name",
    date: "2026-06-12",
    tags: ["Placeholder", "Category"],
  },
  {
    title: "Consectetur Adipiscing Elit",
    slug: "consectetur-adipiscing-elit",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    body:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/images/hero/campus2.jpg",
    author: "Author Name",
    date: "2026-05-03",
    tags: ["Placeholder", "Category"],
  },
  {
    title: "Sed Do Eiusmod Tempor",
    slug: "sed-do-eiusmod-tempor",
    excerpt:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, at vero eos et accusamus et iusto odio.",
    body:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At vero eos et accusamus et iusto odio " +
      "dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas " +
      "molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt.",
    image: "/images/hero/campus3.jpg",
    author: "Author Name",
    date: "2026-03-21",
    tags: ["Placeholder", "Category"],
  },
];

export const posts: BlogPost[] = rawPosts.map((post) => ({
  ...post,
  readTimeMinutes: calculateReadTime(post.body),
}));
