import { Reveal } from "@/components/ui/animations/fade-up";
import MemberCard from "./team/MemberCard";
import { members } from "./team/Member";

export function TeamSection() {
  return (
    <section id="team" className="min-h-screen w-full flex flex-col pt-32 pb-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mb-12">
          <Reveal direction="left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Meet our Team
            </h1>
            <p className="mt-4 text-lg text-primary/70 max-w-2xl">
              Engineering with purpose. Building as one.
            </p>
          </Reveal>
          {/*Required revealing of the members section*/}
          <Reveal direction="right" className="mt-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 items-stretch">
              {/*Dedicated member reveal with a delay for each member to create a staggered animation effect*/}
              {members.map((member, i) => (
                <Reveal
                  key={member.firstname + member.lastname}
                  direction="up"
                  delay={i * 0.06}
                  className="h-full"
                >
                  <MemberCard member={member} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
