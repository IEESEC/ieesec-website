"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const quickLinks = [
  { labelKey: "join", href: "/join" },
  { labelKey: "departmentLink", href: "https://iee.ihu.gr" },
  { labelKey: "github", href: "https://github.com/IEESEC" },
  { labelKey: "discord", href: "https://discord.gg/2xHBsHMKy7" },
] as const;

export function Footbar() {
  const t = useTranslations("footer");
  return (
    <footer className="relative z-10 w-full bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        {/* Diaxoristiki grammi */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

        {/* Main Footbar Container */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Description Subcontainer */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img
                data-testid="footer-logo-black"
                src="/images/brand/ieesec-logo-black.svg"
                alt="IEESEC"
                width={366}
                height={322}
                loading="lazy"
                className="h-auto w-24 dark:hidden"
              />
              <img
                data-testid="footer-logo-white"
                src="/images/brand/ieesec-logo-white.svg"
                alt="IEESEC"
                width={366}
                height={322}
                loading="lazy"
                className="hidden h-auto w-24 dark:block"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {t("descriptionStart")}&nbsp;
              <Link
                href="https://iee.ihu.gr"
                className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {t("department")}
              </Link>
              &nbsp;{t("descriptionEnd")}
            </p>
          </div>

          {/* Quick Links Subcontainer */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2.5 flex flex-col">
              {quickLinks.map((item) => (
                <Link href={item.href} key={item.labelKey}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.labelKey === "github" ? "GitHub" : t(item.labelKey)}
                  </span>
                </Link>
              ))}
            </ul>
          </div>

          {/* Location Subcontainer */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("location")}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>{t("university")}</li>
              <li>{t("campus")}</li>
              <li>{t("city")}</li>
              <li>
                <Link href="mailto:ieesec.ihu@gmail.com" className="font-medium text-foreground">
                  ieesec.ihu@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright container */}
        <div className="mt-16 flex flex-col items-center">
          {/* Diaxoristiki grammi */}
          <div className="w-full max-w-xl h-px bg-linear-to-r from-transparent via-primary/20 to-transparent mb-8" />
          <p className="text-xs text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
