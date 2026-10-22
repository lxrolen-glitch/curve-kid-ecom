import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let cached: NodePgDatabase | null = null;

/**
 * Resolve the connection string. `DATABASE_URL` is canonical, but we also
 * accept the names Vercel Storage (Neon/Postgres) injects automatically, so a
 * freshly connected store works with zero manual configuration.
 */
function resolveDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_URL_NON_POOLING;
  if (!url) {
    throw new Error(
      "DATABASE_URL is required — set it in your environment or in your hosting provider's project settings.",
    );
  }
  return url;
}

function createDb(): NodePgDatabase {
  const databaseUrl = resolveDatabaseUrl();
  const isLocalhost = /(?:localhost|127\.0\.0\.1)/.test(databaseUrl);

  const globalForDb = globalThis as typeof globalThis & {
    __curvekidPostgresPool?: Pool;
  };

  const pool =
    globalForDb.__curvekidPostgresPool ??
    new Pool({
      connectionString: databaseUrl,
      // Hosted Postgres (Neon/Vercel/Supabase…) requires TLS; local dev does not.
      ssl: isLocalhost ? undefined : { rejectUnauthorized: false },
      max: 5,
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
