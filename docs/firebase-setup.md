# Firebase Setup

1. Create or select a Firebase project and register a Web app.
2. Enable Authentication providers used by the project (Google, email/password and/or phone).
3. Create Cloud Firestore in the appropriate region.
4. Copy the web configuration into `.env.local` using `.env.example`.
5. Deploy the repository rules: `firebase deploy --only firestore:rules`.
6. Sign in once, copy the Firebase Authentication UID, and create `users/{uid}` with `uid`, `email`, `displayName` and `role: "admin"`.
7. Restart the development server and verify `/admin`.

The rules depend on `users/{uid}.role`; an email address alone is not authorization. Use the Firebase CLI project matching `NEXT_PUBLIC_FIREBASE_PROJECT_ID` before deployment. Product media defaults to Firestore-embedded optimized data because Firebase Storage billing is optional; switch to `storage` only after configuring bucket rules and billing.

Validation commands:

```powershell
firebase projects:list
firebase use
npm.cmd run test:integration
```

The integration suite performs anonymous REST checks against the configured project and confirms public settings behavior plus denial of private settings and order enumeration.
