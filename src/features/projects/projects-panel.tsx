"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  Gauge,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminPage,
  EmptyPanel,
  MetricCard,
  MetricsGrid,
  PanelHeader,
  StateBadge,
} from "@/features/admin-shell/panel-ui";
import type { Project, ProjectStatus, User } from "@/features/admin/types";

const statusLabel: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  PAUSED: "Paused",
  COMPLETED: "Completed",
};

function toneForStatus(status: ProjectStatus) {
  if (status === "ACTIVE") return "success" as const;
  if (status === "PLANNING") return "info" as const;
  if (status === "PAUSED") return "warning" as const;
  return "neutral" as const;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "Europe/Athens",
  }).format(new Date(value));
}

function ProjectMembers({ project, users }: { project: Project; users: User[] }) {
  const assigned = users.filter((user) => project.memberIds.includes(user.id));
  return (
    <AvatarGroup aria-label={`${assigned.length} assigned members`}>
      {assigned.slice(0, 3).map((user) => (
        <Avatar key={user.id} size="sm">
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

export function ProjectsPanel({ projects, members }: { projects: Project[]; members: User[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | ProjectStatus>("ALL");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter(
      (project) =>
        (status === "ALL" || project.status === status) &&
        (!normalized ||
          project.code.toLowerCase().includes(normalized) ||
          project.titleEl.toLowerCase().includes(normalized) ||
          project.titleEn.toLowerCase().includes(normalized)),
    );
  }, [projects, query, status]);
  const averageProgress = Math.round(
    projects.reduce((total, project) => total + project.progress, 0) / Math.max(projects.length, 1),
  );

  return (
    <AdminPage>
      <PanelHeader
        eyebrow="Delivery portfolio"
        title="Projects workspace"
        description="Track ownership, progress and delivery dates across the community portfolio."
        actions={
          <Button asChild className="rounded-lg">
            <Link href="/admin/projects/new">
              <Plus data-icon="inline-start" />
              New project
            </Link>
          </Button>
        }
      />
      <MetricsGrid>
        <MetricCard
          label="Total projects"
          value={projects.length}
          detail="portfolio"
          icon={FolderKanban}
        />
        <MetricCard
          label="Active delivery"
          value={projects.filter((project) => project.status === "ACTIVE").length}
          detail="in progress"
          icon={Gauge}
        />
        <MetricCard
          label="Average progress"
          value={`${averageProgress}%`}
          detail="all teams"
          icon={CheckCircle2}
        />
        <MetricCard
          label="Contributors"
          value={new Set(projects.flatMap((project) => project.memberIds)).size}
          detail="assigned"
          icon={Users}
        />
      </MetricsGrid>

      <Tabs defaultValue="list" className="mt-6">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="rounded-lg border-border bg-background pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as "ALL" | ProjectStatus)}
            >
              <SelectTrigger
                aria-label="Filter by status"
                className="w-36 rounded-lg border-border bg-background"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">All statuses</SelectItem>
                {Object.entries(statusLabel).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TabsList className="rounded-lg">
              <TabsTrigger value="list" className="rounded-md">
                List
              </TabsTrigger>
              <TabsTrigger value="board" className="rounded-md">
                Board
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="list" className="mt-4">
          {filtered.length ? (
            <Card className="rounded-xl border py-0 shadow-none ring-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="max-w-[24rem] whitespace-normal">
                        <p className="text-sm font-semibold">{project.titleEl}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {project.code} · {project.titleEn}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StateBadge tone={toneForStatus(project.status)}>
                          {statusLabel[project.status]}
                        </StateBadge>
                      </TableCell>
                      <TableCell className="min-w-36">
                        <div className="flex items-center gap-3">
                          <Progress value={project.progress} className="h-1.5" />
                          <span className="w-8 font-mono text-[0.68rem] text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ProjectMembers project={project} users={members} />
                      </TableCell>
                      <TableCell className="font-mono text-[0.68rem] text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarClock className="size-3.5" />
                          {formatDate(project.targetDate)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Actions for ${project.code}`}
                            >
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem asChild className="rounded-lg">
                              <Link href={`/admin/projects/${project.id}`}>
                                <ArrowUpRight />
                                Open workspace
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => navigator.clipboard?.writeText(project.code)}
                              className="rounded-lg"
                            >
                              Copy project code
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <EmptyPanel
              icon={FolderKanban}
              title="No projects found"
              description="Change the filters or create a new project draft."
            />
          )}
        </TabsContent>

        <TabsContent value="board" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(Object.keys(statusLabel) as ProjectStatus[]).map((columnStatus) => {
              const items = filtered.filter((project) => project.status === columnStatus);
              return (
                <section
                  key={columnStatus}
                  className="min-w-0 rounded-xl border border-border bg-muted/20 p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xs font-semibold">{statusLabel[columnStatus]}</h2>
                    <StateBadge>{items.length}</StateBadge>
                  </div>
                  <div className="space-y-3">
                    {items.map((project) => (
                      <Card
                        key={project.id}
                        className="rounded-lg border py-0 shadow-none ring-0 transition-colors hover:border-primary/35"
                      >
                        <CardHeader className="rounded-none px-4 pt-4">
                          <CardTitle className="text-sm">{project.code}</CardTitle>
                          <CardDescription className="line-clamp-2 text-xs">
                            {project.titleEn}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                          <Progress value={project.progress} className="h-1.5" />
                          <div className="mt-3 flex items-center justify-between">
                            <ProjectMembers project={project} users={members} />
                            <Button asChild variant="ghost" size="icon-sm">
                              <Link
                                href={`/admin/projects/${project.id}`}
                                aria-label={`Open ${project.code}`}
                              >
                                <ArrowUpRight />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {!items.length ? (
                      <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                        No projects
                      </p>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}
