import "dotenv/config";
import { db } from "./index";
import {
  newsletterSubscribers,
  orders,
  products,
  reviews,
} from "./schema";
import { productRows, reviewRows, toReviewInserts } from "./seed-data";

async function seed() {
  console.log("Clearing existing data…");
  await db.delete(reviews);
  await db.delete(orders);
  await db.delete(newsletterSubscribers);
  await db.delete(products);

  console.log(`Inserting ${productRows.length} products…`);
  const inserted = await db
    .insert(products)
    .values(productRows)
    .returning({ id: products.id, slug: products.slug });

  const idBySlug = new Map(inserted.map((p) => [p.slug, p.id]));

  console.log(`Inserting ${reviewRows.length} reviews…`);
  await db.insert(reviews).values(toReviewInserts(idBySlug));

  console.log("Seed complete:", {
    products: inserted.length,
    reviews: reviewRows.length,
  });
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
