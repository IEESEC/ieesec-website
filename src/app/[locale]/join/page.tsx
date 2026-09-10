import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JoinExperience } from "@/components/sections/join/JoinExperience";
import type { Locale } from "@/i18n/routing";
import { SITE_URL, SOCIAL_IMAGE } from "@/lib/seo";

type JoinPageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: JoinPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("joinTitle"),
    description: t("joinDescription"),
    openGraph: {
      type: "website",
      siteName: "IEESEC",
      title: `${t("joinTitle")} | IEESEC`,
      description: t("joinDescription"),
      url: `${SITE_URL}/${locale}/join`,
      locale: locale === "el" ? "el_GR" : "en_GB",
      alternateLocale: [locale === "el" ? "en_GB" : "el_GR"],
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("joinTitle")} | IEESEC`,
      description: t("joinDescription"),
      images: [SOCIAL_IMAGE.url],
    },
    alternates: {
      canonical: `/${locale}/join`,
      languages: { el: "/el/join", en: "/en/join", "x-default": "/el/join" },
    },
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <JoinExperience />;
}
