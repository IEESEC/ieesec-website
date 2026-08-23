import type { Metadata } from "next";
import { JoinForm } from "@/components/sections/join/JoinForm";
import { JoinHero } from "@/components/sections/join/JoinHero";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Apply to join IEESEC, the Software Engineering student team of IHU. Only your name and email are required — everything else is optional.",
};

export default function JoinPage() {
  return (
    <main className="relative z-10 flex flex-col flex-1">
      <JoinHero />
      <JoinForm />
    </main>
  );
}
