"use client";

import {
  MOTION_DURATION_HOVER,
  MOTION_DURATION_STANDARD,
  MOTION_EASE_DRAWER,
} from "@/components/ui/motion";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useEffect, useEffectEvent, useRef } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import * as m from "framer-motion/m";
import { cn } from "@/lib/utils";
import { SettingsMenu } from "./settings-menu";
import { Link } from "@/i18n/navigation";
import { navbarItems, type NavbarClickHandler } from "./navbar-links";

type NavbarMobileMenuProps = {
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
  onNavClick: NavbarClickHandler;
};

export function NavbarMobileMenu({
  activeSection,
  isOpen,
  onClose,
  onNavClick,
}: NavbarMobileMenuProps) {
  const t = useTranslations("navigation");
  const reducedMotion = useReducedMotion();
  const sidebarRef = useRef<HTMLElement>(null);
  const closeFromEffect = useEffectEvent(onClose);
  const drawerTransition = {
    duration: reducedMotion ? 0 : MOTION_DURATION_STANDARD,
    ease: MOTION_EASE_DRAWER,
  };
  const fadeTransition = { duration: reducedMotion ? 0 : MOTION_DURATION_HOVER };

  useEffect(() => {
    if (!isOpen) return;
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
        closeFromEffect();
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
      if (desktop.matches) closeFromEffect();
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
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <m.button
            type="button"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
            onClick={onClose}
            aria-label={t("closeMenu")}
          />
        )}
      </AnimatePresence>

      <m.aside
        ref={sidebarRef}
        role="dialog"
        aria-modal={isOpen || undefined}
        aria-label={t("openMenu")}
        id="mobile-navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-60 flex h-dvh w-[min(18rem,calc(100vw-1rem))] flex-col overflow-y-auto overscroll-contain border-l border-border bg-card p-6 shadow-2xl sm:p-8 lg:hidden",
          isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none",
        )}
        initial={false}
        animate={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
        transition={drawerTransition}
      >
        <div className="mb-8 flex items-center">
          <m.button
            type="button"
            onClick={onClose}
            className="transition-colors duration-(--motion-duration-hover) flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            aria-label={t("closeMenu")}
          >
            <X className="h-5 w-5" />
          </m.button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1">
          {navbarItems.map((item) => (
            <Link
              key={item.sectionId}
              href={item.href}
              onClick={(event) => {
                onNavClick(event, item.sectionId);
                onClose();
              }}
              className={cn(
                "px-4 py-3 text-base font-medium rounded-xl",
                activeSection === item.sectionId
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/15",
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
          <div className="mt-6 border-y border-border py-6">
            <SettingsMenu mobile />
          </div>
          <div className="mt-auto px-4 pt-6">
            <Button
              asChild
              className="w-full h-10 rounded-full bg-primary text-white font-semibold hover:bg-primary/85"
            >
              <Link href="/join" onClick={onClose}>
                {t("join")}
              </Link>
            </Button>
          </div>
        </nav>
      </m.aside>
    </>
  );
}
