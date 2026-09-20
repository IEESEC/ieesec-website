import type { Metadata } from "next";
import { SettingsPanel } from "@/features/settings/settings-panel";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <SettingsPanel />;
}
