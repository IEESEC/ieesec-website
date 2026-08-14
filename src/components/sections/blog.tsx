import { Reveal } from "@/components/ui/animations/fade-up";
import BlogCard from "./blog/BlogCard";
import { posts } from "./blog/BlogPost";

export function BlogSection() {
  return (
    <section id="blog" className="min-h-screen w-full flex flex-col pt-32 pb-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mb-12">
          <Reveal direction="left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Blog</h1>
            {/*<p className="mt-4 text-lg text-primary/70 max-w-2xl">*/}
            {/*  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fringilla.*/}
            {/*</p>*/}
          </Reveal>

          <Reveal direction="right" className="mt-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 items-stretch">
              {posts.map((post, i) => (
                <Reveal key={post.slug} direction="up" delay={i * 0.06} className="h-full">
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
