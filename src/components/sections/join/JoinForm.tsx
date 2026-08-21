"use client";

import { useId, useMemo, useState } from "react";
import { Reveal } from "@/components/ui/animations/fade-up";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JoinFormData } from "@/types/join";
import {
  AVAILABILITY_OPTIONS,
  EMPTY_JOIN_FORM,
  EXPERIENCE_LEVELS,
  INTEREST_AREAS,
  MAX_CV_SIZE_BYTES,
  MAX_TEXTAREA_LENGTH,
  STATUS_OPTIONS,
  YEAR_OPTIONS,
} from "./data";
import { Field, OptionRow, Pill, fieldInputClass } from "./FormField";
import { FormSection } from "./FormSection";
import { SuccessPanel } from "./SuccessPanel";

function toggleInArray<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function JoinForm() {
  const [form, setForm] = useState<JoinFormData>(EMPTY_JOIN_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const ids = useId();

  const canSubmit = form.fullName.trim() !== "" && form.email.trim() !== "" && form.consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(EMPTY_JOIN_FORM);
    setCvError(null);
    setSubmitted(false);
  };

  const validateAndSetFile = (file: File | null) => {
    if (!file) {
      setCvError(null);
      setForm((f) => ({ ...f, cv: null }));
      return;
    }
    if (file.type !== "application/pdf") {
      setCvError("PDF files only.");
      return;
    }
    if (file.size > MAX_CV_SIZE_BYTES) {
      setCvError("Max file size is 5 MB.");
      return;
    }
    setCvError(null);
    setForm((f) => ({ ...f, cv: file }));
  };

  const motivationCount = useMemo(() => form.motivation.length, [form.motivation]);
  const builtCount = useMemo(() => form.builtSomething.length, [form.builtSomething]);

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 w-full py-20">
        <SuccessPanel fullName={form.fullName} email={form.email} onReset={resetForm} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 w-full py-20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Reveal direction="up">
          <FormSection
            step="01"
            eyebrow="About you"
            title="Who's applying"
            description="The only two required fields in the whole form live here."
          >
            <Field label="Full name" required htmlFor={`${ids}-name`}>
              <input
                id={`${ids}-name`}
                type="text"
                required
                placeholder="Maria Papadopoulou"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <Field label="Email address" required htmlFor={`${ids}-email`}>
              <input
                id={`${ids}-email`}
                type="email"
                required
                placeholder="student@ihu.gr"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Year" optional htmlFor={`${ids}-year`}>
                <select
                  id={`${ids}-year`}
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  className={cn(fieldInputClass, "cursor-pointer")}
                >
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Status" optional>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <Pill
                      key={status}
                      label={status}
                      selected={form.status === status}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          status: f.status === status ? null : status,
                        }))
                      }
                    />
                  ))}
                </div>
              </Field>
            </div>
          </FormSection>
        </Reveal>

        <Reveal direction="up" delay={0.05}>
          <FormSection
            step="02"
            eyebrow="Where to find you"
            title="Your links"
            description="So we can see your work and reach you. All optional — a repository is not a requirement."
          >
            <Field label="GitHub" optional htmlFor={`${ids}-github`}>
              <input
                id={`${ids}-github`}
                type="text"
                placeholder="github.com/username"
                value={form.github}
                onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <Field label="GitLab" optional htmlFor={`${ids}-gitlab`}>
              <input
                id={`${ids}-gitlab`}
                type="text"
                placeholder="gitlab.com/username"
                value={form.gitlab}
                onChange={(e) => setForm((f) => ({ ...f, gitlab: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <Field label="LinkedIn" optional htmlFor={`${ids}-linkedin`}>
              <input
                id={`${ids}-linkedin`}
                type="text"
                placeholder="linkedin.com/in/username"
                value={form.linkedin}
                onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <Field label="Discord" optional htmlFor={`${ids}-discord`}>
              <input
                id={`${ids}-discord`}
                type="text"
                placeholder="username"
                value={form.discord}
                onChange={(e) => setForm((f) => ({ ...f, discord: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <Field label="Instagram" optional htmlFor={`${ids}-instagram`}>
              <input
                id={`${ids}-instagram`}
                type="text"
                placeholder="instagram.com/username"
                value={form.instagram}
                onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>
          </FormSection>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <FormSection
            step="03"
            eyebrow="Your interest"
            title="What you want to build"
            description="Signals, not commitments. They help us place you on a project you'll enjoy."
          >
            <Field label="Areas of interest" optional hint="pick any, or none">
              <div className="flex flex-wrap gap-2">
                {INTEREST_AREAS.map((area) => (
                  <Pill
                    key={area}
                    label={area}
                    prefix="✓"
                    selected={form.interests.includes(area)}
                    onClick={() =>
                      setForm((f) => ({ ...f, interests: toggleInArray(f.interests, area) }))
                    }
                  />
                ))}
              </div>
            </Field>

            <Field
              label="Experience level"
              optional
              hint="Beginner is the most common answer here. Really."
            >
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LEVELS.map((level) => (
                  <Pill
                    key={level}
                    label={level}
                    selected={form.experience === level}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        experience: f.experience === level ? null : level,
                      }))
                    }
                  />
                ))}
              </div>
            </Field>

            <Field label="Availability" optional>
              <div className="flex flex-col gap-2">
                {AVAILABILITY_OPTIONS.map((option) => (
                  <OptionRow
                    key={option.value}
                    label={option.label}
                    selected={form.availability === option.value}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        availability: f.availability === option.value ? null : option.value,
                      }))
                    }
                  />
                ))}
              </div>
            </Field>
          </FormSection>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <FormSection
            step="04"
            eyebrow="Tell us more"
            title="In your words"
            description="A couple of sentences is plenty."
          >
            <Field label="Why do you want to join IEESEC?" optional htmlFor={`${ids}-motivation`}>
              <textarea
                id={`${ids}-motivation`}
                rows={3}
                maxLength={MAX_TEXTAREA_LENGTH}
                placeholder={' "I want to learn Git properly", "I have a project idea",... '}
                value={form.motivation}
                onChange={(e) => setForm((f) => ({ ...f, motivation: e.target.value }))}
                className={cn(fieldInputClass, "resize-none")}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground/70">
                {motivationCount} / {MAX_TEXTAREA_LENGTH}
              </p>
            </Field>

            <Field label="Tell us about something you've built" optional htmlFor={`${ids}-built`}>
              <textarea
                id={`${ids}-built`}
                rows={3}
                maxLength={MAX_TEXTAREA_LENGTH}
                placeholder="A course project, a bot, a website for a friend, a Minecraft mod — all count."
                value={form.builtSomething}
                onChange={(e) => setForm((f) => ({ ...f, builtSomething: e.target.value }))}
                className={cn(fieldInputClass, "resize-none")}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground/70">
                {builtCount} / {MAX_TEXTAREA_LENGTH}
              </p>
            </Field>

            <Field label="CV" optional hint="PDF only · max 5 MB.">
              <label
                htmlFor={`${ids}-cv`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  validateAndSetFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <p className="text-sm font-medium text-foreground">
                  {form.cv ? form.cv.name : "Drop a PDF here, or click to choose"}
                </p>
                <input
                  id={`${ids}-cv`}
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => validateAndSetFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {cvError && <p className="mt-1.5 text-xs text-destructive">{cvError}</p>}
            </Field>
          </FormSection>
        </Reveal>

        <Reveal direction="up" delay={0.2}>
          <FormSection
            step="05"
            eyebrow="Consent"
            title="Send it"
            description="We document what we do with your data, same as everything else."
          >
            <label className="flex items-start gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border text-primary focus:ring-primary/30"
              />
              <span>
                I agree that IEESEC may store this info to process my application.
                <span className="text-primary"> *</span>{" "}
                <span className="text-primary underline underline-offset-2">
                  Read the privacy note
                </span>
              </span>
            </label>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit}
                className="rounded-full disabled:cursor-not-allowed"
              >
                Submit application →
              </Button>
              <p className="text-xs text-muted-foreground">
                {canSubmit ? "You're all set." : "Name, email and consent unlock this."}
              </p>
            </div>
          </FormSection>
        </Reveal>
      </form>
    </div>
  );
}
