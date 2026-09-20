"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, GitBranch, Save, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AdminPage, PanelHeader, StateBadge } from "@/features/admin-shell/panel-ui";
import type { Project, ProjectStatus, User } from "@/features/admin/types";

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  PAUSED: "Paused",
  COMPLETED: "Completed",
};

export function ProjectEditor({
  initialProject,
  members,
}: {
  initialProject: Project;
  members: User[];
}) {
  const [project, setProject] = useState(initialProject);
  const [saved, setSaved] = useState(true);
  const storageKey = `ieesec-project-draft:${initialProject.id}:v1`;

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      setProject({
        ...initialProject,
        ...(JSON.parse(stored) as Partial<Project>),
        id: initialProject.id,
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [initialProject, storageKey]);

  function update(values: Partial<Project>) {
    setProject((current) => ({ ...current, ...values }));
    setSaved(false);
  }
  function save() {
    const next = { ...project, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setProject(next);
    setSaved(true);
  }

  return (
    <AdminPage>
      <PanelHeader
        eyebrow="Project workspace"
        title={project.titleEn || "New project"}
        description="Edit the bilingual brief, delivery status and team assignment in a browser-local prototype."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-lg">
              <Link href="/admin/projects">
                <ArrowLeft />
                Projects
              </Link>
            </Button>
            <Button onClick={save} className="rounded-lg">
              <Save />
              Save locally
            </Button>
          </>
        }
      />
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <StateBadge tone={saved ? "success" : "warning"}>{saved ? "Saved" : "Unsaved"}</StateBadge>
        <span>{project.code}</span>
      </div>
      <Tabs defaultValue="brief" className="mt-6">
        <TabsList className="rounded-lg">
          <TabsTrigger value="brief" className="rounded-md">
            Brief
          </TabsTrigger>
          <TabsTrigger value="delivery" className="rounded-md">
            Delivery
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-md">
            Team
          </TabsTrigger>
        </TabsList>
        <TabsContent value="brief" className="mt-4 grid gap-4 xl:grid-cols-2">
          {(["el", "en"] as const).map((locale) => (
            <Card key={locale} className="rounded-xl border py-0 shadow-none ring-0">
              <CardHeader className="rounded-none border-b px-5 py-4">
                <CardTitle>{locale === "el" ? "Ελληνικά" : "English"}</CardTitle>
                <CardDescription>Public project copy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-5 py-5">
                <div className="space-y-2">
                  <Label htmlFor={`title-${locale}`}>Title</Label>
                  <Input
                    id={`title-${locale}`}
                    value={locale === "el" ? project.titleEl : project.titleEn}
                    onChange={(event) =>
                      update(
                        locale === "el"
                          ? { titleEl: event.target.value }
                          : { titleEn: event.target.value },
                      )
                    }
                    className="rounded-lg border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`summary-${locale}`}>Summary</Label>
                  <Textarea
                    id={`summary-${locale}`}
                    value={locale === "el" ? project.summaryEl : project.summaryEn}
                    onChange={(event) =>
                      update(
                        locale === "el"
                          ? { summaryEl: event.target.value }
                          : { summaryEn: event.target.value },
                      )
                    }
                    className="rounded-lg border-border bg-background"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="delivery" className="mt-4 grid gap-4 lg:grid-cols-[1fr_20rem]">
          <Card className="rounded-xl border py-0 shadow-none ring-0">
            <CardHeader className="rounded-none border-b px-5 py-4">
              <CardTitle>Delivery controls</CardTitle>
              <CardDescription>Dates, repository and current workflow state.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={project.status}
                  onValueChange={(value) => update({ status: value as ProjectStatus })}
                >
                  <SelectTrigger className="w-full rounded-lg border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-code">Project code</Label>
                <Input
                  id="project-code"
                  value={project.code}
                  onChange={(event) =>
                    update({ code: event.target.value.toUpperCase().slice(0, 12) })
                  }
                  className="rounded-lg border-border bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Start date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={project.startDate}
                  onChange={(event) => update({ startDate: event.target.value })}
                  className="rounded-lg border-border bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-date">Target date</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={project.targetDate}
                  onChange={(event) => update({ targetDate: event.target.value })}
                  className="rounded-lg border-border bg-background"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="repository-url">Repository URL</Label>
                <Input
                  id="repository-url"
                  value={project.repositoryUrl}
                  onChange={(event) => update({ repositoryUrl: event.target.value })}
                  className="rounded-lg border-border bg-background"
                />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border py-0 shadow-none ring-0">
            <CardHeader className="rounded-none px-5 pt-5">
              <CardTitle>Progress</CardTitle>
              <CardDescription>Visible delivery signal</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="font-mono text-4xl font-semibold">{project.progress}%</p>
              <Progress value={project.progress} className="mt-4 h-2" />
              <Input
                aria-label="Project progress"
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(event) => update({ progress: Number(event.target.value) })}
                className="mt-5 h-9 rounded-lg border-border bg-background"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <Card className="rounded-xl border py-0 shadow-none ring-0">
            <CardHeader className="rounded-none border-b px-5 py-4">
              <CardTitle>Project team</CardTitle>
              <CardDescription>Select the members who contribute to this project.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border px-5">
              {members.map((member) => {
                const active = project.memberIds.includes(member.id);
                return (
                  <div key={member.id} className="flex items-center gap-3 py-4">
                    <Avatar>
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{member.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <Switch
                      checked={active}
                      onCheckedChange={(checked) =>
                        update({
                          memberIds: checked
                            ? [...project.memberIds, member.id]
                            : project.memberIds.filter((id) => id !== member.id),
                        })
                      }
                      aria-label={`Assign ${member.name}`}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Card className="rounded-xl border py-0 shadow-none ring-0">
          <CardContent className="flex items-center gap-3 p-4">
            <GitBranch className="size-4 text-primary" />
            <span className="text-xs">Repository linked</span>
          </CardContent>
        </Card>
        <Card className="rounded-xl border py-0 shadow-none ring-0">
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="size-4 text-primary" />
            <span className="text-xs">{project.memberIds.length} assigned members</span>
          </CardContent>
        </Card>
        <Card className="rounded-xl border py-0 shadow-none ring-0">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="size-4 text-primary" />
            <span className="text-xs">{statusLabels[project.status]}</span>
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
