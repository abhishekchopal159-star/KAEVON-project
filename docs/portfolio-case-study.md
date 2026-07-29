# Styloverse — Premium Commerce Case Study

## Brief

Design and engineer a sellable fashion-commerce reference product with a luxury editorial identity, mobile-specific behavior and operational depth beyond a visual landing-page prototype—while preventing accidental real payments.

## Solution

Styloverse combines a responsive Next.js storefront with Firebase identity/persistence and a private commerce office. Customers can browse as guests, authenticate when purchasing, manage their account, wishlist/cart, checkout and order lifecycle. Administrators operate catalogue, SKU inventory, customers, promotions, content, orders, aftercare, analytics and settings through role-enforced workflows.

## Technical decisions

- immutable order snapshots and constrained lifecycle transitions;
- SKU reservations and stock movements instead of decorative inventory counts;
- role checks in both UI and Firestore rules;
- webhook-only future online payment truth;
- local fallback catalogue for resilient browsing;
- distinct premium mobile composition instead of shrinking desktop;
- automated unit, integration, accessibility, responsive visual and multi-engine E2E testing.

## Quality outcome

The final local gate passes TypeScript, ESLint, 16 unit/integration tests, a 286-page production build and 40 executed Playwright tests across Chromium, Firefox and WebKit (14 intentional non-Chromium visual-matrix skips). Seven exact viewport baselines detect layout regression. Production dependency audit reports zero vulnerabilities.

## Portfolio presentation

Show the desktop hero, mobile hero, catalogue/detail, customer account, admin overview, order drawer, inventory movement and responsive visual matrix. Explain that payment is intentionally disabled in the public portfolio and can be integrated safely through documented server-side webhook boundaries.
