# Phase 10 — Notifications

Phase 10 adds central event templates, in-app notifications, per-event channel preferences, read/archive state and delivery attempts for in-app, email, SMS and push.

In-app delivery is immediate. External channels remain pending and fail closed until real provider adapters and credentials are configured; the application never reports an email, SMS or push as sent without provider confirmation.
