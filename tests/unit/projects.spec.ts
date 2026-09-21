import { expect, test } from "@playwright/test";
import { projects } from "@/components/sections/projects/data";

test("project placeholders have complete display data", () => {
  expect(projects).toHaveLength(3);
  expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
  expect(
    projects.every((project) => project.image && project.techStack.length > 0 && project.githubUrl),
  ).toBe(true);
});
