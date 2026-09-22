# Phase 15 — Subscriptions

Phase 15 adds administrator-configured ecosystem subscriptions for business functionality.

## Delivered

- Configurable plan name, description, price, billing period, features, limits, display order and active status.
- No paid plan pricing is hard-coded; administrators set prices through the protected plan API and interface.
- Public active-plan catalogue and authenticated business subscription history.
- Free-plan immediate activation and paid-plan invoice/payment workflow.
- Immutable price, feature and limit snapshots protect existing subscriptions from later plan edits.
- One active ecosystem subscription per business, cancellation history and audited plan/subscription changes.
- Product-limit and inventory-feature enforcement for subscribed businesses.
- Responsive customer plan selector and administrator plan editor.

Payment activation uses the existing signed provider webhook. Production remains dependent on configuring a supported production payment adapter rather than sandbox mode.
