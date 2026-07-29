# Known Limitations

- Real online payment and deployment are intentionally excluded from this portfolio instance.
- Shipping labels, SMS/email delivery, tax invoices and real courier tracking need contracted providers.
- Firebase Storage upload mode needs billing and bucket rules; the project defaults to Firestore-embedded optimized media.
- Automated browsers cover Chromium, Firefox and WebKit, but final commercial delivery still needs real-device iOS/Android/Edge QA.
- Authenticated destructive admin E2E tests require disposable Firebase test accounts/project and are not run against the user's data.
- Recommendation and analytics engines are deterministic application logic, not an external ML warehouse.
- Production legal, privacy, accessibility and tax compliance must be reviewed for the buyer's country and business.

These are integration/ownership boundaries, not hidden broken controls. The architecture exposes the required extension points without pretending unavailable external services are live.
