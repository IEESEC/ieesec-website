"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bold,
  Check,
  CheckCircle2,
  Code2,
  Eye,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RotateCcw,
  Save,
  Send,
  Strikethrough,
  Underline,
  Undo2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ComponentType, type SVGProps } from "react";
import { Button } from "@/components/ui/button";
import { useDemoRole } from "@/features/admin-shell/admin-shell";
import type { MediaAsset, Post, PostStatus, User } from "@/features/admin/types";
import { getPostTranslationStatus } from "@/features/content/posts/translation-status";
import { cn } from "@/lib/utils";

type LocaleCode = "el" | "en";
type LocalizedField = "title" | "slug" | "excerpt" | "body";
type EditorIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
type SaveState = "saved" | "saving" | "unsaved";

const localeLabels: Record<LocaleCode, { label: string; language: string }> = {
  el: { label: "EL", language: "Ελληνικά" },
  en: { label: "EN", language: "English" },
};

const localizedKeys: Record<LocaleCode, Record<LocalizedField, keyof Post>> = {
  el: { title: "titleEl", slug: "slugEl", excerpt: "excerptEl", body: "bodyEl" },
  en: { title: "titleEn", slug: "slugEn", excerpt: "excerptEn", body: "bodyEn" },
};

const statusLabels: Record<PostStatus, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  APPROVED: "Approved",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

function sanitizeEditorHtml(html: string) {
  if (typeof window === "undefined") return html;
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(html, "text/html");
  const allowedTags = new Set([
    "P",
    "BR",
    "STRONG",
    "B",
    "EM",
    "I",
    "U",
    "S",
    "H2",
    "H3",
    "BLOCKQUOTE",
    "UL",
    "OL",
    "LI",
    "A",
    "CODE",
    "HR",
  ]);

  [...documentNode.body.querySelectorAll("*")].forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...element.childNodes);
      return;
    }
    [...element.attributes].forEach((attribute) => {
      const keepSafeLink =
        element.tagName === "A" &&
        attribute.name === "href" &&
        /^(https?:\/\/|mailto:|\/)/i.test(attribute.value);
      if (!keepSafeLink) element.removeAttribute(attribute.name);
    });
    if (element.tagName === "A") {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noreferrer");
    }
  });
  return documentNode.body.innerHTML;
}

function textFromHtml(html: string) {
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, " ");
  const node = document.createElement("div");
  node.innerHTML = sanitizeEditorHtml(html);
  return node.textContent ?? "";
}

function ToolbarButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: EditorIcon;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title={label}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="shrink-0 rounded-md text-muted-foreground"
    >
      <Icon size={15} />
    </Button>
  );
}

function InspectorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border px-4 py-5 last:border-b-0">
      <h2 className="text-xs font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function PostEditor({
  initialPost,
  members,
  media,
}: {
  initialPost: Post;
  members: User[];
  media: MediaAsset[];
}) {
  const role = useDemoRole();
  const [post, setPost] = useState(initialPost);
  const [locale, setLocale] = useState<LocaleCode>("el");
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [conflictVisible, setConflictVisible] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const storageKey = `ieesec-post-draft:${initialPost.id}:v1`;
  const activeKeys = localizedKeys[locale];
  const activeTitle = String(post[activeKeys.title]);
  const activeSlug = String(post[activeKeys.slug]);
  const activeExcerpt = String(post[activeKeys.excerpt]);
  const activeBody = String(post[activeKeys.body]);
  const translationStatus = getPostTranslationStatus(post);
  const selectedMedia = media.find((asset) => asset.id === post.heroMediaId) ?? null;
  const author = members.find((member) => member.id === post.authorId);
  const reviewer = members.find((member) => member.id === post.reviewerId);
  const canEdit = role === "ADMIN" || role === "CONTENT_EDITOR";
  const canReview = role === "ADMIN" || role === "CONTENT_REVIEWER";

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const saved = JSON.parse(stored) as Partial<Post>;
        setPost({
          ...initialPost,
          ...saved,
          id: initialPost.id,
          bodyEl: sanitizeEditorHtml(String(saved.bodyEl ?? initialPost.bodyEl)),
          bodyEn: sanitizeEditorHtml(String(saved.bodyEn ?? initialPost.bodyEn)),
          tags: Array.isArray(saved.tags) ? saved.tags.map(String).slice(0, 8) : initialPost.tags,
        });
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setConflictVisible(
      new URLSearchParams(window.location.search).get("scenario") === "editor-conflict",
    );
  }, [initialPost, storageKey]);

  useEffect(() => {
    if (!editorRef.current) return;
    const safeBody = sanitizeEditorHtml(activeBody);
    if (editorRef.current.innerHTML !== safeBody) editorRef.current.innerHTML = safeBody;
  }, [activeBody, locale]);

  const wordCount = useMemo(() => {
    const plain = textFromHtml(activeBody).trim();
    return plain ? plain.split(/\s+/).length : 0;
  }, [activeBody]);

  function updateField(field: LocalizedField, value: string) {
    setPost((current) => ({ ...current, [localizedKeys[locale][field]]: value }));
    setSaveState("unsaved");
  }

  function updatePost(values: Partial<Post>) {
    setPost((current) => ({ ...current, ...values }));
    setSaveState("unsaved");
  }

  function syncEditorValue() {
    if (!editorRef.current) return;
    updateField("body", editorRef.current.innerHTML);
  }

  function runCommand(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditorValue();
  }

  function insertLink() {
    const href = window.prompt("Paste a secure link beginning with https://, mailto: or /");
    if (!href || !/^(https?:\/\/|mailto:|\/)/i.test(href)) return;
    runCommand("createLink", href);
  }

  function saveDraft(nextStatus?: PostStatus) {
    if (!canEdit && !canReview) return;
    setSaveState("saving");
    const safePost = {
      ...post,
      status: nextStatus ?? post.status,
      bodyEl: sanitizeEditorHtml(post.bodyEl),
      bodyEn: sanitizeEditorHtml(post.bodyEn),
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(storageKey, JSON.stringify(safePost));
    setPost(safePost);
    window.setTimeout(() => {
      setSaveState("saved");
      setSavedAt(
        new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      );
    }, 240);
  }

  function resetLocalDraft() {
    window.localStorage.removeItem(storageKey);
    setPost(initialPost);
    setSaveState("saved");
    setSavedAt(null);
  }

  const localeProgress = (targetLocale: LocaleCode) => {
    const keys = localizedKeys[targetLocale];
    const values = [post[keys.title], post[keys.slug], post[keys.excerpt], post[keys.body]];
    return Math.round(
      (values.filter((value) => String(value).trim()).length / values.length) * 100,
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/25">
      {conflictVisible ? (
        <div className="border-b border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 sm:px-6 lg:px-7">
          <div className="mx-auto flex max-w-[92rem] items-start justify-between gap-4">
            <p>
              <strong>Another draft is newer.</strong> This prototype keeps your local version;
              review before saving.
            </p>
            <button
              type="button"
              aria-label="Dismiss conflict notice"
              onClick={() => setConflictVisible(false)}
              className="rounded p-1 hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ) : null}

      <div className="sticky top-16 z-20 border-b border-border bg-card/95 px-4 backdrop-blur-md sm:px-6 lg:px-7">
        <div className="mx-auto flex min-h-16 max-w-[92rem] flex-wrap items-center gap-3 py-2">
          <Link
            href="/admin/content/posts"
            aria-label="Back to posts"
            className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold">
                {activeTitle || "Untitled post"}
              </span>
              <span className="hidden rounded-md border border-border bg-muted px-2 py-0.5 text-[0.62rem] font-semibold text-muted-foreground sm:inline-flex">
                {statusLabels[post.status]}
              </span>
            </div>
            <p className="mt-0.5 text-[0.66rem] text-muted-foreground">
              {saveState === "saving"
                ? "Saving locally..."
                : saveState === "unsaved"
                  ? "Unsaved changes"
                  : savedAt
                    ? `Saved at ${savedAt}`
                    : "All changes saved"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Preview post"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-semibold hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Eye size={15} /> <span className="hidden sm:inline">Preview</span>
          </button>
          {canEdit ? (
            <button
              type="button"
              aria-label="Save draft"
              onClick={() => saveDraft()}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-semibold hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Save size={15} /> <span className="hidden sm:inline">Save draft</span>
            </button>
          ) : null}
          {canEdit ? (
            <button
              type="button"
              aria-label="Submit post for review"
              onClick={() => saveDraft("IN_REVIEW")}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Send size={15} /> <span className="hidden sm:inline">Submit for review</span>
            </button>
          ) : null}
          {canReview ? (
            <button
              type="button"
              aria-label="Approve post"
              onClick={() => saveDraft("APPROVED")}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Check size={15} /> <span className="hidden sm:inline">Approve</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[92rem] items-start gap-5 px-4 py-5 sm:px-6 lg:px-7 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <main className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/55 p-1">
              {(Object.keys(localeLabels) as LocaleCode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLocale(item)}
                  className={cn(
                    "inline-flex h-8 items-center gap-2 rounded-md px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                    locale === item
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {localeLabels[item].label}
                  <span className="hidden text-[0.62rem] font-normal sm:inline">
                    {localeLabels[item].language}
                  </span>
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      localeProgress(item) === 100 ? "bg-emerald-500" : "bg-amber-500",
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="font-mono text-[0.64rem] text-muted-foreground">{wordCount} words</p>
          </div>

          <div className="px-5 pt-8 sm:px-8 lg:px-12">
            <label htmlFor="post-title" className="sr-only">
              Post title
            </label>
            <textarea
              id="post-title"
              value={activeTitle}
              rows={2}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder={locale === "el" ? "Τίτλος άρθρου" : "Story title"}
              className="max-h-40 min-h-20 w-full resize-none bg-transparent text-3xl font-semibold tracking-[-0.035em] outline-none placeholder:text-muted-foreground/45 sm:text-4xl"
            />
            <label htmlFor="post-excerpt" className="sr-only">
              Post excerpt
            </label>
            <textarea
              id="post-excerpt"
              value={activeExcerpt}
              rows={2}
              maxLength={180}
              onChange={(event) => updateField("excerpt", event.target.value)}
              placeholder={
                locale === "el"
                  ? "Μια σύντομη περίληψη για κάρτες και αναζητήσεις."
                  : "A concise summary for cards and search results."
              }
              className="mt-3 min-h-14 w-full resize-none bg-transparent text-base leading-7 text-muted-foreground outline-none placeholder:text-muted-foreground/45"
            />
          </div>

          <div
            className="sticky top-32 z-10 mt-5 flex items-center gap-1 overflow-x-auto border-y border-border bg-card/96 px-3 py-2 backdrop-blur sm:px-5"
            role="toolbar"
            aria-label="Text formatting"
          >
            <ToolbarButton label="Undo" icon={Undo2} onClick={() => runCommand("undo")} />
            <ToolbarButton label="Redo" icon={Redo2} onClick={() => runCommand("redo")} />
            <span className="mx-1 h-5 w-px shrink-0 bg-border" />
            <ToolbarButton
              label="Heading 2"
              icon={Heading2}
              onClick={() => runCommand("formatBlock", "h2")}
            />
            <ToolbarButton
              label="Heading 3"
              icon={Heading3}
              onClick={() => runCommand("formatBlock", "h3")}
            />
            <span className="mx-1 h-5 w-px shrink-0 bg-border" />
            <ToolbarButton label="Bold" icon={Bold} onClick={() => runCommand("bold")} />
            <ToolbarButton label="Italic" icon={Italic} onClick={() => runCommand("italic")} />
            <ToolbarButton
              label="Underline"
              icon={Underline}
              onClick={() => runCommand("underline")}
            />
            <ToolbarButton
              label="Strikethrough"
              icon={Strikethrough}
              onClick={() => runCommand("strikeThrough")}
            />
            <span className="mx-1 h-5 w-px shrink-0 bg-border" />
            <ToolbarButton
              label="Bullet list"
              icon={List}
              onClick={() => runCommand("insertUnorderedList")}
            />
            <ToolbarButton
              label="Numbered list"
              icon={ListOrdered}
              onClick={() => runCommand("insertOrderedList")}
            />
            <ToolbarButton
              label="Quote"
              icon={Quote}
              onClick={() => runCommand("formatBlock", "blockquote")}
            />
            <ToolbarButton
              label="Inline code"
              icon={Code2}
              onClick={() => runCommand("formatBlock", "code")}
            />
            <ToolbarButton label="Link" icon={Link2} onClick={insertLink} />
            <ToolbarButton
              label="Horizontal rule"
              icon={Minus}
              onClick={() => runCommand("insertHorizontalRule")}
            />
          </div>

          <div className="px-5 py-8 sm:px-8 lg:px-12">
            <div
              ref={editorRef}
              contentEditable={canEdit}
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-label={`${localeLabels[locale].language} post body`}
              data-placeholder={
                locale === "el" ? "Ξεκίνα να γράφεις το άρθρο..." : "Start writing the story..."
              }
              onInput={syncEditorValue}
              className="cms-editor-surface min-h-[28rem] max-w-none text-[0.98rem] leading-7 outline-none"
            />
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/25 px-5 py-3 text-[0.66rem] text-muted-foreground">
            <span>Local prototype draft. No data leaves this browser.</span>
            <button
              type="button"
              onClick={resetLocalDraft}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw size={12} /> Reset local changes
            </button>
          </footer>
        </main>

        <aside className="overflow-hidden rounded-xl border border-border bg-card xl:sticky xl:top-36">
          <InspectorSection title="Publication">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold">{statusLabels[post.status]}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Author</span>
                <span className="truncate font-semibold">{author?.name ?? "Unassigned"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Reviewer</span>
                <span className="truncate font-semibold">{reviewer?.name ?? "Not assigned"}</span>
              </div>
              <label className="block pt-2 text-[0.68rem] text-muted-foreground">
                Schedule
                <input
                  type="datetime-local"
                  value={post.scheduledFor?.slice(0, 16) ?? ""}
                  onChange={(event) => updatePost({ scheduledFor: event.target.value || null })}
                  className="mt-1.5 h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
            </div>
          </InspectorSection>

          <InspectorSection title="Translation health">
            <div className="space-y-3">
              {(["el", "en"] as LocaleCode[]).map((item) => (
                <div key={item}>
                  <div className="mb-1.5 flex items-center justify-between text-[0.68rem]">
                    <span className="font-semibold">{localeLabels[item].language}</span>
                    <span className="font-mono text-muted-foreground">{localeProgress(item)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        localeProgress(item) === 100 ? "bg-emerald-500" : "bg-amber-500",
                      )}
                      style={{ width: `${localeProgress(item)}%` }}
                    />
                  </div>
                </div>
              ))}
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-[0.68rem] font-semibold",
                  translationStatus === "READY"
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
                )}
              >
                {translationStatus === "READY" ? <CheckCircle2 size={14} /> : <LanguagesIcon />}
                {translationStatus === "READY"
                  ? "Ready in both locales"
                  : "Translation needs attention"}
              </div>
            </div>
          </InspectorSection>

          <InspectorSection title="Slug and search preview">
            <label className="text-[0.68rem] text-muted-foreground">
              URL slug
              <div className="mt-1.5 flex h-9 items-center overflow-hidden rounded-lg border border-border bg-background focus-within:ring-2 focus-within:ring-ring">
                <span className="pl-2.5 text-muted-foreground">/</span>
                <input
                  value={activeSlug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      event.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    )
                  }
                  placeholder="story-slug"
                  className="min-w-0 flex-1 bg-transparent px-1.5 text-xs outline-none"
                />
              </div>
            </label>
            <div className="mt-3 rounded-lg border border-border bg-background p-3">
              <p className="truncate text-[0.62rem] text-emerald-700 dark:text-emerald-300">
                ieesec.gr/{locale}/posts/{activeSlug || "story-slug"}
              </p>
              <p className="mt-1.5 line-clamp-1 text-xs font-semibold text-primary">
                {activeTitle || "Story title"}
              </p>
              <p className="mt-1 line-clamp-2 text-[0.66rem] leading-4 text-muted-foreground">
                {activeExcerpt || "Add an excerpt to improve link previews and search context."}
              </p>
            </div>
          </InspectorSection>

          <InspectorSection title="Featured media">
            {selectedMedia ? (
              <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                <Image
                  src={selectedMedia.url}
                  alt={locale === "el" ? selectedMedia.altEl : selectedMedia.altEn}
                  fill
                  sizes="304px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="grid aspect-video place-items-center rounded-lg border border-dashed border-border bg-muted/35 text-muted-foreground">
                <ImageIcon size={20} />
              </div>
            )}
            <select
              value={post.heroMediaId ?? ""}
              onChange={(event) => updatePost({ heroMediaId: event.target.value || null })}
              className="mt-2 h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">No featured image</option>
              {media.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.filename}
                </option>
              ))}
            </select>
          </InspectorSection>

          <InspectorSection title="Tags">
            <input
              value={post.tags.join(", ")}
              onChange={(event) =>
                updatePost({
                  tags: event.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .slice(0, 8),
                })
              }
              placeholder="community, engineering"
              className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="mt-2 text-[0.64rem] leading-4 text-muted-foreground">
              Separate tags with commas. Up to eight tags are kept.
            </p>
          </InspectorSection>
        </aside>
      </div>

      {previewOpen ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-preview-title"
        >
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0"
            onClick={() => setPreviewOpen(false)}
          />
          <article className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-3 backdrop-blur">
              <div>
                <p className="text-[0.65rem] text-muted-foreground">Preview</p>
                <p className="text-xs font-semibold">{localeLabels[locale].language}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="grid size-9 place-items-center rounded-lg border border-border hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={16} />
              </button>
            </div>
            {selectedMedia ? (
              <div className="relative aspect-[16/7]">
                <Image
                  src={selectedMedia.url}
                  alt={locale === "el" ? selectedMedia.altEl : selectedMedia.altEn}
                  fill
                  sizes="768px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="px-6 py-9 sm:px-10 sm:py-12">
              <h1
                id="post-preview-title"
                className="text-3xl font-semibold tracking-[-0.035em] sm:text-5xl"
              >
                {activeTitle || "Untitled post"}
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">{activeExcerpt}</p>
              <div className="mt-8 border-t border-border pt-8">
                <div
                  className="cms-editor-surface"
                  dangerouslySetInnerHTML={{ __html: sanitizeEditorHtml(activeBody) }}
                />
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </div>
  );
}

function LanguagesIcon() {
  return <span className="font-mono text-[0.65rem]">EL/EN</span>;
}
