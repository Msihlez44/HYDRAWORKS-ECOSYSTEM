# Phase 14 — KASIBIZ Storefront

Phase 14 lets a business owner optionally publish a mobile-friendly mini storefront at `/shop/business-slug`.

## Delivered

- Owner-managed storefront publishing with a unique, validated URL slug.
- Public logo, business name, description, opening hours and service area.
- Explicit product-level publish/hide controls, public descriptions, images and ZAR prices.
- Phone, email, WhatsApp and external ordering options.
- Generated downloadable QR code linked to the canonical storefront URL.
- Responsive public storefront and authenticated KASIBIZ management interface.
- Public responses use an explicit safe-field projection; cost prices, stock internals, supplier data, business registration data and member details are never exposed.
- Storefront publication changes are written to the audit log.

Storefronts and products are private by default. Owners must deliberately publish both the storefront and each product.
