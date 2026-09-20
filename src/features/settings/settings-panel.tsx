"use client";

import { Bell, Database, Languages, RotateCcw, Save, Settings2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
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

interface DemoSettings {
  workspaceName: string;
  defaultLocale: "el" | "en";
  reviewRequired: boolean;
  translationRequired: boolean;
  weeklyDigest: boolean;
  deadlineAlerts: boolean;
  compactTables: boolean;
  autosave: boolean;
}
const defaults: DemoSettings = {
  workspaceName: "IEESEC Content Studio",
  defaultLocale: "el",
  reviewRequired: true,
  translationRequired: true,
  weeklyDigest: true,
  deadlineAlerts: true,
  compactTables: true,
  autosave: true,
};

function SettingRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={title} />
    </div>
  );
}

export function SettingsPanel() {
  const [settings, setSettings] = useState(defaults);
  const [saved, setSaved] = useState(true);
  const [resetOpen, setResetOpen] = useState(false);
  const storageKey = "ieesec-admin-settings:v1";
  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      setSettings({ ...defaults, ...(JSON.parse(stored) as Partial<DemoSettings>) });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);
  function update(values: Partial<DemoSettings>) {
    setSettings((current) => ({ ...current, ...values }));
    setSaved(false);
  }
  function save() {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
    setSaved(true);
  }
  function reset() {
    window.localStorage.removeItem(storageKey);
    setSettings(defaults);
    setSaved(true);
    setResetOpen(false);
  }

  return (
    <AdminPage>
      <PanelHeader
        eyebrow="Workspace configuration"
        title="Prototype settings"
        description="Configure editorial defaults and interface preferences for this browser-only administration demo."
        actions={
          <>
            <StateBadge tone={saved ? "success" : "warning"}>
              {saved ? "Saved" : "Unsaved"}
            </StateBadge>
            <Button onClick={save} className="rounded-lg">
              <Save />
              Save settings
            </Button>
          </>
        }
      />
      <MetricsGrid>
        <MetricCard
          label="Default locale"
          value={settings.defaultLocale.toUpperCase()}
          detail="authoring"
          icon={Languages}
        />
        <MetricCard
          label="Review gate"
          value={settings.reviewRequired ? "On" : "Off"}
          detail="publishing"
          icon={ShieldCheck}
        />
        <MetricCard
          label="Autosave"
          value={settings.autosave ? "On" : "Off"}
          detail="local"
          icon={Database}
        />
        <MetricCard
          label="Alerts"
          value={Number(settings.weeklyDigest) + Number(settings.deadlineAlerts)}
          detail="enabled"
          icon={Bell}
        />
      </MetricsGrid>
      <Tabs
        defaultValue="general"
        className="mt-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-5"
      >
        <TabsList className="h-auto! w-full flex-wrap justify-start rounded-xl border border-border bg-card p-2 lg:sticky lg:top-24 lg:flex-col">
          <TabsTrigger value="general" className="w-full rounded-lg lg:justify-start">
            <Settings2 />
            General
          </TabsTrigger>
          <TabsTrigger value="workflow" className="w-full rounded-lg lg:justify-start">
            <ShieldCheck />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-full rounded-lg lg:justify-start">
            <Bell />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="interface" className="w-full rounded-lg lg:justify-start">
            <Database />
            Interface
          </TabsTrigger>
        </TabsList>
        <div className="mt-4 min-w-0 lg:mt-0">
          <TabsContent value="general">
            <Card className="rounded-xl border py-0 shadow-none ring-0">
              <CardHeader className="rounded-none border-b px-5 py-5">
                <CardTitle>General workspace</CardTitle>
                <CardDescription>
                  Names and locale defaults used throughout the prototype.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-5 py-5">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace name</Label>
                  <Input
                    id="workspace-name"
                    value={settings.workspaceName}
                    onChange={(event) => update({ workspaceName: event.target.value })}
                    className="max-w-xl rounded-lg border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default authoring locale</Label>
                  <Select
                    value={settings.defaultLocale}
                    onValueChange={(value) => update({ defaultLocale: value as "el" | "en" })}
                  >
                    <SelectTrigger className="w-56 rounded-lg border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="el">Greek</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="workflow">
            <Card className="rounded-xl border py-0 shadow-none ring-0">
              <CardHeader className="rounded-none border-b px-5 py-5">
                <CardTitle>Publishing workflow</CardTitle>
                <CardDescription>
                  Interface rules demonstrated by the content editor.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border px-5">
                <SettingRow
                  title="Require editorial review"
                  description="Posts move through the review queue before approval."
                  checked={settings.reviewRequired}
                  onCheckedChange={(checked) => update({ reviewRequired: checked })}
                />
                <SettingRow
                  title="Require both translations"
                  description="Show readiness warnings until Greek and English fields are complete."
                  checked={settings.translationRequired}
                  onCheckedChange={(checked) => update({ translationRequired: checked })}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card className="rounded-xl border py-0 shadow-none ring-0">
              <CardHeader className="rounded-none border-b px-5 py-5">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  These toggles only change the local demo state and send nothing.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border px-5">
                <SettingRow
                  title="Weekly workspace digest"
                  description="Summarise posts, projects and pending reviews."
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => update({ weeklyDigest: checked })}
                />
                <SettingRow
                  title="Deadline alerts"
                  description="Surface upcoming project and editorial dates."
                  checked={settings.deadlineAlerts}
                  onCheckedChange={(checked) => update({ deadlineAlerts: checked })}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="interface">
            <Card className="rounded-xl border py-0 shadow-none ring-0">
              <CardHeader className="rounded-none border-b px-5 py-5">
                <CardTitle>Interface preferences</CardTitle>
                <CardDescription>
                  Browser-local behavior for the administration prototype.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border px-5">
                <SettingRow
                  title="Compact data tables"
                  description="Use dense rows for operational workspaces."
                  checked={settings.compactTables}
                  onCheckedChange={(checked) => update({ compactTables: checked })}
                />
                <SettingRow
                  title="Autosave drafts"
                  description="Persist editor changes in local storage while authoring."
                  checked={settings.autosave}
                  onCheckedChange={(checked) => update({ autosave: checked })}
                />
                <Separator />
                <div className="py-5">
                  <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="rounded-lg">
                        <RotateCcw />
                        Reset settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset local settings?</DialogTitle>
                        <DialogDescription>
                          This removes only the settings stored by this prototype in the current
                          browser.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => setResetOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button variant="destructive" className="rounded-lg" onClick={reset}>
                          Reset local settings
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </AdminPage>
  );
}
