# GitHub-connected production deployment

GitHub is the canonical source and release origin. The application includes an Express backend, private APIs, Prisma database, persistent uploads, and scheduled backup work, so GitHub Pages is not a valid production runtime. Use a Node 22 or container platform with persistent storage, or a VPS, connected to the protected `main` branch.

## Reproducible release

CI validates pull requests. On `main`, `release.yml` repeats formatting, client generation, tests, and production build, then publishes an immutable artifact named for the commit SHA. The included multi-stage `Dockerfile` is an alternative reproducible runtime image. Neither workflow contains provider credentials.

The `production` GitHub Environment should require approval and restrict deployments to `main`. A hosting provider may pull the container/repository through its official GitHub integration, or an operator can add a provider-specific deploy job after selecting the provider. Pin third-party actions to reviewed commit SHAs.

## Required production configuration

- Store secrets (`JWT_SECRET`, webhook/provider credentials, database access) in GitHub Environment secrets or the host's secret store.
- Set `APP_ORIGIN` to the final HTTPS origin and `NODE_ENV=production`; never expose secrets through Vite-prefixed variables.
- Attach durable private volumes for SQLite, `UPLOAD_DIR`, and local backup staging. For multiple replicas, migrate and test the Prisma schema on managed PostgreSQL before deployment.
- Terminate TLS at the host load balancer/reverse proxy and redirect HTTP to HTTPS.
- Run the Node server as the service command, not as a static site.
- Forward structured stdout/stderr to retained logs and configure uptime/error alerts.
- Use the platform scheduler for `npm run backup`; replicate recovery points off-site.
- Configure email, payments, maps, webhooks, and DNS through their real providers and test sandbox/staging before production.

## Provider integration contract

A provider-specific deploy job must consume only the already-verified commit/artifact, authenticate via short-lived identity or environment secrets, deploy to staging/preview where supported, run a health check over HTTPS, then promote the same artifact. Failed health checks must stop promotion. Production database migrations require a backup and a mutually exclusive release job.

After deployment, verify the real URL, security headers, registration/sign-in, authorised API access, webhook signature rejection/acceptance, persistent upload retrieval, restart persistence, logs, and a backup/restore drill. Record the commit SHA and rollback version.

## Container notes

The image intentionally contains no `.env`, database, uploads, or backup data. Mount writable durable paths and inject environment variables at runtime. Because the runtime uses the unprivileged `node` user, volumes must be owned by the matching container UID. The current SQLite configuration is appropriate only for one application writer on durable local storage.
