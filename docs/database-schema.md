# Database and Security Model

Core Cloud Firestore paths:

| Path | Purpose | Write owner |
|---|---|---|
| `users/{uid}` | Identity, profile, role and membership | Owner for allowed fields; admin for operations |
| `users/{uid}/commerce/cart` | Authenticated cart state | Owner |
| `users/{uid}/commerce/wishlist` | Authenticated saved items | Owner |
| `orders/{orderId}` | Immutable commercial snapshot plus audited lifecycle | Customer creates constrained order; admin transitions |
| `products/{productId}` | Published catalogue and media | Admin |
| `inventory/{sku}` | Available/reserved units and thresholds | Admin transactions |
| `inventoryMovements/{id}` | Append-oriented stock journal | Admin |
| `returns/{id}` | Return/exchange/refund preparation | Customer request; admin lifecycle |
| `promotions/{id}` | Coupon and promotion rules | Admin |
| `categories/{id}` | Merchandising taxonomy | Admin |
| `storeSettings/{id}` | Private operational configuration | Admin |
| `publicSettings/{id}` | Public-safe presentation configuration | Public read, admin write |

Orders preserve product name, SKU, variant, price, quantity, discounts, address, payment method/status and timestamps so later catalogue edits cannot rewrite history. Inventory reservations use transactions. Admin mutations append actor/time context rather than silently changing commercial truth.

`firestore.rules` is the authority: interface guards improve UX, but data access is enforced by authenticated UID ownership and `role == "admin"`. Detailed field contracts and sync behavior remain in [firestore-architecture.md](firestore-architecture.md).
