import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footbar } from "@/components/footbar";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin", "greek"], variable: "--font-inter" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "metadata" });
  const baseUrl = SITE_URL;

  return {
    metadataBase: new URL(baseUrl),
    title: { default: t("title"), template: `%s | IEESEC` },
    description: t("description"),
    keywords: [
      "IEESEC",
      "Software Engineering",
      "Μηχανικών Πληροφορικής",
      "IHU",
      "ΔΙΠΑΕ",
      "Student Community",
      "Open Source",
      "Thessaloniki",
      "Sindos",
    ],
    authors: [{ name: "IEESEC Team" }],
    creator: "IEESEC",
    icons: { icon: "/images/ico/favicon.ico" },
    alternates: {
      canonical: `/${locale}`,
      languages: { el: "/el", en: "/en", "x-default": "/el" },
    },
    openGraph: {
      type: "website",
      locale: locale === "el" ? "el_GR" : "en_GB",
      alternateLocale: locale === "el" ? ["en_GB"] : ["el_GR"],
      url: `${baseUrl}/${locale}`,
      siteName: "IEESEC",
      title: t("title"),
      description: t("description"),
      images: [{ url: "/images/metadata/og-image.png", width: 1200, height: 630, alt: "IEESEC" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/images/metadata/og-image.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        geistMono.variable,
        geistSans.variable,
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Athens">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <a href="#main-content" className="skip-link">
              {locale === "el" ? "Μετάβαση στο περιεχόμενο" : "Skip to content"}
            </a>
            <Navbar />
            {children}
            <Footbar />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
