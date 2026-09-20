"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  CalendarRange,
  CircleAlert,
  Download,
  FileCheck2,
  FolderKanban,
  ImageOff,
  Languages,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useRef } from "react";
import type {
  DashboardData,
  DashboardSnapshot,
  DemoRole,
  PostStatus,
} from "@/features/admin/types";
import { roleLabels } from "@/features/admin-shell/navigation";
import { useDemoRole } from "@/features/admin-shell/admin-shell";
import { getPostTranslationStatus } from "@/features/content/posts/translation-status";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const quickActions: Record<DemoRole, { label: string; href: string }[]> = {
  ADMIN: [
    { label: "New project", href: "/admin/projects/new" },
    { label: "Draft post", href: "/admin/content/posts/new" },
  ],
  PROJECT_MANAGER: [{ label: "Review projects", href: "/admin/projects" }],
  CONTENT_EDITOR: [
    { label: "Draft post", href: "/admin/content/posts/new" },
    { label: "Update homepage", href: "/admin/content/homepage" },
  ],
  CONTENT_REVIEWER: [{ label: "Open review queue", href: "/admin/content/posts" }],
};

function formatDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Europe/Athens",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className="inline-flex rounded-md border border-primary/20 bg-primary/8 px-2 py-1 text-[0.62rem] font-semibold tracking-wide text-primary uppercase">
      {status.replaceAll("_", " ")}
    </span>
  );
}

function MetricCards({ data }: { data: DashboardData }) {
  const metrics = [
    {
      label: "Active projects",
      value: data.metrics.activeProjects,
      note: "Across three delivery teams",
      signal: "On track",
      icon: FolderKanban,
      tone: "positive",
    },
    {
      label: "Awaiting review",
      value: data.metrics.reviewQueue,
      note: "Editorial decisions pending",
      signal: "Needs review",
      icon: FileCheck2,
      tone: "attention",
    },
    {
      label: "Next 14 days",
      value: data.metrics.upcomingDeadlines,
      note: "Milestones and sessions",
      signal: "3 scheduled",
      icon: CalendarClock,
      tone: "positive",
    },
    {
      label: "Content issues",
      value: data.metrics.assetsMissingAlt,
      note: "Missing bilingual alt text",
      signal: "Action needed",
      icon: ImageOff,
      tone: "attention",
    },
  ];

  return (
    <section aria-label="Workspace summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <article
            key={metric.label}
            data-metric-card
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
              <h2 className="text-xs font-semibold">{metric.label}</h2>
              <Icon size={16} strokeWidth={1.75} className="text-muted-foreground" />
            </div>
            <div className="px-4 py-4">
              <p className="font-mono text-3xl font-semibold tracking-[-0.04em]">{metric.value}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem]">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold",
                    metric.tone === "positive"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                  )}
                >
                  {metric.tone === "positive" ? (
                    <TrendingUp size={11} />
                  ) : (
                    <CircleAlert size={11} />
                  )}
                  {metric.signal}
                </span>
                <span className="text-muted-foreground">{metric.note}</span>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function DeliveryChart({ data }: { data: DashboardData["deliveryRhythm"] }) {
  const width = 700;
  const height = 220;
  const horizontalPadding = 24;
  const verticalPadding = 28;
  const maxValue = Math.max(...data.flatMap((item) => [item.updates, item.reviews]), 1);
  const xAt = (index: number) =>
    horizontalPadding + (index * (width - horizontalPadding * 2)) / Math.max(data.length - 1, 1);
  const yAt = (value: number) =>
    height - verticalPadding - (value / maxValue) * (height - verticalPadding * 2);
  const updatePoints = data.map((item, index) => `${xAt(index)},${yAt(item.updates)}`).join(" ");
  const reviewPoints = data.map((item, index) => `${xAt(index)},${yAt(item.reviews)}`).join(" ");

  return (
    <div data-dashboard-visual className="mt-3 min-h-64 origin-bottom">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-labelledby="delivery-chart-title delivery-chart-description"
        className="h-56 w-full overflow-visible"
      >
        <title id="delivery-chart-title">Delivery rhythm for the last seven days</title>
        <desc id="delivery-chart-description">
          Project updates peaked at nine on Thursday. Editorial reviews peaked at six on Friday.
        </desc>
        {[0.25, 0.5, 0.75].map((position) => (
          <line
            key={position}
            x1={horizontalPadding}
            x2={width - horizontalPadding}
            y1={verticalPadding + position * (height - verticalPadding * 2)}
            y2={verticalPadding + position * (height - verticalPadding * 2)}
            className="stroke-border"
            strokeDasharray="4 6"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <polyline
          points={reviewPoints}
          fill="none"
          className="stroke-muted-foreground/45"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={updatePoints}
          fill="none"
          className="stroke-primary"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((item, index) => (
          <circle
            key={item.label}
            cx={xAt(index)}
            cy={yAt(item.updates)}
            r="4"
            className="fill-card stroke-primary"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="grid grid-cols-7 px-2 text-center font-mono text-[0.62rem] text-muted-foreground">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

function PanelHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-[0.7rem] text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function DashboardReady({ data }: { data: DashboardData }) {
  const role = useDemoRole();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from("[data-dashboard-header] > *", {
        opacity: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: "power3.out",
      });
      gsap.from("[data-metric-card]", {
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.12,
        ease: "power3.out",
      });
      gsap.utils.toArray<HTMLElement>("[data-dashboard-panel]").forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0.35 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top 94%",
              end: "top 66%",
              scrub: 0.6,
            },
          },
        );
      });
      gsap.fromTo(
        "[data-dashboard-visual]",
        { scale: 0.9, opacity: 0.35 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-dashboard-visual]",
            start: "top 92%",
            end: "top 56%",
            scrub: 0.7,
          },
        },
      );
    },
    { scope: containerRef },
  );

  function exportWorkspace() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ieesec-demo-workspace.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[96rem] px-4 py-6 sm:px-6 lg:px-7 lg:py-7"
    >
      <header data-dashboard-header className="mb-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-5xl">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              {roleLabels[role]} · Interface preview
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Project dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              A focused view of delivery, editorial readiness and the next decisions across IEESEC.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <time className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium shadow-sm">
              <CalendarRange size={15} className="text-muted-foreground" />
              21 Aug — 17 Sep 2026
            </time>
            <button
              type="button"
              onClick={exportWorkspace}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold shadow-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download size={15} /> Export
            </button>
          </div>
        </div>

        <nav
          aria-label="Dashboard sections"
          className="mt-5 flex w-fit rounded-lg bg-muted p-1 text-xs font-medium"
        >
          <a
            href="#overview"
            className="rounded-md bg-background px-3 py-1.5 text-foreground shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
          >
            Overview
          </a>
          <a
            href="#active-projects"
            className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Projects
          </a>
          <a
            href="#review-queue"
            className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Content
          </a>
        </nav>
      </header>

      <div id="overview">
        <MetricCards data={data} />
      </div>

      <div className="mt-4 grid grid-flow-dense grid-cols-1 gap-4 xl:grid-cols-12">
        <section
          data-dashboard-panel
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm xl:col-span-8"
        >
          <PanelHeading
            title="Delivery rhythm"
            description="Project updates and editorial reviews across the last seven days."
            action={
              <div className="hidden items-center gap-4 text-[0.66rem] text-muted-foreground sm:flex">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" />
                  Updates
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-muted-foreground/45" />
                  Reviews
                </span>
              </div>
            }
          />
          <div className="px-4 pb-4">
            <DeliveryChart data={data.deliveryRhythm} />
          </div>
        </section>

        <section
          data-dashboard-panel
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm xl:col-span-4"
        >
          <PanelHeading title="Team pulse" description="Contributors active in this workspace." />
          <div className="p-5">
            <p className="font-mono text-4xl font-semibold tracking-[-0.05em]">
              {data.contributors.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Active contributors</p>
            <div className="mt-6 flex -space-x-2" aria-label="Active contributors">
              {data.contributors.map((contributor, index) => (
                <span
                  key={contributor.id}
                  title={contributor.name}
                  className="grid size-10 place-items-center rounded-full border-2 border-card bg-secondary text-xs font-bold text-secondary-foreground"
                  style={{ zIndex: data.contributors.length - index }}
                >
                  {contributor.initials}
                </span>
              ))}
            </div>
            <dl className="mt-7 divide-y divide-border border-y border-border text-xs">
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted-foreground">Average project progress</dt>
                <dd className="font-mono font-semibold">52%</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted-foreground">Reviews completed</dt>
                <dd className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  12
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted-foreground">Open blockers</dt>
                <dd className="font-mono font-semibold text-amber-700 dark:text-amber-400">2</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          id="active-projects"
          data-dashboard-panel
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm xl:col-span-8"
        >
          <PanelHeading
            title="Active projects"
            description="Current delivery progress across project teams."
            action={
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-primary hover:underline"
              >
                View all <ArrowRight size={13} />
              </Link>
            }
          />
          {data.activeProjects.length ? (
            <div className="divide-y divide-border">
              {data.activeProjects.map((project) => (
                <Link
                  key={project.id}
                  data-stack-card
                  href={`/admin/projects/${project.id}`}
                  className="group grid gap-4 px-5 py-4 transition-colors hover:bg-muted/45 focus-visible:bg-muted sm:grid-cols-[minmax(0,1fr)_13rem_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[0.64rem] font-semibold tracking-[0.1em] text-primary">
                        {project.code}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[0.62rem] font-medium text-muted-foreground">
                        {project.status.toLowerCase()}
                      </span>
                    </div>
                    <h3 className="mt-2 truncate text-sm font-semibold">{project.titleEn}</h3>
                    <p className="mt-1 truncate text-[0.7rem] text-muted-foreground">
                      {project.titleEl}
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between font-mono text-[0.64rem] text-muted-foreground">
                      <span>Progress</span>
                      <span className="text-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-700"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <FolderKanban className="mx-auto text-muted-foreground" size={24} />
              <h3 className="mt-3 text-sm font-semibold">No active projects</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Switch scenarios or create the first project draft.
              </p>
            </div>
          )}
        </section>

        <section
          id="review-queue"
          data-dashboard-panel
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm xl:col-span-4"
        >
          <PanelHeading title="Review queue" description="Posts that need an editorial decision." />
          {data.reviewQueue.length ? (
            <div className="divide-y divide-border">
              {data.reviewQueue.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/content/posts/${post.id}`}
                  className="group block px-5 py-4 transition-colors hover:bg-muted/45 focus-visible:bg-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <StatusBadge status={post.status} />
                    <span className="font-mono text-[0.62rem] text-muted-foreground">
                      {formatDate(post.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold leading-5">
                        {post.titleEn || post.titleEl}
                      </h3>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
                        <Languages size={13} />
                        {getPostTranslationStatus(post).toLowerCase()}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={15}
                      className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              The review queue is clear.
            </div>
          )}
        </section>

        <section
          data-dashboard-panel
          className="rounded-xl border border-border bg-card shadow-sm xl:col-span-4"
        >
          <PanelHeading title="Upcoming" description="Deadlines and team sessions." />
          <div className="space-y-1 p-3">
            {data.deadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/55"
              >
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    deadline.tone === "urgent"
                      ? "bg-destructive"
                      : deadline.tone === "attention"
                        ? "bg-amber-500"
                        : "bg-primary",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{deadline.label}</p>
                  <p className="mt-0.5 text-[0.66rem] text-muted-foreground">{deadline.context}</p>
                </div>
                <time className="shrink-0 font-mono text-[0.62rem] text-muted-foreground">
                  {formatDate(deadline.dueAt)}
                </time>
              </div>
            ))}
          </div>
        </section>

        <section
          id="recent-activity"
          data-dashboard-panel
          className="rounded-xl border border-border bg-card shadow-sm xl:col-span-8"
        >
          <PanelHeading
            title="Recent activity"
            description="Latest changes across projects and content."
          />
          <ol className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {data.activity.map((item) => (
              <li key={item.id} className="group min-w-0 p-5 transition-colors hover:bg-muted/45">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-secondary text-[0.66rem] font-bold text-secondary-foreground">
                    {item.actor.slice(0, 1)}
                  </span>
                  <time className="font-mono text-[0.6rem] text-muted-foreground">
                    {formatDate(item.occurredAt, true)}
                  </time>
                </div>
                <p className="mt-4 text-xs leading-5">
                  <span className="font-semibold">{item.actor}</span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>
                </p>
                <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">{item.subject}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <footer className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <BriefcaseBusiness size={17} />
          </span>
          <div>
            <p className="text-xs font-semibold">Ready for the next focused slice</p>
            <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
              Projects, posts and media already have typed repository seams.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions[role].map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                index === 0
                  ? "border-primary bg-primary text-primary-foreground hover:opacity-85"
                  : "border-border bg-background hover:bg-muted",
              )}
            >
              {index === 0 ? <Plus size={14} /> : null}
              {action.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="mx-auto max-w-[96rem] animate-pulse px-4 py-7 sm:px-6 lg:px-7">
      <div className="h-9 w-72 max-w-full rounded bg-muted" />
      <div className="mt-3 h-4 w-[32rem] max-w-full rounded bg-muted" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-36 rounded-xl border border-border bg-card" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <div className="h-96 rounded-xl border border-border bg-card xl:col-span-8" />
        <div className="h-96 rounded-xl border border-border bg-card xl:col-span-4" />
      </div>
    </div>
  );
}

function DashboardError({ message }: { message: string }) {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-destructive/25 bg-destructive/8 text-destructive">
        <CircleAlert size={25} />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">
        We couldn&apos;t load this workspace
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
      <Link
        href="/admin"
        className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring"
      >
        Try default data <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export function DashboardOverview({ snapshot }: { snapshot: DashboardSnapshot }) {
  if (snapshot.state === "loading") return <DashboardLoading />;
  if (snapshot.state === "error") return <DashboardError message={snapshot.message} />;
  return <DashboardReady data={snapshot.data} />;
}
