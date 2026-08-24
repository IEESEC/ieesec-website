import { Reveal } from "@/components/ui/animations/fade-up";

export function JoinHero() {
  return (
    <section className="relative min-h-svh w-full overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-6 pb-24 pt-20">
        <Reveal direction="up">
          <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Join our community!
          </h1>

          <p className="mt-5 max-w-lg text-lg text-white/85 leading-relaxed">
            From curiosity to shipped projects, shared knowledge and a community that keeps moving
            with you.
          </p>
          <p className="mt-3 max-w-lg text-sm text-white/70 leading-relaxed">
            Fill in your info and we will contact you!
            <br></br>
            Name and email required.
          </p>
        </Reveal>

        <a
          href="#join-application"
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-center text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none sm:bottom-10"
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
