# Styloverse Admin Architecture

This document explains the administrator area added to the Styloverse
storefront. It is written as a handoff guide for the current owner and for a
future client who buys the project.

## 1. What is attached to the website

The storefront and administrator panel live in the same Next.js project:

```text
/                    public customer storefront
/account             protected customer account
/admin/login         private administrator sign-in
/admin               protected administrator overview
/admin/orders        order operations
/admin/products      catalogue management
/admin/inventory     stock management
/admin/customers     customer directory
/admin/categories    collection structure
/admin/discounts     promotional rules
/admin/analytics     business reporting
/admin/settings      store configuration
```

The `/admin` link is rendered in the storefront account menu and footer only
when the currently signed-in profile has `role: "admin"`. Guests and customer
accounts do not see it. Hiding the link is only a presentation choice;
security is enforced separately by authentication, authorization and
Firestore rules.

## 2. How the website recognizes an administrator

1. Firebase Authentication verifies the email/password account.
2. Firebase returns a unique user ID (`uid`).
3. `services/admin.service.ts` reads `users/{uid}` from Firestore.
4. Access is granted only when the profile contains `role: "admin"`.
5. Firestore rules repeat the role check before protected database reads or
   writes.

New storefront accounts are always created with `role: "customer"`. The
browser does not contain a button or request that can promote a customer to
administrator.

## 3. Assigning the first admin

For the current project model, create/sign in to the intended owner Gmail
account once and then change only that user's profile through the trusted
Firebase Console:

```text
Firestore Database
  users
    <owner uid>
      role: "admin"
```

The document ID must be the same Firebase Authentication `uid` shown for that
Gmail account. After the role is saved, sign out and sign in again (or refresh
the storefront). The **Admin Office** entry will then appear and open `/admin`.
All other Gmail accounts retain `role: "customer"` and never receive the link.

Never allow a public form to write `role: "admin"`. For a commercial
deployment, this one-time assignment can later be moved to a protected
Firebase Admin SDK setup script.

## 4. Security layers

### Interface guard

`components/admin/AdminGate.tsx` redirects signed-out users to
`/admin/login`. Signed-in customers receive an access-denied screen.

### Data rules

`firestore.rules` allows an administrator to read orders and customer
profiles and to manage products. Customer accounts cannot perform those
operations.

### Mutation rule

Every future admin write service must verify the current role and rely on
Firestore rules. Hiding or disabling a button is not treated as security.

## 5. Safe development preview

During local development only, the login screen exposes a **View safe demo
preview** link. It opens:

```text
/admin?preview=1
```

The preview:

- is compiled for development mode only;
- uses clearly labelled sample dashboard data;
- never reads private customer data;
- never writes to Firestore;
- keeps future management actions non-operational.

Production builds do not accept this preview bypass. A real administrator role
is required.

## 6. Folder and file map

```text
app/admin/
  (auth)/login/page.tsx          admin login route
  (panel)/layout.tsx             protected panel layout
  (panel)/page.tsx               overview route and catalogue summary
  (panel)/*/page.tsx             management module routes

components/admin/
  AdminGate.tsx                  role verification and access states
  AdminLoginForm.tsx             Firebase admin sign-in
  AdminShell.tsx                 responsive panel frame
  AdminSidebar.tsx               desktop and drawer navigation
  AdminHeader.tsx                search, alerts and profile header
  AdminMobileNav.tsx             touch-friendly mobile navigation
  AdminOverview.tsx              overview metrics and live subscriptions
  AdminModulePlaceholder.tsx     staged module screen

contexts/
  AdminContext.tsx               safe profile and preview state

services/
  admin.service.ts               order reads, pagination, audited lifecycle mutations
  product.service.ts             product publishing and variant-aware catalogue records
  inventory.service.ts           stock transactions, movements, CSV and SKU registry

hooks/
  useCatalogProducts.ts          merges published cloud products into the core catalogue

firebase.json                    Firestore and Storage rules configuration
firestore.rules                  role-aware product document access
storage.rules                    admin-only product image uploads

types/
  admin.ts                       explicit admin order/payment data shapes
  inventory.ts                   SKU, variant, stock and movement contracts
```

## 7. Responsive behavior

Desktop uses a fixed dark navigation rail, a wide commerce overview, dense
tables and side-by-side operational cards.

Mobile uses a compact header, two-column metrics, stacked order cards, a
bottom navigation bar and a slide-out management drawer. It is not a squeezed
desktop table.

## 8. Current milestone

Implemented:

- role-aware login;
- protected admin shell;
- responsive desktop/mobile navigation;
- real Firestore order/customer subscriptions for authorized admins;
- catalogue and inventory summary from the current product source;
- read-only local portfolio preview;
- premium overview dashboard.
- functional product creation with draft/published states;
- administrator-only product image processing;
- live cloud products in the shop and category grids;
- dynamic detail pages for newly published products.
- complete responsive Orders workspace with pagination, bulk operations,
  lifecycle audit and branded PDF invoice;
- complete responsive Inventory workspace with variants, SKU/barcode
  uniqueness, reservations, adjustments, movement history and CSV import/export;
- transaction-backed reserve/release/sold stock integration across checkout,
  cancellation and delivery.

The next milestone is the Customers and CRM module. Live acceptance for Orders
and Inventory still requires deploying the checked-in rules/indexes and running
the real-admin/customer-denial tests documented in:

```text
docs/phase-1-admin-orders-handoff.md
docs/phase-2-inventory-handoff.md
```

## 9. Product publishing workflow

1. The administrator opens `/admin/products` and selects **Add new product**.
2. `AdminProductsManager.tsx` validates the form and image locally.
3. In the default free project mode, `product.service.ts` converts the image
   to a compact WebP data URL and keeps it below 300 KB before saving it with
   the product record. This avoids requiring a paid Firebase Storage plan for
   the portfolio demo.
4. The complete catalogue record is written to
   `products/{productId}` in Firestore.
5. Draft records remain private to administrators. Published records are
   subscribed to by `useCatalogProducts.ts` and merged with the original
   catalogue without replacing it.
6. The shop, category grid and dynamic `/product/{productId}` page update from
   the published record.

The browser never grants itself administrator access. Firestore rules verify
`users/{uid}.role == "admin"` before accepting the product and inline image
write.

The inline mode is intentionally for the current project/portfolio phase. A
commercial deployment should set `NEXT_PUBLIC_PRODUCT_MEDIA_MODE=storage`
after Firebase Storage (or another object-storage provider) is configured.
The service already retains that production-ready Storage path so the admin UI
and catalogue do not need to be rebuilt during migration.
