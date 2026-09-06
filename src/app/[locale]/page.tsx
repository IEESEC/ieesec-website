import { setRequestLocale } from "next-intl/server";
import { HeroCarousel } from "@/components/hero-carousel";
import { TeamSection } from "@/components/sections/team";
import { ProjectsSection } from "@/components/sections/projects";
import { TechStackSection } from "@/components/sections/tech-stack";
import { EventsSection } from "@/components/sections/events";
import { BlogSection } from "@/components/sections/blog";
import type { Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative z-10 flex min-w-0 w-full flex-1 flex-col overflow-x-clip"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "IEESEC",
            url: SITE_URL,
            logo: `${SITE_URL}/images/brand/ieesec-logo-black.svg`,
            email: "ieesec.ihu@gmail.com",
            sameAs: ["https://github.com/IEESEC"],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div id="home">
        <HeroCarousel />
      </div>
      <TeamSection />
      <ProjectsSection />
      <TechStackSection />
      <EventsSection />
      <BlogSection />
    </main>
  );
}
