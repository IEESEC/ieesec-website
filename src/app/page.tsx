import { HeroCarousel } from "@/components/hero-carousel";
import { TeamSection } from "@/components/sections/team";
import { ProjectsSection } from "@/components/sections/projects";
import { EventsSection } from "@/components/sections/events";
import { BlogSection } from "@/components/sections/blog";

export default function HomePage() {
  return (
    <main className="relative z-10 flex flex-col flex-1">
      {/* Home Section (Hero) */}
      <div id="home">
        <HeroCarousel />
      </div>

      <TeamSection />
      <ProjectsSection />
      <EventsSection />
      <BlogSection />
    </main>
  );
}
