import { expect, test } from "@playwright/test";
import type { JoinFormData } from "../../src/types/join";
import {
  getJoinStepProgress,
  getNextJoinStep,
  isJoinStepComplete,
  JOIN_FORM_STEP_COUNT,
} from "../../src/components/sections/join/join-form-flow";

const completeForm: JoinFormData = {
  fullName: "Test User",
  email: "test@example.com",
  year: "1st year",
  github: "github.com/test-user",
  linkedin: "",
  discord: "test-user",
  interests: ["Web Development (Frontend/Backend)"],
  experience: 3,
  participationPreferences: {
    regularMember: "high",
    eventOrganizer: "medium",
    workshopVolunteer: "low",
  },
  motivation: "",
  builtSomething: "",
  consent: true,
};

test("required steps block forward navigation until complete", () => {
  const incomplete = { ...completeForm, email: "invalid" };

  expect(isJoinStepComplete(0, incomplete)).toBe(false);
  expect(getNextJoinStep(0, 1, incomplete)).toBe(0);
  expect(getNextJoinStep(0, 1, completeForm)).toBe(1);
});

test("back navigation clamps to the first step", () => {
  expect(getNextJoinStep(0, -1, completeForm)).toBe(0);
  expect(getNextJoinStep(3, -1, completeForm)).toBe(2);
});

test("interests, experience, and participation choices gate the third step", () => {
  expect(isJoinStepComplete(2, completeForm)).toBe(true);
  expect(
    isJoinStepComplete(2, {
      ...completeForm,
      participationPreferences: { ...completeForm.participationPreferences, eventOrganizer: null },
    }),
  ).toBe(false);
});

test("step progress is clamped and reaches one on the final step", () => {
  expect(getJoinStepProgress(-1)).toBe(0);
  expect(getJoinStepProgress(0)).toBe(0);
  expect(getJoinStepProgress(JOIN_FORM_STEP_COUNT - 1)).toBe(1);
  expect(getJoinStepProgress(JOIN_FORM_STEP_COUNT + 2)).toBe(1);
});
