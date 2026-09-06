import { Reveal } from "@/components/ui/animations/fade-up";
import MemberCard from "./team/MemberCard";
import { members } from "./team/Member";
import { useTranslations } from "next-intl";

export function TeamSection() {
  const t = useTranslations("sections");
  return (
    <section
      id="team"
      className="min-h-screen w-full flex flex-col pt-24 pb-16 sm:pt-32 sm:pb-20 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mb-12">
          <Reveal direction="left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("teamTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("teamDescription")}</p>
          </Reveal>
          {/*Required revealing of the members section*/}
          <Reveal direction="right" className="mt-8">
            <div className="mr-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
              {" "}
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
