"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Building2,
  ChevronRight,
  Command,
  FileText,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Moon,
  RotateCcw,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DemoRole, DemoScenario } from "@/features/admin/types";
import {
  adminNavigation,
  canAccessAdminPath,
  getNavigationForRole,
  roleLabels,
  type AdminIconName,
  type AdminNavigationItem,
} from "@/features/admin-shell/navigation";
import { demoScenarios } from "@/mocks/scenarios";
import { cn } from "@/lib/utils";

const roleStorageKey = "ieesec-admin-demo-role:v1";

const iconByName: Record<AdminIconName, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  projects: FolderKanban,
  posts: FileText,
  homepage: Building2,
  media: ImageIcon,
  members: Users,
  settings: Settings,
};

const navigationGroups = [
  { label: "Workspace", items: ["Overview", "Projects", "Members"] },
  { label: "Content", items: ["Posts", "Homepage", "Media"] },
  { label: "Administration", items: ["Settings"] },
] as const;

const DemoRoleContext = createContext<DemoRole>("ADMIN");

export function useDemoRole() {
  return useContext(DemoRoleContext);
}

function ThemeControl() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-lg"
    >
      {mounted && resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}

function NavigationLink({
  item,
  pathname,
  onNavigate,
}: {
  item: AdminNavigationItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = iconByName[item.icon];
  const isActive = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex min-h-9 items-center gap-3 rounded-lg px-3 text-[0.82rem] font-medium text-sidebar-foreground/62 transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        isActive &&
          "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border",
      )}
    >
      <Icon
        size={16}
        strokeWidth={1.8}
        className={cn(
          "transition-colors",
          isActive
            ? "text-primary"
            : "text-sidebar-foreground/48 group-hover:text-sidebar-foreground",
        )}
      />
      <span className="flex-1">{item.label}</span>
      {isActive ? <span className="size-1.5 rounded-full bg-primary" /> : null}
    </Link>
  );
}

function Sidebar({ role, onNavigate }: { role: DemoRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const navigation = getNavigationForRole(role);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const filtered = query
    ? navigation.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : navigation;

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Image
          src="/images/brand/ieesec-navbar.svg"
          width={128}
          height={32}
          alt="IEESEC"
          priority
          className="brightness-0 dark:invert"
        />
      </div>

      <div className="px-3 pt-4">
        <label htmlFor="admin-navigation-search" className="sr-only">
          Search navigation
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sidebar-foreground/40"
          />
          <Input
            ref={searchRef}
            id="admin-navigation-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search workspace"
            className="h-9 w-full rounded-lg border-sidebar-border bg-background/70 pr-12 pl-9 text-xs"
          />
          <span className="pointer-events-none absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-sidebar-border bg-sidebar px-1.5 py-0.5 font-mono text-[0.56rem] text-sidebar-foreground/45">
            <Command size={9} />K
          </span>
        </div>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3 py-4">
        {filtered.length ? (
          <div className="space-y-5">
            {navigationGroups.map((group) => {
              const items = filtered.filter((item) =>
                (group.items as readonly string[]).includes(item.label),
              );
              if (!items.length) return null;

              return (
                <section key={group.label} aria-labelledby={`nav-${group.label.toLowerCase()}`}>
                  <h2
                    id={`nav-${group.label.toLowerCase()}`}
                    className="px-3 pb-1.5 text-[0.67rem] font-medium text-sidebar-foreground/38"
                  >
                    {group.label}
                  </h2>
                  <ul className="space-y-0.5">
                    {items.map((item) => (
                      <li key={item.href}>
                        <NavigationLink item={item} pathname={pathname} onNavigate={onNavigate} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-sidebar-border px-3 py-4 text-center text-xs text-sidebar-foreground/50">
            No matching workspace area.
          </p>
        )}
      </nav>

      <div className="mx-3 mb-3 rounded-xl border border-sidebar-border bg-sidebar-accent/35 p-3">
        <p className="text-xs font-semibold text-sidebar-accent-foreground">Interface prototype</p>
        <p className="mt-1 text-[0.68rem] leading-4 text-sidebar-foreground/48">
          Role visibility is simulated and is not security enforcement.
        </p>
      </div>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-[0.68rem] font-bold text-primary-foreground ring-2 ring-background">
            AP
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              Alex Papadopoulos
            </p>
            <p className="truncate text-[0.66rem] text-sidebar-foreground/45">{roleLabels[role]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessUnavailable({ role }: { role: DemoRole }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <span className="mb-5 grid size-14 place-items-center rounded-2xl border border-border bg-muted text-muted-foreground">
        <LockKeyhole size={24} />
      </span>
      <p className="mb-2 text-xs font-semibold text-primary">{roleLabels[role]}</p>
      <h1 className="text-2xl font-semibold tracking-tight">Access unavailable in this role</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        This is an interface preview only. Switch the demo role to inspect how navigation and
        actions adapt; it is not production authorization.
      </p>
      <Link
        href="/admin"
        className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring"
      >
        Return to overview <ChevronRight size={16} />
      </Link>
    </section>
  );
}

export function AdminShell({
  children,
  showScenarioControls,
}: {
  children: ReactNode;
  showScenarioControls: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<DemoRole>("ADMIN");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scenario, setScenario] = useState<DemoScenario>("default");

  useEffect(() => {
    const storedRole = window.localStorage.getItem(roleStorageKey) as DemoRole | null;
    if (storedRole && roleLabels[storedRole]) setRole(storedRole);
    const queryScenario = new URLSearchParams(window.location.search).get("scenario");
    if (demoScenarios.includes(queryScenario as DemoScenario)) {
      setScenario(queryScenario as DemoScenario);
    }
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const breadcrumb = useMemo(() => {
    return [...adminNavigation]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label;
  }, [pathname]);

  function changeRole(nextRole: DemoRole) {
    setRole(nextRole);
    window.localStorage.setItem(roleStorageKey, nextRole);
  }

  function changeScenario(nextScenario: DemoScenario) {
    setScenario(nextScenario);
    const query = nextScenario === "default" ? "" : `?scenario=${nextScenario}`;
    router.replace(`${pathname}${query}`);
  }

  function resetDemo() {
    window.localStorage.removeItem(roleStorageKey);
    setRole("ADMIN");
    setScenario("default");
    router.replace("/admin");
  }

  const hasAccess = canAccessAdminPath(role, pathname);

  return (
    <DemoRoleContext.Provider value={role}>
      <a href="#admin-content" className="skip-link">
        Skip to dashboard content
      </a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-68 border-r border-sidebar-border lg:block">
        <Sidebar role={role} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[min(18rem,88vw)] border-r border-sidebar-border shadow-2xl">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 z-10 rounded-lg text-sidebar-foreground/55"
            >
              <X size={18} />
            </Button>
            <Sidebar role={role} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-muted/25 lg:pl-68">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/94 px-4 backdrop-blur-md sm:px-6 lg:px-7">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="rounded-lg lg:hidden"
          >
            <Menu size={18} />
          </Button>
          <div className="flex min-w-0 flex-1 items-center gap-2 text-xs">
            <span className="hidden text-muted-foreground sm:inline">IEESEC</span>
            <ChevronRight size={13} className="hidden text-muted-foreground/50 sm:block" />
            <span className="truncate font-semibold">{breadcrumb ?? "Workspace"}</span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-md border border-primary/20 bg-primary/8 px-2 py-1 text-[0.62rem] font-semibold text-primary">
              Demo
            </span>
            <Select value={role} onValueChange={(value) => changeRole(value as DemoRole)}>
              <SelectTrigger
                id="demo-role"
                aria-label="Demo role"
                className="w-44 rounded-lg border-border bg-background text-xs font-semibold"
              >
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
          <ThemeControl />
        </header>

        <div className="border-b border-border bg-card px-4 py-3 sm:hidden">
          <label
            htmlFor="demo-role-mobile"
            className="mb-1.5 block text-[0.68rem] text-muted-foreground"
          >
            Demo role
          </label>
          <Select value={role} onValueChange={(value) => changeRole(value as DemoRole)}>
            <SelectTrigger
              id="demo-role-mobile"
              className="w-full rounded-lg border-border bg-background text-xs font-semibold"
            >
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

        {showScenarioControls ? (
          <div className="mx-4 mt-3 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-border bg-card/65 px-3 py-2.5 sm:mx-6 lg:mx-7">
            <div>
              <label
                htmlFor="demo-scenario"
                className="mb-1 block text-[0.62rem] text-muted-foreground"
              >
                Development scenario
              </label>
              <Select
                value={scenario}
                onValueChange={(value) => changeScenario(value as DemoScenario)}
              >
                <SelectTrigger
                  id="demo-scenario"
                  size="sm"
                  className="w-44 rounded-lg border-border bg-background text-[0.68rem]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {demoScenarios.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetDemo}
              className="rounded-lg text-[0.68rem]"
            >
              <RotateCcw size={13} /> Reset demo data
            </Button>
          </div>
        ) : null}

        <main id="admin-content" className="min-w-0">
          {hasAccess ? children : <AccessUnavailable role={role} />}
        </main>
      </div>
    </DemoRoleContext.Provider>
  );
}
