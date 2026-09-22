# Phase 13 — HYDRA Command Centre Full Version

Phase 13 upgrades the protected administrator dashboard into an ecosystem-wide aggregate analytics centre.

## Delivered

- Eighteen metrics covering users, commercial participants, platform operations, transaction value, revenue, commissions, subscriptions, tickets, verifications and disputes.
- Date, South African province, platform, user-type and status filters.
- Province capture for new HYDRA ID users and businesses.
- Responsive administrator interface with South African Rand formatting.
- Strict `ADMIN` or `SUPER_ADMIN` API authorization.
- Aggregate-only API responses: no names, emails, phone numbers, addresses or transaction records are exposed.

## Definitions

- Active users have a non-expired authenticated session.
- TUCKQUEST deliveries count delivered stock requests unless another compatible status is selected.
- Transaction value totals successful payment records by default.
- Platform revenue combines completed commissions and paid HYDRAHOST invoices.
- Tuckshops are businesses with products or stock requests.

Historical records without a province remain visible under **All provinces**. Payment records are platform-filterable through their related entity metadata; province and user-type filtering applies only where an authenticated user or business relationship exists.
