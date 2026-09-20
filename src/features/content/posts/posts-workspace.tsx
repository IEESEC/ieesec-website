"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  Languages,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoRole } from "@/features/admin-shell/admin-shell";
import type { Post, PostStatus, User } from "@/features/admin/types";
import { getPostTranslationStatus } from "@/features/content/posts/translation-status";
import { cn } from "@/lib/utils";

const statusLabels: Record<PostStatus, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  APPROVED: "Approved",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const statusStyles: Record<PostStatus, string> = {
  DRAFT: "border-border bg-muted text-muted-foreground",
  IN_REVIEW: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  APPROVED: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  SCHEDULED: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  PUBLISHED: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  ARCHIVED: "border-border bg-muted text-muted-foreground",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Athens",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-md border px-2 text-[0.66rem] font-semibold",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function PostsWorkspace({ posts, members }: { posts: Post[]; members: User[] }) {
  const role = useDemoRole();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | PostStatus>("ALL");
  const authorById = useMemo(
    () => Object.fromEntries(members.map((member) => [member.id, member])),
    [members],
  );
  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesStatus = status === "ALL" || post.status === status;
      const matchesQuery =
        !normalized ||
        post.titleEl.toLowerCase().includes(normalized) ||
        post.titleEn.toLowerCase().includes(normalized) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalized));
      return matchesStatus && matchesQuery;
    });
  }, [posts, query, status]);
  const canCreate = role === "ADMIN" || role === "CONTENT_EDITOR";

  const metrics = [
    { label: "Total posts", value: posts.length, icon: FileText },
    {
      label: "In review",
      value: posts.filter((post) => post.status === "IN_REVIEW").length,
      icon: Clock3,
    },
    {
      label: "Translation ready",
      value: posts.filter((post) => getPostTranslationStatus(post) === "READY").length,
      icon: Languages,
    },
    {
      label: "Published",
      value: posts.filter((post) => post.status === "PUBLISHED").length,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[92rem] px-4 py-7 sm:px-6 lg:px-7 lg:py-9">
      <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[0.66rem] font-semibold tracking-[0.12em] text-primary uppercase">
            Editorial workflow
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Posts and stories
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Write, translate and review every story from one bilingual workspace.
          </p>
        </div>
        {canCreate ? (
          <Button asChild className="rounded-lg">
            <Link href="/admin/content/posts/new">
              <Plus size={16} /> New post
            </Link>
          </Button>
        ) : null}
      </header>

      <section
        aria-label="Post metrics"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-card px-4 py-4 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.7rem] font-medium text-muted-foreground">{metric.label}</p>
                <Icon size={15} className="text-primary" />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold tracking-tight">{metric.value}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <label htmlFor="post-search" className="sr-only">
              Search posts
            </label>
            <Input
              id="post-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or tag"
              className="h-10 w-full rounded-lg border-border bg-background pr-3 pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Status</span>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as "ALL" | PostStatus)}
            >
              <SelectTrigger
                aria-label="Post status"
                className="w-36 rounded-lg border-border bg-background text-xs font-semibold"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">All posts</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredPosts.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-[0.66rem] text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Story</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Locales</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-5 py-3 text-right font-medium">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => {
                    const translation = getPostTranslationStatus(post);
                    const author = authorById[post.authorId];
                    return (
                      <tr
                        key={post.id}
                        className="group border-b border-border/75 last:border-b-0 hover:bg-muted/35"
                      >
                        <td className="max-w-[26rem] px-5 py-4">
                          <p className="truncate text-sm font-semibold">
                            {post.titleEl || "Untitled post"}
                          </p>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {post.titleEn || "English title missing"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={post.status} />
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              translation === "READY"
                                ? "text-emerald-600 dark:text-emerald-300"
                                : "text-amber-700 dark:text-amber-300",
                            )}
                          >
                            {translation === "READY" ? "EL + EN ready" : "Needs translation"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-muted-foreground">
                          {author?.name ?? "Unassigned"}
                        </td>
                        <td className="px-4 py-4 font-mono text-[0.68rem] text-muted-foreground">
                          {formatDate(post.updatedAt)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/content/posts/${post.id}`}
                            aria-label={`Open ${post.titleEn || post.titleEl}`}
                            className="inline-grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <ArrowUpRight size={15} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-border md:hidden">
              {filteredPosts.map((post) => {
                const translation = getPostTranslationStatus(post);
                return (
                  <Link
                    key={post.id}
                    href={`/admin/content/posts/${post.id}`}
                    className="block p-4 transition-colors hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{post.titleEl || "Untitled post"}</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {post.titleEn || "English title missing"}
                        </p>
                      </div>
                      <ArrowUpRight size={15} className="shrink-0 text-muted-foreground" />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusBadge status={post.status} />
                      <span
                        className={cn(
                          "text-[0.68rem] font-semibold",
                          translation === "READY"
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-amber-700 dark:text-amber-300",
                        )}
                      >
                        {translation === "READY" ? "EL + EN ready" : "Needs translation"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="px-5 py-16 text-center">
            <FileText size={26} className="mx-auto text-muted-foreground/55" />
            <h2 className="mt-4 text-sm font-semibold">No posts match these filters</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Clear the search or choose another status.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
