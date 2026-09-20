import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/animations/fade-up";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type FAQItem = {
  question: string;
  answer: ReactNode;
};

const FAQ_ITEM_KEYS = [
  "whatIs",
  "whoCanJoin",
  "previousExperience",
  "timeCommitment",
  "howToJoin",
  "whatCanIWorkOn",
  "whatHappensNext",
  "whereToFindUpdates",
] as const;

type FAQItemKey = (typeof FAQ_ITEM_KEYS)[number];

const externalLinkClassName =
  "font-semibold text-primary underline underline-offset-4 transition-colors hover:text-foreground";

export function FAQSection() {
  const t = useTranslations("sections");
  const items = FAQ_ITEM_KEYS.map((key): FAQItem & { id: FAQItemKey } => ({
    id: key,
    question: t(`faq.${key}.question`),
    answer:
      key === "howToJoin"
        ? t.rich("faq.howToJoin.answer", {
            link: (chunks) => (
              <Link href="/join" className={externalLinkClassName}>
                {chunks}
              </Link>
            ),
          })
        : key === "whereToFindUpdates"
          ? t.rich("faq.whereToFindUpdates.answer", {
              link: (chunks) => (
                <a
                  href="https://discord.gg/2xHBsHMKy7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={externalLinkClassName}
                >
                  {chunks}
                </a>
              ),
            })
          : t(`faq.${key}.answer`),
  }));

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="home-section-lazy min-h-screen w-full scroll-mt-20 pt-24 pb-16 sm:pt-32 sm:pb-20"
    >
      <div className="mx-auto w-full max-w-4xl px-6">
        <div>
          <Reveal direction="left">
            <h2
              id="faq-title"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              {t("faqTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("faqDescription")}</p>
          </Reveal>

          <Reveal direction="right" className="mt-8">
            <Accordion.Root
              type="single"
              collapsible
              aria-labelledby="faq-title"
              className="space-y-3"
            >
              {items.map((item, index) => (
                <Reveal key={item.id} direction="up" delay={index * 0.06}>
                  <Accordion.Item
                    value={item.id}
                    className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground transition-colors data-[state=open]:border-accent/60 data-[state=open]:bg-accent/5"
                  >
                    <Accordion.Header className="flex">
                      <Accordion.Trigger className="group/faq-trigger flex min-h-11 w-full items-center justify-between gap-4 px-4 py-4 text-left text-base font-semibold text-foreground outline-none transition-colors hover:text-accent focus-visible:ring-3 focus-visible:ring-ring/30 sm:px-5">
                        <span>{item.question}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className="size-5 shrink-0 transition-transform duration-200 group-data-[state=open]/faq-trigger:rotate-180"
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="faq-accordion-content overflow-hidden text-muted-foreground">
                      <p className="border-t border-border/60 px-4 pb-5 pt-4 leading-7 sm:px-5">
                        {item.answer}
                      </p>
                    </Accordion.Content>
                  </Accordion.Item>
                </Reveal>
              ))}
            </Accordion.Root>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
