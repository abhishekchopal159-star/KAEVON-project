# Styloverse World-Class Master Roadmap & AI Handoff

Updated: 29 July 2026  
Project root: `C:\Users\abhis\OneDrive\Documents\my website\styloverse-store`

## Product vision

Styloverse is not intended to remain a basic portfolio website. The target is
a complete, sellable premium commerce product whose visual quality, customer
journey, operational depth and technical polish can be presented above the
usual Zara/Apple-inspired project benchmark.

Real payment collection is intentionally disabled during the portfolio phase.
The checkout, order data and admin payment views must remain future-ready so a
buyer can later connect a verified gateway without rebuilding the product.

## Global non-negotiable rules

1. Desktop, tablet and mobile must all feel intentionally designed.
2. Mobile must not be a squeezed desktop layout.
3. Every visible control must work.
4. Fake/sample data is allowed only inside a clearly labelled preview.
5. Real customer data must be account-scoped and persisted through Firebase.
6. Guests may browse; authentication is required at protected buying actions.
7. Only verified admins may see/use the private office.
8. Firestore rules—not hidden buttons—must enforce authorization.
9. Online payment can become Received only from a future trusted webhook.
10. No real payment gateway may be activated during the portfolio phase.
11. Preserve existing user files and dirty-worktree changes.
12. Read `AGENTS.md` and relevant Next.js 16.2.12 local guides before editing.
13. Never use `git reset --hard` or overwrite unrelated user work.
14. A phase is complete only after its build, responsive, interaction,
    accessibility and persistence checks pass.

## Overall status

```text
Original audited world-class readiness: 43–45%
Current documented portfolio/sellable-project readiness: 100%
Remaining implementation scope inside the agreed project: 0%
```

The overall number is scope-weighted. It is not the simple average of every
phase percentage because the storefront foundation and advanced commerce
phases are much larger than documentation-only phases.

## Phase summary

| Stage | Scope | Current phase completion | Overall target after phase |
|---|---|---:|---:|
| Foundation | Existing storefront, auth, account and catalogue | 100% of planned foundation | 43% |
| Phase 1 | Admin Orders Management | 100% of planned implementation | 50% |
| Phase 2 | Inventory, SKU and variants | 100% | 57% |
| Phase 3 | Customers and CRM | 100% | 62% |
| Phase 4 | Categories, collections and CMS | 100% | 68% |
| Phase 5 | Discounts, subscription and loyalty | 100% | 73% |
| Phase 6 | Advanced storefront commerce | 100% | 81% |
| Phase 7 | Delivery, returns, exchange and refunds | 100% | 87% |
| Phase 8 | Personalization and differentiators | 100% of planned local architecture | 92% |
| Phase 9 | Analytics, settings and operations | 100% of planned local architecture | 95% |
| Phase 10 | Performance, accessibility, SEO and security | 100% of planned local implementation | 98% |
| Phase 11 | QA, docs, portfolio and sellable handoff | 100% | 100% |

---

# Foundation — Current base

## Status: 100% of the planned initial foundation

This does not mean the complete site is 100%. It means the base required to
begin operational phases exists.

## Already available

- Next.js App Router project.
- Premium desktop storefront.
- Separate mobile homepage experience.
- Responsive navigation and mobile bottom navigation.
- Hero, category, seasonal and editorial sections.
- Large local product catalogue.
- Shop/category/subcategory pages.
- Product detail pages.
- Dynamic Firestore-published admin products.
- Product create/edit/delete/draft/publish.
- Admin product image optimization.
- Search and category filtering foundation.
- Cart and wishlist.
- Guest browsing.
- Firebase Authentication.
- Google/email/phone authentication flows.
- Account-specific Firestore profile.
- UID-locked email identity.
- Customer dashboard.
- Orders, addresses, notifications, security and settings routes.
- Subscription presentation and admin Privé Gold state.
- Checkout and cloud order creation.
- Role-protected admin foundation.
- Responsive admin overview and navigation.

## Foundation files

```text
app/
components/
contexts/
data/
hooks/
lib/
services/
types/
firestore.rules
storage.rules
```

## Foundation acceptance

- Preserve it while completing later phases.
- Replace remaining local/static commerce behavior with cloud-backed behavior
  only when the relevant phase is implemented and verified.

---

# Phase 1 — Admin Orders Management

## Status: 100% locally implemented; 97% including the live Firebase gate

Detailed handoff:

```text
docs/phase-1-admin-orders-handoff.md
```

## Completed

- Full admin order data contracts.
- Live Firestore subscription.
- Responsive premium order ledger/cards.
- Search, filters and sorting.
- Operational metrics.
- CSV export.
- Order detail dossier.
- Overview/Journey/Payment tabs.
- Product/customer/address/pricing details.
- Order status updates.
- Internal notes.
- Carrier, tracking and estimated delivery.
- Timeline events.
- UPI/Card/Wallet/COD display.
- COD collection pending/received actions.
- Online gateway verification boundary.
- Read-only preview dataset.
- Targeted TypeScript and ESLint passed.
- Preview browser checks passed.

## Pending live acceptance only

1. Authenticate Firebase CLI and deploy the checked-in rules/indexes.
2. Run a real-admin mutation and refresh-persistence test.
3. Verify normal-customer admin-write denial against the deployed rules.

## Main files

```text
components/admin/orders/AdminOrdersManager.tsx
services/admin.service.ts
types/admin.ts
app/admin/(panel)/orders/page.tsx
firestore.rules
```

## Phase 1 definition of done

- Every pending item in `phase-1-admin-orders-handoff.md` passes.
- No customer can mutate another customer's/admin order data.
- Online payment cannot be manually marked Received.
- Orders remain correct after page refresh and account switching.

---

# Phase 2 — Inventory, SKU and variant engine

## Status: 100% complete

Detailed implementation and acceptance evidence:

```text
docs/phase-2-inventory-handoff.md
```

## Implemented

### Data model

```text
products/{productId}
inventoryVariants/{productId__variantId}
inventorySkus/{normalizedSku}
inventoryBarcodes/{normalizedBarcode}

inventoryMovements/{movementId}
  productId
  sku
  type
  quantity
  reason
  orderId
  actorUid
  createdAt
```

### Admin features

- SKU/variant table.
- Size/colour matrix editor.
- Available/reserved/sold stock.
- Low-stock/out-of-stock alerts.
- Stock movement history.
- Manual adjustment with reason.
- Bulk stock import/export.
- Reorder thresholds.
- Inventory search/filter/sort.
- Desktop table and mobile cards.
- Variant-specific images.
- SKU/barcode collision protection.
- Validated CSV import preview and audited application.

### Commerce integration

- Reserve stock while order is active.
- Release reservation on cancellation.
- Deduct stock at confirmed fulfilment stage.
- Record return and damage adjustments with reasons.
- Prevent checkout of unavailable variant.
- Show accurate product-level availability.
- Preserve product/variant/SKU through cart, checkout and order.

## Suggested structure

```text
app/admin/(panel)/inventory/page.tsx
components/admin/inventory/AdminInventoryManager.tsx
services/inventory.service.ts
types/inventory.ts
lib/inventory.ts
```

## Live acceptance evidence

- Rules and indexes deployed to `styloverse-4e247`.
- Real admin inventory loads without permission errors.
- 121 products and 606 SKU variants synchronized.
- All six categories and 11 inventory pages persist after refresh.

---

# Phase 3 — Customers and CRM

## Status: 100% complete

## Already available

- Firebase user profiles.
- Admin overview customer count.
- Role-aware admin reads.
- Customer account/profile/dashboard.
- Customers placeholder route.

## Completed

- Secure customer directory.
- Search and segmentation.
- Customer profile dossier.
- Order history and lifetime spending.
- Wishlist/cart summary.
- Membership level.
- Address summary.
- Return/refund history.
- Internal support notes.
- VIP/high-value tags.
- New/active/returning/dormant segments.
- Customer CSV export.
- Account status and safe support actions.
- Privacy and data-minimization controls.
- Admin cannot edit Firebase login email from a public form.

## Suggested structure

```text
app/admin/(panel)/customers/page.tsx
components/admin/customers/AdminCustomersManager.tsx
components/admin/customers/CustomerDossier.tsx
components/admin/customers/CustomerSegments.tsx
services/customer-admin.service.ts
types/customer-admin.ts
```

## Definition of done

- Admin sees only necessary customer information.
- Customer identity is never mixed across accounts.
- Search, filters and segmentation work at mobile/desktop sizes.
- Admin notes and tags persist with audit information.

---

# Phase 4 — Categories, collections and content CMS

## Status: 100% of planned implementation complete

## Already available

- Static navigation/category data.
- Collection pages and visual collection cards.
- Separate mobile/desktop hero assets.
- Categories placeholder route.

## Completed scope

- Category/subcategory CRUD.
- Collection ordering.
- Navigation menu editor.
- Desktop/mobile homepage hero editor.
- Featured products editor.
- New arrivals editor.
- Seasonal campaigns.
- Editorial lookbook manager.
- Promotional announcement bars.
- Footer/content page editor.
- Homepage section show/hide/reorder.
- Draft/preview/publish workflow.
- Schedule publish/unpublish.
- Fallback asset validation.
- URL/slug conflict protection.

## Suggested structure

```text
app/admin/(panel)/categories/page.tsx
app/admin/(panel)/content/page.tsx
components/admin/categories/AdminCategoriesManager.tsx
components/admin/content/AdminContentStudio.tsx
services/category.service.ts
services/content.service.ts
types/category.ts
types/content.ts
```

## Definition of done

- Buyer can change storefront merchandising without editing code.
- Invalid/mobile-missing assets cannot be published.
- Navigation and collection URLs remain valid.
- Preview never changes the public storefront.

---

# Phase 5 — Discounts, subscription and loyalty

## Status: 100% of planned implementation complete

## Already available

- Free versus Privé subscription experience.
- Privé Gold admin entitlement.
- Safe subscription preview.
- Customer subscription field protected by Firestore rules.
- Discounts placeholder route.

## Build next

### Discount engine

- Percentage and fixed discounts.
- Product/category/customer eligibility.
- Minimum order value.
- First-order coupons.
- Usage/per-customer limits.
- Start/end date.
- Automatic promotion versus coupon.
- Conflict/stacking protection.
- Preview and campaign status.

### Membership/loyalty

- Privé plan entitlements.
- Early collection access.
- Exclusive pricing.
- Reward points ledger.
- Birthday rewards.
- Voucher wallet.
- Referral rewards.
- Gift cards/store credit.
- Refund-to-wallet architecture.
- Future subscription webhook integration.

## Suggested structure

```text
app/admin/(panel)/discounts/page.tsx
components/admin/discounts/AdminDiscountsManager.tsx
services/discount.service.ts
services/loyalty.service.ts
types/discount.ts
types/loyalty.ts
lib/promotion-engine.ts
```

## Definition of done

- Discount totals match cart, checkout, order and invoice.
- Expired/overused codes fail securely.
- Customer cannot grant themselves Privé or points.
- Demo subscription never charges money.

---

# Phase 6 — Advanced storefront commerce

## Status: 100% of planned implementation complete

## Already available

- Premium homepage and mobile experience.
- Catalogue, categories and subcategories.
- Product cards and detail pages.
- Related products by category logic.
- Search/filter foundation.
- Cart and wishlist.
- Product image galleries.
- Reviews presentation.
- Responsive checkout.

## Build next

### Product detail excellence

- Variant-aware image gallery.
- High-quality zoom.
- Product video support.
- Model measurements and worn size.
- Interactive size guide.
- Fit recommendation.
- Fabric/care/origin/craftsmanship.
- Pincode delivery estimate.
- Accurate stock availability.
- Verified reviews stored in Firestore.
- Customer Q&A.
- Complete-the-look.
- Recently viewed.
- Price-drop/back-in-stock alerts.
- Sharing and social metadata.

### Search/discovery

- Autocomplete.
- Typo tolerance.
- Recent/trending searches.
- Filter by size, colour, material, price and availability.
- No-results suggestions.
- Product comparison.
- Visual-search-ready adapter.

### Cart/checkout

- Save for later.
- Coupon/store credit.
- Gift wrapping.
- Saved addresses.
- Delivery method selector.
- Address validation.
- Checkout progress.
- Duplicate-submit protection.
- Demo transaction confirmation.
- Wallet method already added; fully style/verify it.

## Suggested structure

```text
components/search/
components/product/variants/
components/product/fit/
components/checkout/
services/search.service.ts
services/review.service.ts
services/delivery-estimate.service.ts
types/review.ts
types/search.ts
```

## Definition of done

- A user can discover, understand and select the correct variant without
  confusion.
- Cart/checkout totals and inventory remain consistent.
- Every mobile interaction is touch-friendly.
- Product and search states work with admin-published cloud products.

---

# Phase 7 — Delivery, cancellation, returns, exchange and refunds

## Status: 100% of planned implementation complete

## Already available

- Basic order placement.
- Customer order display.
- Customer cancellation for confirmed orders.
- Admin lifecycle foundation.
- Estimated delivery field.
- Text invoice in the customer area.

## Build next

- Branded PDF invoice.
- Customer visual tracking timeline.
- Cancellation eligibility rules.
- Partial item cancellation.
- Return request with reason/images.
- Return approval/rejection.
- Exchange size/colour workflow.
- Pickup/return shipment tracking.
- Return received/inspection.
- Refund pending/completed states.
- Partial refunds.
- COD refund details.
- Email/SMS/push notification adapters.
- Help centre and support tickets.
- Shipping/return/refund policy pages.

## Suggested structure

```text
app/account/returns/
app/help/
components/account/returns/
components/admin/returns/
services/return.service.ts
services/refund.service.ts
services/notification-delivery.service.ts
types/return.ts
types/refund.ts
```

## Definition of done

- Customer and admin see the same return/refund truth.
- Inventory and payment states update consistently.
- Online refunds are future webhook/server only.
- Demo mode clearly states no real pickup/refund/fulfilment occurs.

---

# Phase 8 — Personalization and above-benchmark differentiators

## Status: 100% of planned local architecture complete

## Already available

- Related products.
- Recommended products section.
- Wishlist/cart signals.
- Animated mobile collection/category experiences.
- Premium editorial visual direction.

## Build next

- Recently viewed history.
- Browsing/cart/wishlist recommendations.
- Complete-the-look outfit builder.
- Occasion-based discovery.
- Personalized logged-in homepage.
- Digital wardrobe.
- Saved fit/measurement profile.
- Gift finder.
- Premium packaging selector.
- Private collection drops/countdowns.
- Luxury style concierge.
- Visual-search integration-ready adapter.
- Multilingual/multi-currency architecture.
- Future store pickup/omnichannel adapter.

## Suggested structure

```text
components/personalization/
components/outfit-builder/
components/concierge/
services/recommendation.service.ts
services/recently-viewed.service.ts
services/style-profile.service.ts
types/personalization.ts
```

## Definition of done

- Recommendations respond to real customer signals.
- Guests receive privacy-safe session recommendations.
- Personal data stays account-scoped.
- Empty/new-user fallbacks still look curated.

---

# Phase 9 — Analytics, settings and operations

## Status: 100% of planned local architecture complete

## Already available

- Admin overview metrics.
- Basic order/customer/inventory summaries.
- Analytics and settings placeholder routes.

## Build next

### Analytics

- Revenue/orders trend.
- Best-selling products/categories.
- Conversion funnel.
- Cart abandonment.
- Wishlist-to-order conversion.
- Customer retention.
- Return/cancellation rate.
- Discount performance.
- Inventory health.
- Date-range and compare controls.
- Exportable reports.

### Settings/operations

- Store identity.
- Shipping rules.
- Tax configuration.
- Order/invoice numbering.
- Notification templates.
- Return window.
- Currency/locale.
- Demo/live commerce mode.
- Maintenance mode.
- Admin roles/permissions.
- Audit logs.
- Future integration settings.

## Suggested structure

```text
components/admin/analytics/
components/admin/settings/
services/analytics.service.ts
services/settings.service.ts
services/audit.service.ts
types/analytics.ts
types/settings.ts
```

## Definition of done

- Metrics come from real data and have labelled preview fallbacks.
- Changing settings safely affects the intended storefront behavior.
- Sensitive integration settings never enter the client bundle.

---

# Phase 10 — Performance, accessibility, SEO and security

## Status: 100% of planned local implementation complete

## Already available

- Next.js metadata foundation.
- Responsive images/assets in many sections.
- Firebase auth and role-aware Firestore rules.
- Loading/error/not-found screens.
- Responsive desktop/mobile components.
- Product image validation/optimization.

## Build next

### Performance

- Core Web Vitals audit.
- Image sizing/format/lazy loading audit.
- Font loading audit.
- Client-bundle reduction.
- Animation/reduced-motion optimization.
- Firestore query bounds and indexes.
- Skeleton/streaming consistency.

### Accessibility

- WCAG 2.2 AA audit.
- Keyboard navigation.
- Visible focus.
- Dialog focus traps.
- Screen-reader labels/live regions.
- Contrast.
- 44px mobile targets.
- Reduced motion.
- Form errors and descriptions.

### SEO

- Sitemap.
- Robots.
- Canonical URLs.
- Product/organization/breadcrumb structured data.
- Open Graph/Twitter images.
- Category and product metadata.
- No-index admin/account/private pages.

### Security

- Firestore rules emulator tests.
- Storage rule tests.
- App Check plan.
- Rate-limit architecture.
- Input validation and sanitization.
- Secure admin mutations.
- Upload MIME/size validation.
- Dependency/security audit.
- Secrets/environment audit.
- Backup/recovery documentation.

## Suggested structure

```text
app/sitemap.ts
app/robots.ts
components/seo/
tests/firestore/
tests/storage/
lib/security/
docs/security.md
docs/performance.md
```

## Definition of done

- Performance and accessibility budgets pass on representative mobile and
  desktop devices.
- SEO data validates.
- No privileged operation relies only on client UI checks.
- Private pages remain no-indexed.

---

# Phase 11 — QA, documentation, portfolio and sellable handoff

## Status: 100% complete for the documented portfolio scope

## Completed evidence

- Vitest unit coverage for inventory calculations, order transitions,
  promotions and recommendation behavior.
- Live anonymous Firebase integration checks for public/private rule boundaries.
- Playwright guest, navigation, branded 404, authentication denial,
  administrator denial, Firestore failure and slow-media journeys.
- Automated WCAG serious/critical scans on home, shop, collections and product.
- Cross-browser smoke and accessibility passes in Chromium, Firefox and WebKit.
- Screenshot regression baselines at every required mobile/tablet/desktop size.
- Clean README, environment template, Firebase/admin/product/payment/schema,
  customization/reset, testing, limitations and buyer handoff guides.
- Changelog and completed portfolio case study.
- Production build, static generation and production dependency audit passed.

### Responsive matrix

```text
360 × 800
390 × 844
430 × 932
768 × 1024
1366 × 768
1440 × 900
1920 × 1080
```

Browsers:

```text
Chromium (Chrome/Edge/Android engine coverage)
Firefox
WebKit (Safari/iOS engine coverage)
```

Real-device Edge, iOS Safari and Android Chrome remain buyer acceptance checks,
because device keyboards, safe areas, GPU/font rendering and external accounts
cannot be completely represented by desktop automation. This boundary is
documented in `docs/testing.md` and is not missing application code.

## Suggested structure

```text
tests/
  unit/
  integration/
  e2e/
  visual/

docs/
  admin-user-guide.md
  firebase-setup.md
  payment-integration.md
  buyer-handoff.md
  testing.md
  security.md
  performance.md
```

## Definition of done

- Full lint, typecheck and production build pass.
- Automated critical journeys pass.
- Responsive/browser matrix passes.
- Documentation lets a buyer run and customize the project without guessing.
- Portfolio case study is created only after website scope reaches 100%.

---

# Completed implementation order

The roadmap was delivered in this sequence:

```text
1. Phase 1 Admin Orders Management — complete
2. Phase 2 Inventory/SKU engine — complete
3. Phase 3 Customers/CRM — complete
4. Phase 4 Categories/CMS — complete
5. Phase 5 Discounts/loyalty — complete
6. Phase 6 advanced storefront commerce — complete
7. Phase 7 after-sales — complete
8. Phase 8 personalization/differentiators — complete
9. Phase 9 analytics/settings — complete
10. Phase 10 technical excellence — complete
11. Phase 11 QA/handoff — complete
12. Portfolio case study — complete
```

## Final quality gate

Run before every delivery or material change:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Also verify:

- Real data persistence.
- Admin/customer authorization.
- Preview safety.
- Mobile/tablet/desktop layouts.
- Loading/empty/error/success states.
- Keyboard accessibility.
- No browser console errors.
- No dead controls.
- Documentation update.

# Final payment architecture

Project phase:

```env
NEXT_PUBLIC_COMMERCE_MODE=demo
NEXT_PUBLIC_PAYMENT_MODE=disabled
```

Supported display methods:

```text
UPI
Card
Wallet
Cash on Delivery
```

Rules:

- Demo mode never collects money.
- Demo COD never promises real delivery.
- Online payment is webhook-verified in future live mode.
- COD collection may be confirmed by an authorized admin after delivery.
- Payment/order/refund truth is auditable.
- A buyer connects gateway secrets only in a trusted server environment.

# Maintenance handoff

```text
Open the Styloverse project at
C:\Users\abhis\OneDrive\Documents\my website\styloverse-store.

Read AGENTS.md, docs/world-class-master-roadmap-handoff.md and
docs/phase-1-admin-orders-handoff.md completely before editing. This is a
dirty worktree containing valuable user changes; preserve all of them and do
not reset or overwrite unrelated files.

All eleven phases are complete for the documented portfolio scope. Treat future
work as maintenance or buyer customization, not unfinished roadmap work. Read
the relevant Next.js 16.2.12 guide from node_modules/next/dist/docs before
editing. Maintain the premium desktop/mobile standard and keep real
Card/UPI/Wallet payment disabled until a server-side signed webhook is
implemented. Run lint, typecheck, Vitest, production build and Playwright after
material changes, then update the changelog and relevant buyer documentation.
```
