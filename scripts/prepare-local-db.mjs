import 'dotenv/config'
import { close, open } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'
if (!databaseUrl.startsWith('file:')) {
  console.log('Non-SQLite database selected; creation is delegated to its database server.')
  process.exit(0)
}

const configuredPath = databaseUrl.slice('file:'.length)
const databasePath = isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), 'prisma', configuredPath)
open(databasePath, 'a', 0o600, (error, descriptor) => {
  if (error) throw error
  close(descriptor, (closeError) => {
    if (closeError) throw closeError
    console.log(`Local SQLite database prepared: ${databasePath}`)
  })
})
