# Styloverse Phase 1 — Admin Orders Handoff

Date: 28 July 2026  
Project root: `C:\Users\abhis\OneDrive\Documents\my website\styloverse-store`

## Goal

Build a world-class responsive Admin Orders Management workspace for the
Styloverse commerce project. Real online payments stay disabled during the
portfolio/project phase, but the order and payment architecture must be ready
for a future buyer to connect a verified payment gateway.

## Current completion

- Phase 1 Admin Orders Management: approximately **85% complete**.
- Overall Zara/Apple-plus project roadmap: approximately **48–49% complete**.
- Implementation is usable in the safe preview and connected to real Firestore
  subscriptions for the authenticated administrator.
- It must not be called 100% complete until every item in the pending checklist
  below has passed.

## Files created

```text
components/
  admin/
    orders/
      AdminOrdersManager.tsx   # Complete responsive orders workspace UI

docs/
  phase-1-admin-orders-handoff.md
```

## Files modified

```text
app/
  admin/
    (panel)/
      orders/
        page.tsx               # Replaced placeholder with AdminOrdersManager
  checkout/
    page.tsx                   # Added Wallet and COD-specific payment state

components/
  admin/
    AdminOverview.tsx          # Updated preview orders for expanded order type

services/
  admin.service.ts             # Normalization, subscriptions and admin mutations

types/
  admin.ts                     # Full order/payment/admin data contracts

firestore.rules                # Validates supported demo payment methods/states
.env.example                   # Safe commerce/payment mode documentation
```

## What is implemented

### Order workspace

- Premium responsive hero and operational metrics.
- Gross order value, received amount, open fulfilment and attention metrics.
- Live Firestore order subscription for the verified admin account.
- Safe read-only preview dataset at `/admin/orders?preview=1`.
- Real administrator route at `/admin/orders`.
- Search by order ID, customer name, email, phone or tracking ID.
- Filters for order status, payment status, payment method and date range.
- Sort by newest, oldest, highest value and lowest value.
- CSV export of the currently filtered order view.
- Desktop order ledger and separate mobile luxury order cards.
- Loading, empty and Firebase error states.

### Order dossier

- Responsive side drawer/bottom-sheet behavior.
- Overview, Journey and Payment tabs.
- Customer identity and contact information.
- Shipping address.
- Item images, name, size, colour, quantity and price.
- Pricing breakdown: subtotal, delivery, savings and total.
- Private administrator notes.
- Fulfilment carrier, tracking ID and estimated delivery fields.
- Order status selector and quick next-stage action.
- Controlled cancellation action.
- Complete timeline rendering with actor and timestamp.
- Payment method, provider, transaction ID, amount received, paid date,
  verification and refund information display.

### Order lifecycle types

```text
Confirmed
Processing
Packed
Shipped
Out for Delivery
Delivered
Cancelled
Return Requested
Return Approved
Return Received
Exchange Requested
```

### Payment methods

```text
UPI
Card
Wallet
Cash on Delivery
```

### Payment states

```text
Pending
Authorized
Received
Failed
Partially Refunded
Refunded
COD Collection Pending
COD Received
```

### Payment safety

- Online Card/UPI/Wallet payment cannot be marked Received from the admin UI.
- A future real gateway must update online payment truth from its secure server
  webhook.
- COD collection can be marked pending/received by the verified administrator.
- Every COD collection change creates a timeline event.
- Safe defaults are documented as:

```env
NEXT_PUBLIC_COMMERCE_MODE=demo
NEXT_PUBLIC_PAYMENT_MODE=disabled
```

- Never add payment-provider secret keys to a `NEXT_PUBLIC_` variable.

### Admin service mutations

Implemented in `services/admin.service.ts`:

```text
subscribeToAdminOrders
updateAdminOrderStatus
addAdminOrderNote
updateAdminOrderFulfilment
recordAdminCodCollection
```

Firestore rules remain the final admin authorization boundary.

## Verification already completed

### Static checks

Passed:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit

.\node_modules\.bin\eslint.cmd `
  "components/admin/orders/AdminOrdersManager.tsx" `
  "services/admin.service.ts" `
  "types/admin.ts" `
  "components/admin/AdminOverview.tsx" `
  "app/admin/(panel)/orders/page.tsx" `
  "app/checkout/page.tsx"
```

### Browser checks completed

Route tested:

```text
http://localhost:3000/admin/orders?preview=1
```

Verified:

- Route renders with correct metadata/title.
- Four sample orders and metrics render.
- UPI, Card, Wallet and COD appear in filters and records.
- Search/filter controls are accessible.
- COD filter correctly reduces the preview to one order.
- Order dossier opens.
- Overview, Journey and Payment tabs render.
- Product images resolve using existing project assets.
- Fulfilment fields and lifecycle controls render.
- Online payment shows the server-verification boundary.
- Read-only preview actions do not write to Firestore.
- Browser console showed no errors or warnings during the inspected flow.

## Pending work before Phase 1 can be called 100%

Complete these steps in order.

### 1. Full repository checks

Run:

```powershell
npm.cmd run lint
npm.cmd run build
```

Fix every error caused by the new order types. Do not suppress errors with
`any`, `@ts-ignore` or disabled lint rules.

### 2. Responsive visual QA

Test at minimum:

```text
360 × 800
390 × 844
430 × 932
768 × 1024
1366 × 768
1440 × 900
1920 × 1080
```

Verify:

- Header and hero never collide.
- Metric cards do not clip values.
- Filters remain usable at every width.
- Desktop table columns align and never overlap.
- Mobile bottom navigation does not cover the final order card.
- Drawer header stays visible when opening an order.
- Drawer content scroll begins at the top.
- Overview/Journey/Payment tabs remain sticky and readable.
- All buttons have visible labels and touch targets of at least 44px.

### 3. Real administrator mutation test

Use the verified admin account, not `?preview=1`.

Create one safe demo order through checkout, then test:

1. Order appears in `/admin/orders` without refresh.
2. Confirmed → Processing → Packed.
3. Add an internal note.
4. Save carrier, tracking ID and estimated delivery.
5. Refresh the page and confirm values persist.
6. For a COD demo order, mark collection Received, refresh, then return it to
   pending.
7. Confirm every action added one timeline event.
8. Confirm a normal customer account cannot perform any admin mutation.

Do not test real online payment because payments are intentionally disabled.

### 4. Deploy the updated Firestore rules

The checked-in rule now accepts:

- UPI/Card/Wallet orders with payment status `Pending`.
- Cash on Delivery orders with `COD Collection Pending`.

Deploy only after reviewing the active Firebase project:

```powershell
npx.cmd firebase-tools deploy --only firestore:rules
```

Do not change or deploy rules to an unknown Firebase project.

### 5. Professional invoice

The customer area currently generates a text invoice. Phase 1 should finish a
real branded PDF invoice containing:

- Styloverse identity and invoice number.
- Order/customer/billing/shipping information.
- Items, quantity, size, colour and tax-ready totals.
- Payment method/status.
- Demo watermark while commerce mode is `demo`.
- Download button inside the admin order dossier.

Do not claim GST/tax compliance unless the seller's real tax details are
configured.

### 6. Status transition protection

Move the allowed-transition rules into a shared pure helper. Both UI and
service must reject impossible transitions, for example:

```text
Delivered → Processing       reject
Cancelled → Shipped          reject
Confirmed → Processing       allow
Processing → Packed          allow
Packed → Shipped             allow
Shipped → Out for Delivery   allow
Out for Delivery → Delivered allow
```

Return/exchange flows can remain visible in the schema, but their complete
customer workflow belongs to the later After-Sales phase.

### 7. Pagination and scale

The current subscription reads the complete orders collection. Replace it
before large-scale use with:

- Server/firestore query pagination.
- `orderBy(createdAt)` and a bounded `limit`.
- Cursor-based next/previous pages.
- Required Firestore indexes.
- Debounced search strategy or a dedicated search service for large datasets.

The portfolio sample works without this, but a world-class production build
must not load unlimited orders into the browser.

### 8. Bulk operations

Add desktop row selection and controlled bulk actions:

- Export selected.
- Mark selected as Processing/Packed only when every transition is valid.
- Assign delivery partner.
- Never bulk-mark online payments Received.
- Require a confirmation sheet and create an audit event per order.

### 9. Audit completeness

Add/update fields:

```text
lastActionByUid
lastActionByName
lastActionAt
statusHistory
payment.verificationSource
payment.verifiedAt
```

For future live payments, only the trusted webhook/Admin SDK may set online
payment verification fields.

### 10. Accessibility and interaction QA

- Escape closes the order drawer.
- Focus is trapped inside the open drawer.
- Focus returns to the clicked order after close.
- Drawer and toast are announced by screen readers.
- Status is never communicated by colour alone.
- Reduced-motion users receive minimal transitions.
- Verify keyboard-only filters and order navigation.

### 11. Update project documentation

After all checks pass, update:

```text
docs/admin-architecture.md
README.md
```

Mark Orders as implemented and change the next admin milestone to Inventory.

## Important implementation cautions

- The repository already had many modified/untracked files before this phase.
  Preserve them; do not use `git reset --hard` or overwrite unrelated work.
- Most of the current project is untracked in Git, so `git diff` is not a
  reliable record of all previous user work.
- Keep `/admin?preview=1` read-only.
- Guests and customer accounts must never see or receive admin authorization.
- Firestore rules—not hidden buttons—must protect writes.
- Do not activate a real payment gateway during the portfolio phase.
- Do not allow the browser to self-verify online payment.

## Recommended next AI prompt

```text
Continue Styloverse Phase 1 Admin Orders from
docs/phase-1-admin-orders-handoff.md. Read AGENTS.md and the relevant local
Next.js 16.2.9 guides before editing. Preserve all existing user changes.
Finish only the Pending work in the documented order, beginning with full lint
and build, then responsive QA and real-admin Firestore mutation testing. Keep
online payments disabled and webhook-only for future verification. Do not move
to Inventory until every Phase 1 acceptance item passes.
```

## Definition of Phase 1 complete

Phase 1 is 100% only when:

- Full lint and production build pass.
- Mobile/tablet/desktop visual QA passes.
- Real admin Firestore writes and refresh persistence pass.
- Customer authorization denial is verified.
- Updated rules are deployed to the intended Firebase project.
- Branded demo invoice is available.
- Transition validation, pagination, accessibility and audit fields pass.
- Admin architecture documentation is updated.

