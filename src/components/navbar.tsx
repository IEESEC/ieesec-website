"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { label: "Home", href: "/#home", sectionId: "home" },
  { label: "Team", href: "/#team", sectionId: "team" },
  { label: "Projects", href: "/#projects", sectionId: "projects" },
  { label: "Stack", href: "/#tech-stack", sectionId: "tech-stack" },
  { label: "Events", href: "/#events", sectionId: "events" },
  { label: "Blog", href: "/#blog", sectionId: "blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      // Let the root hash URL navigate from secondary pages such as /join.
      if (window.location.pathname !== "/") return;

      e.preventDefault();
      setActiveSection(sectionId);
      scrollTo(sectionId);
    },
    [scrollTo],
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
            <a
              href="/#home"
              onClick={(e) => handleNavClick(e, "home")}
              className="flex items-center gap-3 group"
            >
              <img
                src="/images/brand/ieesec-navbar.svg"
                alt="IEESEC"
                width={178}
                height={44}
                className="h-7 w-auto brightness-0 transition-opacity group-hover:opacity-80 dark:brightness-100"
              />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.sectionId)}
                  className={cn(
                    "px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200",
                    activeSection === item.sectionId
                      ? "text-primary-foreground bg-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/25",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <Button
                asChild
                className="h-8 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/85 transition-colors"
              >
                <Link href="/join">Join Us</Link>
              </Button>
            </div>

            {/* Mobile actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-muted cursor-pointer"
                onClick={toggleSidebar}
                aria-label="Open menu"
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        id="mobile-navigation"
        aria-hidden={!isSidebarOpen}
        inert={!isSidebarOpen}
        className={`fixed inset-y-0 right-0 z-60 w-[min(18rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain transform bg-card border-l border-border p-6 sm:p-8 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={toggleSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
          <ThemeToggle />
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
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
              {item.label}
            </Link>
          ))}
          <div className="mt-6 px-4">
            <Button
              asChild
              className="w-full h-10 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/85 transition-colors"
            >
              <Link href="/join" onClick={toggleSidebar}>
                Join Us
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
