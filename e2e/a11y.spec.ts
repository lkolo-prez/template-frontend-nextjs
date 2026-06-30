import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Accessibility checks with axe-core. We assert zero violations on the WCAG
 * 2.1 A/AA rule sets for the key pages. New violations fail CI.
 */
const pages = ["/", "/about"];

for (const path of pages) {
  test(`has no detectable a11y violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
