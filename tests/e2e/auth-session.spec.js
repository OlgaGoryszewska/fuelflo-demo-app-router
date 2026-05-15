import { expect, test } from '@playwright/test';

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

async function signIn(page) {
  await page.goto('/');

  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/operations\/dashboard\/|\/resources\/projects/);
  await expect(page.getByText(/FuelFlo/i).first()).toBeVisible();
}

test.describe('authenticated session', () => {
  test.beforeEach(() => {
    test.skip(
      !email || !password,
      'Set E2E_EMAIL and E2E_PASSWORD to run authenticated flow tests.'
    );
  });

  test('user stays signed in after reload and returning home', async ({ page }) => {
    await signIn(page);

    const signedInUrl = page.url();

    await page.reload();
    await expect(page).toHaveURL(signedInUrl);
    await expect(page.getByText(/FuelFlo/i).first()).toBeVisible();

    await page.goto('/');
    await expect(page.getByRole('link', { name: /go to dashboard/i })).toBeVisible();
    await expect(page.getByText(/sign in to access/i)).toBeHidden();
  });

  test('project page does not expose financial labels to technicians', async ({
    page,
  }) => {
    await signIn(page);

    const roleText = await page.locator('body').innerText();
    test.skip(
      !/technician/i.test(roleText),
      'This check requires E2E credentials for a technician profile.'
    );

    await page.goto('/resources/projects');
    const firstProject = page.locator('a[href^="/resources/projects/"]').first();

    await expect(firstProject).toBeVisible();
    await firstProject.click();

    await expect(page.getByText(/Fuel financials/i)).toHaveCount(0);
    await expect(page.getByText(/Gross margin/i)).toHaveCount(0);
    await expect(page.getByText(/Buy price/i)).toHaveCount(0);
    await expect(page.getByText(/Sell price/i)).toHaveCount(0);
  });
});
