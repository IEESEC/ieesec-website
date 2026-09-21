"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Moon, Settings2, Sun } from "lucide-react";
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

type SettingsMenuProps = {
  mobile?: boolean;
};

export function SettingsMenu({ mobile = false }: SettingsMenuProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("controls");
  const { resolvedTheme, setTheme } = useTheme();
  const targetLocale: Locale = locale === "el" ? "en" : "el";
  const languageLabel = targetLocale === "en" ? t("switchToEnglish") : t("switchToGreek");

  const switchLanguage = () => {
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    router.replace(localizePathname(currentUrl, targetLocale));
  };

  const languageIcon = locale === "el" ? <GreekFlag /> : <BritishFlag />;
  const themeIcon = (
    <>
      <Sun className="hidden size-5 dark:block" />
      <Moon className="size-5 dark:hidden" />
    </>
  );

  if (mobile) {
    return (
      <section aria-labelledby="mobile-settings-heading" className="w-full">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={switchLanguage}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {languageIcon}
            <span>{languageLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {themeIcon}
            <span>{t("theme")}</span>
          </button>
        </div>
      </section>
    );
  }

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
      <DropdownMenuContent align="end" className="z-70 w-56">
        <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={switchLanguage}>
          {languageIcon}
          <span>{languageLabel}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {themeIcon}
          <span>{t("theme")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
