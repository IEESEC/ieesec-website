import type { DemoScenario } from "@/features/admin/types";

export const demoScenarios: DemoScenario[] = [
  "default",
  "empty-projects",
  "empty-posts",
  "loading",
  "recoverable-error",
  "long-greek-copy",
  "incomplete-translations",
  "editor-conflict",
];

export function parseDemoScenario(value: string | string[] | undefined): DemoScenario {
  const candidate = Array.isArray(value) ? value[0] : value;
  return demoScenarios.includes(candidate as DemoScenario)
    ? (candidate as DemoScenario)
    : "default";
}
