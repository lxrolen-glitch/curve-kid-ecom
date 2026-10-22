import { cache } from "react";
import { avg, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ensureDbReady } from "@/db/bootstrap";

export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;

export type ProductWithRating = Product & {
  ratingAvg: number;
  ratingCount: number;
};

/** Plain, client-safe product shape used by cards, grids and the cart UI. */
export type CardProduct = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  priceCents: number;
  compareAtCents: number | null;
  ageLabel: string;
  ageMin: number;
  ageMax: number;
  images: string[];
  badge: string | null;
  stock: number;
  featured: boolean;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
};

async function ratingsByProduct(): Promise<Map<number, { avg: number; n: number }>> {
  const rows = await db
    .select({
      productId: reviews.productId,
      avg: avg(reviews.rating),
      n: count(reviews.id),
    })
    .from(reviews)
    .groupBy(reviews.productId);
  return new Map(
    rows.map((r) => [
      r.productId,
      { avg: r.avg ? Number(r.avg) : 0, n: Number(r.n) },
    ]),
  );
}

export function toCardProduct(p: ProductWithRating): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    ageLabel: p.ageLabel,
    ageMin: p.ageMin,
    ageMax: p.ageMax,
    images: p.images,
    badge: p.badge,
    stock: p.stock,
    featured: p.featured,
    ratingAvg: Math.round(p.ratingAvg * 10) / 10,
    ratingCount: p.ratingCount,
    createdAt: p.createdAt.toISOString(),
  };
}

export const getAllProducts = cache(
  async (): Promise<ProductWithRating[]> => {
    await ensureDbReady();
    const [all, ratings] = await Promise.all([
      db.select().from(products).orderBy(products.id),
      ratingsByProduct(),
    ]);
    return all.map((p) => {
      const r = ratings.get(p.id);
      return { ...p, ratingAvg: r?.avg ?? 0, ratingCount: r?.n ?? 0 };
    });
  },
);

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductWithRating | null> => {
    await ensureDbReady();
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    const product = rows[0];
    if (!product) return null;
    const agg = await db
      .select({ avg: avg(reviews.rating), n: count(reviews.id) })
      .from(reviews)
      .where(eq(reviews.productId, product.id));
    return {
      ...product,
      ratingAvg: agg[0]?.avg ? Number(agg[0].avg) : 0,
      ratingCount: agg[0]?.n ? Number(agg[0].n) : 0,
    };
  },
);

export const getReviewsForProduct = cache(
  async (productId: number): Promise<Review[]> => {
    await ensureDbReady();
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  },
);

export const getTopReviews = cache(
  async (limit: number): Promise<(Review & { productName: string; productSlug: string })[]> => {
    await ensureDbReady();
    const rows = await db
      .select({
        review: reviews,
        productName: products.name,
        productSlug: products.slug,
      })
      .from(reviews)
      .innerJoin(products, eq(reviews.productId, products.id))
      .where(eq(reviews.rating, 5))
      .orderBy(desc(reviews.helpful));
    return rows
      .slice(0, limit)
      .map((r) => ({
        ...r.review,
        productName: r.productName,
        productSlug: r.productSlug,
      }));
  },
);

export const getRelatedProducts = cache(
  async (product: Product, limit = 4): Promise<CardProduct[]> => {
    const all = await getAllProducts();
    const sameCategory = all.filter(
      (p) => p.category === product.category && p.id !== product.id,
    );
    const others = all.filter(
      (p) => p.category !== product.category && p.id !== product.id,
    );
    return [...sameCategory, ...others].slice(0, limit).map(toCardProduct);
  },
);

export async function getProductsByIds(ids: number[]) {
  await ensureDbReady();
  if (ids.length === 0) return [];
  return db.select().from(products).where(inArray(products.id, ids));
}
