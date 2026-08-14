import { Reveal } from "@/components/ui/animations/fade-up";

export function BlogSection() {
  return (
    <section id="blog" className="min-h-screen w-full flex flex-col pt-32 pb-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mb-12">
          <Reveal direction="left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Blog</h1>
            <p className="mt-4 text-lg text-primary/70 max-w-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fringilla.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
