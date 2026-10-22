import { sql } from "drizzle-orm";
import { db } from "./index";
import { products, reviews } from "./schema";
import { productRows, toReviewInserts } from "./seed-data";

/**
 * Self-healing runtime bootstrap.
 *
 * Fresh hosting environments (e.g. a newly created Vercel Postgres store) have
 * no schema and no data. On the first database-touching request we create the
 * tables if missing and seed the demo catalog if the shop is empty — inside a
 * single transaction guarded by a transaction-scoped advisory lock, so
 * concurrent serverless cold starts can't race or double-seed. Existing
 * databases are a no-op (one cheap existence check, memoized per process).
 */

const DDL = [
  `create table if not exists products (
     id serial primary key,
     slug text not null unique,
     name text not null,
     tagline text not null,
     description text not null,
     category text not null,
     price_cents integer not null,
     compare_at_cents integer,
     age_label text not null,
     age_min integer not null,
     age_max integer not null,
     players text,
     playtime text,
     materials text not null,
     in_box text[] not null,
     images text[] not null,
     badge text,
     featured boolean not null default false,
     stock integer not null default 20,
     created_at timestamptz not null default now()
   )`,
  `create table if not exists reviews (
     id serial primary key,
     product_id integer not null references products(id) on delete cascade,
     author text not null,
     location text not null,
     rating integer not null,
     title text not null,
     body text not null,
     verified boolean not null default true,
     helpful integer not null default 0,
     created_at timestamptz not null default now()
   )`,
  `create table if not exists orders (
     id uuid primary key default gen_random_uuid(),
     email text not null,
     name text not null,
     line1 text not null,
     line2 text,
     city text not null,
     region text not null,
     postal_code text not null,
     country text not null,
     shipping_method text not null,
     items jsonb not null,
     subtotal_cents integer not null,
     shipping_cents integer not null,
     total_cents integer not null,
     status text not null default 'confirmed',
     created_at timestamptz not null default now()
   )`,
  `create table if not exists newsletter_subscribers (
     id serial primary key,
     email text not null unique,
     created_at timestamptz not null default now()
   )`,
];

let ready: Promise<void> | null = null;

export function ensureDbReady(): Promise<void> {
  ready ??= bootstrap().catch((err) => {
    ready = null; // allow retry on the next request
    throw err;
  });
  return ready;
}

async function bootstrap(): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(${727272727})`);

    for (const statement of DDL) {
      await tx.execute(sql.raw(statement));
    }

    const existing = (await tx.execute(
      sql`select 1 as x from products limit 1`,
    )) as unknown as unknown[];

    if (existing.length > 0) return;

    const inserted = await tx
      .insert(products)
      .values(productRows)
      .returning({ id: products.id, slug: products.slug });

    const idBySlug = new Map(inserted.map((p) => [p.slug, p.id]));
    await tx.insert(reviews).values(toReviewInserts(idBySlug));
  });
}
