# E2E Tests

These tests use Playwright to exercise the app in a real browser.

Useful commands:

```bash
npm run test:pwa
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

The first suite focuses on PWA health: landing page render, manifest, icons,
service worker asset, offline page, and browser service-worker registration.

Authenticated Supabase flows should be added with dedicated test users and safe
seed data before testing create/update/delete production workflows.
