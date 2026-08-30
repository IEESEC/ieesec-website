import type { JoinFormData } from "@/types/join";

export const JOIN_FORM_STEP_COUNT = 5;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;
const DEFAULT_YEAR = "1st year";

export function isJoinStepComplete(step: number, form: JoinFormData): boolean {
  if (step === 0) {
    return form.fullName.trim().length > 0 && EMAIL_PATTERN.test(form.email.trim());
  }

  if (step === 1) {
    return form.github.trim().length > 0 && form.discord.trim().length > 0;
  }

  if (step === JOIN_FORM_STEP_COUNT - 1) return form.consent;

  return true;
}

export function getNextJoinStep(
  currentStep: number,
  direction: -1 | 1,
  form: JoinFormData,
): number {
  if (direction < 0) return Math.max(currentStep - 1, 0);
  if (!isJoinStepComplete(currentStep, form)) return currentStep;

  return Math.min(currentStep + 1, JOIN_FORM_STEP_COUNT - 1);
}

export function isJoinFormDirty(form: JoinFormData): boolean {
  return (
    form.fullName.trim().length > 0 ||
    form.email.trim().length > 0 ||
    form.year !== DEFAULT_YEAR ||
    form.status !== null ||
    form.github.trim().length > 0 ||
    form.linkedin.trim().length > 0 ||
    form.discord.trim().length > 0 ||
    form.interests.length > 0 ||
    form.experience !== null ||
    form.availability !== null ||
    form.motivation.trim().length > 0 ||
    form.builtSomething.trim().length > 0 ||
    form.consent
  );
}
