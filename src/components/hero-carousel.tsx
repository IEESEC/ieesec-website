"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type HeroSlide = {
  image: string;
  altKey: "campus1" | "campus2" | "campus3";
};

const slides: HeroSlide[] = [
  {
    image: "/images/hero/campus3.jpg",
    altKey: "campus3",
  },
  {
    image: "/images/hero/campus2.jpg",
    altKey: "campus2",
  },
  {
    image: "/images/hero/campus1.jpg",
    altKey: "campus1",
  },
];

function TypingHeadline() {
  const t = useTranslations("hero");
  return (
    <h1
      aria-label={t("headlineLabel")}
      className="max-w-4xl text-balance font-[var(--font-geist-sans)] text-[clamp(1.8rem,9.8vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-foreground drop-shadow-[0_8px_30px_rgb(255,255,255,0.35)] dark:text-white dark:drop-shadow-[0_8px_30px_rgb(0,0,0,0.5)] sm:text-7xl lg:text-8xl"
    >
      <span aria-hidden="true" className="hero-typewriter block">
        <span className="hero-typewriter-line" data-text={t("line1")}>
          <span className="hero-typewriter-reveal">{t("line1")}</span>
          <span aria-hidden="true" className="hero-typewriter-caret" />
        </span>
        <span className="hero-typewriter-line" data-text={`${t("line2Start")} ${t("line2Accent")}`}>
          <span className="hero-typewriter-reveal">
            {t("line2Start")} <span className="text-primary">{t("line2Accent")}</span>
          </span>
          <span aria-hidden="true" className="hero-typewriter-caret" />
        </span>
        <span className="hero-typewriter-line text-primary" data-text={t("line3")}>
          <span className="hero-typewriter-reveal">{t("line3")}</span>
          <span aria-hidden="true" className="hero-typewriter-caret" />
        </span>
      </span>
    </h1>
  );
}

export function HeroCarousel() {
  const t = useTranslations("hero");
  const controls = useTranslations("controls");
  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 5000,
      playOnInit: false,
      stopOnFocusIn: true,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplayPlugin.current]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isAutoplaying, setIsAutoplaying] = React.useState(true);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = React.useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
  const toggleAutoplay = React.useCallback(() => {
    if (!emblaApi) return;

    if (autoplayPlugin.current.isPlaying()) {
      autoplayPlugin.current.stop();
      setIsAutoplaying(false);
      return;
    }

    autoplayPlugin.current.play();
    setIsAutoplaying(true);
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopForReducedMotion = () => {
      if (reducedMotion.matches) autoplayPlugin.current.stop();
    };
    stopForReducedMotion();
    if (!reducedMotion.matches) autoplayPlugin.current.play();
    reducedMotion.addEventListener("change", stopForReducedMotion);

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onAutoplayPlay = () => setIsAutoplaying(true);
    const onAutoplayStop = () => setIsAutoplaying(false);

    emblaApi.on("select", onSelect);
    emblaApi.on("autoplay:play", onAutoplayPlay);
    emblaApi.on("autoplay:stop", onAutoplayStop);
    onSelect();
    setIsAutoplaying(autoplayPlugin.current.isPlaying());

    return () => {
      reducedMotion.removeEventListener("change", stopForReducedMotion);
      emblaApi.off("select", onSelect);
      emblaApi.off("autoplay:play", onAutoplayPlay);
      emblaApi.off("autoplay:stop", onAutoplayStop);
    };
  }, [emblaApi]);

  return (
    <section
      aria-label={t("regionLabel")}
      aria-roledescription="carousel"
      className="hero-carousel relative isolate min-h-dvh w-full min-w-0 max-w-full overflow-hidden"
      role="region"
    >
      <div ref={emblaRef} className="min-h-dvh w-full overflow-hidden">
        <div className="flex min-h-dvh touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={slide.image}
              aria-hidden={selectedIndex !== index}
              aria-label={t("slide", { current: index + 1, total: slides.length })}
              aria-roledescription="slide"
              className="relative min-h-dvh min-w-0 shrink-0 grow-0 basis-full"
              role="group"
            >
              {/* Background image */}
              <Image
                src={slide.image}
                alt={t(`images.${slide.altKey}`)}
                fill
                className="object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="100vw"
              />

              {/* Overlays for readability */}
              <div className="absolute inset-0 hero-overlay opacity-60" />
              <div className="absolute inset-0 hero-vignette" />
              <div className="absolute inset-0 hero-content-wash" />
              <div data-testid="hero-fade" className="absolute inset-0 hero-fade" />
            </div>
          ))}
        </div>
      </div>

      {/* Fixed onboarding message while the background images autoplay */}
      <div className="hero-content pointer-events-none absolute inset-0 z-10 flex items-center md:block">
        <div className="mx-auto min-w-0 w-full max-w-7xl px-5 sm:px-10 md:absolute md:inset-x-0 md:bottom-0 md:pb-32 md:pt-32 lg:px-12 lg:pb-36">
          <div className="pointer-events-auto max-w-3xl">
            <TypingHeadline />
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground/80 drop-shadow-[0_2px_10px_rgb(255,255,255,0.35)] dark:text-white/80 dark:drop-shadow-[0_2px_10px_rgb(0,0,0,0.5)] sm:text-lg">
              {t("description")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4">
              <a
                href="#projects"
                className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-accent/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {t("projectsCta")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#team"
                className="group inline-flex min-h-11 items-center gap-2 py-2 text-sm font-semibold text-foreground/85 transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground dark:text-white/85 dark:hover:text-white dark:focus-visible:outline-white"
              >
                {t("teamCta")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      <div className="absolute inset-x-4 bottom-6 z-20 flex min-w-0 items-center justify-center sm:bottom-8 sm:left-auto sm:right-10 sm:w-[min(32rem,calc(100%-3rem))] sm:justify-end">
        <div className="flex max-w-full items-center gap-1 rounded-full border border-foreground/15 bg-background/65 p-1 pl-2 text-foreground shadow-sm backdrop-blur-sm sm:gap-3 sm:p-1.5 sm:pl-4 dark:border-white/15 dark:bg-black/20 dark:text-white dark:shadow-none dark:backdrop-blur-md">
          <span
            className="hidden min-w-12 text-xs font-semibold tabular-nums text-foreground/70 sm:inline dark:text-white/75"
            aria-hidden="true"
          >
            {String(selectedIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <div
            className="flex items-center gap-0.5 sm:gap-1.5"
            aria-label={t("chooseImage")}
            role="group"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                aria-current={selectedIndex === index ? "true" : undefined}
                aria-label={t("showSlide", { number: index + 1 })}
                onClick={() => scrollTo(index)}
                className="group flex h-11 w-11 items-center justify-center rounded-full px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:focus-visible:outline-white"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-[width,background-color] duration-300",
                    selectedIndex === index
                      ? "w-6 bg-primary"
                      : "w-3 bg-foreground/25 group-hover:bg-foreground/50 dark:bg-white/30 dark:group-hover:bg-white/60",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="ml-0.5 flex items-center gap-0.5 border-l border-foreground/15 pl-0.5 sm:ml-1 sm:gap-1 sm:pl-1 dark:border-white/15">
            <button
              aria-label={controls("previousSlide")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground/70 transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground  dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:outline-white"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label={isAutoplaying ? t("pause") : t("play")}
              aria-pressed={isAutoplaying}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors duration-200 hover:bg-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground  dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus-visible:outline-white"
              onClick={toggleAutoplay}
            >
              {isAutoplaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="ml-0.5 h-3.5 w-3.5" />
              )}
            </button>
            <button
              aria-label={controls("nextSlide")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground/70 transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground  dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:outline-white"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
