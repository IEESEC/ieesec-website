import Image from "next/image";
import { Reveal } from "@/components/ui/animations/fade-up";

export function JoinHero() {
  return (
    <section className="relative w-full h-[520px] sm:h-[600px] overflow-hidden">
      <Image
        src="/images/hero/campus1.jpg"
        alt="International Hellenic University, Alexandria Campus"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 hero-overlay opacity-60" />
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-0 hero-fade" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
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
        </Reveal>
      </div>
    </section>
  );
}
