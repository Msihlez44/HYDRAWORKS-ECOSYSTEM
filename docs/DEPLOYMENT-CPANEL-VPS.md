# cPanel and self-hosted deployment

HYDRA WORKS requires a persistent Node.js process, server-side API, database, writable private storage, and scheduled jobs. Basic PHP-only shared hosting and GitHub Pages cannot run it. Use either Node.js-capable cPanel (Option A) or a VPS/cloud host (Option B). A PHP/MySQL edition (Option C) does not exist in this repository.

## Production prerequisites

- Node.js 22, npm, and a hosting account that permits a continuously running Node application
- HTTPS-capable reverse proxy and DNS control
- A production database supported by the deployed Prisma schema; the current repository is configured for SQLite and requires a single-instance host with durable disk
- Durable, non-public volumes for the database, `UPLOAD_DIR`, and backup destinations
- SMTP/email, payment, maps, monitoring, and off-site backup providers configured separately

For horizontal scaling or managed SQL, first migrate the Prisma datasource and schema to PostgreSQL in a reviewed change. Do not put SQLite on ephemeral or multi-writer network storage.

## Option A: Node.js-capable cPanel

1. Point the chosen DNS names to the cPanel host. Start with one canonical application origin; route additional subdomains to it only when the proxy and cookie policy are explicitly configured.
2. In **Setup Node.js App**, select Node 22, Production mode, repository/application root, and `dist/server.js` as the startup file. Set the application URL and cPanel-provided port binding.
3. Deploy from the protected GitHub branch using cPanel Git Version Control or a read-only deployment key. Run `npm ci`, `npx prisma generate`, `npm run build`, and `npm run db:deploy` during a maintenance window.
4. Add production environment variables in cPanel's application environment UI. Never upload `.env` into a public web root.
5. Keep the database, uploads, and backups outside `public_html`. Grant write access only to the application user.
6. Configure AutoSSL and force HTTPS. Set `APP_ORIGIN` to the exact `https://` origin, then restart the application.
7. Configure cPanel cron to run `npm run backup` daily from the application directory and alert on non-zero exit. Use the host's process manager/restart feature for the web process; cron is not a substitute for a process manager.

cPanel implementations vary. If the account cannot run Node 22 continuously, bind private ports, persist storage, or execute cron, use Option B.

## Option B: VPS or cloud VM

Provision an unprivileged service account, Node 22, firewall, Nginx/Caddy, and persistent volumes. Clone the repository to a versioned release directory, install with `npm ci`, generate Prisma Client, build, apply reviewed migrations, and switch the service symlink only after validation.

Run `node dist/server.js` under systemd, PM2, or the platform's supervised service. Restart on failure, limit filesystem permissions, send logs to journald/a log service, and expose only the reverse proxy on ports 80/443. A health check should request `/api/health` if enabled by the deployed release, otherwise a documented safe HTTP route.

## Domains and subdomains

Preferred logical names are configurable:

- `hydraworks.co.za` — primary application
- `id`, `tuckquest`, `kasibiz`, `mzansifix`, `mzansiwork`, `hydrahost`, and `admin` subdomains — optional branded entry points
- `api.hydraworks.co.za` — optional API origin only after CORS, cookies, and CSRF/origin enforcement are configured for it

Issue certificates for every active hostname. Redirect unused aliases to the canonical origin. Do not enable a wildcard DNS record unless the reverse proxy rejects unknown hosts. The current safest topology is one canonical origin with path-based modules.

## Database, files, and secrets

- Stop writes and take a verified backup before schema deployment.
- Restrict the SQLite file to the service account and use durable local block storage.
- Keep uploads private; serve authorised files through the application rather than a public directory.
- Supply `JWT_SECRET`, webhook secrets, admin seed password, and provider credentials from cPanel/platform secrets or a root-readable service environment file.
- Rotate secrets after any suspected disclosure. Changing `JWT_SECRET` invalidates existing authentication tokens.

## Email and background work

Use an authenticated transactional email provider with SPF, DKIM, and DMARC. The application must not claim delivery until provider credentials and failure handling are tested. Schedule backups and any queue/notification workers through cPanel cron, systemd timers, or the platform scheduler, using a lock so runs cannot overlap.

## Backup and release procedure

Follow `docs/BACKUP-RECOVERY.md`. Store daily copies off the application disk and perform quarterly isolated restore drills. For each release: back up, deploy to a staging/release directory, build and test, apply migrations, switch traffic, verify HTTPS/auth/critical workflows, and retain the prior release for rollback. Database rollback requires a separately tested recovery plan; reverting code alone may not reverse a migration.
