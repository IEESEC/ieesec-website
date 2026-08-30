"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type {
  ExperienceLevel,
  InterestArea,
  JoinFormData,
  ParticipationPreference,
  ParticipationRating,
} from "@/types/join";
import {
  AlertTriangle,
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Gamepad2,
  GitFork,
  Link2,
  MessageCircle,
  Network,
  Smartphone,
  TestTubeDiagonal,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/animations/fade-up";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  EMPTY_JOIN_FORM,
  EXPERIENCE_LEVELS,
  INTEREST_AREAS,
  MAX_TEXTAREA_LENGTH,
  PARTICIPATION_RATINGS,
  PARTICIPATION_ROWS,
  YEAR_OPTIONS,
} from "./data";
import { Field, fieldInputClass } from "./FormField";
import { FormSection } from "./FormSection";
import {
  getNextJoinStep,
  isJoinFormDirty,
  isJoinStepComplete,
  JOIN_FORM_STEP_COUNT,
} from "./join-form-flow";
import { SuccessPanel } from "./SuccessPanel";

function toggleInArray<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

interface FormStepScreenProps {
  active: boolean;
  children: React.ReactNode;
  delay?: number;
}

function FormStepScreen({ active, children, delay = 0 }: FormStepScreenProps) {
  return (
    <section
      data-join-form-step
      data-scroll-video-section
      aria-hidden={!active}
      inert={!active}
      className="flex h-svh snap-start snap-always items-center px-5 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-32"
    >
      <Reveal direction="up" delay={delay} className="mx-auto w-full max-w-4xl">
        {children}
      </Reveal>
    </section>
  );
}

function canScrollWithin(element: HTMLElement, direction: -1 | 1): boolean {
  if (direction > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
  }

  return element.scrollTop > 1;
}

const INTEREST_ICONS: Record<InterestArea, LucideIcon> = {
  "Web Development (Frontend/Backend)": Code2,
  "Mobile Development (iOS/Android)": Smartphone,
  "Data Science / Machine Learning / AI": BrainCircuit,
  "Embedded Systems / IoT Software": Cpu,
  "Game Development": Gamepad2,
  "Software Testing / Quality Assurance": TestTubeDiagonal,
  "DevOps / Cloud Computing": Cloud,
  DSA: Network,
};

interface IconTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

function IconTextInput({ icon: Icon, className, ...props }: IconTextInputProps) {
  return (
    <div className="relative">
      <Icon
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input {...props} className={cn(fieldInputClass, "pl-10", className)} />
    </div>
  );
}

interface YearSliderProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

function YearSlider({ id, value, onChange }: YearSliderProps) {
  const selectedIndex = Math.max(YEAR_OPTIONS.indexOf(value), 0);

  return (
    <div className="rounded-2xl border border-border bg-background/70 px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-foreground">{YEAR_OPTIONS[selectedIndex]}</span>
        <span className="text-xs text-muted-foreground">Drag to select</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={YEAR_OPTIONS.length - 1}
        step={1}
        value={selectedIndex}
        onChange={(event) => onChange(YEAR_OPTIONS[Number(event.target.value)])}
        aria-valuetext={YEAR_OPTIONS[selectedIndex]}
        className="mt-4 h-2 w-full cursor-grab appearance-none rounded-full bg-muted accent-primary active:cursor-grabbing"
      />
      <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[0.68rem] font-medium text-muted-foreground">
        {YEAR_OPTIONS.map((year, index) => (
          <button
            key={year}
            type="button"
            onClick={() => onChange(year)}
            className={cn(
              "rounded-md px-1 py-1 transition-colors cursor-pointer",
              selectedIndex === index && "bg-primary/10 text-primary",
            )}
          >
            {year.replace(" year", "")}
          </button>
        ))}
      </div>
    </div>
  );
}

interface InterestCardProps {
  area: InterestArea;
  selected: boolean;
  onClick: () => void;
}

function InterestCard({ area, selected, onClick }: InterestCardProps) {
  const Icon = INTEREST_ICONS[area];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex min-h-16 items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-all cursor-pointer",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background/70 text-foreground hover:border-primary/60 hover:bg-primary/5",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
          selected ? "bg-white/18" : "bg-primary/10 text-primary group-hover:bg-primary/15",
        )}
      >
        <Icon aria-hidden className="size-4" />
      </span>
      <span className="leading-snug">{area}</span>
    </button>
  );
}

interface ExperienceScaleProps {
  value: ExperienceLevel | null;
  onChange: (value: ExperienceLevel) => void;
}

function ExperienceScale({ value, onChange }: ExperienceScaleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Programming experience level"
      className="rounded-2xl border border-border bg-background/70 p-4"
    >
      <div className="grid grid-cols-5 gap-2 text-center text-sm font-medium text-foreground">
        {EXPERIENCE_LEVELS.map((level) => (
          <span key={level}>{level}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {EXPERIENCE_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={value === level}
            onClick={() => onChange(level)}
            className={cn(
              "mx-auto size-5 rounded-full border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25",
              value === level
                ? "border-primary bg-primary ring-4 ring-primary/15"
                : "border-muted-foreground/55 bg-background hover:border-primary",
            )}
          >
            <span className="sr-only">Experience level {level}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-between gap-4 text-xs text-muted-foreground">
        <span className="max-w-40 leading-snug">Beginner: I know the basics.</span>
        <span className="max-w-56 text-right leading-snug">
          Advanced: I feel comfortable with real projects, frameworks, and Git.
        </span>
      </div>
    </div>
  );
}

interface ParticipationMatrixProps {
  values: Record<ParticipationPreference, ParticipationRating | null>;
  onChange: (preference: ParticipationPreference, rating: ParticipationRating) => void;
}

function ParticipationMatrix({ values, onChange }: ParticipationMatrixProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background/70">
      <div className="grid grid-cols-[minmax(5.8rem,1fr)_repeat(4,minmax(2.7rem,0.55fr))] border-b border-border px-2 py-2 text-center text-[0.62rem] font-semibold text-muted-foreground sm:grid-cols-[minmax(7.5rem,1.1fr)_repeat(4,minmax(3.6rem,0.7fr))] sm:px-3 sm:text-[0.68rem]">
        <span className="text-left">Preference</span>
        {PARTICIPATION_RATINGS.map((rating) => (
          <span key={rating.value} className="leading-tight">
            {rating.label}
          </span>
        ))}
      </div>
      {PARTICIPATION_ROWS.map((row) => (
        <div
          key={row.value}
          className="grid grid-cols-[minmax(5.8rem,1fr)_repeat(4,minmax(2.7rem,0.55fr))] items-center border-b border-border/80 px-2 py-3 last:border-b-0 sm:grid-cols-[minmax(7.5rem,1.1fr)_repeat(4,minmax(3.6rem,0.7fr))] sm:px-3"
        >
          <p className="pr-3 text-xs font-semibold leading-snug text-foreground">{row.label}</p>
          {PARTICIPATION_RATINGS.map((rating) => (
            <button
              key={rating.value}
              type="button"
              role="radio"
              aria-checked={values[row.value] === rating.value}
              aria-label={`${row.label}: ${rating.label}`}
              onClick={() => onChange(row.value, rating.value)}
              className="mx-auto flex size-5 items-center justify-center rounded-full border border-muted-foreground/45 bg-background transition-all cursor-pointer hover:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2.5 rounded-full transition-transform",
                  values[row.value] === rating.value
                    ? "scale-100 bg-primary"
                    : "scale-0 bg-transparent",
                )}
              />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

interface ContinueButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

function ContinueButton({ disabled = false, onClick }: ContinueButtonProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      <Button
        type="button"
        size="lg"
        disabled={disabled}
        onClick={onClick}
        className="rounded-full disabled:cursor-not-allowed"
      >
        Continue →
      </Button>
      {disabled && (
        <p className="text-xs text-muted-foreground">Complete the required fields to continue.</p>
      )}
    </div>
  );
}

export function JoinForm() {
  const [form, setForm] = useState<JoinFormData>(EMPTY_JOIN_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLFormElement>(null);
  const activeStepRef = useRef(0);
  const formStateRef = useRef(form);
  const navigationLockRef = useRef(false);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ids = useId();

  formStateRef.current = form;

  const canSubmit = Array.from({ length: JOIN_FORM_STEP_COUNT }, (_, step) =>
    isJoinStepComplete(step, form),
  ).every(Boolean);
  const progress = ((activeStep + 1) / JOIN_FORM_STEP_COUNT) * 100;

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    scrollerRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    activeStepRef.current = 0;
    setActiveStep(0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const scrollToStep = useCallback((step: number) => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    activeStepRef.current = step;
    setActiveStep(step);
    setBlockedMessage(null);
    scroller.scrollTo({
      top: step * scroller.clientHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, []);

  const showValidationForStep = useCallback((step: number) => {
    const section =
      scrollerRef.current?.querySelectorAll<HTMLElement>("[data-join-form-step]")[step];
    const invalidField = section?.querySelector<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >(":invalid");

    invalidField?.reportValidity();
    invalidField?.focus({ preventScroll: true });
    const messages = [
      "Add your name and a valid email to continue.",
      "Add your GitHub and Discord to continue.",
      "Choose an interest, your experience level, and every participation preference.",
      "Complete the required field before continuing.",
      "Consent is required before submitting.",
    ];

    setBlockedMessage(messages[step] ?? "Complete the required fields before continuing.");
  }, []);

  const attemptNavigation = useCallback(
    (direction: -1 | 1): boolean => {
      const currentStep = activeStepRef.current;

      if (direction < 0 && currentStep === 0) return false;

      const nextStep = getNextJoinStep(currentStep, direction, formStateRef.current);

      if (nextStep === currentStep) {
        if (direction > 0 && currentStep < JOIN_FORM_STEP_COUNT - 1) {
          showValidationForStep(currentStep);
        } else if (direction > 0) {
          setBlockedMessage("Submit your application to finish.");
        }

        return true;
      }

      scrollToStep(nextStep);
      return true;
    },
    [scrollToStep, showValidationForStep],
  );

  useEffect(() => {
    if (submitted || !isJoinFormDirty(form)) return;

    const confirmBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
    };

    window.addEventListener("beforeunload", confirmBeforeLeaving);
    return () => window.removeEventListener("beforeunload", confirmBeforeLeaving);
  }, [form, submitted]);

  useEffect(() => {
    setBlockedMessage(null);
  }, [form]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    let accumulatedWheelDelta = 0;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let touchTarget: HTMLElement | null = null;
    const getFormDocumentTop = () => window.scrollY + scroller.getBoundingClientRect().top;
    const alignWindowToForm = () => {
      window.scrollTo({ top: getFormDocumentTop(), behavior: "auto" });
    };

    const lockNavigation = () => {
      navigationLockRef.current = true;
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = setTimeout(() => {
        navigationLockRef.current = false;
      }, 320);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;

      const direction: -1 | 1 = event.deltaY > 0 ? 1 : -1;
      const target = event.target instanceof Element ? event.target : null;
      const stepContent = target?.closest<HTMLElement>("[data-join-step-scroll]");

      if (direction > 0 && scroller.getBoundingClientRect().top > 1) {
        event.preventDefault();
        alignWindowToForm();
        return;
      }

      if (stepContent && canScrollWithin(stepContent, direction)) {
        accumulatedWheelDelta = 0;
        return;
      }

      if (direction < 0 && activeStepRef.current === 0) {
        event.preventDefault();
        window.scrollBy({ top: event.deltaY, behavior: "auto" });
        return;
      }

      event.preventDefault();
      accumulatedWheelDelta += event.deltaY;

      if (Math.abs(accumulatedWheelDelta) < 24 || navigationLockRef.current) return;

      const accumulatedDirection: -1 | 1 = accumulatedWheelDelta > 0 ? 1 : -1;
      accumulatedWheelDelta = 0;
      attemptNavigation(accumulatedDirection);
      lockNavigation();
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchCurrentY = touchStartY;
      touchTarget = event.target instanceof HTMLElement ? event.target : null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      touchCurrentY = event.touches[0]?.clientY ?? touchCurrentY;
      const distance = touchStartY - touchCurrentY;

      if (Math.abs(distance) < 8) return;

      const direction: -1 | 1 = distance > 0 ? 1 : -1;
      const stepContent = touchTarget?.closest<HTMLElement>("[data-join-step-scroll]");

      if (stepContent && canScrollWithin(stepContent, direction)) return;
      if (direction < 0 && activeStepRef.current === 0) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
    };

    const handleTouchEnd = () => {
      const distance = touchStartY - touchCurrentY;

      if (Math.abs(distance) < 48 || navigationLockRef.current) return;

      const direction: -1 | 1 = distance > 0 ? 1 : -1;
      const stepContent = touchTarget?.closest<HTMLElement>("[data-join-step-scroll]");

      if (direction > 0 && scroller.getBoundingClientRect().top > 1) {
        alignWindowToForm();
        return;
      }

      if (direction < 0 && activeStepRef.current === 0) {
        window.scrollTo({
          top: Math.max(window.scrollY - Math.abs(distance), 0),
          behavior: "smooth",
        });
        return;
      }

      if (stepContent && canScrollWithin(stepContent, direction)) return;
      if (!attemptNavigation(direction)) return;

      lockNavigation();
    };

    const keepCurrentStepAligned = () => {
      scroller.scrollTo({ top: activeStepRef.current * scroller.clientHeight, behavior: "auto" });
    };

    const keepFormViewportAligned = () => {
      const formDocumentTop = getFormDocumentTop();
      const hasOvershotForm = window.scrollY > formDocumentTop + 1;
      const leftActiveForm =
        activeStepRef.current > 0 && Math.abs(window.scrollY - formDocumentTop) > 1;

      if (hasOvershotForm || leftActiveForm) {
        window.scrollTo({ top: formDocumentTop, behavior: "auto" });
      }
    };

    scroller.addEventListener("wheel", handleWheel, { passive: false });
    scroller.addEventListener("touchstart", handleTouchStart, { passive: true });
    scroller.addEventListener("touchmove", handleTouchMove, { passive: false });
    scroller.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("scroll", keepFormViewportAligned, { passive: true });
    window.addEventListener("resize", keepCurrentStepAligned);

    return () => {
      scroller.removeEventListener("wheel", handleWheel);
      scroller.removeEventListener("touchstart", handleTouchStart);
      scroller.removeEventListener("touchmove", handleTouchMove);
      scroller.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("scroll", keepFormViewportAligned);
      window.removeEventListener("resize", keepCurrentStepAligned);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, [attemptNavigation]);

  const handleStepKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.repeat) return;

    const target = event.target as HTMLElement;
    const isFormControl = target.matches("input, textarea, select, button");
    let direction: -1 | 1 | null = null;

    if (event.key === "PageDown" || (!isFormControl && ["ArrowDown", " "].includes(event.key))) {
      direction = 1;
    }
    if (event.key === "PageUp" || (!isFormControl && event.key === "ArrowUp")) {
      direction = -1;
    }

    if (direction && attemptNavigation(direction)) event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setBlockedMessage(null);

    try {
      const response = await fetch("/api/join-application", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setBlockedMessage("Application could not be submitted. Please try again in a moment.");
        return;
      }

      setSubmitted(true);
    } catch {
      setBlockedMessage("Application could not be submitted. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const motivationCount = useMemo(() => form.motivation.length, [form.motivation]);
  const builtCount = useMemo(() => form.builtSomething.length, [form.builtSomething]);

  if (submitted) {
    return (
      <section
        id="join-application"
        className="mx-auto flex min-h-svh w-full max-w-3xl items-center px-6 py-24"
      >
        <SuccessPanel fullName={form.fullName} email={form.email} />
      </section>
    );
  }

  return (
    <div id="join-application" className="relative h-svh w-full scroll-mt-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50">
        <div
          role="progressbar"
          aria-label="Application progress"
          aria-valuemin={1}
          aria-valuemax={JOIN_FORM_STEP_COUNT}
          aria-valuenow={activeStep + 1}
          className="h-1 overflow-hidden bg-white/15"
        >
          <div
            className="h-full origin-left bg-primary transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>

      <div className="pointer-events-none fixed right-5 top-6 z-50 sm:right-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/45 bg-amber-400/14 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-amber-100 shadow-sm backdrop-blur-md">
          <AlertTriangle aria-hidden className="size-3.5" />
          Experimental feature
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[5.35rem] z-30 px-5 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 text-xs text-white/75">
          <p aria-live="polite" className="min-h-5 font-medium text-white">
            {blockedMessage}
          </p>
          <p className="shrink-0 font-mono tabular-nums">
            {String(activeStep + 1).padStart(2, "0")} /{" "}
            {String(JOIN_FORM_STEP_COUNT).padStart(2, "0")}
          </p>
        </div>
      </div>

      <form
        ref={scrollerRef}
        data-scroll-video-timeline
        onSubmit={handleSubmit}
        onKeyDown={handleStepKeyDown}
        className="h-svh snap-y snap-mandatory overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <FormStepScreen active={activeStep === 0}>
          <FormSection
            step="01"
            eyebrow="Start with the basics"
            title="Who's applying"
            description="Tell us who you are and where you are in your studies."
          >
            <Field label="Full name" required htmlFor={`${ids}-name`}>
              <input
                id={`${ids}-name`}
                type="text"
                required
                placeholder="Giorgos Giorgopoulos"
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

            <div className="grid grid-cols-1 gap-5">
              <Field label="Year" required htmlFor={`${ids}-year`}>
                <YearSlider
                  id={`${ids}-year`}
                  value={form.year}
                  onChange={(year) => setForm((f) => ({ ...f, year }))}
                />
              </Field>
            </div>

            <ContinueButton
              disabled={!isJoinStepComplete(0, form)}
              onClick={() => attemptNavigation(1)}
            />
          </FormSection>
        </FormStepScreen>

        <FormStepScreen active={activeStep === 1} delay={0.05}>
          <FormSection
            step="02"
            eyebrow="Your online trail"
            title="Your links"
            description="GitHub helps us see your work. Discord helps us reach you quickly."
          >
            <Field label="GitHub" required htmlFor={`${ids}-github`}>
              <IconTextInput
                id={`${ids}-github`}
                type="text"
                required
                icon={GitFork}
                placeholder="github.com/username"
                value={form.github}
                onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
              />
            </Field>

            <Field label="Discord" required htmlFor={`${ids}-discord`}>
              <IconTextInput
                id={`${ids}-discord`}
                type="text"
                required
                icon={MessageCircle}
                placeholder="username"
                value={form.discord}
                onChange={(e) => setForm((f) => ({ ...f, discord: e.target.value }))}
              />
            </Field>

            <Field label="LinkedIn" optional htmlFor={`${ids}-linkedin`}>
              <IconTextInput
                id={`${ids}-linkedin`}
                type="text"
                icon={Link2}
                placeholder="linkedin.com/in/username"
                value={form.linkedin}
                onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
              />
            </Field>
            <ContinueButton
              disabled={!isJoinStepComplete(1, form)}
              onClick={() => attemptNavigation(1)}
            />
          </FormSection>
        </FormStepScreen>

        <FormStepScreen active={activeStep === 2} delay={0.1}>
          <FormSection
            step="03"
            eyebrow="What pulls you in"
            title="What you want to build"
            description="Pick the areas and team activities that sound worth your time."
          >
            <Field label="Areas of interest" required hint="Pick at least one.">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {INTEREST_AREAS.map((area) => (
                  <InterestCard
                    key={area}
                    area={area}
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
              required
              hint="Choose the point that feels closest today."
            >
              <ExperienceScale
                value={form.experience}
                onChange={(experience) => setForm((f) => ({ ...f, experience }))}
              />
            </Field>

            <Field
              label="How much would you like to participate in these parts of the team?"
              required
              hint="Select one option per row."
            >
              <ParticipationMatrix
                values={form.participationPreferences}
                onChange={(preference, rating) =>
                  setForm((f) => ({
                    ...f,
                    participationPreferences: {
                      ...f.participationPreferences,
                      [preference]: rating,
                    },
                  }))
                }
              />
            </Field>

            <ContinueButton
              disabled={!isJoinStepComplete(2, form)}
              onClick={() => attemptNavigation(1)}
            />
          </FormSection>
        </FormStepScreen>

        <FormStepScreen active={activeStep === 3} delay={0.15}>
          <FormSection
            step="04"
            eyebrow="The long answer"
            title="In your words"
            description="A couple of sentences is plenty."
          >
            <Field
              label="Do you have a specific idea for a project or an initiative that you'd like us to carry out together?"
              optional
              htmlFor={`${ids}-motivation`}
            >
              <textarea
                id={`${ids}-motivation`}
                rows={3}
                maxLength={MAX_TEXTAREA_LENGTH}
                placeholder="A workshop, an open-source tool, a campus app, a research idea..."
                value={form.motivation}
                onChange={(e) => setForm((f) => ({ ...f, motivation: e.target.value }))}
                className={cn(fieldInputClass, "resize-none")}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground/70">
                {motivationCount} / {MAX_TEXTAREA_LENGTH}
              </p>
            </Field>

            <Field
              label="Share links to the projects you're most proud of"
              optional
              htmlFor={`${ids}-built`}
            >
              <textarea
                id={`${ids}-built`}
                rows={3}
                maxLength={MAX_TEXTAREA_LENGTH}
                placeholder="GitHub repos, demos, write-ups, apps, bots, notebooks, videos..."
                value={form.builtSomething}
                onChange={(e) => setForm((f) => ({ ...f, builtSomething: e.target.value }))}
                className={cn(fieldInputClass, "resize-none")}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground/70">
                {builtCount} / {MAX_TEXTAREA_LENGTH}
              </p>
            </Field>

            <ContinueButton onClick={() => attemptNavigation(1)} />
          </FormSection>
        </FormStepScreen>

        <FormStepScreen active={activeStep === 4} delay={0.2}>
          <FormSection
            step="05"
            eyebrow="One last thing"
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
                disabled={!canSubmit || isSubmitting}
                className="rounded-full disabled:cursor-not-allowed"
              >
                Submit application →
              </Button>
              <p className="text-xs text-muted-foreground">
                {canSubmit ? "You're all set." : "Complete the required form steps to unlock this."}
              </p>
            </div>
          </FormSection>
        </FormStepScreen>
      </form>
    </div>
  );
}
