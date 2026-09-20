import type { DemoRole } from "@/features/admin/types";

export type AdminIconName =
  | "overview"
  | "projects"
  | "posts"
  | "homepage"
  | "media"
  | "members"
  | "settings";

export interface AdminNavigationItem {
  label: string;
  href: string;
  icon: AdminIconName;
  roles: DemoRole[];
}

export const roleLabels: Record<DemoRole, string> = {
  ADMIN: "Administrator",
  PROJECT_MANAGER: "Project manager",
  CONTENT_EDITOR: "Content editor",
  CONTENT_REVIEWER: "Content reviewer",
};

export const adminNavigation: AdminNavigationItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: "overview",
    roles: ["ADMIN", "PROJECT_MANAGER", "CONTENT_EDITOR", "CONTENT_REVIEWER"],
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: "projects",
    roles: ["ADMIN", "PROJECT_MANAGER"],
  },
  {
    label: "Posts",
    href: "/admin/content/posts",
    icon: "posts",
    roles: ["ADMIN", "CONTENT_EDITOR", "CONTENT_REVIEWER"],
  },
  {
    label: "Homepage",
    href: "/admin/content/homepage",
    icon: "homepage",
    roles: ["ADMIN", "CONTENT_EDITOR"],
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: "media",
    roles: ["ADMIN", "CONTENT_EDITOR"],
  },
  {
    label: "Members",
    href: "/admin/members",
    icon: "members",
    roles: ["ADMIN", "PROJECT_MANAGER"],
  },
  { label: "Settings", href: "/admin/settings", icon: "settings", roles: ["ADMIN"] },
];

export function getNavigationForRole(role: DemoRole) {
  return adminNavigation.filter((item) => item.roles.includes(role));
}

export function canAccessAdminPath(role: DemoRole, pathname: string) {
  const matches = adminNavigation
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length);

  return (matches[0] ?? adminNavigation[0]).roles.includes(role);
}
