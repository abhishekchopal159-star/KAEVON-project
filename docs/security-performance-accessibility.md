# Phase 10 — Security, Performance, Accessibility and SEO

Status: implementation complete for the current portfolio architecture.

## Security

- Firebase Authentication plus Firestore role/owner checks protect all private data.
- Admin writes are rule-protected; hidden UI is never the security boundary.
- Online payment/refund completion remains reserved for a future trusted server/webhook.
- Style profiles are owner-scoped. Store operations settings are admin-only; only an explicit public-safe projection is readable by the storefront.
- Security headers disable framing, MIME sniffing and unnecessary browser capabilities.
- Product uploads validate MIME type, size and optimized output before persistence.
- No gateway secret or carrier credential exists in the client bundle.
- Before a live launch: enable Firebase App Check enforcement, move integrations into server-only environment variables, add edge/server rate limiting and schedule Firestore export/backups.

## Performance

- Next image AVIF/WebP negotiation, responsive sizing and lazy loading are enabled.
- Google fonts use `next/font` with swap behavior.
- Firestore lists are bounded/indexed where operational pagination is required.
- Reduced-motion CSS disables non-essential animation.
- Production build is the release gate; representative mobile/desktop routes receive browser overflow checks.

## Accessibility

- Global visible focus styling, semantic landmarks, labelled controls and live status messages.
- Modal/drawer focus management on operational workflows.
- Touch controls target at least 44px on primary mobile actions.
- `prefers-reduced-motion` support is global.
- Private/admin routes expose no-index metadata.

## SEO

- Canonical metadata base, sitemap and robots routes.
- Organization and Product JSON-LD.
- Product Open Graph/Twitter cards.
- Public discovery routes are indexed; admin/account/checkout/order/auth routes are blocked from indexing.

## Recovery

1. Export Firestore and Storage before structural migrations.
2. Keep `firestore.rules`, `storage.rules` and indexes versioned with the application.
3. Roll back application and rules together when a release changes data contracts.
4. Test restore procedures against a non-production Firebase project before live commerce.
