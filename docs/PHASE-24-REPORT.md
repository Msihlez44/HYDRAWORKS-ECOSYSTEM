# Phase 24 — GitHub-compatible deployment

Phase 24 adds a protected-environment production release workflow, immutable commit-addressed build artifacts, and a multi-stage Node 22 container definition. Deployment guidance covers secure secrets, production data, domains/HTTPS, storage, authentication, server runtime, logs, scheduling, provider promotion, real-URL smoke tests, and rollback.

No external host was selected or authorised, so the repository produces a verified release rather than pretending to deploy. GitHub Pages is explicitly excluded for the backend.
