# Backup and recovery runbook

## Policy

- Run `npm run backup` every day from cron or the platform scheduler.
- Set `BACKUP_DIR` to storage separate from the live application disk.
- Set `OFFSITE_BACKUP_DIR` to a mounted encrypted off-site or cloud volume when available.
- Retain 7 daily, 4 weekly, and 12 monthly recovery points. Apply lifecycle rules on the destination rather than deleting from the application process.
- Monitor command exit codes and alert operations staff when a scheduled run fails or a day has no new manifest.
- Protect backups with least-privilege access and the same or stronger controls as production data.

Each recovery point contains the database, uploaded documents when `UPLOAD_DIR` exists, and a SHA-256 manifest. Email-provider state and external payment-provider records must be exported using those providers' own backup facilities.

## Restore drill

1. Select a recovery point under `BACKUP_DIR`.
2. Run `npm run restore:verify -- backups/<timestamp>` to validate its checksum and SQLite header.
3. For an isolated drill only, run `npm run restore:verify -- backups/<timestamp> --restore-to=/absolute/path/drill.db --confirm`.
4. Point a non-production instance at the restored database, start it, and exercise sign-in and representative read/write workflows.
5. Record the recovery point, operator, elapsed recovery time, and results. Investigate any difference from the recovery objectives.

Never use the restore command to overwrite the production database. Stop the app and take a fresh snapshot before a separately reviewed production recovery.

## Recovery objectives

The default daily schedule provides an RPO of up to 24 hours. The operational target RTO is 4 hours; validate it in quarterly restore drills. Hosting operators should shorten the schedule where the business requires a lower data-loss window.
