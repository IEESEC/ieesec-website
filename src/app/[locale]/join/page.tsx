import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JoinExperience } from "@/components/sections/join/JoinExperience";
import type { Locale } from "@/i18n/routing";

type JoinPageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: JoinPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("joinTitle"),
    description: t("joinDescription"),
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
