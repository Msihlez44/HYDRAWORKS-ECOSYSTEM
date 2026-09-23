import { describe, expect, it } from 'vitest'
import { checksum, retentionCutoff, safeChild, sqliteHeader } from '../../src/backup'

describe('backup safety helpers', () => {
  it('creates a stable SHA-256 checksum', () => expect(checksum('hydraworks')).toHaveLength(64))
  it('accepts child paths and rejects traversal', () => {
    expect(safeChild('/tmp/backups', '/tmp/backups/2026-01-01')).toContain('2026-01-01')
    expect(() => safeChild('/tmp/backups', '/tmp/production.db')).toThrow(/escapes/)
  })
  it('recognises SQLite headers', () => {
    expect(sqliteHeader(Buffer.from('SQLite format 3\u0000rest'))).toBe(true)
    expect(sqliteHeader(Buffer.from('not a database'))).toBe(false)
  })
  it('computes a deterministic retention cutoff', () => {
    expect(retentionCutoff(7, new Date('2026-01-08T00:00:00Z')).toISOString()).toBe('2026-01-01T00:00:00.000Z')
    expect(() => retentionCutoff(0)).toThrow(/positive/)
  })
})
