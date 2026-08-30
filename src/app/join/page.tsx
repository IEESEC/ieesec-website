import type { Metadata } from "next";
import { JoinForm } from "@/components/sections/join/JoinForm";
import { JoinHero } from "@/components/sections/join/JoinHero";
import { ScrollVideoBackground } from "@/components/sections/join/ScrollVideoBackground";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Apply to join IEESEC, the Software Engineering student team of IHU. Your name, email, GitHub and Discord are required.",
};

export default function JoinPage() {
  return (
    <main className="relative isolate flex flex-1 flex-col bg-slate-950/10">
      <ScrollVideoBackground />
      <JoinHero />
      <JoinForm />
    </main>
  );
}
