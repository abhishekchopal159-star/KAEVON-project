# Payment Integration Boundary

The current project is deliberately non-collecting. `NEXT_PUBLIC_PAYMENT_MODE=disabled` keeps Card, UPI and Wallet as safe UX demonstrations; no online order can become `Received` through the browser.

For a buyer to enable live payments:

1. Select a provider and create a server-only payment-order endpoint.
2. Keep provider secrets outside all `NEXT_PUBLIC_*` variables.
3. Return only a short-lived client token/order reference.
4. Verify signed webhooks on a trusted server.
5. Idempotently map the verified provider event to `orders/{id}.paymentStatus = "Received"` and store provider reference, amount, currency and verification timestamp.
6. Reject mismatched amount/currency/order/customer and replayed events.
7. Implement verified refund webhooks and reconciliation before calling refunds complete.
8. Run sandbox, failure, retry, timeout and duplicate-webhook tests before live mode.

COD is distinct: it begins pending and may be confirmed by an authorized admin only after real collection. Never trust a client success callback as payment truth.
