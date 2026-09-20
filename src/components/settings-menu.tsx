"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Moon, Settings2, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localizePathname, type Locale } from "@/i18n/routing";

function GreekFlag() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 27 18"
      preserveAspectRatio="xMidYMid slice"
      className="size-5 overflow-hidden rounded-full ring-1 ring-foreground/15"
    >
      <rect width="27" height="18" fill="#0d5eaf" />
      <path d="M0 2h27v2H0zm0 4h27v2H0zm0 4h27v2H0zm0 4h27v2H0z" fill="#fff" />
      <rect width="10" height="10" fill="#0d5eaf" />
      <path d="M4 0h2v10H4zM0 4h10v2H0z" fill="#fff" />
    </svg>
  );
}

function BritishFlag() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 36"
      preserveAspectRatio="xMidYMid slice"
      className="size-5 overflow-hidden rounded-full ring-1 ring-foreground/15"
    >
      <rect width="60" height="36" fill="#012169" />
      <path d="M0 0 60 36M60 0 0 36" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 60 36M60 0 0 36" stroke="#c8102e" strokeWidth="4" />
      <path d="M24 0h12v36H24zM0 12h60v12H0z" fill="#fff" />
      <path d="M27 0h6v36h-6zM0 15h60v6H0z" fill="#c8102e" />
    </svg>
  );
}

export function SettingsMenu() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("controls");
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const targetLocale: Locale = locale === "el" ? "en" : "el";
  const languageLabel = targetLocale === "en" ? t("switchToEnglish") : t("switchToGreek");

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = () => {
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    router.replace(localizePathname(currentUrl, targetLocale));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("openSettings")}
          title={t("settings")}
          className="relative"
        >
          <Settings2 className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={switchLanguage}>
          {locale === "el" ? <GreekFlag /> : <BritishFlag />}
          <span>{languageLabel}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span>{t("theme")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
