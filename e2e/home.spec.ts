import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("renders the heading and primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "About this template" }),
    ).toBeVisible();
  });

  test("navigates to the about page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "About this template" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "About" }),
    ).toBeVisible();
  });

  test("sets a strict Content-Security-Policy header", async ({ page }) => {
    const response = await page.goto("/");
    const csp = response?.headers()["content-security-policy"];
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("'unsafe-inline'");
  });

  test("exposes a healthy /api/health endpoint", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
  });
});
