"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/ui/animations/fade-up";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JoinFormData } from "@/types/join";
import {
  AVAILABILITY_OPTIONS,
  EMPTY_JOIN_FORM,
  EXPERIENCE_LEVELS,
  INTEREST_AREAS,
  MAX_TEXTAREA_LENGTH,
  YEAR_OPTIONS,
} from "./data";
import { Field, OptionRow, Pill, fieldInputClass } from "./FormField";
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

interface ContinueButtonProps {
  onBack?: () => void;
  disabled?: boolean;
  onClick: () => void;
}

function ContinueButton({ onBack, disabled = false, onClick }: ContinueButtonProps) {
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
          Back
        </Button>
      )}
      <Button
        type="button"
        size="lg"
        disabled={disabled}
        onClick={onClick}
        className="min-h-11 flex-1 rounded-full disabled:cursor-not-allowed sm:flex-none"
      >
        Continue
      </Button>
      {disabled && (
        <p className="basis-full text-xs text-muted-foreground">
          Complete the required fields to continue.
        </p>
      )}
    </div>
  );
}

interface JoinFormProps {
  onActiveStepChange?: (step: number) => void;
}

export function JoinForm({ onActiveStepChange }: JoinFormProps) {
  const [form, setForm] = useState<JoinFormData>(EMPTY_JOIN_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLFormElement>(null);
  const activeStepRef = useRef(0);
  const formStateRef = useRef(form);
  const navigationLockRef = useRef(false);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const applicationRef = useRef<HTMLDivElement>(null);
  const desktopScrollModeRef = useRef(false);
  const yearSliderRef = useRef<HTMLDivElement>(null);
  const yearDraggingRef = useRef(false);
  const ids = useId();

  formStateRef.current = form;

  const canSubmit =
    isJoinStepComplete(0, form) && isJoinStepComplete(1, form) && isJoinStepComplete(4, form);
  const progress = ((activeStep + 1) / JOIN_FORM_STEP_COUNT) * 100;
  const yearIndex = Math.max(YEAR_OPTIONS.indexOf(form.year), 0);

  const setYearFromPointer = useCallback((clientX: number) => {
    const slider = yearSliderRef.current;

    if (!slider) return;

    const bounds = slider.getBoundingClientRect();
    const position = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1);
    const nextYearIndex = Math.round(position * (YEAR_OPTIONS.length - 1));

    setForm((currentForm) => ({ ...currentForm, year: YEAR_OPTIONS[nextYearIndex] }));
  }, []);

  const handleYearPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    yearDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setYearFromPointer(event.clientX);
  };

  const handleYearPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (yearDraggingRef.current) setYearFromPointer(event.clientX);
  };

  const handleYearPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    yearDraggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

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

  const showValidationForStep = useCallback((step: number) => {
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
    setBlockedMessage(
      step === 0
        ? "Add your name and a valid email to continue."
        : step === 1
          ? "Add your GitHub and Discord details to continue."
          : "Complete the required field before continuing.",
    );
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBlockedMessage(null);
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(EMPTY_JOIN_FORM);
    setSubmitted(false);
    activeStepRef.current = 0;
    setActiveStep(0);
    window.requestAnimationFrame(() => scrollToStep(0));
  };

  const motivationCount = useMemo(() => form.motivation.length, [form.motivation]);
  const builtCount = useMemo(() => form.builtSomething.length, [form.builtSomething]);

  if (submitted) {
    return (
      <section
        id="join-application"
        className="mx-auto flex min-h-svh w-full max-w-3xl items-center px-6 py-24"
      >
        <SuccessPanel fullName={form.fullName} email={form.email} onReset={resetForm} />
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
        className="join-form-progress sticky inset-x-0 top-[4.25rem] z-30 bg-slate-950/80 backdrop-blur-md"
      >
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
        <div className="join-form-progress-meta px-4 py-2.5 md:px-6">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 text-xs text-white/80">
            <p aria-live="polite" className="min-h-5 font-medium text-white">
              {blockedMessage}
            </p>
            <p className="shrink-0 font-mono tabular-nums">
              {String(activeStep + 1).padStart(2, "0")} /{" "}
              {String(JOIN_FORM_STEP_COUNT).padStart(2, "0")}
            </p>
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
            eyebrow="Start with the basics"
            title="Who's applying"
            description="Start with your contact details so we know who is applying."
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
                placeholder="giorgos@mail.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Year" optional>
                <select
                  id={`${ids}-year-mobile`}
                  aria-label="Year of study"
                  value={form.year}
                  onChange={(event) =>
                    setForm((currentForm) => ({ ...currentForm, year: event.target.value }))
                  }
                  className={cn(fieldInputClass, "md:hidden")}
                >
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div
                  ref={yearSliderRef}
                  onPointerDown={handleYearPointerDown}
                  onPointerMove={handleYearPointerMove}
                  onPointerUp={handleYearPointerEnd}
                  onPointerCancel={handleYearPointerEnd}
                  className="relative hidden touch-none select-none py-1 md:block"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-6 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/20"
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
                      style={{
                        width: `${(yearIndex / (YEAR_OPTIONS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <input
                    id={`${ids}-year`}
                    type="range"
                    min={0}
                    max={YEAR_OPTIONS.length - 1}
                    step={1}
                    value={yearIndex}
                    aria-label="Year of study"
                    aria-valuetext={form.year}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, year: YEAR_OPTIONS[Number(e.target.value)] }))
                    }
                    className="sr-only"
                  />
                  <div className="pointer-events-none relative z-10 grid h-14 grid-cols-5 items-center">
                    {YEAR_OPTIONS.map((year, index) => {
                      const selected = form.year === year;
                      const label = selected ? year.replace(" year", "") : String(index + 1);

                      return (
                        <button
                          key={year}
                          type="button"
                          aria-label={`Select ${year}`}
                          aria-pressed={selected}
                          onClick={() => setForm((f) => ({ ...f, year }))}
                          className={cn(
                            "pointer-events-auto mx-auto flex h-12 w-12 items-center justify-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-primary/20",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
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
            description="Share your GitHub and Discord so we can see your work and reach you. LinkedIn is optional."
          >
            <Field label="GitHub" required htmlFor={`${ids}-github`}>
              <input
                id={`${ids}-github`}
                type="text"
                required
                placeholder="github.com/username"
                value={form.github}
                onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>

            <Field label="Discord" required htmlFor={`${ids}-discord`}>
              <input
                id={`${ids}-discord`}
                type="text"
                required
                placeholder="username"
                value={form.discord}
                onChange={(e) => setForm((f) => ({ ...f, discord: e.target.value }))}
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
            eyebrow="What pulls you in"
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

            <ContinueButton
              onBack={() => attemptNavigation(-1)}
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
                placeholder="A course project, a bot, a website for a friend, or a Minecraft mod."
                value={form.builtSomething}
                onChange={(e) => setForm((f) => ({ ...f, builtSomething: e.target.value }))}
                className={cn(fieldInputClass, "resize-none")}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground/70">
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

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => attemptNavigation(-1)}
                className="min-h-11 flex-1 rounded-full sm:flex-none"
              >
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit}
                className="min-h-11 flex-1 rounded-full disabled:cursor-not-allowed sm:flex-none"
              >
                Submit application
              </Button>
              <p className="basis-full text-xs text-muted-foreground">
                {canSubmit
                  ? "You're all set."
                  : "Name, email, GitHub, Discord and consent unlock this."}
              </p>
            </div>
          </FormSection>
        </FormStepScreen>
      </form>
    </div>
  );
}
