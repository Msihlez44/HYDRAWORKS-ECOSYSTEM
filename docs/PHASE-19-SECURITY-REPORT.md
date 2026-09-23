# Phase 19 — Security Hardening

## Controls verified

- Authentication uses strong password hashing, signed short-lived JWTs and server-side session records.
- Logout revokes the active session; suspended accounts are rejected on every authenticated request.
- Login and registration are IP rate-limited.
- Role and ownership checks protect administrative and object routes; transaction participants are resolved server-side.
- Prisma parameterisation prevents raw SQL injection in application routes.
- React escaping, strict JSON input, Helmet CSP, frame denial and object-source denial reduce XSS exposure.
- SameSite cookies plus production origin validation protect state-changing cookie-authenticated requests from CSRF.
- Evidence/document metadata allowlists restrict MIME type and size; storage references are not publicly resolved by the API.
- Payment callbacks require HMAC verification and terminal payment states make replay idempotent.
- Sensitive fields are excluded from public storefront/analytics responses and a reusable redaction helper protects structured logs.
- Request bodies are limited to 64 KB. External user-provided links are required to use HTTPS by validation schemas.

Password-reset and OTP endpoints are not currently exposed, so there is no dormant insecure flow. They require dedicated hashed, expiring, single-use token models before introduction.

## Production requirements

Set `APP_ORIGIN` exactly to the HTTPS application origin, use a 32+ character random JWT secret, rotate webhook secrets, place uploads in private object storage with short-lived signed URLs, and operate behind a TLS reverse proxy. Security review must be repeated after selecting production payment, storage, email and maps providers.
