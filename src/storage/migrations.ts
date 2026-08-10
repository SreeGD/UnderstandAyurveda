import { CURRENT_SCHEMA_VERSION } from './schema'

/**
 * Forward-only migrations, applied in ascending order from a document's
 * schemaVersion to CURRENT_SCHEMA_VERSION.
 *
 * Rules (contracts/storage-schema.md):
 *   - Each migration is pure and unit tested against a fixture of the prior version.
 *   - A document from a NEWER version is never downgraded and never discarded.
 *     A user who loads an old cached build must not lose their data.
 */
export type Migration = (doc: Record<string, unknown>) => Record<string, unknown>

export const migrations: Record<number, Migration> = {
  // 1 → 2 will live here when the schema first changes. Example shape:
  // 1: (doc) => ({ ...doc, schemaVersion: 2, newField: defaultValue }),
}

export interface MigrationResult {
  document: Record<string, unknown>
  /** True when the stored document came from a newer app version. */
  isFutureVersion: boolean
  applied: number[]
}

export function migrate(raw: Record<string, unknown>): MigrationResult {
  const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 0
  const applied: number[] = []

  if (version > CURRENT_SCHEMA_VERSION) {
    // Preserve, do not touch. Reading is fine; writing would destroy fields
    // this build knows nothing about.
    return { document: raw, isFutureVersion: true, applied }
  }

  let doc = raw
  for (let v = version; v < CURRENT_SCHEMA_VERSION; v++) {
    const migration = migrations[v]
    if (!migration) {
      // No path from this version. Treat as unmigratable rather than guessing.
      break
    }
    doc = migration(doc)
    applied.push(v)
  }

  return { document: doc, isFutureVersion: false, applied }
}
