import { expect, test } from "@playwright/test";

const privacyPages = [
  {
    locale: "en",
    linkLabel: "Read the privacy notice",
    heading: "Privacy notice for join applications",
  },
  {
    locale: "el",
    linkLabel: "Διάβασε την ενημέρωση απορρήτου",
    heading: "Ενημέρωση απορρήτου για αιτήσεις συμμετοχής",
  },
] as const;

for (const privacyPage of privacyPages) {
  test(`${privacyPage.locale} join form links to its localized privacy notice`, async ({ page }) => {
    await page.goto(`/${privacyPage.locale}/join`);

    const privacyLink = page.getByRole("link", { name: privacyPage.linkLabel });
    await expect(privacyLink).toHaveAttribute("href", `/${privacyPage.locale}/privacy`);

    await privacyLink.click();
    await expect(page).toHaveURL(new RegExp(`/${privacyPage.locale}/privacy$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(privacyPage.heading);
    await expect(page.getByRole("link", { name: "ieesec.ihu@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:ieesec.ihu@gmail.com",
    );
  });
}

test("privacy routes are included in the sitemap", async ({ request }) => {
  const response = await request.get("/sitemap.xml");

  expect(response.ok()).toBe(true);
  const sitemap = await response.text();
  expect(sitemap).toContain("/el/privacy</loc>");
  expect(sitemap).toContain("/en/privacy</loc>");
});
