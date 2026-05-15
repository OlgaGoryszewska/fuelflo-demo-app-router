# E2E Tests

These tests use Playwright to exercise the app in a real browser.

Useful commands:

```bash
npm run test:pwa
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
npm run test:auth
```

The first suite focuses on PWA health: landing page render, manifest, icons,
service worker asset, offline page, and browser service-worker registration.

Authenticated Supabase flows should be added with dedicated test users and safe
seed data before testing create/update/delete production workflows.

Authenticated checks are skipped unless these environment variables are present:

```bash
E2E_EMAIL="technician@example.com" E2E_PASSWORD="..." npm run test:auth
```

Use a dedicated test user, never a real production operator account.
