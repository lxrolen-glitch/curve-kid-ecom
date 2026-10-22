"use server";

import { db } from "@/db";
import { orders, type OrderLine } from "@/db/schema";
import { getProductsByIds } from "@/lib/data";
import {
  EXPRESS_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
} from "@/lib/format";

export type OrderInput = {
  email: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  shippingMethod: "standard" | "express";
  lines: { id: number; qty: number }[];
};

export type OrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export async function placeOrder(input: OrderInput): Promise<OrderResult> {
  // --- Validate contact + address
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email ?? "")) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  const required = [
    input.name,
    input.line1,
    input.city,
    input.region,
    input.postalCode,
    input.country,
  ];
  if (required.some((f) => !f || !f.trim())) {
    return { ok: false, error: "Please complete your shipping address." };
  }
  if (!Array.isArray(input.lines) || input.lines.length === 0) {
    return { ok: false, error: "Your basket is empty." };
  }

  // --- Re-price everything server-side; never trust client totals.
  const ids = input.lines.map((l) => l.id);
  const products = await getProductsByIds(ids);
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines: OrderLine[] = [];
  for (const line of input.lines) {
    const product = byId.get(line.id);
    if (!product) {
      return {
        ok: false,
        error: "One of the items in your basket is no longer available.",
      };
    }
    const qty = Math.max(1, Math.min(99, Math.floor(line.qty) || 1));
    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      priceCents: product.priceCents,
      qty,
    });
  }

  const subtotalCents = lines.reduce(
    (sum, l) => sum + l.priceCents * l.qty,
    0,
  );
  const shippingCents =
    input.shippingMethod === "express"
      ? EXPRESS_SHIPPING_CENTS
      : subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
        ? 0
        : STANDARD_SHIPPING_CENTS;

  const [inserted] = await db
    .insert(orders)
    .values({
      email: input.email.trim(),
      name: input.name.trim(),
      line1: input.line1.trim(),
      line2: input.line2?.trim() || null,
      city: input.city.trim(),
      region: input.region.trim(),
      postalCode: input.postalCode.trim(),
      country: input.country.trim(),
      shippingMethod: input.shippingMethod,
      items: lines,
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      status: "confirmed",
    })
    .returning({ id: orders.id });

  return { ok: true, orderId: inserted.id };
}
