# Demo and Live Modes

## Portfolio/demo (default)

```env
NEXT_PUBLIC_COMMERCE_MODE=demo
NEXT_PUBLIC_PAYMENT_MODE=disabled
```

Browsing, account, cart, checkout orchestration, order records and admin workflows remain demonstrable. The interface clearly states that online collection is disabled. Demo data must never imply real shipping or settled money.

## Live buyer configuration

Live commerce requires a real merchant, policies, inventory source, delivery partner, support ownership and the server-side payment architecture in [payment-integration.md](payment-integration.md). Only after those dependencies are verified should the buyer set payment mode to `live` and deploy.

Changing the environment flag alone is intentionally insufficient: online `Received` state still requires trusted webhook verification.
