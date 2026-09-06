"use client";

import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { Link, usePathname } from "@/i18n/navigation";

const navItems = [
  { labelKey: "home", href: "/#home", sectionId: "home" },
  { labelKey: "team", href: "/#team", sectionId: "team" },
  { labelKey: "projects", href: "/#projects", sectionId: "projects" },
  { labelKey: "stack", href: "/#tech-stack", sectionId: "tech-stack" },
  { labelKey: "events", href: "/#events", sectionId: "events" },
  { labelKey: "blog", href: "/#blog", sectionId: "blog" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const background = [...document.querySelectorAll<HTMLElement>("header, main, footer")].filter(
      (element) => !sidebar.contains(element),
    );
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    document.body.style.overflow = "hidden";
    sidebar.querySelector<HTMLButtonElement>("button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsSidebarOpen(false);
      }
      if (event.key !== "Tab") return;
      const controls = [...sidebar.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)")];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsSidebarOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = overflow;
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      if (previousFocus?.isConnected && previousFocus.getClientRects().length) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const getActiveSectionFromHash = () => {
      const sectionId = window.location.hash.slice(1);
      return navItems.some((item) => item.sectionId === sectionId) ? sectionId : "home";
    };

    setActiveSection(getActiveSectionFromHash());

    const sectionIds = navItems.map((item) => item.sectionId);
    const observers: IntersectionObserver[] = [];

    const handleIntersect = (id: string) => (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      });
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(handleIntersect(id), {
        rootMargin: "-40% 0px -55% 0px",
      });
      observer.observe(el);
      observers.push(observer);
    });

    const handleScroll = () => {
      if (!window.location.hash && window.scrollY < window.innerHeight * 0.5) {
        setActiveSection("home");
      }
    };
    const handleHashChange = () => setActiveSection(getActiveSectionFromHash());

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  const scrollTo = useCallback((sectionId: string) => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior });
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior });
    }
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      // Let the root hash URL navigate from secondary pages such as /join.
      if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
        return;

      e.preventDefault();
      window.history.pushState(null, "", `#${sectionId}`);
      setActiveSection(sectionId);
      scrollTo(sectionId);
    },
    [pathname, scrollTo],
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full max-w-full overflow-x-clip">
        <div className="mx-auto max-w-7xl px-4 pt-3">
          <div
            data-testid="navbar-surface"
            className="relative flex h-14 items-center justify-between rounded-2xl border border-foreground/15 bg-background/68 px-5 shadow-lg shadow-foreground/5 backdrop-blur-md backdrop-saturate-150 dark:border-primary/10 dark:bg-background/30 dark:shadow-lg dark:shadow-black/20 dark:backdrop-blur-md dark:backdrop-saturate-150"
          >
            <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
            {/* Logo */}
            <Link
              href="/#home"
              onClick={(e) => handleNavClick(e, "home")}
              aria-label={t("homeLabel")}
              className="group flex items-center gap-3"
            >
              <img
                src="/images/brand/ieesec-navbar.svg"
                alt="IEESEC"
                width={178}
                height={44}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="light-theme-logo h-7 w-auto text-transparent brightness-0 transition-opacity group-hover:opacity-80 dark:brightness-100"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.sectionId}
                  aria-current={activeSection === item.sectionId ? "location" : undefined}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.sectionId)}
                  className={cn(
                    "px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200",
                    activeSection === item.sectionId
                      ? "text-primary-foreground bg-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/25",
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <Button
                asChild
                className="h-8 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/85 transition-colors"
              >
                <Link href="/join">{t("join")}</Link>
              </Button>
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-muted cursor-pointer"
                onClick={toggleSidebar}
                aria-label={t("openMenu")}
                aria-controls="mobile-navigation"
                aria-expanded={isSidebarOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal={isSidebarOpen || undefined}
        aria-label={t("openMenu")}
        id="mobile-navigation"
        aria-hidden={!isSidebarOpen}
        inert={!isSidebarOpen}
        className={`fixed inset-y-0 right-0 z-60 w-[min(18rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain transform bg-card border-l border-border p-6 sm:p-8 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={toggleSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label={t("closeMenu")}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.sectionId}
              href={item.href}
              onClick={(e) => {
                handleNavClick(e, item.sectionId);
                toggleSidebar();
              }}
              className={cn(
                "px-4 py-3 text-base font-medium rounded-xl transition-colors",
                activeSection === item.sectionId
                  ? "text-primary-foreground bg-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/15",
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
          <div className="mt-6 px-4">
            <Button
              asChild
              className="w-full h-10 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/85 transition-colors"
            >
              <Link href="/join" onClick={toggleSidebar}>
                {t("join")}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
