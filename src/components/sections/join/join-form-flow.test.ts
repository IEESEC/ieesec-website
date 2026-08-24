import assert from "node:assert/strict";
import { describe, it } from "node:test";

// @ts-expect-error Node's type-stripping test runner requires the explicit TypeScript extension.
import { EMPTY_JOIN_FORM } from "./data.ts";
// @ts-expect-error Node's type-stripping test runner requires the explicit TypeScript extension.
import { getNextJoinStep, isJoinFormDirty, isJoinStepComplete } from "./join-form-flow.ts";

describe("isJoinStepComplete", () => {
  it("keeps the first section locked until name and a valid email are filled", () => {
    assert.equal(isJoinStepComplete(0, EMPTY_JOIN_FORM), false);
    assert.equal(
      isJoinStepComplete(0, {
        ...EMPTY_JOIN_FORM,
        fullName: "Maria Papadopoulou",
        email: "not-an-email",
      }),
      false,
    );
    assert.equal(
      isJoinStepComplete(0, {
        ...EMPTY_JOIN_FORM,
        fullName: "Maria Papadopoulou",
        email: "maria@ihu.gr",
      }),
      true,
    );
  });

  it("allows the optional middle sections to advance", () => {
    assert.equal(isJoinStepComplete(1, EMPTY_JOIN_FORM), true);
    assert.equal(isJoinStepComplete(2, EMPTY_JOIN_FORM), true);
    assert.equal(isJoinStepComplete(3, EMPTY_JOIN_FORM), true);
  });
});

describe("getNextJoinStep", () => {
  it("does not advance past an incomplete section", () => {
    assert.equal(getNextJoinStep(0, 1, EMPTY_JOIN_FORM), 0);
  });

  it("advances one screen when the current section is complete", () => {
    const completedIdentity = {
      ...EMPTY_JOIN_FORM,
      fullName: "Maria Papadopoulou",
      email: "maria@ihu.gr",
    };

    assert.equal(getNextJoinStep(0, 1, completedIdentity), 1);
    assert.equal(getNextJoinStep(1, 1, completedIdentity), 2);
  });

  it("always allows returning to an earlier section and clamps at the ends", () => {
    assert.equal(getNextJoinStep(3, -1, EMPTY_JOIN_FORM), 2);
    assert.equal(getNextJoinStep(0, -1, EMPTY_JOIN_FORM), 0);
    assert.equal(getNextJoinStep(4, 1, EMPTY_JOIN_FORM), 4);
  });
});

describe("isJoinFormDirty", () => {
  it("is false for the untouched default form", () => {
    assert.equal(isJoinFormDirty(EMPTY_JOIN_FORM), false);
  });

  it("becomes true after any meaningful form edit", () => {
    assert.equal(isJoinFormDirty({ ...EMPTY_JOIN_FORM, year: "2nd year" }), true);
    assert.equal(isJoinFormDirty({ ...EMPTY_JOIN_FORM, github: "github.com/maria" }), true);
    assert.equal(isJoinFormDirty({ ...EMPTY_JOIN_FORM, consent: true }), true);
  });
});
