import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getDiscordServerInfo } from "@/lib/discord";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/ui/animations/fade-up";
import { DiscordMemberCount } from "./discord-member-count";

const DISCORD_INVITE_URL = "https://discord.gg/2xHBsHMKy7";

export async function DiscordCtaSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "discordCta" });
  const { memberCount, iconUrl } = await getDiscordServerInfo();

  return (
    <section
      id="discord"
      aria-labelledby="discord-title"
      className="home-section-lazy flex min-h-[75vh] w-full flex-col scroll-mt-20 pt-24 pb-16 sm:pt-32 sm:pb-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:gap-16">
          <div className="flex flex-col items-start">
            <Reveal direction="left">
              <h2
                id="discord-title"
                className="max-w-2xl text-pretty text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl"
              >
                {t("title")}
              </h2>
            </Reveal>
          </div>

          <Reveal direction="right">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="relative h-28 overflow-hidden bg-primary/20 sm:h-36">
                <Image
                  src="/images/hero/campus2.jpg"
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-b from-primary/15 via-primary/25 to-foreground/75" />
              </div>
              <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
                <div className="-mt-10 flex items-end justify-between sm:-mt-12">
                  <div className="size-20 overflow-hidden rounded-2xl border-4 border-card shadow-md sm:size-24">
                    <Image
                      src={iconUrl ?? "/images/brand/ieesec-logo-white.svg"}
                      alt={t("communityLabel")}
                      width={366}
                      height={322}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                  {t("description")}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t("join")} (${t("externalLabel")})`}
                    className="group flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-4 sm:text-sm"
                  >
                    {t("join")}
                    <span
                      aria-hidden="true"
                      className="text-base leading-none transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                  <p className="flex shrink-0 items-baseline gap-2 font-mono text-5xl font-medium leading-none tracking-[-0.08em] text-primary tabular-nums sm:text-6xl">
                    <DiscordMemberCount locale={locale} value={memberCount} />
                    <span className="font-sans text-sm font-medium tracking-normal text-muted-foreground">
                      {t("memberCountShort")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
