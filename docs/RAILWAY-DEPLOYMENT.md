# Railway deployment

The production topology uses GitHub as the canonical source and Railway for the Node.js runtime and PostgreSQL. `railway.json` builds the checked-in Dockerfile, applies committed Prisma migrations as a pre-deploy command, checks `/api/health`, and restarts failed processes.

## Required services

1. Application service sourced from `Msihlez44/HYDRAWORKS-ECOSYSTEM`.
2. PostgreSQL service with `DATABASE_URL` referenced into the application service.
3. Private upload storage or an object-storage provider before accepting user documents.

The initial Railway-generated domain is for staging acceptance. Attach the controlled production domain only after email, production payments, maps, monitoring, storage, backups, policies, and live acceptance tests pass.

## Required application variables

- `NODE_ENV=production`
- `APP_ORIGIN=https://<current-service-domain>`
- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- a unique 32-byte-or-longer `JWT_SECRET`
- a unique webhook secret for the active payment provider
- `PAYMENT_MODE=sandbox` during staging only
- `HOSTING_PROVIDER=manual` until a real registrar/hosting adapter is connected
- `AUTH_RATE_LIMIT=10`
- `DOMAIN_COZA_PRICE_CENTS=14900`

Do not set `SEED_ADMIN_PASSWORD` on the continuously running application. Supply it only to a controlled one-time seed command, then remove it.

## Release and rollback

Pull requests must pass GitHub CI. Merging the deployment branch triggers Railway from the connected repository. The database migration runs before the release becomes healthy. Roll back application code through Railway only when the schema remains backward compatible; otherwise restore from a verified database backup under a reviewed recovery plan.
