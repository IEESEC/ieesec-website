"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type {
  ExperienceLevel,
  InterestArea,
  JoinFormData,
  ParticipationPreference,
  ParticipationRating,
  YearOption,
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
import { useTranslations } from "next-intl";

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
      className={cn(
        "join-form-step min-h-[calc(100svh-7.25rem)] items-start px-4 pb-8 pt-4 md:px-6 md:pb-10",
        active ? "flex" : "hidden",
      )}
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
  web: Code2,
  mobile: Smartphone,
  dataAi: BrainCircuit,
  embedded: Cpu,
  games: Gamepad2,
  testing: TestTubeDiagonal,
  devops: Cloud,
  dsa: Network,
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
  value: YearOption;
  onChange: (value: YearOption) => void;
}

function YearSlider({ id, value, onChange }: YearSliderProps) {
  const t = useTranslations("join.year");
  const selectedIndex = Math.max(YEAR_OPTIONS.indexOf(value), 0);

  return (
    <>
      <select
        id={`${id}-mobile`}
        aria-label={t("label")}
        value={value}
        onChange={(event) => onChange(event.target.value as YearOption)}
        className={cn(fieldInputClass, "join-year-mobile")}
      >
        {YEAR_OPTIONS.map((year) => (
          <option key={year} value={year}>
            {t(year)}
          </option>
        ))}
      </select>

      <div className="join-year-desktop rounded-2xl border border-border bg-secondary/40 px-4 py-4 dark:bg-background/70">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-foreground">
            {t(YEAR_OPTIONS[selectedIndex])}
          </span>
          <span className="text-xs text-muted-foreground">{t("drag")}</span>
        </div>
        <input
          id={id}
          type="range"
          min={0}
          max={YEAR_OPTIONS.length - 1}
          step={1}
          value={selectedIndex}
          onChange={(event) => onChange(YEAR_OPTIONS[Number(event.target.value)])}
          aria-label={t("label")}
          aria-valuetext={t(YEAR_OPTIONS[selectedIndex])}
          className="mt-4 h-2 w-full cursor-grab appearance-none rounded-full bg-muted accent-primary active:cursor-grabbing"
        />
        <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[0.68rem] font-medium text-muted-foreground">
          {YEAR_OPTIONS.map((year, index) => (
            <button
              key={year}
              type="button"
              onClick={() => onChange(year)}
              className={cn(
                "min-h-11 rounded-md px-1 py-1 transition-colors cursor-pointer",
                selectedIndex === index && "bg-primary/10 text-primary",
              )}
            >
              {t(`short${index + 1}${index === 4 ? "plus" : ""}`)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

interface InterestCardProps {
  area: InterestArea;
  selected: boolean;
  onClick: () => void;
}

function InterestCard({ area, selected, onClick }: InterestCardProps) {
  const Icon = INTEREST_ICONS[area];
  const t = useTranslations("join.interests");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex min-h-16 items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-all cursor-pointer",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground hover:border-primary/60 hover:bg-primary/5 dark:bg-background/70",
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
      <span className="leading-snug">{t(area)}</span>
    </button>
  );
}

interface ExperienceScaleProps {
  value: ExperienceLevel | null;
  onChange: (value: ExperienceLevel) => void;
}

function ExperienceScale({ value, onChange }: ExperienceScaleProps) {
  const t = useTranslations("join.experience");
  return (
    <div
      role="radiogroup"
      aria-label={t("label")}
      className="rounded-2xl border border-border bg-secondary/40 p-4 dark:bg-background/70"
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
                : "border-input bg-background hover:border-primary",
            )}
          >
            <span className="sr-only">{t("level", { level })}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-between gap-4 text-xs text-muted-foreground">
        <span className="max-w-40 leading-snug">{t("beginner")}</span>
        <span className="max-w-56 text-right leading-snug">{t("advanced")}</span>
      </div>
    </div>
  );
}

interface ParticipationMatrixProps {
  values: Record<ParticipationPreference, ParticipationRating | null>;
  onChange: (preference: ParticipationPreference, rating: ParticipationRating) => void;
}

function ParticipationMatrix({ values, onChange }: ParticipationMatrixProps) {
  const ratings = useTranslations("join.ratings");
  const participation = useTranslations("join.participation");
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background dark:bg-background/70">
      <div className="grid grid-cols-[minmax(5.8rem,1fr)_repeat(4,minmax(2.7rem,0.55fr))] border-b border-border px-2 py-2 text-center text-[0.62rem] font-semibold text-muted-foreground sm:grid-cols-[minmax(7.5rem,1.1fr)_repeat(4,minmax(3.6rem,0.7fr))] sm:px-3 sm:text-[0.68rem]">
        <span className="text-left">{ratings("preference")}</span>
        {PARTICIPATION_RATINGS.map((rating) => (
          <span key={rating} className="leading-tight">
            {ratings(rating)}
          </span>
        ))}
      </div>
      {PARTICIPATION_ROWS.map((preference) => (
        <div
          key={preference}
          className="grid grid-cols-[minmax(5.8rem,1fr)_repeat(4,minmax(2.7rem,0.55fr))] items-center border-b border-border/80 px-2 py-3 last:border-b-0 sm:grid-cols-[minmax(7.5rem,1.1fr)_repeat(4,minmax(3.6rem,0.7fr))] sm:px-3"
        >
          <p className="pr-3 text-xs font-semibold leading-snug text-foreground">
            {participation(preference)}
          </p>
          {PARTICIPATION_RATINGS.map((rating) => (
            <button
              key={rating}
              type="button"
              role="radio"
              aria-checked={values[preference] === rating}
              aria-label={`${participation(preference)}: ${ratings(rating)}`}
              onClick={() => onChange(preference, rating)}
              className="mx-auto flex size-5 cursor-pointer items-center justify-center rounded-full border border-input bg-background transition-all hover:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2.5 rounded-full transition-transform",
                  values[preference] === rating ? "scale-100 bg-primary" : "scale-0 bg-transparent",
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
  onBack?: () => void;
  disabled?: boolean;
  onClick: () => void;
}

function ContinueButton({ onBack, disabled = false, onClick }: ContinueButtonProps) {
  const t = useTranslations("join");
  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      {onBack && (
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={onBack}
          className="min-h-11 flex-1 rounded-full sm:flex-none"
        >
          {t("back")}
        </Button>
      )}
      <Button
        type="button"
        size="lg"
        disabled={disabled}
        onClick={onClick}
        className="min-h-11 flex-1 rounded-full disabled:cursor-not-allowed sm:flex-none"
      >
        {t("continue")}
      </Button>
      {disabled && (
        <p className="basis-full text-xs text-muted-foreground">{t("completeRequired")}</p>
      )}
    </div>
  );
}

interface JoinFormProps {
  onActiveStepChange?: (step: number) => void;
}

export function JoinForm({ onActiveStepChange }: JoinFormProps) {
  const t = useTranslations("join");
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
  const applicationRef = useRef<HTMLDivElement>(null);
  const desktopScrollModeRef = useRef(false);
  const ids = useId();

  formStateRef.current = form;

  const canSubmit = Array.from({ length: JOIN_FORM_STEP_COUNT }, (_, step) =>
    isJoinStepComplete(step, form),
  ).every(Boolean);
  const progress = ((activeStep + 1) / JOIN_FORM_STEP_COUNT) * 100;

  useEffect(() => {
    onActiveStepChange?.(activeStep);
  }, [activeStep, onActiveStepChange]);

  useEffect(() => {
    const desktopScrollMode = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const updateMode = () => {
      desktopScrollModeRef.current = desktopScrollMode.matches;
    };

    updateMode();
    desktopScrollMode.addEventListener("change", updateMode);
    return () => desktopScrollMode.removeEventListener("change", updateMode);
  }, []);

  const scrollToStep = useCallback((step: number) => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    activeStepRef.current = step;
    setActiveStep(step);
    setBlockedMessage(null);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

    if (desktopScrollModeRef.current) {
      scroller.scrollTo({ top: step * scroller.clientHeight, behavior });
      return;
    }

    window.requestAnimationFrame(() => {
      applicationRef.current?.scrollIntoView({ block: "start", behavior });
    });
  }, []);

  const showValidationForStep = useCallback(
    (step: number) => {
      const section =
        scrollerRef.current?.querySelectorAll<HTMLElement>("[data-join-form-step]")[step];
      const invalidField = section?.querySelector<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >(":invalid");

      invalidField?.reportValidity();
      invalidField?.focus({ preventScroll: desktopScrollModeRef.current });
      if (!desktopScrollModeRef.current) {
        invalidField?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      const messages = [
        t("validation.identity"),
        t("validation.links"),
        t("validation.interests"),
        t("validation.generic"),
        t("validation.consent"),
      ];

      setBlockedMessage(messages[step] ?? t("completeRequired"));
    },
    [t],
  );

  const attemptNavigation = useCallback(
    (direction: -1 | 1): boolean => {
      const currentStep = activeStepRef.current;

      if (direction < 0 && currentStep === 0) return false;

      const nextStep = getNextJoinStep(currentStep, direction, formStateRef.current);

      if (nextStep === currentStep) {
        if (direction > 0 && currentStep < JOIN_FORM_STEP_COUNT - 1) {
          showValidationForStep(currentStep);
        } else if (direction > 0) {
          setBlockedMessage(t("submitToFinish"));
        }

        return true;
      }

      scrollToStep(nextStep);
      return true;
    },
    [scrollToStep, showValidationForStep, t],
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
    const desktopScrollMode = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    let removeDesktopHandlers = () => undefined;

    const configureDesktopHandlers = () => {
      removeDesktopHandlers();
      desktopScrollModeRef.current = desktopScrollMode.matches;

      if (!desktopScrollMode.matches) return;

      let accumulatedWheelDelta = 0;

      const lockNavigation = () => {
        navigationLockRef.current = true;
        if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = setTimeout(() => {
          navigationLockRef.current = false;
        }, 650);
      };

      const handleWheel = (event: WheelEvent) => {
        if (event.deltaY === 0) return;

        const direction: -1 | 1 = event.deltaY > 0 ? 1 : -1;
        const target = event.target instanceof Element ? event.target : null;
        const stepContent = target?.closest<HTMLElement>("[data-join-step-scroll]");

        if (direction > 0 && scroller.getBoundingClientRect().top > 1) {
          event.preventDefault();
          applicationRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
          return;
        }

        if (stepContent && canScrollWithin(stepContent, direction)) {
          accumulatedWheelDelta = 0;
          return;
        }

        if (direction < 0 && activeStepRef.current === 0) return;

        event.preventDefault();
        accumulatedWheelDelta += event.deltaY;

        if (Math.abs(accumulatedWheelDelta) < 24 || navigationLockRef.current) return;

        const accumulatedDirection: -1 | 1 = accumulatedWheelDelta > 0 ? 1 : -1;
        accumulatedWheelDelta = 0;
        attemptNavigation(accumulatedDirection);
        lockNavigation();
      };

      const keepCurrentStepAligned = () => {
        scroller.scrollTo({ top: activeStepRef.current * scroller.clientHeight, behavior: "auto" });
      };

      scroller.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("resize", keepCurrentStepAligned);

      removeDesktopHandlers = () => {
        scroller.removeEventListener("wheel", handleWheel);
        window.removeEventListener("resize", keepCurrentStepAligned);
      };
    };

    configureDesktopHandlers();
    desktopScrollMode.addEventListener("change", configureDesktopHandlers);

    return () => {
      removeDesktopHandlers();
      desktopScrollMode.removeEventListener("change", configureDesktopHandlers);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, [attemptNavigation]);

  const handleStepKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.repeat || !desktopScrollModeRef.current) return;

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
        setBlockedMessage(t("submitError"));
        return;
      }

      setSubmitted(true);
    } catch {
      setBlockedMessage(t("submitError"));
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
    <div
      ref={applicationRef}
      id="join-application"
      data-testid="join-form-shell"
      className="join-form-shell relative min-h-svh w-full scroll-mt-[4.25rem]"
    >
      <div
        data-testid="join-progress"
        className="join-form-progress sticky inset-x-0 top-[4.25rem] z-30"
      >
        <div
          role="progressbar"
          aria-label={t("progress")}
          aria-valuemin={1}
          aria-valuemax={JOIN_FORM_STEP_COUNT}
          aria-valuenow={activeStep + 1}
          className="h-1 overflow-hidden bg-foreground/15 dark:bg-white/15"
        >
          <div
            className="h-full origin-left bg-primary transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <div className="join-form-progress-meta px-4 py-2.5 md:px-6">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 text-xs text-foreground/75 dark:text-white/80">
            <p aria-live="polite" className="min-h-5 font-medium text-foreground dark:text-white">
              {blockedMessage}
            </p>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden items-center gap-1.5 rounded-full border border-amber-700/65 bg-amber-100/95 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-amber-950 shadow-sm shadow-amber-950/10 sm:inline-flex dark:border-amber-300/45 dark:bg-amber-400/14 dark:text-amber-100 dark:shadow-none">
                <AlertTriangle aria-hidden className="size-3" />
                {t("experimental")}
              </span>
              <p className="font-mono tabular-nums">
                {String(activeStep + 1).padStart(2, "0")} /{" "}
                {String(JOIN_FORM_STEP_COUNT).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        ref={scrollerRef}
        data-scroll-video-timeline
        onSubmit={handleSubmit}
        onKeyDown={handleStepKeyDown}
        className="join-form-timeline overflow-visible"
      >
        <FormStepScreen active={activeStep === 0}>
          <FormSection
            step="01"
            eyebrow={t("steps.identity.eyebrow")}
            title={t("steps.identity.title")}
            description={t("steps.identity.description")}
          >
            <Field label={t("steps.identity.name")} required htmlFor={`${ids}-name`}>
              <input
                id={`${ids}-name`}
                type="text"
                required
                placeholder={t("steps.identity.namePlaceholder")}
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <Field label={t("steps.identity.email")} required htmlFor={`${ids}-email`}>
              <input
                id={`${ids}-email`}
                type="email"
                required
                placeholder="giorgos@mail.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5">
              <Field label={t("steps.identity.year")} required>
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
            eyebrow={t("steps.links.eyebrow")}
            title={t("steps.links.title")}
            description={t("steps.links.description")}
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
              onBack={() => attemptNavigation(-1)}
              disabled={!isJoinStepComplete(1, form)}
              onClick={() => attemptNavigation(1)}
            />
          </FormSection>
        </FormStepScreen>

        <FormStepScreen active={activeStep === 2} delay={0.1}>
          <FormSection
            step="03"
            eyebrow={t("steps.interests.eyebrow")}
            title={t("steps.interests.title")}
            description={t("steps.interests.description")}
          >
            <Field label={t("steps.interests.areas")} required hint={t("steps.interests.pickOne")}>
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
              label={t("steps.interests.experience")}
              required
              hint={t("steps.interests.experienceHint")}
            >
              <ExperienceScale
                value={form.experience}
                onChange={(experience) => setForm((f) => ({ ...f, experience }))}
              />
            </Field>

            <Field
              label={t("steps.interests.participation")}
              required
              hint={t("steps.interests.participationHint")}
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
              onBack={() => attemptNavigation(-1)}
              disabled={!isJoinStepComplete(2, form)}
              onClick={() => attemptNavigation(1)}
            />
          </FormSection>
        </FormStepScreen>

        <FormStepScreen active={activeStep === 3} delay={0.15}>
          <FormSection
            step="04"
            eyebrow={t("steps.details.eyebrow")}
            title={t("steps.details.title")}
            description={t("steps.details.description")}
          >
            <Field label={t("steps.details.idea")} optional htmlFor={`${ids}-motivation`}>
              <textarea
                id={`${ids}-motivation`}
                rows={3}
                maxLength={MAX_TEXTAREA_LENGTH}
                placeholder={t("steps.details.ideaPlaceholder")}
                value={form.motivation}
                onChange={(e) => setForm((f) => ({ ...f, motivation: e.target.value }))}
                className={cn(fieldInputClass, "resize-none")}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {motivationCount} / {MAX_TEXTAREA_LENGTH}
              </p>
            </Field>

            <Field label={t("steps.details.projects")} optional htmlFor={`${ids}-built`}>
              <textarea
                id={`${ids}-built`}
                rows={3}
                maxLength={MAX_TEXTAREA_LENGTH}
                placeholder={t("steps.details.projectsPlaceholder")}
                value={form.builtSomething}
                onChange={(e) => setForm((f) => ({ ...f, builtSomething: e.target.value }))}
                className={cn(fieldInputClass, "resize-none")}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {builtCount} / {MAX_TEXTAREA_LENGTH}
              </p>
            </Field>

            <ContinueButton
              onBack={() => attemptNavigation(-1)}
              onClick={() => attemptNavigation(1)}
            />
          </FormSection>
        </FormStepScreen>

        <FormStepScreen active={activeStep === 4} delay={0.2}>
          <FormSection
            step="05"
            eyebrow={t("steps.submit.eyebrow")}
            title={t("steps.submit.title")}
            description={t("steps.submit.description")}
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
                {t("steps.submit.consent")}
                <span className="text-primary"> *</span>{" "}
                <span className="text-primary underline underline-offset-2">
                  {t("steps.submit.privacy")}
                </span>
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => attemptNavigation(-1)}
                className="min-h-11 flex-1 rounded-full sm:flex-none"
              >
                {t("back")}
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit || isSubmitting}
                className="min-h-11 flex-1 rounded-full disabled:cursor-not-allowed sm:flex-none"
              >
                {isSubmitting ? t("steps.submit.submitting") : t("steps.submit.submit")}
              </Button>
              <p className="basis-full text-xs text-muted-foreground">
                {canSubmit ? t("steps.submit.ready") : t("steps.submit.locked")}
              </p>
            </div>
          </FormSection>
        </FormStepScreen>
      </form>
    </div>
  );
}
