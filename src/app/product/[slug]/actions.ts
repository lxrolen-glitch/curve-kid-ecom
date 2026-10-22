"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { ensureDbReady } from "@/db/bootstrap";
import { products, reviews } from "@/db/schema";

export type ReviewFormState = { ok: true } | { ok: false; error: string };

export async function addReview(
  _prev: ReviewFormState | null,
  formData: FormData,
): Promise<ReviewFormState> {
  const slug = String(formData.get("slug") ?? "");
  const author = String(formData.get("author") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);

  if (!slug || !author || !location || !title || !body) {
    return { ok: false, error: "Please fill in every field." };
  }
  if (rating < 1 || rating > 5) {
    return { ok: false, error: "Please pick a star rating." };
  }

  await ensureDbReady();

  const product = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product[0]) return { ok: false, error: "Product not found." };

  await db.insert(reviews).values({
    productId: product[0].id,
    author: author.slice(0, 60),
    location: location.slice(0, 60),
    title: title.slice(0, 120),
    body: body.slice(0, 1200),
    rating,
    verified: false,
    helpful: 0,
  });

  revalidatePath(`/product/${slug}`);
  return { ok: true };
}
