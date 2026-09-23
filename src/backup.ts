import { createHash } from 'node:crypto'
import { resolve, sep } from 'node:path'

export function checksum(data: Buffer | string) {
  return createHash('sha256').update(data).digest('hex')
}

export function safeChild(root: string, target: string) {
  const base = resolve(root)
  const full = resolve(target)
  if (full !== base && !full.startsWith(base + sep)) throw new Error('Path escapes the configured backup root')
  return full
}

export function sqliteHeader(data: Buffer) {
  return data.subarray(0, 16).toString('utf8') === 'SQLite format 3\u0000'
}

export function retentionCutoff(days: number, now = new Date()) {
  if (!Number.isInteger(days) || days < 1) throw new Error('Retention days must be positive')
  return new Date(now.getTime() - days * 86_400_000)
}
