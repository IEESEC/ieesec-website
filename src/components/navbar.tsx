"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "@/i18n/navigation";
import { NavbarHeader } from "./navbar-header";
import { NavbarMobileMenu } from "./navbar-mobile-menu";
import { navbarItems, type NavbarClickHandler } from "./navbar-links";

export function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const getActiveSectionFromHash = () => {
      const sectionId = window.location.hash.slice(1);
      return navbarItems.some((item) => item.sectionId === sectionId) ? sectionId : "home";
    };

    setActiveSection(getActiveSectionFromHash());

    const sectionIds = navbarItems.map((item) => item.sectionId);
    const syncActiveSection = (id: string) => {
      setActiveSection(id);

      const nextHash = `#${id}`;
      if (window.location.hash === nextHash) return;

      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${nextHash}`,
      );
    };

    const sectionByElement = new Map<Element, string>();
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const id = sectionByElement.get(entry.target);
          if (entry.isIntersecting && id) syncActiveSection(id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      sectionByElement.set(element, id);
      observer.observe(element);
    });

    const handleScroll = () => {
      if (window.scrollY < window.innerHeight * 0.5) syncActiveSection("home");
    };
    const handleHashChange = () => setActiveSection(getActiveSectionFromHash());

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
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
      document.getElementById(sectionId)?.scrollIntoView({ behavior });
    }
  }, []);

  const handleNavClick = useCallback<NavbarClickHandler>(
    (event, sectionId) => {
      // Let the root hash URL navigate from secondary pages such as /join.
      if (
        pathname !== "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, "", `#${sectionId}`);
      setActiveSection(sectionId);
      scrollTo(sectionId);
    },
    [pathname, scrollTo],
  );

  return (
    <>
      <NavbarHeader
        activeSection={activeSection}
        isMenuOpen={isSidebarOpen}
        onNavClick={handleNavClick}
        onOpenMenu={openSidebar}
      />
      <NavbarMobileMenu
        activeSection={activeSection}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onNavClick={handleNavClick}
      />
    </>
  );
}
