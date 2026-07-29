# Account profile and subscription

## Identity boundary

Each account profile is stored at `users/{firebaseAuthUid}`. The UID and login
email come from Firebase Authentication and are never accepted from editable
form fields.

Editable customer fields are:

- `displayName`
- `phoneNumber`
- `dateOfBirth`
- `gender`

The profile form displays the authenticated email as read-only. The Firestore
rules also require the saved email to match the authenticated token, preserve
the UID and role, and prevent a customer from changing their own subscription
status.

## Subscription model

New accounts receive `subscriptionPlan: "free"`. The premium state is
`subscriptionPlan: "prive"`.

Accounts with `role: "admin"` automatically receive and display the highest
Privé Gold membership. `ensureUserProfile()` persists that premium state on
the administrator's next active session, while the UI also derives it directly
from the verified administrator role so it appears immediately.

The current project includes the complete responsive Free-versus-Privé
experience and a safe subscription checkout preview. It intentionally does not
activate Privé from the browser because real payment processing is deferred.

For commercial launch, a verified payment webhook or protected administrator
service should be the only code allowed to change `subscriptionPlan` from
`free` to `prive`. The storefront and account UI already react to that field,
so the visual system will not need to be rebuilt when billing is connected.

## Main files

```text
services/user.service.ts
  creates, normalises, subscribes to and updates UID-owned profiles

contexts/AuthContext.tsx
  exposes the authenticated user and their live Firestore profile

components/account/ProfileForm.tsx
  editable fields plus locked authenticated email

components/account/ProfileCard.tsx
  real profile summary and current Free/Privé state

components/account/SubscriptionExperience.tsx
  animated pricing, benefit comparison and safe checkout preview

app/account/subscription/page.tsx
  membership route

firestore.rules
  identity, email, role and subscription mutation boundaries
```
