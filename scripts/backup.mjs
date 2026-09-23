import { createHash } from 'node:crypto'
import { copyFile, cp, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, isAbsolute, join, resolve } from 'node:path'

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'
if (!databaseUrl.startsWith('file:')) throw new Error('The bundled backup command currently supports SQLite file: databases only')

const rawDatabase = databaseUrl.slice(5)
const database = isAbsolute(rawDatabase) ? rawDatabase : resolve(process.cwd(), rawDatabase)
const backupRoot = resolve(process.env.BACKUP_DIR || './backups')
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const destination = join(backupRoot, stamp)
await mkdir(destination, { recursive: true })

const databaseCopy = join(destination, basename(database))
await copyFile(database, databaseCopy)
const databaseData = await readFile(databaseCopy)
const databaseStat = await stat(databaseCopy)
const digest = createHash('sha256').update(databaseData).digest('hex')

const uploads = resolve(process.env.UPLOAD_DIR || './uploads')
let uploadedFiles = false
try {
  if ((await stat(uploads)).isDirectory()) {
    await cp(uploads, join(destination, 'uploads'), { recursive: true })
    uploadedFiles = true
  }
} catch (error) {
  if (error?.code !== 'ENOENT') throw error
}

const manifest = {
  version: 1,
  createdAt: new Date().toISOString(),
  database: { file: basename(databaseCopy), bytes: databaseStat.size, sha256: digest },
  uploadsIncluded: uploadedFiles,
  restoreTested: false,
}
await writeFile(join(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')

if (process.env.OFFSITE_BACKUP_DIR) {
  const offsite = resolve(process.env.OFFSITE_BACKUP_DIR, basename(destination))
  await mkdir(dirname(offsite), { recursive: true })
  await cp(destination, offsite, { recursive: true })
}

console.log(`Backup completed: ${destination}`)
