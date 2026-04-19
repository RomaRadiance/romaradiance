import { expect, test } from "@playwright/test";

test("root redirects to locale page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|hi)$/);
  await expect(page.getByRole("link", { name: /Roma Tuition home/i })).toBeVisible();
});

test("admin login page loads without redirect loop", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: /Sign in to Roma admin/i })).toBeVisible();
});

test("parent login page loads without redirect loop", async ({ page }) => {
  await page.goto("/parent/login");
  await expect(page).toHaveURL(/\/parent\/login$/);
  await expect(page.getByRole("heading", { name: /Open the private gallery/i })).toBeVisible();
});

test("public about page renders", async ({ page }) => {
  await page.goto("/en/about");
  await expect(page.getByRole("link", { name: /Roma Tuition/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /About \/ Contact/i })).toBeVisible();
});
