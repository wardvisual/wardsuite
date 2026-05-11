/**
 * Firestore migration runner.
 *
 * Each migration is a file in this directory named NNN_description.ts that
 * exports a default async function. The runner tracks which migrations have
 * already executed in the `_migrations` Firestore collection so each one
 * runs exactly once.
 *
 * Usage:
 *   npm run firebase:migrate
 */
import 'dotenv/config';
import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { db } from '../firestore.client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_COL = '_migrations';

interface MigrationModule {
  default: () => Promise<void>;
  description?: string;
}

async function getApplied(): Promise<Set<string>> {
  const snap = await db.collection(MIGRATIONS_COL).get();
  return new Set(snap.docs.map(d => d.id));
}

async function markApplied(name: string, durationMs: number) {
  await db.collection(MIGRATIONS_COL).doc(name).set({
    appliedAt: new Date().toISOString(),
    durationMs,
  });
}

async function main() {
  const files = (await readdir(__dirname))
    .filter(f => /^\d{3}_.*\.ts$/.test(f))
    .sort();

  if (!files.length) {
    console.log('[migrate] No migration files found.');
    return;
  }

  const applied = await getApplied();
  const pending = files.filter(f => !applied.has(f));

  if (!pending.length) {
    console.log('[migrate] All migrations already applied.');
    return;
  }

  console.log(`[migrate] ${pending.length} pending migration(s):\n`);

  for (const file of pending) {
    const mod: MigrationModule = await import(pathToFileURL(join(__dirname, file)).href);
    const label = file.replace('.ts', '');
    process.stdout.write(`  → ${label} ... `);
    const t0 = Date.now();
    await mod.default();
    const elapsed = Date.now() - t0;
    await markApplied(file, elapsed);
    console.log(`done (${elapsed}ms)`);
  }

  console.log('\n[migrate] Finished.');
}

main().catch((err) => {
  console.error('[migrate] Fatal:', err);
  process.exit(1);
});
