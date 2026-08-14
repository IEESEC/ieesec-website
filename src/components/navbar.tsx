"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Team", href: "#team" },
  { label: "Projects", href: "#projects" },
  { label: "Events", href: "#events" },
  { label: "Blog", href: "#blog" },
];

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Scroll Observer gia na kanei highlight to active section.
  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1));
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
      if (window.scrollY < window.innerHeight * 0.5) {
        setActiveSection("home");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = useCallback((href: string) => {
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      scrollTo(href);
    },
    [scrollTo],
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full">
        <div className="mx-auto max-w-7xl px-4 pt-3">
          <div className="relative flex h-14 items-center justify-between rounded-2xl bg-background/20 dark:bg-background/30 backdrop-blur-md border border-primary/10 px-5 shadow-lg shadow-black/3 dark:shadow-black/20">
            <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="flex items-center gap-3 group"
            >
              <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                IEEESEC
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200",
                    activeSection === item.href.slice(1)
                      ? "text-primary bg-primary/15"
                      : "text-white/70 hover:text-primary hover:bg-primary/10",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button className="h-8 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/85 transition-colors">
                Join Us
              </Button>
            </div>

            {/* Mobile actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-muted cursor-pointer"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
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
        className={`fixed inset-y-0 right-0 z-60 w-72 transform bg-card border-l border-border p-8 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                handleNavClick(e, item.href);
                toggleSidebar();
              }}
              className={cn(
                "px-4 py-3 text-base font-medium rounded-xl transition-colors",
                activeSection === item.href.slice(1)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5",
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 px-4">
            <Button className="w-full h-10 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/85 transition-colors">
              Join Us
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
