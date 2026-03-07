import pg from "pg";

let pool = null;

export function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function query(text, params) {
  const p = getPool();
  if (!p) throw new Error("DATABASE_URL not configured");
  return p.query(text, params);
}
