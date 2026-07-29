# Administrator User Guide

## Access

Sign in with a Firebase account whose `users/{uid}` document contains `role: "admin"`, then open `/admin`. The storefront shows **Admin Office** only to that role. Query-string preview links are not authorization and never grant write access.

## Daily workflow

1. **Overview** — inspect revenue, open fulfilment, stock and operational alerts.
2. **Orders** — search/filter, open the detail drawer, validate payment state, update fulfilment, carrier, tracking, notes and status. Bulk actions and CSV export are available.
3. **Returns** — approve/reject requests, record inspection and reverse-logistics progress, and prepare exchange/refund state.
4. **Products** — create/edit/publish catalogue records and media.
5. **Inventory** — manage SKU-level stock, thresholds, reservations, movements and CSV import/export.
6. **Customers** — inspect authenticated profiles, spend, order and aftercare context.
7. **Categories / Discounts** — control merchandising structure and promotion rules.
8. **Analytics / Settings** — review real operational aggregates and store configuration.

## Safety rules

- Do not mark Card/UPI/Wallet as received unless a verified live webhook exists.
- COD may be confirmed only after real collection.
- Preview mode is read-only.
- Never share the admin Firebase account or put passwords in `.env`.
- Test destructive catalogue or stock operations on a separate Firebase project first.

See [admin-architecture.md](admin-architecture.md) for the complete file map and authorization design.
