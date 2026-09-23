# Production launch checklist

Run `npm run readiness` in the production release environment. A passing result is required but is not a substitute for change approval and retained evidence.

| Gate | Current repository evidence | Launch status |
| --- | --- | --- |
| Production database configured | Deployment procedure exists; no production database access supplied | Blocked |
| HTTPS and production domain | Configuration documented; no live URL supplied | Blocked |
| Debug disabled | Readiness gate requires `NODE_ENV=production` | Configurable |
| Demo credentials removed / administrator secured | No default password committed; live admin not verifiable | Blocked |
| Email working | Provider required | Blocked |
| Production payments and webhooks | Only sandbox adapter is implemented | Blocked |
| Maps configured | Credentials/provider required | Blocked |
| Storage protected | Private durable storage procedure documented | Blocked pending host evidence |
| Backups running and production backup completed | Tools/runbook exist; no scheduler or production recovery point | Blocked |
| Error monitoring running | Logs documented; service not connected | Blocked |
| Privacy policy and terms published | No approved legal publication supplied | Blocked |
| Support and verification processes working | Application workflows/tests exist; staffing/SLA operations unverified | Blocked |
| Mobile layouts tested | Responsive/PWA tests exist; production device sign-off absent | Blocked |
| Critical tests passing | 84 tests and build passed in Phase 25; must pass for release commit | Recheck at launch |

Each external gate is attested with its named `*_VERIFIED=true` environment value only after evidence (URL, test timestamp, operator, result, and incident/rollback contact) is stored in the launch record. Never set attestations merely to make the command pass.

## Launch decision

As of Phase 26, HYDRA WORKS is **not production-ready** because the external infrastructure, production integrations, policies, and operational evidence above have not been supplied. The source is release-ready for staging and provider integration. Production-ready status may be declared only after every row is verified against the actual deployment and the readiness command passes.
