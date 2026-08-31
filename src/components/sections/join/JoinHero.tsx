import { Reveal } from "@/components/ui/animations/fade-up";
import { useTranslations } from "next-intl";

export function JoinHero() {
  const t = useTranslations("join");
  return (
    <section className="relative min-h-svh w-full overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] sm:px-6 sm:pb-24 sm:pt-20">
        <Reveal direction="up">
          <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground text-balance drop-shadow-[0_2px_18px_rgb(255,255,255,0.4)] dark:text-white dark:drop-shadow-[0_2px_18px_rgb(0,0,0,0.5)] sm:text-6xl">
            {t("heroTitle")}
          </h1>

          <p className="mt-5 max-w-lg text-base text-foreground/90 leading-relaxed drop-shadow-[0_1px_10px_rgb(255,255,255,0.35)] dark:text-white/90 dark:drop-shadow-[0_1px_10px_rgb(0,0,0,0.45)] sm:text-lg">
            {t("heroDescription")}
          </p>
          <p className="mt-3 max-w-lg text-sm text-foreground/80 leading-relaxed drop-shadow-[0_1px_8px_rgb(255,255,255,0.3)] dark:text-white/80 dark:drop-shadow-[0_1px_8px_rgb(0,0,0,0.4)]">
            {t("heroDetails")}
            <br></br>
            {t("requiredNote")}
          </p>
        </Reveal>

        <a
          href="#join-application"
          className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 flex min-h-11 -translate-x-1/2 flex-col items-center justify-center gap-1 text-center text-[0.68rem] font-medium uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none dark:text-white/80 dark:hover:text-white dark:focus-visible:text-white sm:bottom-10 sm:gap-2"
        >
          <span className="whitespace-nowrap">{t("scroll")}</span>
          <span aria-hidden className="animate-bounce text-xl leading-none">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
