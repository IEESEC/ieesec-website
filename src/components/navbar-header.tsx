"use client";

import { MOTION_DURATION_HOVER } from "@/components/ui/motion";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import * as m from "framer-motion/m";
import { cn } from "@/lib/utils";
import { SettingsMenu } from "./settings-menu";
import { Link } from "@/i18n/navigation";
import { navbarItems, type NavbarClickHandler } from "./navbar-links";

type NavbarHeaderProps = {
  activeSection: string;
  isMenuOpen: boolean;
  onNavClick: NavbarClickHandler;
  onOpenMenu: () => void;
};

export function NavbarHeader({
  activeSection,
  isMenuOpen,
  onNavClick,
  onOpenMenu,
}: NavbarHeaderProps) {
  const t = useTranslations("navigation");

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full max-w-full overflow-x-clip">
      <div className="mx-auto max-w-7xl px-4 pt-3">
        <div
          data-testid="navbar-surface"
          className="relative flex h-14 items-center justify-between rounded-2xl border border-foreground/15 bg-background/68 px-5 shadow-lg shadow-foreground/5 backdrop-blur-md backdrop-saturate-150 dark:border-primary/10 dark:bg-background/30 dark:shadow-lg dark:shadow-black/20 dark:backdrop-blur-md dark:backdrop-saturate-150"
        >
          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
          <Link
            href="/#home"
            onClick={(event) => onNavClick(event, "home")}
            aria-label={t("homeLabel")}
            className="group flex items-center gap-3"
          >
            <m.div whileHover={{ opacity: 0.8 }} transition={{ duration: MOTION_DURATION_HOVER }}>
              <img
                src="/images/brand/ieesec-navbar.svg"
                alt="IEESEC"
                width={178}
                height={44}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="light-theme-logo h-7 w-auto text-transparent brightness-0 dark:brightness-100"
              />
            </m.div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navbarItems.map((item) => (
              <Link
                key={item.sectionId}
                aria-current={activeSection === item.sectionId ? "location" : undefined}
                href={item.href}
                onClick={(event) => onNavClick(event, item.sectionId)}
                className={cn(
                  "px-3.5 py-1.5 text-sm font-medium rounded-lg",
                  activeSection === item.sectionId
                    ? "bg-primary text-white"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/25",
                )}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <SettingsMenu />
            <Button
              asChild
              className="h-8 rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/85"
            >
              <Link href="/join">{t("join")}</Link>
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <m.button
              type="button"
              className="transition-colors duration-(--motion-duration-hover) flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              onClick={onOpenMenu}
              aria-label={t("openMenu")}
              aria-controls="mobile-navigation"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </m.button>
          </div>
        </div>
      </div>
    </header>
  );
}
