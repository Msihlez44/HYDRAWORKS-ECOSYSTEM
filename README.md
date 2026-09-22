# HYDRA WORKS Digital Ecosystem

**One account. Five platforms. One digital business ecosystem.**

This repository contains the GitHub execution build for HYDRA ID, TUCKQUEST, KASIBIZ, MZANSIFIX, MZANSIWORK, HYDRAHOST, HYDRA Wallet and the HYDRA Command Centre.

Phase 0 and Phase 1 provide a working full-stack foundation: secure registration and login, role-based identity, profile access, business accounts, audit logging, responsive UI and administrator metrics.

## Quick start

```bash
cp .env.example .env
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Use Node.js 22+. See `docs/PHASE-0-1-REPORT.md` for implementation status and acceptance notes.
