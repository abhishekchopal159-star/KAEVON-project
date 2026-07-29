# Buyer Handoff

## Included

- premium responsive storefront and mobile-specific experience;
- Firebase authentication, customer profile, cart, wishlist, checkout and order history;
- role-protected admin operations across orders, returns, products, inventory, customers, content, promotions, analytics and settings;
- transaction-oriented stock/order architecture, invoices/exports and audit context;
- SEO metadata, robots, sitemap, accessibility improvements and error states;
- Vitest + Playwright quality suite and seven visual viewport baselines;
- complete setup, operations, customization, payment and limitation documentation.

## Acceptance sequence

1. Install dependencies and create `.env.local` from `.env.example`.
2. Configure a new Firebase project and deploy `firestore.rules`.
3. Assign the buyer administrator UID.
4. Run `npm.cmd run test:all`.
5. Review the storefront and admin suite on desktop, tablet and mobile.
6. Replace brand/catalogue/policies and rerun the gate.
7. Add external delivery/payment services under a separate commercial scope.

## Delivery hygiene

Never deliver `.env.local`, Firebase CLI tokens, customer/order exports, `test-results`, `playwright-report`, `.next` or `node_modules`. Deliver source, lockfile, rules, public assets, tests and docs. See [known-limitations.md](known-limitations.md) for explicit external boundaries.
