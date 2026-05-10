import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../../drizzle/schema/index';

const connectionString = process.env.DATABASE_URL;

let drizzleDb: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (drizzleDb) return drizzleDb;

  if (!connectionString) {
    console.warn('[Drizzle] DATABASE_URL not set — MySQL features are disabled');
    return null;
  }

  const pool = mysql.createPool(connectionString);
  drizzleDb = drizzle(pool, { schema, mode: 'default' });
  return drizzleDb;
}
