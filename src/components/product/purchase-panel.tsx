"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Baby,
  Check,
  Clock3,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";
import type { ProductWithRating } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/store/cart";

export default function PurchasePanel({
  product,
}: {
  product: ProductWithRating;
}) {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const sale =
    product.compareAtCents && product.compareAtCents > product.priceCents;
  const lowStock = product.stock > 0 && product.stock < 8;

  function addToCart() {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        image: product.images[0],
      },
      qty,
    );
    setAdded(true);
    open();
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[2rem] font-semibold">
          {formatMoney(product.priceCents)}
        </span>
        {sale && (
          <>
            <span className="text-lg text-ink/40 line-through">
              {formatMoney(product.compareAtCents!)}
            </span>
            <span className="rounded-full bg-clay px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-cream">
              Save {formatMoney(product.compareAtCents! - product.priceCents)}
            </span>
          </>
        )}
      </div>

      {/* Meta chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-card px-3.5 py-1.5 text-[13px] font-medium">
          <Baby size={14} className="text-clay" />
          {product.ageLabel}
        </span>
        {product.players && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-card px-3.5 py-1.5 text-[13px] font-medium">
            <Users size={14} className="text-fern" />
            {product.players}
          </span>
        )}
        {product.playtime && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-card px-3.5 py-1.5 text-[13px] font-medium">
            <Clock3 size={14} className="text-sky" />
            {product.playtime}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-card px-3.5 py-1.5 text-[13px] font-medium">
          <Package size={14} className="text-butter" />
          Ships in 24h
        </span>
      </div>

      <p className="mt-6 text-[15.5px] leading-relaxed text-ink/70">
        {product.description}
      </p>

      {lowStock && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-butter/25 px-3.5 py-1.5 text-[13px] font-semibold text-ink">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-clay opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-clay" />
          </span>
          Only {product.stock} left on the shelf
        </p>
      )}

      {/* Qty + CTA */}
      <div className="mt-7 flex items-stretch gap-3">
        <div className="flex items-center rounded-full border border-ink/15 bg-card px-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-10 place-items-center rounded-full transition hover:bg-ink/5"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="grid size-10 place-items-center rounded-full transition hover:bg-ink/5"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
        <motion.button
          onClick={addToCart}
          whileTap={{ scale: 0.97 }}
          className={`flex flex-1 items-center justify-center gap-2.5 rounded-full py-4 text-[15.5px] font-semibold text-cream transition-colors ${
            added ? "bg-fern" : "bg-clay hover:bg-clay-deep"
          }`}
        >
          {added ? (
            <>
              <Check size={18} strokeWidth={3} />
              Added to basket
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              Add to basket — {formatMoney(product.priceCents * qty)}
            </>
          )}
        </motion.button>
      </div>

      {/* Reassurance rows */}
      <div className="mt-7 space-y-2.5 rounded-3xl border border-ink/10 bg-card p-5 text-[13.5px] text-ink/70">
        {[
          {
            icon: Truck,
            text: "Free standard shipping over $60 · Express available",
          },
          { icon: RotateCcw, text: "30-day no-drama returns, on us" },
          {
            icon: ShieldCheck,
            text: "2-year play-hard guarantee · EN71 & ASTM certified",
          },
        ].map((row) => (
          <p key={row.text} className="flex items-center gap-2.5">
            <row.icon size={15} className="shrink-0 text-fern" />
            {row.text}
          </p>
        ))}
      </div>
    </div>
  );
}
