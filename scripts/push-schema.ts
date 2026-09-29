/**
 * Pushes the Payload schema to the SQLite database, working around a drizzle-kit bug.
 *
 * When drizzle-kit rebuilds a SQLite table (e.g. to add a foreign key for a new
 * collection to `payload_locked_documents_rels` or a `*_rels` table), it emits every
 * CREATE INDEX statement twice. The second copy fails with "index ... already exists",
 * so the dev server's automatic push never completes. This script runs the same diff,
 * drops the duplicate statements and applies the rest in a transaction.
 *
 * It refuses to run anything drizzle flags as data loss or that needs a rename answer.
 *
 * Usage (stop `npm run dev` first):
 *   npm run db:push            # show and apply the changes
 *   npm run db:push -- --dry   # only show them
 */
import config from '@payload-config'
import { getPayload } from 'payload'

// Stop Payload pushing on init; this script does the push itself.
process.env.PAYLOAD_MIGRATING = 'true'

const dryRun = process.argv.includes('--dry')

const payload = await getPayload({ config })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = payload.db as any
const { pushSchema } = adapter.requireDrizzleKit()

const { hasDataLoss, statementsToExecute, warnings } = await pushSchema(
  adapter.schema,
  adapter.drizzle,
  undefined,
  adapter.tablesFilter,
  undefined,
)

if (hasDataLoss || warnings.length) {
  console.error('Not pushing: drizzle reports possible data loss.\n' + warnings.join('\n'))
  process.exit(1)
}

const seen = new Set<string>()
const statements = (statementsToExecute as string[]).filter((sql) => {
  if (!sql.startsWith('CREATE INDEX') && !sql.startsWith('CREATE UNIQUE INDEX')) return true
  if (seen.has(sql)) return false
  seen.add(sql)
  return true
})

if (!statements.length) {
  console.log('Schema is up to date.')
  process.exit(0)
}

console.log(statements.join('\n'))

if (dryRun) {
  console.log(`\n${statements.length} statements (dry run, nothing applied).`)
  process.exit(0)
}

const client = adapter.client
await client.execute('PRAGMA foreign_keys=OFF;')
const tx = await client.transaction('write')
try {
  for (const sql of statements) {
    if (sql.startsWith('PRAGMA')) continue
    await tx.execute(sql)
  }
  await tx.commit()
} catch (error) {
  await tx.rollback()
  throw error
} finally {
  await client.execute('PRAGMA foreign_keys=ON;')
}

console.log(`\nApplied ${statements.length} statements.`)
process.exit(0)
