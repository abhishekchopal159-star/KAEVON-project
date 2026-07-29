# Phase 1 Remaining Work — File Manifest

The handoff ZIP preserves each file's project-relative path. Extract it into the Styloverse project root without flattening directories.

## Core configuration

- `AGENTS.md`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `eslint.config.mjs`
- `next.config.ts`
- `postcss.config.mjs`
- `.env.example`
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`

## Admin Orders

- `app/admin/`
- `components/admin/`
- `contexts/AdminContext.tsx`
- `services/admin.service.ts`
- `types/admin.ts`
- `lib/order-transitions.ts`

## Authentication and Firebase support

- `contexts/AuthContext.tsx`
- `services/auth.service.ts`
- `services/firestore.service.ts`
- `services/user.service.ts`
- `lib/firebase.ts`
- `types/user.ts`

## Checkout, customer orders and invoice work

- `app/checkout/page.tsx`
- `app/account/`
- `components/account/`
- `components/Navbar/`
- `services/order.service.ts`
- `types/commerce.ts`
- `types/order.ts`
- `types/product.ts`
- `lib/storefront-storage.ts`
- `lib/account-recommendations.ts`

## Styling and documentation

- `app/globals.css`
- `app/layout.tsx`
- `README.md`
- `docs/phase-1-admin-orders-handoff.md`
- `docs/world-class-master-roadmap-handoff.md`
- `docs/admin-architecture.md`
- `docs/firestore-architecture.md`
- `docs/phase-1-remaining-strict-prompt.md`
- `docs/phase-1-remaining-file-manifest.md`

Secrets and generated folders are intentionally excluded: `.env.local`, `.next/`, `node_modules/`, Firebase credentials and service-account files.
