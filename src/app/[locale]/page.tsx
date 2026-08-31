import { setRequestLocale } from "next-intl/server";
import { HeroCarousel } from "@/components/hero-carousel";
import { TeamSection } from "@/components/sections/team";
import { ProjectsSection } from "@/components/sections/projects";
import { TechStackSection } from "@/components/sections/tech-stack";
import { EventsSection } from "@/components/sections/events";
import { BlogSection } from "@/components/sections/blog";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative z-10 flex min-w-0 w-full flex-1 flex-col overflow-x-clip">
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
