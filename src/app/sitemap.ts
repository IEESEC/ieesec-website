import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/join"].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: {
        languages: {
          el: `${SITE_URL}/el${path}`,
          en: `${SITE_URL}/en${path}`,
          "x-default": `${SITE_URL}/el${path}`,
        },
      },
    })),
  );
}
