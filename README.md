# Styloverse

Styloverse is a full-stack premium fashion commerce reference product built with Next.js 16, React 19, TypeScript, Firebase Authentication and Cloud Firestore. It includes a responsive storefront, customer account, safe demonstration checkout, and a role-protected operations suite for orders, products, inventory, customers, content, promotions, aftercare, analytics and settings.

## Safe project mode

This repository intentionally does **not** collect real money or promise real fulfilment. Card, UPI and wallet methods are presentation-ready, but online payment truth can become `Received` only after a future buyer connects a trusted server-side gateway webhook. The default environment remains:

```env
NEXT_PUBLIC_COMMERCE_MODE=demo
NEXT_PUBLIC_PAYMENT_MODE=disabled
```

## Local setup

```powershell
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

Fill the Firebase web configuration values in `.env.local`, then open `http://localhost:3000`. Assign an administrator with `users/{uid}.role = "admin"`; never expose privileged credentials in source control.

## Quality commands

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

`npm.cmd run test:all` executes the complete local quality gate. Playwright covers Chromium, Firefox and WebKit; the Chromium visual matrix captures 360×800, 390×844, 430×932, 768×1024, 1366×768, 1440×900 and 1920×1080.

## Documentation map

- [Buyer handoff](docs/buyer-handoff.md)
- [Administrator guide](docs/admin-user-guide.md)
- [Firebase setup](docs/firebase-setup.md)
- [Database and security model](docs/database-schema.md)
- [Product publishing](docs/product-upload-guide.md)
- [Testing and QA](docs/testing.md)
- [Payment integration boundary](docs/payment-integration.md)
- [Demo and live modes](docs/demo-live-mode.md)
- [Customization and reset](docs/customization-guide.md)
- [Known limitations](docs/known-limitations.md)
- [Portfolio case study](docs/portfolio-case-study.md)
- [Master roadmap](docs/world-class-master-roadmap-handoff.md)

## Main routes

The public experience lives at `/`, `/shop`, `/collections` and `/product/[id]`. Customer features live under `/account`; checkout is authenticated. The private operations suite lives under `/admin` and validates both Firebase authentication and the Firestore admin role.

Copyright © 2026 Styloverse. Portfolio/reference implementation.
