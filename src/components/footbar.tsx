"use client";

import Link from "next/link";

const quickLinks = [
  { label: "Join Us", href: "/join" },
  { label: "Department", href: "https://iee.ihu.gr" },
  { label: "GitHub", href: "https://github.com/IEESEC" },
  { label: "Discord Server", href: "https://discord.gg/2xHBsHMKy7" },
];

export function Footbar() {
  return (
    <footer className="relative z-10 w-full bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        {/* Diaxoristiki grammi */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

        {/* Main Footbar Container */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Description Subcontainer */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img
                data-testid="footer-logo-black"
                src="/images/brand/ieesec-logo-black.svg"
                alt="IEESEC"
                width={366}
                height={322}
                loading="lazy"
                className="h-auto w-24 dark:hidden"
              />
              <img
                data-testid="footer-logo-white"
                src="/images/brand/ieesec-logo-white.svg"
                alt="IEESEC"
                width={366}
                height={322}
                loading="lazy"
                className="hidden h-auto w-24 dark:block"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              The Software Engineering Student Team of&nbsp;
              <Link
                href="https://iee.ihu.gr"
                className="text-primary/70 hover:text-primary transition-colors"
              >
                Informatics and Electronics Engineering Department
              </Link>
              &nbsp;at International Hellenic University.
            </p>
          </div>

          {/* Quick Links Subcontainer */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Quick Links
            </h4>
            <ul className="space-y-2.5 flex flex-col">
              {quickLinks.map((item) => (
                <Link href={item.href} key={item.label}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </ul>
          </div>

          {/* Location Subcontainer */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Location
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>International Hellenic University</li>
              <li>Sindos Campus</li>
              <li>Sindos 574 00</li>
              <li>
                <Link href="mailto:ieesec.ihu@gmail.com" className="text-primary/70">
                  ieesec.ihu@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright container */}
        <div className="mt-16 flex flex-col items-center">
          {/* Diaxoristiki grammi */}
          <div className="w-full max-w-xl h-px bg-linear-to-r from-transparent via-primary/20 to-transparent mb-8" />
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()}&nbsp;IEESEC &middot; All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
