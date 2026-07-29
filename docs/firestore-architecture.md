# Styloverse Firestore Architecture

## Purpose

Styloverse keeps anonymous browsing fast while giving authenticated customers secure cross-device commerce persistence.

- Guests use browser storage for cart and wishlist.
- On sign-in, guest selections merge into the authenticated customer's Firestore data.
- Authenticated cart and wishlist changes sync in real time.
- Orders are written to a top-level collection so the future admin panel can securely query and manage them.
- On sign-out or account switching, private browser caches are cleared to prevent another user seeing the previous customer's data.

## Data model

```text
users/{uid}
  uid
  displayName
  email
  phoneNumber
  photoURL
  role: "customer" | "admin"
  createdAt
  lastActiveAt

users/{uid}/commerce/cart
  items: CartItem[]
  updatedAt

users/{uid}/commerce/wishlist
  items: ProductId[]
  updatedAt

orders/{orderId}
  id
  userId
  userEmail
  createdAt
  estimatedDelivery
  status
  paymentMethod
  paymentStatus
  items
  customer
  shippingAddress
  pricing
  createdOnServerAt
  updatedAt

products/{productId}
  Reserved for the admin-managed catalogue phase.
```

## Runtime flow

1. `AuthProvider` resolves the Firebase user.
2. `StorefrontCloudSync` keeps guest mode untouched when no user is signed in.
3. After sign-in it creates or refreshes `users/{uid}`.
4. Local and cloud cart entries merge by product, size and colour. The higher quantity wins, preventing duplicate quantities after repeated sign-ins.
5. Wishlist IDs merge as a unique set.
6. Legacy browser orders are never uploaded, preventing old demo or owner-less data from becoming cloud order history.
7. Firestore listeners mirror only the current user's real cloud orders into the existing UI cache, so all desktop and mobile components update together.
8. Checkout writes the order and clears the cloud cart in one Firestore batch.

## Security boundaries

The rules in `firestore.rules` enforce:

- Customers can read and update only their own profile and commerce documents.
- Customers cannot promote themselves to admin.
- An order can only be created for the authenticated UID.
- New project-mode orders must begin as `Confirmed` with payment status `Pending`.
- Customers may only change their own confirmed order to `Cancelled`.
- Customers cannot rewrite totals, products, addresses or ownership during cancellation.
- Order deletion is disabled.
- Product reads are public; product writes are admin-only for the future admin panel.

Client-side checks improve the interface, but Firestore rules remain the final authorization layer.

## Important files

- `components/providers/StorefrontCloudSync.tsx` — login merge, realtime listeners and privacy cleanup.
- `services/cart.service.ts` — cloud cart reads, writes, merge and subscription.
- `services/wishlist.service.ts` — cloud wishlist reads, writes, merge and subscription.
- `services/order.service.ts` — secure order placement, cancellation and subscription.
- `services/user.service.ts` — customer profile creation and refresh.
- `firestore.rules` — database authorization.
- `firestore.indexes.json` — Firestore index configuration.
- `firebase.json` — Firebase CLI configuration.

## One-time Firebase setup

Firestore must be enabled for the Firebase project and the checked-in rules must be deployed before authenticated cloud writes can succeed.

```bash
npx firebase-tools login
npx firebase-tools use <your-firebase-project-id>
npx firebase-tools deploy --only firestore
```

Do not put service-account keys or private server credentials in `NEXT_PUBLIC_` environment variables.
