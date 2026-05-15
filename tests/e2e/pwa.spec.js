import { expect, test } from '@playwright/test';

test.describe('PWA shell', () => {
  test('homepage loads with install metadata', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /fuel management that works/i })
    ).toBeVisible();
    await expect(page.getByText('Offline-ready', { exact: true })).toBeVisible();
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      'href',
      '/manifest.webmanifest'
    );
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#e2ecfc'
    );
    expect(pageErrors).toEqual([]);
  });

  test('manifest is valid and icons are reachable', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest.name).toBe('FuelFlo App');
    expect(manifest.short_name).toBe('FuelFlo');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: '/icons/icon-192.png' }),
        expect.objectContaining({ src: '/icons/icon-512.png' }),
      ])
    );

    for (const icon of manifest.icons) {
      const iconResponse = await request.get(icon.src);
      expect(iconResponse.ok()).toBeTruthy();
      expect(iconResponse.headers()['content-type']).toContain('image/png');
    }
  });

  test('service worker asset includes offline fallback support', async ({
    request,
  }) => {
    const response = await request.get('/sw.js');
    expect(response.ok()).toBeTruthy();

    const serviceWorker = await response.text();
    expect(serviceWorker).toContain('/offline');
    expect(serviceWorker).toContain('caches.open');
    expect(serviceWorker).toContain('fetch');
  });

  test('offline page renders recovery UI', async ({ page }) => {
    await page.goto('/offline');

    await expect(page.getByText('Offline mode')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /connection lost/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
  });

  test('registers a service worker in chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Service worker support is browser-specific.');

    await page.goto('/');

    const hasRegistration = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;

      const registration =
        (await navigator.serviceWorker.getRegistration('/')) ||
        (await navigator.serviceWorker.ready);

      return Boolean(registration);
    });

    expect(hasRegistration).toBe(true);
  });
});
