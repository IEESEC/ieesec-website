import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BlogPost } from "./BlogPost";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="h-full p-0 rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/60">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <CardContent className="pt-6">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
          <p className="mt-2 text-sm text-primary/70 line-clamp-3">{post.excerpt}</p>
        </CardContent>

        <CardFooter className="pt-8 pb-6 mt-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-medium ring-1 ring-foreground/5">
              {initials(post.author)}
            </div>
            <div className="text-xs text-primary/70">
              <p className="font-medium text-foreground">{post.author}</p>
              <p>
                {formatDate(post.date)} · {post.readTimeMinutes} min read
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
