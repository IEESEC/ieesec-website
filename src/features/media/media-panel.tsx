"use client";

import Image from "next/image";
import { FileImage, Film, ImagePlus, Images, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminPage,
  EmptyPanel,
  MetricCard,
  MetricsGrid,
  PanelHeader,
  StateBadge,
} from "@/features/admin-shell/panel-ui";
import type { MediaAsset } from "@/features/admin/types";

function fileSize(bytes: number) {
  return `${Math.round(bytes / 1000)} KB`;
}

export function MediaPanel({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"ALL" | MediaAsset["type"]>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const selected = assets.find((asset) => asset.id === selectedId) ?? null;
  const filtered = useMemo(
    () =>
      assets.filter(
        (asset) =>
          (type === "ALL" || asset.type === type) &&
          asset.filename.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [assets, query, type],
  );
  const incomplete = assets.filter((asset) => !asset.altEl || !asset.altEn).length;

  function updateAsset(id: string, values: Partial<MediaAsset>) {
    setAssets((current) =>
      current.map((asset) => (asset.id === id ? { ...asset, ...values } : asset)),
    );
  }
  function addDemoAsset() {
    const next: MediaAsset = {
      id: `media-${Date.now()}`,
      filename: "new-community-asset.jpg",
      type: "image",
      width: 1600,
      height: 900,
      size: 210000,
      altEl: "",
      altEn: "",
      url: "/images/hero/campus1.jpg",
    };
    setAssets((current) => [next, ...current]);
    setAddOpen(false);
    setSelectedId(next.id);
  }

  return (
    <AdminPage>
      <PanelHeader
        eyebrow="Asset operations"
        title="Media library"
        description="Browse approved assets, inspect technical metadata and complete bilingual alternative text."
        actions={
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-lg">
                <ImagePlus />
                Add demo asset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a media asset</DialogTitle>
                <DialogDescription>
                  This MVP creates a browser-only sample entry. It does not upload a file.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-dashed border-border bg-muted/25 px-5 py-10 text-center">
                <ImagePlus className="mx-auto size-7 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold">Upload adapter not connected</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create a demo record to inspect the editing workflow.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-lg" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button className="rounded-lg" onClick={addDemoAsset}>
                  Create demo record
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <MetricsGrid>
        <MetricCard label="Total assets" value={assets.length} detail="library" icon={Images} />
        <MetricCard
          label="Images"
          value={assets.filter((asset) => asset.type === "image").length}
          detail="optimised"
          icon={FileImage}
        />
        <MetricCard
          label="Video entries"
          value={assets.filter((asset) => asset.type === "video").length}
          detail="poster based"
          icon={Film}
        />
        <MetricCard
          label="Missing alt text"
          value={incomplete}
          detail="needs review"
          icon={Sparkles}
        />
      </MetricsGrid>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search filenames"
            aria-label="Search media"
            className="rounded-lg border-border bg-background pl-9"
          />
        </div>
        <Select
          value={type}
          onValueChange={(value) => setType(value as "ALL" | MediaAsset["type"])}
        >
          <SelectTrigger
            aria-label="Filter media type"
            className="w-36 rounded-lg border-border bg-background"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">All media</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length ? (
        <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((asset) => {
            const ready = Boolean(asset.altEl && asset.altEn);
            return (
              <Card
                key={asset.id}
                className="cursor-pointer rounded-xl border py-0 shadow-none ring-0 transition-colors hover:border-primary/40"
                onClick={() => setSelectedId(asset.id)}
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                  <Image
                    src={asset.url}
                    alt={asset.altEn || asset.filename}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                  />
                  <div className="absolute top-3 left-3">
                    <StateBadge tone={asset.type === "video" ? "info" : "neutral"}>
                      {asset.type}
                    </StateBadge>
                  </div>
                </div>
                <CardHeader className="rounded-none px-4 pt-4">
                  <CardTitle className="truncate text-sm">{asset.filename}</CardTitle>
                  <CardDescription className="font-mono text-[0.65rem]">
                    {asset.width} × {asset.height} · {fileSize(asset.size)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between px-4 pb-4">
                  <StateBadge tone={ready ? "success" : "warning"}>
                    {ready ? "Alt text ready" : "Needs alt text"}
                  </StateBadge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(asset.id);
                    }}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      ) : (
        <div className="mt-4">
          <EmptyPanel
            icon={Images}
            title="No media found"
            description="Change the query or media type filter."
          />
        </div>
      )}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.filename}</DialogTitle>
            <DialogDescription>
              Edit bilingual accessibility metadata for this local demo asset.
            </DialogDescription>
          </DialogHeader>
          {selected ? (
            <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
              <div className="relative min-h-56 overflow-hidden rounded-xl border border-border">
                <Image
                  src={selected.url}
                  alt={selected.altEn || selected.filename}
                  fill
                  sizes="360px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/25 p-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Dimensions</p>
                    <p className="mt-1 font-mono">
                      {selected.width} × {selected.height}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">File size</p>
                    <p className="mt-1 font-mono">{fileSize(selected.size)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt-el">Greek alt text</Label>
                  <Textarea
                    id="alt-el"
                    value={selected.altEl}
                    onChange={(event) => updateAsset(selected.id, { altEl: event.target.value })}
                    className="rounded-lg border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt-en">English alt text</Label>
                  <Textarea
                    id="alt-en"
                    value={selected.altEn}
                    onChange={(event) => updateAsset(selected.id, { altEn: event.target.value })}
                    className="rounded-lg border-border bg-background"
                  />
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button className="rounded-lg" onClick={() => setSelectedId(null)}>
              Save metadata
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
