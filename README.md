# HYDRA WORKS Digital Ecosystem

**One account. Five platforms. One digital business ecosystem.**

HYDRA WORKS is a full-stack TypeScript application for HYDRA ID, Tuckquest, KasiBiz, MzansiFix, MzansiWork, HydraHost, HYDRA Wallet, and the administrator Command Centre. The Express server exposes the API and serves the Vite/React production bundle; Prisma provides persistence.

## Prerequisites

- Node.js 22 LTS (the version used by CI)
- npm 10 or newer
- Git
- Docker with Compose for the default local PostgreSQL 16 database, or access to another PostgreSQL instance

## Install from a fresh clone

```bash
git clone https://github.com/Msihlez44/HYDRAWORKS-ECOSYSTEM.git
cd HYDRAWORKS-ECOSYSTEM
npm ci
cp .env.example .env
```

Generate secure local values instead of retaining example secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use independent output for `JWT_SECRET`, `PAYMENT_WEBHOOK_SECRET`, and a password of at least 12 characters for `SEED_ADMIN_PASSWORD`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string; Railway supplies this through a private service reference |
| `JWT_SECRET` | Yes | At least 32 random characters used to sign authentication tokens |
| `SEED_ADMIN_PASSWORD` | For seed | Initial administrator password, at least 12 characters |
| `PORT` | No | Express port; defaults to `3000` |
| `NODE_ENV` | Yes | `development`, `test`, or `production` |
| `APP_ORIGIN` | Yes | Public browser origin used by security checks |
| `AUTH_RATE_LIMIT` | No | Authentication attempts allowed by the limiter window |
| `PAYMENT_MODE` | Yes | Keep `sandbox` locally; production requires real provider configuration |
| `PAYMENT_WEBHOOK_SECRET` | Yes | Verifies incoming payment webhook signatures |
| `HOSTING_PROVIDER` | No | HydraHost adapter; `manual` records requests without claiming infrastructure was provisioned |
| `DOMAIN_COZA_PRICE_CENTS` | No | Configurable .co.za domain price in cents |
| `UPLOAD_DIR` | No | Persistent uploaded-document directory; defaults to `./uploads` |
| `BACKUP_DIR` | No | Backup destination; defaults to `./backups` |
| `OFFSITE_BACKUP_DIR` | No | Optional mounted off-site replication destination |

Never commit `.env`. Client code can only access variables explicitly prefixed for Vite; do not put secrets in such variables.

## Database setup and migrations

For a new local database:

```bash
npx prisma generate
npm run db:start
npm run db:setup
SEED_ADMIN_PASSWORD='your-secure-local-password' npm run db:seed
```

`db:start` starts PostgreSQL 16 from `compose.yaml`. `db:setup` applies committed migrations. Schema changes must be converted into a named development migration with `npm run db:migrate -- --name <change>` before a production release. Railway applies committed migrations non-interactively before starting the new release. Back up data before any production migration.

The seed is repeatable: it upserts one administrator, the three HydraHost packages, and notification templates. It does not print or store a default password in source control.

## Run locally

```bash
npm run dev
```

Open `http://localhost:5173`. Restart after changing server environment variables.

## Test and build

Run the same essential validation used by GitHub Actions:

```bash
npx prisma format --check
npx prisma generate
npm test
npm run build
```

The build emits the server to `dist/` and the browser bundle to `dist/public/`. Run it with:

```bash
NODE_ENV=production node dist/src/server.js
```

Before production use, configure a supported production database, durable uploads, TLS reverse proxy, email/payment providers, backups, and monitoring. Consult the deployment and recovery documents in `docs/`.

## Backup commands

```bash
npm run backup
npm run restore:verify -- backups/<timestamp>
```

The legacy file-backup command supports SQLite only. Railway PostgreSQL must use Railway database backups plus an independently tested off-site export. Read `docs/BACKUP-RECOVERY.md` before scheduling or restoring.

## Troubleshooting

- **Prisma cannot reach PostgreSQL:** confirm Docker is running, use `npm run db:start`, and verify the `.env` connection string before `npm run db:setup`.
- **Seed rejects the password:** supply `SEED_ADMIN_PASSWORD` with 12 or more characters in the shell invocation or `.env`.
- **Port already in use:** set another `PORT` and ensure the configured origin matches.
- **401 after a restart:** sign in again and confirm `JWT_SECRET` did not change unexpectedly.
- **403 on state changes:** use the configured `APP_ORIGIN` and allow cookies; cross-origin mutations are rejected.
- **Page loads but API fails:** this is not a static-only app. Run the Node server and database behind HTTPS; GitHub Pages alone cannot host it.
- **Generated client/schema mismatch:** run `npx prisma generate`; never delete production data to resolve a migration error.

Security issues should follow [SECURITY.md](SECURITY.md). Contributions should follow [CONTRIBUTING.md](CONTRIBUTING.md).
