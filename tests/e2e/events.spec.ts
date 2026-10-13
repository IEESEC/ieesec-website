import { expect, test } from "@playwright/test";

test("events render one focused upcoming card with past cards around it", async ({ page }) => {
  for (const locale of ["el", "en"]) {
    await page.goto(`/${locale}#events`);
    const section = page.locator("#events");

    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(section.getByTestId("events-upcoming-heading")).toHaveCount(0);
    await expect(section.getByTestId("event-carousel")).toHaveAttribute(
      "aria-roledescription",
      "carousel",
    );
    await expect(section.getByTestId("event-card")).toHaveCount(4);
    await expect(section.locator('[data-focused="true"]')).toHaveCount(1);
    await expect(
      section.locator('[data-focused="true"] [data-testid="event-countdown"]'),
    ).toBeVisible();
    await expect(
      section.getByRole("button", {
        name: locale === "el" ? "Προηγούμενη εκδήλωση" : "Previous event",
      }),
    ).toBeVisible();
    await expect(
      section.getByRole("button", { name: locale === "el" ? "Επόμενη εκδήλωση" : "Next event" }),
    ).toBeVisible();
    await expect(section.getByText("02 / 04", { exact: true })).toHaveCount(0);

    const focusedBox = await section.locator('[data-focused="true"]').boundingBox();
    const previousBox = await section
      .getByRole("button", { name: locale === "el" ? "Προηγούμενη εκδήλωση" : "Previous event" })
      .boundingBox();
    const nextBox = await section
      .getByRole("button", { name: locale === "el" ? "Επόμενη εκδήλωση" : "Next event" })
      .boundingBox();
    expect(focusedBox).not.toBeNull();
    expect(previousBox).not.toBeNull();
    expect(nextBox).not.toBeNull();
    expect(previousBox!.x + previousBox!.width).toBeLessThan(focusedBox!.x + focusedBox!.width / 2);
    expect(nextBox!.x).toBeGreaterThan(focusedBox!.x + focusedBox!.width / 2);

    await section
      .getByRole("button", { name: locale === "el" ? "Επόμενη εκδήλωση" : "Next event" })
      .click();
    await expect(section.locator('[data-focused="true"]')).toHaveCount(1);
    await expect(section.locator('[data-focused="true"]')).toHaveAttribute(
      "data-event-id",
      "past-workshop",
    );
  }
});
