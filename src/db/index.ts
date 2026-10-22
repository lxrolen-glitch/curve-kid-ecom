import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let cached: NodePgDatabase | null = null;

function createDb(): NodePgDatabase {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required — set it in your environment or in your hosting provider's project settings.",
    );
  }

  const globalForDb = globalThis as typeof globalThis & {
    __curvekidPostgresPool?: Pool;
  };

  const pool =
    globalForDb.__curvekidPostgresPool ??
    new Pool({
      connectionString: databaseUrl,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__curvekidPostgresPool = pool;
  }

  return drizzle(pool);
}

/**
 * Lazily-initialized database client.
 *
 * Nothing connects — and nothing throws — at import time. That keeps module
 * evaluation safe during production builds on CI/Vercel, where page-data
 * collection imports route modules before any DATABASE_URL may be present.
 * The requirement is only enforced when a query actually executes.
 */
export const db = new Proxy({} as NodePgDatabase, {
  get(_target, prop, receiver) {
    const target = (cached ??= createDb()) as unknown as Record<
      PropertyKey,
      unknown
    >;
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(target)
      : value;
  },
  set(_target, prop, value) {
    const target = (cached ??= createDb()) as unknown as Record<
      PropertyKey,
      unknown
    >;
    return Reflect.set(target, prop, value);
  },
});
