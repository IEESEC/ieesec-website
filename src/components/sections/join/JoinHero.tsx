import { Reveal } from "@/components/ui/animations/fade-up";

export function JoinHero() {
  return (
    <section className="relative min-h-[78svh] w-full overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-center px-6">
        <Reveal direction="up">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Applications open
          </span>

          <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Join the community that ships.
          </h1>

          <p className="mt-5 max-w-lg text-lg text-white/85 leading-relaxed">
            From curiosity to shipped projects, shared knowledge and a community that keeps moving
            with you.
          </p>
          <p className="mt-3 max-w-lg text-sm text-white/70 leading-relaxed">
            Fill in your info and we will contact you! Name and email required.
          </p>

          <div className="mt-12 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-white/65">
            <span className="h-px w-10 bg-white/40" />
            Scroll to move through campus
          </div>
        </Reveal>
      </div>
    </section>
  );
}
