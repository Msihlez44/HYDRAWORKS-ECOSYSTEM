# Phase 21 — Backups and recovery

Phase 21 adds reproducible SQLite and uploaded-document backups, SHA-256 integrity manifests, optional off-site replication, guarded restore verification, an explicit retention policy, and a quarterly recovery-drill procedure.

The application does not claim that a backup is healthy merely because it was copied: verification checks both its digest and database header, and records the last successful test in the manifest. Production scheduling, encrypted destination storage, alerts, and external-provider exports remain hosting-operator responsibilities.
