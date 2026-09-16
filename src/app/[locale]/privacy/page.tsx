import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SITE_URL, SOCIAL_IMAGE } from "@/lib/seo";

type PrivacyPageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("title"),
    description: t("summary"),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { el: "/el/privacy", en: "/en/privacy", "x-default": "/el/privacy" },
    },
    openGraph: {
      type: "website",
      siteName: "IEESEC",
      title: `${t("title")} | IEESEC`,
      description: t("summary"),
      url: `${SITE_URL}/${locale}/privacy`,
      locale: locale === "el" ? "el_GR" : "en_GB",
      alternateLocale: [locale === "el" ? "en_GB" : "el_GR"],
      images: [SOCIAL_IMAGE],
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const collectedData = t.raw("data.items") as string[];

  return (
    <main id="main-content" tabIndex={-1} className="w-full flex-1 bg-background pt-28 pb-20">
      <article className="mx-auto max-w-3xl px-6">
        <header className="border-b border-border pb-8">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{t("summary")}</p>
          <p className="mt-4 text-sm text-muted-foreground">{t("lastUpdated")}</p>
        </header>

        <div className="space-y-10 pt-10 text-base leading-7 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold">{t("controller.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("controller.body")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">{t("data.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("data.body")}</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {collectedData.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {(["purpose", "processing", "access", "retention", "rights", "security"] as const).map(
            (section) => (
              <section key={section}>
                <h2 className="text-2xl font-semibold">{t(`${section}.title`)}</h2>
                <p className="mt-3 text-muted-foreground">{t(`${section}.body`)}</p>
              </section>
            ),
          )}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-2xl font-semibold">{t("contact.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("contact.body")}</p>
            <a
              href="mailto:ieesec.ihu@gmail.com"
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              ieesec.ihu@gmail.com
            </a>
          </section>
        </div>

        <nav
          className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8"
          aria-label={t("navigationLabel")}
        >
          <Link className="font-semibold text-primary underline underline-offset-4" href="/join">
            {t("backToJoin")}
          </Link>
          <Link className="font-semibold text-primary underline underline-offset-4" href="/">
            {t("backToHome")}
          </Link>
        </nav>
      </article>
    </main>
  );
}
