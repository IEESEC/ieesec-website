"use client";

import {
  ArrowDown,
  ArrowUp,
  Eye,
  LayoutTemplate,
  Monitor,
  Plus,
  Save,
  Smartphone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminPage,
  MetricCard,
  MetricsGrid,
  PanelHeader,
  StateBadge,
} from "@/features/admin-shell/panel-ui";
import type { HomepagePlacement, Post, Project } from "@/features/admin/types";

type PreviewMode = "desktop" | "mobile";
const sectionLabels: Record<HomepagePlacement["sectionKey"], string> = {
  hero: "Hero",
  "featured-posts": "Featured posts",
  "active-projects": "Active projects",
  "upcoming-events": "Upcoming events",
};

export function HomepagePanel({
  initialPlacements,
  posts,
  projects,
}: {
  initialPlacements: HomepagePlacement[];
  posts: Post[];
  projects: Project[];
}) {
  const [placements, setPlacements] = useState(initialPlacements);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [saved, setSaved] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSection, setNewSection] = useState<HomepagePlacement["sectionKey"]>("featured-posts");
  const [newContent, setNewContent] = useState(posts[0]?.id ?? projects[0]?.id ?? "");
  const storageKey = "ieesec-homepage-composition:v1";

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as HomepagePlacement[];
      if (Array.isArray(parsed)) setPlacements(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const titleById = useMemo(
    () =>
      Object.fromEntries([
        ...posts.map((post) => [post.id, post.titleEn]),
        ...projects.map((project) => [project.id, project.titleEn]),
        ["event-autumn-meetup", "Autumn community meetup"],
      ]),
    [posts, projects],
  );
  const contentOptions =
    newSection === "active-projects" || newSection === "hero"
      ? projects.map((project) => ({
          id: project.id,
          label: project.titleEn,
          type: "project" as const,
        }))
      : newSection === "featured-posts"
        ? posts.map((post) => ({ id: post.id, label: post.titleEn, type: "post" as const }))
        : [{ id: "event-autumn-meetup", label: "Autumn community meetup", type: "event" as const }];

  function updatePlacement(id: string, values: Partial<HomepagePlacement>) {
    setPlacements((current) =>
      current.map((item) => (item.id === id ? { ...item, ...values } : item)),
    );
    setSaved(false);
  }
  function move(id: string, direction: -1 | 1) {
    setPlacements((current) => {
      const item = current.find((placement) => placement.id === id);
      if (!item) return current;
      const siblingIds = current
        .filter((placement) => placement.locale === item.locale)
        .map((placement) => placement.id);
      const siblingIndex = siblingIds.indexOf(id);
      const targetId = siblingIds[siblingIndex + direction];
      if (!targetId) return current;
      const index = current.findIndex((placement) => placement.id === id);
      const targetIndex = current.findIndex((placement) => placement.id === targetId);
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
    setSaved(false);
  }
  function save() {
    window.localStorage.setItem(storageKey, JSON.stringify(placements));
    setSaved(true);
  }
  function addPlacement() {
    const option = contentOptions.find((item) => item.id === newContent) ?? contentOptions[0];
    if (!option) return;
    setPlacements((current) => [
      ...current,
      {
        id: `placement-${Date.now()}`,
        sectionKey: newSection,
        contentType: option.type,
        contentId: option.id,
        locale: "el",
        order: current.length + 1,
        visible: true,
      },
    ]);
    setDialogOpen(false);
    setSaved(false);
  }

  const visibleCount = placements.filter((item) => item.visible).length;
  const incompleteCount = placements.filter((item) => !item.visible).length;

  return (
    <AdminPage>
      <PanelHeader
        eyebrow="Page composition"
        title="Homepage manager"
        description="Control the bilingual homepage order and visibility without editing the public layout code."
        actions={
          <>
            <StateBadge tone={saved ? "success" : "warning"}>
              {saved ? "Saved" : "Unsaved"}
            </StateBadge>
            <Button onClick={save} className="rounded-lg">
              <Save />
              Save composition
            </Button>
          </>
        }
      />
      <MetricsGrid>
        <MetricCard
          label="Placements"
          value={placements.length}
          detail="configured"
          icon={LayoutTemplate}
        />
        <MetricCard label="Visible" value={visibleCount} detail="live in demo" icon={Eye} />
        <MetricCard
          label="Greek entries"
          value={placements.filter((item) => item.locale === "el").length}
          detail="EL"
          icon={Monitor}
        />
        <MetricCard
          label="Hidden items"
          value={incompleteCount}
          detail="attention"
          icon={Smartphone}
        />
      </MetricsGrid>

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Tabs defaultValue="el">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
            <TabsList className="rounded-lg">
              <TabsTrigger value="el" className="rounded-md">
                Greek
              </TabsTrigger>
              <TabsTrigger value="en" className="rounded-md">
                English
              </TabsTrigger>
            </TabsList>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-lg">
                  <Plus />
                  Add placement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add homepage placement</DialogTitle>
                  <DialogDescription>
                    Choose the section and mock content source for this local demo.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Select
                      value={newSection}
                      onValueChange={(value) => {
                        const section = value as HomepagePlacement["sectionKey"];
                        setNewSection(section);
                        const options =
                          section === "active-projects" || section === "hero"
                            ? projects
                            : section === "featured-posts"
                              ? posts
                              : [{ id: "event-autumn-meetup" }];
                        setNewContent(options[0]?.id ?? "");
                      }}
                    >
                      <SelectTrigger className="w-full rounded-lg border-border bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {Object.entries(sectionLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Select value={newContent} onValueChange={setNewContent}>
                      <SelectTrigger className="w-full rounded-lg border-border bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {contentOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="rounded-lg"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="rounded-lg" onClick={addPlacement}>
                    Add to homepage
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {(["el", "en"] as const).map((locale) => (
            <TabsContent key={locale} value={locale} className="mt-4 space-y-3">
              {placements
                .filter((item) => item.locale === locale)
                .map((placement, index, items) => (
                  <Card key={placement.id} className="rounded-xl border py-0 shadow-none ring-0">
                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted font-mono text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">
                            {sectionLabels[placement.sectionKey]}
                          </p>
                          <StateBadge tone={placement.visible ? "success" : "neutral"}>
                            {placement.visible ? "Visible" : "Hidden"}
                          </StateBadge>
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {titleById[placement.contentId] ?? placement.contentId}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={placement.visible}
                          onCheckedChange={(visible) => updatePlacement(placement.id, { visible })}
                          aria-label={`Toggle ${sectionLabels[placement.sectionKey]}`}
                        />
                        <Separator orientation="vertical" className="mx-2 h-6" />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={index === 0}
                          onClick={() => move(placement.id, -1)}
                          aria-label="Move up"
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={index === items.length - 1}
                          onClick={() => move(placement.id, 1)}
                          aria-label="Move down"
                        >
                          <ArrowDown />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>

        <Card className="rounded-xl border py-0 shadow-none ring-0 xl:sticky xl:top-24">
          <CardHeader className="rounded-none border-b px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Live preview</CardTitle>
                <CardDescription className="mt-1">Structural composition preview</CardDescription>
              </div>
              <div className="flex rounded-lg border border-border p-1">
                <Button
                  variant={previewMode === "desktop" ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setPreviewMode("desktop")}
                  aria-label="Desktop preview"
                >
                  <Monitor />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setPreviewMode("mobile")}
                  aria-label="Mobile preview"
                >
                  <Smartphone />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-muted/25 p-4">
            <div className={previewMode === "mobile" ? "mx-auto max-w-[13rem]" : "w-full"}>
              <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                <div className="h-5 border-b border-border bg-card" />
                <div className="aspect-[16/7] bg-[linear-gradient(135deg,var(--primary),color-mix(in_oklab,var(--primary)_30%,var(--background)))] p-3">
                  <div className="h-2 w-1/3 rounded bg-primary-foreground/70" />
                  <div className="mt-2 h-5 w-2/3 rounded bg-primary-foreground/90" />
                  <div className="mt-2 h-2 w-1/2 rounded bg-primary-foreground/55" />
                </div>
                <div className="grid gap-2 p-3">
                  <div className="h-2 w-1/4 rounded bg-muted-foreground/30" />
                  <div
                    className={previewMode === "mobile" ? "grid gap-2" : "grid grid-cols-3 gap-2"}
                  >
                    {placements
                      .filter((item) => item.visible)
                      .slice(0, 3)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="aspect-[4/3] rounded border border-border bg-muted/65 p-2"
                        >
                          <div className="h-1.5 w-2/3 rounded bg-muted-foreground/25" />
                          <div className="mt-2 h-1.5 w-full rounded bg-muted-foreground/15" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
