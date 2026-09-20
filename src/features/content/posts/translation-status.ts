import type { Post, TranslationStatus } from "@/features/admin/types";

const fieldsByLocale = {
  el: ["titleEl", "slugEl", "excerptEl", "bodyEl"],
  en: ["titleEn", "slugEn", "excerptEn", "bodyEn"],
} as const satisfies Record<string, readonly (keyof Post)[]>;

export function getPostTranslationStatus(post: Post): TranslationStatus {
  const localeCompleteness = Object.values(fieldsByLocale).map(
    (fields) => fields.filter((field) => String(post[field]).trim().length > 0).length,
  );

  if (localeCompleteness.some((count) => count === 0)) return "MISSING";
  if (localeCompleteness.some((count) => count < 4)) return "INCOMPLETE";
  return "READY";
}
