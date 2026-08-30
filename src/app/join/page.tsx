import type { Metadata } from "next";
import { JoinExperience } from "@/components/sections/join/JoinExperience";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Apply to join IEESEC, the Software Engineering student team of IHU. Your name, email, GitHub and Discord are required.",
};

export default function JoinPage() {
  return <JoinExperience />;
}
