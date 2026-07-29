# Phase 3 — Customers and CRM

Date: 29 July 2026  
Status: **100% of the Phase 3 implementation scope complete**

## Delivered

- Secure, admin-only live customer directory from `users`, `orders` and `customerCrm`.
- Search by name, email, phone and private tags.
- New, active, returning, VIP and dormant segmentation.
- Free/Privé membership filtering.
- Customer dossier with order count, lifetime value, wishlist, membership and order history.
- Delivered/cancelled counts, average order value and last activity/order timestamps.
- Private CRM tags, account support state and administrator notes.
- Append-only administrator audit information for CRM mutations.
- CSV customer export.
- Responsive desktop table/mobile cards and accessible dossier dialog.
- Firebase Authentication email remains immutable from CRM.
- Clearly labelled read-only portfolio preview data.

## Main files

```text
app/admin/(panel)/customers/page.tsx
components/admin/customers/AdminCustomersManager.tsx
services/customer-admin.service.ts
types/customer-admin.ts
firestore.rules
```

## Security boundary

`customerCrm/{customerId}` is readable/writable only when `isAdmin()` succeeds in
deployed Firestore rules. CRM writes never update the login email in `users` or
Firebase Authentication.

## Acceptance evidence

- TypeScript: pass.
- Targeted ESLint: pass.
- Next.js production build: pass, 278 routes/pages generated.
- Desktop preview directory and dossier: pass.
- 390px mobile layout: pass, no horizontal overflow.
- Runtime console errors: zero.
- Firestore rules: compiled and deployed to `styloverse-4e247`.

