# Buyer Customization and Reset

## Rebrand checklist

1. Replace name, metadata, contact, policy and social copy.
2. Replace hero/category/product imagery and alt text.
3. Adjust design tokens in `app/globals.css` while preserving WCAG contrast.
4. Configure category, product, promotion and public settings through `/admin`.
5. Replace Firebase web configuration and create the buyer's admin UID role.
6. Update `NEXT_PUBLIC_SITE_URL`, robots and sitemap expectations.
7. Connect storage/CDN, delivery, email/support and payment services only when contracted.
8. Run the full quality gate and review all seven viewport snapshots.

## Safe reset

Use a separate Firebase project for each buyer. Export any required data, remove project-specific Firestore documents through the Firebase console/CLI, create the new buyer administrator, and republish catalogue/settings. Do not reuse customer identities, orders, analytics or credentials between buyers. Delete local `.env.local`, Playwright reports and generated test results before delivery; never delete source or assets through broad recursive commands.
