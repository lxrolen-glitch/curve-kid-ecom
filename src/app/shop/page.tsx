import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts, toCardProduct } from "@/lib/data";
import ShopClient from "@/components/shop/shop-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse the full CurveKid shelf — wooden games and drawing books for curious kids and calm parents.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;

  const products = (await getAllProducts()).map(toCardProduct);

  return (
    <Suspense>
      <ShopClient
        products={products}
        initialCategory={category}
        initialSort={sort}
      />
    </Suspense>
  );
}
