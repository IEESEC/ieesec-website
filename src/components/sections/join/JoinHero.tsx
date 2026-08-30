import { Reveal } from "@/components/ui/animations/fade-up";

export function JoinHero() {
  return (
    <section className="relative min-h-svh w-full overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] sm:px-6 sm:pb-24 sm:pt-20">
        <Reveal direction="up">
          <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-white text-balance sm:text-6xl">
            Join our community!
          </h1>

          <p className="mt-5 max-w-lg text-base text-white/90 leading-relaxed sm:text-lg">
            From curiosity to shipped projects, shared knowledge and a community that keeps moving
            with you.
          </p>
          <p className="mt-3 max-w-lg text-sm text-white/80 leading-relaxed">
            Fill in your info and we will contact you!
            <br></br>
            Required fields are marked as you go.
          </p>
        </Reveal>

        <a
          href="#join-application"
          className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 flex min-h-11 -translate-x-1/2 flex-col items-center justify-center gap-1 text-center text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/80 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none sm:bottom-10 sm:gap-2"
        >
          <span className="whitespace-nowrap">Scroll to get started</span>
          <span aria-hidden className="animate-bounce text-xl leading-none">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
