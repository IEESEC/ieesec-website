"use client";

import {
  MailPlus,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  AdminPage,
  EmptyPanel,
  MetricCard,
  MetricsGrid,
  PanelHeader,
  StateBadge,
} from "@/features/admin-shell/panel-ui";
import { roleLabels } from "@/features/admin-shell/navigation";
import type { DemoRole, Project, User } from "@/features/admin/types";

export function MembersPanel({
  initialMembers,
  projects,
}: {
  initialMembers: User[];
  projects: Project[];
}) {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"ALL" | DemoRole>("ALL");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<DemoRole>("CONTENT_EDITOR");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return members.filter(
      (member) =>
        (role === "ALL" || member.roles.includes(role)) &&
        (!normalized ||
          member.name.toLowerCase().includes(normalized) ||
          member.email.toLowerCase().includes(normalized)),
    );
  }, [members, query, role]);

  function addMember() {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const initials = inviteName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setMembers((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        initials,
        roles: [inviteRole],
      },
    ]);
    setInviteName("");
    setInviteEmail("");
    setInviteOpen(false);
  }
  function projectCount(memberId: string) {
    return projects.filter((project) => project.memberIds.includes(memberId)).length;
  }

  return (
    <AdminPage>
      <PanelHeader
        eyebrow="People and access"
        title="Members workspace"
        description="Review prototype roles, project assignments and team coverage without connecting an identity provider."
        actions={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-lg">
                <UserPlus />
                Add demo member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a demo member</DialogTitle>
                <DialogDescription>
                  This creates a local interface record and sends no invitation email.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-name">Name</Label>
                  <Input
                    id="invite-name"
                    value={inviteName}
                    onChange={(event) => setInviteName(event.target.value)}
                    placeholder="Member name"
                    className="rounded-lg border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="name@example.invalid"
                    className="rounded-lg border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Demo role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(value) => setInviteRole(value as DemoRole)}
                  >
                    <SelectTrigger className="w-full rounded-lg border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
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
                  onClick={() => setInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-lg"
                  onClick={addMember}
                  disabled={!inviteName.trim() || !inviteEmail.trim()}
                >
                  Add member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <MetricsGrid>
        <MetricCard label="Members" value={members.length} detail="demo directory" icon={Users} />
        <MetricCard
          label="Admins"
          value={members.filter((member) => member.roles.includes("ADMIN")).length}
          detail="full access"
          icon={ShieldCheck}
        />
        <MetricCard
          label="Project leads"
          value={members.filter((member) => member.roles.includes("PROJECT_MANAGER")).length}
          detail="delivery"
          icon={UserCheck}
        />
        <MetricCard
          label="Assigned seats"
          value={members.filter((member) => projectCount(member.id) > 0).length}
          detail="on projects"
          icon={MailPlus}
        />
      </MetricsGrid>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or email"
            aria-label="Search members"
            className="rounded-lg border-border bg-background pl-9"
          />
        </div>
        <Select value={role} onValueChange={(value) => setRole(value as "ALL" | DemoRole)}>
          <SelectTrigger
            aria-label="Filter by role"
            className="w-48 rounded-lg border-border bg-background"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">All roles</SelectItem>
            {Object.entries(roleLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length ? (
        <Card className="mt-4 rounded-xl border py-0 shadow-none ring-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[22rem] whitespace-normal">
                    <div className="flex flex-wrap gap-1.5">
                      {member.roles.map((item) => (
                        <StateBadge key={item} tone={item === "ADMIN" ? "info" : "neutral"}>
                          {roleLabels[item]}
                        </StateBadge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">{projectCount(member.id)}</span>
                  </TableCell>
                  <TableCell>
                    <StateBadge tone="success">Active</StateBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${member.name}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem
                          className="rounded-lg"
                          onSelect={() => navigator.clipboard?.writeText(member.email)}
                        >
                          Copy email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-lg"
                          onSelect={() =>
                            setMembers((current) =>
                              current.map((item) =>
                                item.id === member.id
                                  ? {
                                      ...item,
                                      roles: item.roles.includes("CONTENT_EDITOR")
                                        ? item.roles
                                        : [...item.roles, "CONTENT_EDITOR"],
                                    }
                                  : item,
                              ),
                            )
                          }
                        >
                          Add content role
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
        <div className="mt-4">
          <EmptyPanel
            icon={Users}
            title="No members found"
            description="Change the search or selected role."
          />
        </div>
      )}
    </AdminPage>
  );
}
