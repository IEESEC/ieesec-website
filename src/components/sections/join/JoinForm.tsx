"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { JoinFormData } from "@/types/join";
import { EMPTY_JOIN_FORM } from "./data";
import {
  getNextJoinStep,
  isJoinFormDirty,
  isJoinStepComplete,
  JOIN_FORM_STEP_COUNT,
} from "./join-form-flow";
import { JoinFormProgress, JoinFormSteps } from "./JoinFormSteps";
import { SuccessPanel } from "./SuccessPanel";
import { useTranslations } from "next-intl";

function canScrollWithin(element: HTMLElement, direction: -1 | 1): boolean {
  if (direction > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
  }

  return element.scrollTop > 1;
}

interface JoinFormProps {
  activeStep: number;
  onActiveStepChange: (step: number) => void;
}

export function JoinForm({ activeStep, onActiveStepChange }: JoinFormProps) {
  const t = useTranslations("join");
  const [form, setForm] = useState<JoinFormData>(EMPTY_JOIN_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLFormElement>(null);
  const activeStepRef = useRef(0);
  const formStateRef = useRef(form);
  const navigationLockRef = useRef(false);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelAccumulationRef = useRef(0);
  const applicationRef = useRef<HTMLDivElement>(null);
  const desktopScrollModeRef = useRef(false);
  const ids = useId();

  const canSubmit = Array.from({ length: JOIN_FORM_STEP_COUNT }, (_, step) =>
    isJoinStepComplete(step, form),
  ).every(Boolean);

  useEffect(() => {
    formStateRef.current = form;
  }, [form]);

  const scrollToStep = useCallback(
    (step: number) => {
      const scroller = scrollerRef.current;

      if (!scroller) return;

      activeStepRef.current = step;
      onActiveStepChange(step);
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
    },
    [onActiveStepChange],
  );

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

  const clearNavigationTimeout = useCallback(() => {
    if (navigationTimeoutRef.current === null) return;

    clearTimeout(navigationTimeoutRef.current);
    navigationTimeoutRef.current = null;
  }, []);

  const lockNavigation = useCallback(() => {
    navigationLockRef.current = true;
    clearNavigationTimeout();
    navigationTimeoutRef.current = setTimeout(() => {
      navigationLockRef.current = false;
      navigationTimeoutRef.current = null;
    }, 650);
  }, [clearNavigationTimeout]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!desktopScrollModeRef.current || event.deltaY === 0) return;

      const direction: -1 | 1 = event.deltaY > 0 ? 1 : -1;
      const target = event.target instanceof Element ? event.target : null;
      const stepContent = target?.closest<HTMLElement>("[data-join-step-scroll]");
      const scroller = scrollerRef.current;

      if (!scroller) return;

      if (direction > 0 && scroller.getBoundingClientRect().top > 1) {
        event.preventDefault();
        applicationRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }

      if (stepContent && canScrollWithin(stepContent, direction)) {
        wheelAccumulationRef.current = 0;
        return;
      }

      if (direction < 0 && activeStepRef.current === 0) return;

      event.preventDefault();
      wheelAccumulationRef.current += event.deltaY;

      if (Math.abs(wheelAccumulationRef.current) < 24 || navigationLockRef.current) return;

      const accumulatedDirection: -1 | 1 = wheelAccumulationRef.current > 0 ? 1 : -1;
      wheelAccumulationRef.current = 0;
      attemptNavigation(accumulatedDirection);
      lockNavigation();
    },
    [attemptNavigation, lockNavigation],
  );

  const handleResize = useCallback(() => {
    if (!desktopScrollModeRef.current) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollTo({ top: activeStepRef.current * scroller.clientHeight, behavior: "auto" });
  }, []);

  const handleDesktopModeChange = useCallback(
    (event: MediaQueryListEvent) => {
      desktopScrollModeRef.current = event.matches;
      wheelAccumulationRef.current = 0;

      if (!event.matches) {
        clearNavigationTimeout();
        navigationLockRef.current = false;
      }
    },
    [clearNavigationTimeout],
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
    desktopScrollModeRef.current = desktopScrollMode.matches;
    scroller.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);
    desktopScrollMode.addEventListener("change", handleDesktopModeChange);

    return () => {
      scroller.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      desktopScrollMode.removeEventListener("change", handleDesktopModeChange);
      if (navigationTimeoutRef.current !== null) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
      navigationLockRef.current = false;
      wheelAccumulationRef.current = 0;
    };
  }, [handleDesktopModeChange, handleResize, handleWheel]);

  const handleStepKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.repeat || !desktopScrollModeRef.current) return;

    const isFormControl = (event.target as HTMLElement).matches("input, textarea, select, button");
    const direction: -1 | 1 | null =
      event.key === "PageDown" || (!isFormControl && ["ArrowDown", " "].includes(event.key))
        ? 1
        : event.key === "PageUp" || (!isFormControl && event.key === "ArrowUp")
          ? -1
          : null;

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
      <JoinFormProgress activeStep={activeStep} blockedMessage={blockedMessage} />

      <form
        ref={scrollerRef}
        data-scroll-video-timeline
        onSubmit={handleSubmit}
        onKeyDown={handleStepKeyDown}
        className="join-form-timeline overflow-visible"
      >
        <JoinFormSteps
          activeStep={activeStep}
          canSubmit={canSubmit}
          form={form}
          ids={ids}
          isSubmitting={isSubmitting}
          onNavigate={attemptNavigation}
          setForm={setForm}
        />
      </form>
    </div>
  );
}
