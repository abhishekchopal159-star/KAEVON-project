# Strict Prompt — Finish Styloverse Phase 1 Admin Orders

Work inside this existing project only:

`C:\Users\abhis\OneDrive\Documents\my website\styloverse-store`

## Non-negotiable rules

1. Read `AGENTS.md` completely, then read the relevant Next.js 16.2.9 guides under `node_modules/next/dist/docs/` before editing.
2. Read `docs/phase-1-admin-orders-handoff.md`, `docs/world-class-master-roadmap-handoff.md`, and `docs/phase-1-remaining-file-manifest.md` completely.
3. Preserve every existing user change. The worktree is dirty and many files are untracked. Never use `git reset --hard`, `git checkout --`, or destructive cleanup.
4. Finish Phase 1 only. Do not start Inventory or later phases.
5. Maintain the current Styloverse world-class luxury visual system on desktop, tablet, and mobile. Do not replace premium UI with generic dashboard styling.
6. Keep real online payments disabled. Do not add live gateway keys or create any browser action that can mark Card/UPI/Wallet payment as received.
7. Future online payment verification must be server/webhook-only. COD may be manually confirmed only by a verified administrator.
8. Firestore rules are the authorization boundary. Hidden buttons are not security.
9. Do not claim Phase 1 is 100% until every acceptance check below passes with evidence.

## Current verified state

- ZIP transition changes have been merged into the correct project paths.
- Shared transition rules exist in `lib/order-transitions.ts` and are used by both UI and service code.
- TypeScript passes.
- Full ESLint has zero errors (three unrelated `no-img-element` warnings remain in Testimonials).
- Next.js production build passes and generates 278 routes/pages.
- Phase 1 is approximately 90% complete, not 100%.

## Complete the remaining work in this exact order

### 1. Real Firestore administrator and customer authorization tests

- Use the intended Firebase project or Firebase Emulator Suite. Never guess the project.
- Create a safe demo order through checkout.
- Verify it appears live in `/admin/orders` without refresh.
- Verify valid transitions persist after refresh: Confirmed → Processing → Packed → Shipped → Out for Delivery → Delivered.
- Verify impossible transitions are rejected by the UI and service.
- Verify notes, carrier, tracking ID, estimated delivery, COD pending/received, and timeline events persist.
- Sign in as a normal customer and prove every admin mutation is denied.
- Record test evidence in the handoff document.

### 2. Firestore rules and indexes

- Review `firebase.json`, `firestore.rules`, `firestore.indexes.json`, and the exact active Firebase project.
- Add rules required for new audit fields without weakening customer isolation.
- A customer may read only their own orders. Only an authenticated `users/{uid}.role == "admin"` account may perform admin order mutations.
- Never permit a browser to self-verify online payment fields.
- Deploy only after the user confirms the intended Firebase project. If project confirmation is unavailable, stop deployment and provide the exact command instead.

### 3. Branded PDF invoice

- Create a professional Styloverse PDF invoice available from both the admin order dossier and customer order area.
- Include invoice/order number, issue date, customer, billing/shipping address, item name, size, colour, quantity, unit price, subtotal, savings, delivery, total, payment method and payment status.
- Add a clearly visible `DEMO — NO REAL PAYMENT OR DELIVERY` watermark while `NEXT_PUBLIC_COMMERCE_MODE=demo`.
- Do not claim GST/tax compliance unless real seller tax information is configured.
- Use deterministic filenames and handle missing legacy fields safely.
- Ensure PDF generation works on supported desktop and mobile browsers without exposing secrets.

### 4. Cursor pagination and bounded queries

- Replace the unlimited admin order collection subscription with a bounded query using `orderBy(createdAt)`, `limit`, and Firestore cursors.
- Implement reliable next/previous page controls, loading, empty, retry and end-of-results states.
- Keep preview mode read-only and working.
- Add required composite indexes to `firestore.indexes.json`.
- Do not fake global search across unloaded records. Clearly implement an appropriate bounded search strategy or document the limitation.

### 5. Controlled bulk operations

- Add desktop row selection and a usable mobile selection pattern.
- Implement Export selected, valid bulk status advance, and Assign delivery partner.
- Validate every selected order with `canBulkTransition` before any write.
- Use a confirmation sheet and create one audit/timeline event per changed order.
- Never bulk-mark Card/UPI/Wallet payments Received.

### 6. Complete audit fields

- Persist `lastActionByUid`, `lastActionByName`, `lastActionAt`, `statusHistory`, `payment.verificationSource`, and `payment.verifiedAt` where applicable.
- Preserve nested payment/fulfilment fields during updates; do not accidentally overwrite unrelated data.
- Audit records must include actor, action, timestamp, old value and new value where relevant.

### 7. Drawer accessibility and interaction safety

- Escape closes the order drawer.
- Focus is trapped while open and returns to the triggering order after close.
- Prevent background scrolling.
- Add correct dialog semantics, accessible name/description, live announcements for action success/error, keyboard navigation and visible focus.
- Status must not rely on colour alone.
- Respect reduced motion.
- Maintain minimum 44×44px touch targets.

### 8. Responsive visual QA

Test all of these exact viewports:

- 360×800
- 390×844
- 430×932
- 768×1024
- 1366×768
- 1440×900
- 1920×1080

Verify header, metrics, filters, table/cards, bulk bar, pagination, drawer, invoice actions, sticky tabs, bottom navigation, long customer/order values, loading, empty and error states. Capture screenshots or a concise evidence table.

### 9. Final verification and documentation

- Run `npm.cmd run lint` and `npm.cmd run build`.
- Run `\.\node_modules\.bin\tsc.cmd --noEmit` if not covered by build.
- No TypeScript or ESLint errors may remain. Do not use `any`, `@ts-ignore`, disabled rules, or fake data to hide failures.
- Update `docs/phase-1-admin-orders-handoff.md`, `docs/admin-architecture.md`, `README.md`, and the master roadmap with exact evidence and honest percentages.
- Mark Phase 1 100% only after all real-admin, customer-denial, rules, invoice, pagination, bulk, audit, accessibility and viewport checks pass.

## Required final response

Return:

1. Exact files created and modified with absolute paths.
2. What was implemented.
3. Test commands and their actual results.
4. Firebase deployment status and exact project used.
5. Remaining blockers, if any.
6. Honest Phase 1 completion percentage.

Do not give a generic summary and do not say “done” without evidence.
