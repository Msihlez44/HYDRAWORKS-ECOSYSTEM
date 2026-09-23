import { createHash } from 'node:crypto'
import { copyFile, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve, sep } from 'node:path'

const backup = process.argv[2]
if (!backup) throw new Error('Usage: npm run restore:verify -- <backup-directory> [--restore-to=/safe/path] [--confirm]')
const backupRoot = resolve(process.env.BACKUP_DIR || './backups')
const directory = resolve(backup)
if (directory !== backupRoot && !directory.startsWith(backupRoot + sep)) throw new Error('Backup directory is outside BACKUP_DIR')

const manifestPath = join(directory, 'manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const databasePath = join(directory, basename(manifest.database.file))
const data = await readFile(databasePath)
const digest = createHash('sha256').update(data).digest('hex')
if (digest !== manifest.database.sha256) throw new Error('Database checksum does not match the manifest')
if (data.subarray(0, 16).toString('utf8') !== 'SQLite format 3\u0000') throw new Error('Backup does not contain a valid SQLite database')

const restoreArg = process.argv.find((value) => value.startsWith('--restore-to='))
if (restoreArg) {
  if (!process.argv.includes('--confirm')) throw new Error('Restoring requires the explicit --confirm flag')
  const target = resolve(restoreArg.slice('--restore-to='.length))
  const cwd = resolve(process.cwd())
  if (target === cwd || target === dirname(target)) throw new Error('Unsafe restore target')
  await copyFile(databasePath, target)
  console.log(`Verified backup restored to: ${target}`)
}

manifest.restoreTested = true
manifest.lastRestoreTestAt = new Date().toISOString()
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Backup verified: ${directory}`)
