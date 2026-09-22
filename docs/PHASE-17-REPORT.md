# Phase 17 — PWA and Mobile Optimisation

- Installable web manifest with theme, standalone display and maskable HYDRA icon.
- Production service worker with versioned application-shell caching and old-cache cleanup.
- Network-first static assets, explicit API exclusion and offline fallback page.
- Lightweight splash shell and mobile viewport/safe-area metadata.
- Responsive layouts cover compact phone, tablet and desktop breakpoints.
- Slow-network loading states remain visible while API requests complete.
- Static resources are cacheable; private API responses are never written to the service-worker cache.

Installability requires HTTPS in production. Native store packaging is handled separately in Phase 18.
