"use client";

import { MOTION_DURATION_STANDARD } from "@/components/ui/motion";
import Image from "next/image";
import * as m from "framer-motion/m";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BlogPost } from "./BlogPost";
import { useFormatter, useTranslations } from "next-intl";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const t = useTranslations("blog");
  const format = useFormatter();
  const title = t(`posts.${post.id}.title`);
  const author = t("author");
  const tags = [t(`posts.${post.id}.tag1`), t(`posts.${post.id}.tag2`)];

  return (
    <m.article
      className="block h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: MOTION_DURATION_STANDARD }}
    >
      <Card className="h-full overflow-hidden rounded-2xl border border-border bg-card p-0 hover:border-primary/60 hover:shadow-sm dark:hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden">
          <m.div
            className="absolute inset-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: MOTION_DURATION_STANDARD }}
          >
            <Image
              src={post.image}
              alt={title}
              fill
              quality={65}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </m.div>
        </div>

        <CardContent className="pt-6">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-lg font-semibold leading-snug">{title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {t(`posts.${post.id}.excerpt`)}
          </p>
        </CardContent>

        <CardFooter className="pt-8 pb-6 mt-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium ring-1 ring-border">
              {initials(author)}
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{author}</p>
              <p>
                {format.dateTime(new Date(post.date), {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                · {t("readTime", { minutes: post.readTimeMinutes })}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </m.article>
  );
}
