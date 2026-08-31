"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { localizePathname, type Locale } from "@/i18n/routing";

function GreekFlag() {
  return (
    <svg aria-hidden="true" viewBox="0 0 27 18" className="h-[15px] w-[22px] rounded-[2px]">
      <rect width="27" height="18" fill="#0d5eaf" />
      <path d="M0 2h27v2H0zm0 4h27v2H0zm0 4h27v2H0zm0 4h27v2H0z" fill="#fff" />
      <rect width="10" height="10" fill="#0d5eaf" />
      <path d="M4 0h2v10H4zM0 4h10v2H0z" fill="#fff" />
    </svg>
  );
}

function BritishFlag() {
  return (
    <svg aria-hidden="true" viewBox="0 0 60 36" className="h-[15px] w-[22px] rounded-[2px]">
      <rect width="60" height="36" fill="#012169" />
      <path d="M0 0 60 36M60 0 0 36" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 60 36M60 0 0 36" stroke="#c8102e" strokeWidth="4" />
      <path d="M24 0h12v36H24zM0 12h60v12H0z" fill="#fff" />
      <path d="M27 0h6v36h-6zM0 15h60v6H0z" fill="#c8102e" />
    </svg>
  );
}

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("controls");
  const targetLocale: Locale = locale === "el" ? "en" : "el";
  const label = targetLocale === "en" ? t("switchToEnglish") : t("switchToGreek");

  const switchLanguage = () => {
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    router.replace(localizePathname(currentUrl, targetLocale));
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={switchLanguage}
      aria-label={label}
      title={label}
      data-language-icon={locale}
      className="relative"
    >
      {locale === "el" ? <GreekFlag /> : <BritishFlag />}
    </Button>
  );
}
