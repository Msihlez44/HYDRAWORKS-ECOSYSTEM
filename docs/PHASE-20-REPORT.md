# Phase 20 — Performance

- Added compound indexes for user/business analytics, product catalogue access, payments, related entities and invoice due-state queries.
- Added reusable, bounded cursor pagination with a maximum page size of 100.
- Administrative subscription results now use stable cursor pages rather than loading 500 records.
- Public plan/catalogue payloads use short shared-cache headers; storefront caching remains stale-while-revalidate.
- Analytics uses parallel aggregate queries and returns aggregate values instead of large record collections.
- PWA service-worker static caching and explicit loading states support slow networks.

Production database execution plans and response percentiles must be measured again against the selected production database; SQLite development measurements are not a substitute for production profiling.
