import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import type { Member } from "./Member";

function SocialLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-card/90 text-card-foreground shadow-sm backdrop-blur-sm transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transform-none"
    >
      {children}
    </a>
  );
}

export default function MemberCard({ member }: { member: Member }) {
  const fullName = `${member.firstname} ${member.lastname}`;
  const nameParts = fullName.split(/\s+/);
  const [role, specialization = ""] = member.role.split("|").map((value) => value.trim());
  const specializationLabel = specialization.replace(/\s+developer$/i, "");

  return (
    <Card className="group relative isolate mx-auto h-full w-full max-w-sm gap-0 overflow-hidden rounded-3xl border border-border/80 bg-card p-0 shadow-sm transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 focus-within:border-primary/50 motion-reduce:transform-none">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={member.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 384px, 100vw"
          className="object-cover grayscale-[15%] contrast-[1.04] transition-[filter] duration-700 ease-out group-hover:grayscale-0 motion-reduce:transition-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-70"
        />
        <div className="absolute right-4 bottom-4 z-10 flex gap-2">
          <SocialLink href={member.socialLinks.linkedIn} label={`${fullName} on LinkedIn`}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V7h4v2" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </SocialLink>

          <SocialLink href={member.socialLinks.github} label={`${fullName} on GitHub`}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4" />
              <path d="M8 19c-3 .9-3-1.5-4-2" />
            </svg>
          </SocialLink>

          <SocialLink href={member.socialLinks.twitter} label={`${fullName} on Twitter`}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.06 9.06 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.5 0c-2.5 0-4.5 2.28-4.5 5.08 0 .4.05.8.14 1.18C8.2 6.05 4.3 4.13 1.67 1.15c-.44.75-.7 1.62-.7 2.55 0 1.76.96 3.31 2.42 4.22A4.48 4.48 0 0 1 .9 7v.06c0 2.46 1.66 4.51 3.86 4.98-.4.1-.82.15-1.25.15-.3 0-.6-.03-.88-.09.6 2.08 2.38 3.6 4.48 3.64A9.07 9.07 0 0 1 0 19.54 12.8 12.8 0 0 0 6.92 21c8.3 0 12.84-7.2 12.84-13.44v-.61A9.2 9.2 0 0 0 23 3z" />
            </svg>
          </SocialLink>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
        <span
          aria-hidden="true"
          className="absolute left-5 top-0 h-0.5 w-12 bg-primary transition-[width] duration-500 group-hover:w-20"
        />

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3">
          <h2 className="min-w-0 text-xl font-semibold leading-tight tracking-tight text-foreground">
            {nameParts.map((part, index) => (
              <Fragment key={`${part}-${index}`}>
                {part}
                {index < nameParts.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </h2>
          <p className="whitespace-nowrap text-right text-sm font-medium tracking-wide text-muted-foreground">
            {role}
          </p>
        </div>
        {specializationLabel ? (
          <span className="mt-2.5 inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
            {specializationLabel}
          </span>
        ) : null}
        <p className="mt-3 text-sm leading-5 text-muted-foreground">{member.bio}</p>
      </div>
    </Card>
  );
}
