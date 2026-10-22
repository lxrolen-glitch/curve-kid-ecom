"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import type { CardProduct } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/store/cart";
import RatingStars from "@/components/rating-stars";

function Badge({ product }: { product: CardProduct }) {
  const sale =
    product.compareAtCents && product.compareAtCents > product.priceCents;
  let label: string | null = null;
  let tone = "bg-ink text-cream";
  if (sale) {
    label = `Save ${formatMoney(product.compareAtCents! - product.priceCents)}`;
    tone = "bg-clay text-cream";
  } else if (product.stock > 0 && product.stock < 8) {
    label = "Low stock";
    tone = "bg-butter text-ink";
  } else if (product.badge === "bestseller") {
    label = "Bestseller";
  } else if (product.badge === "new") {
    label = "Just in";
    tone = "bg-fern text-cream";
  }
  if (!label) return null;
  return (
    <span
      className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${tone}`}
    >
      {label}
    </span>
  );
}

export default function ProductCard({
  product,
  index = 0,
  wide = false,
}: {
  product: CardProduct;
  index?: number;
  wide?: boolean;
}) {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);
  const [added, setAdded] = useState(false);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      image: product.images[0],
    });
    setAdded(true);
    open();
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex h-full flex-col ${wide ? "min-w-[260px] md:min-w-[300px]" : ""}`}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-[26px] bg-cream-deep"
        aria-label={product.name}
      >
        <Badge product={product} />
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 280px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 280px"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.slug}`} className="min-w-0">
            <h3 className="truncate font-display text-[17px] font-semibold leading-snug transition-colors group-hover:text-clay">
              {product.name}
            </h3>
          </Link>
          <button
            onClick={quickAdd}
            aria-label={`Add ${product.name} to basket`}
            className={`grid size-9 shrink-0 place-items-center rounded-full transition-all active:scale-90 ${
              added
                ? "bg-fern text-cream"
                : "bg-ink text-cream hover:bg-clay"
            }`}
          >
            {added ? (
              <Check size={16} strokeWidth={3} />
            ) : (
              <Plus size={17} strokeWidth={2.5} />
            )}
          </button>
        </div>
        <p className="mt-0.5 truncate text-[13.5px] text-ink/55">
          {product.tagline}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <RatingStars rating={product.ratingAvg} size={13} />
          <span className="text-xs font-medium text-ink/50">
            {product.ratingAvg.toFixed(1)} ({product.ratingCount})
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-[17px] font-semibold">
            {formatMoney(product.priceCents)}
          </span>
          {product.compareAtCents && (
            <span className="text-sm text-ink/45 line-through">
              {formatMoney(product.compareAtCents)}
            </span>
          )}
          <span className="ml-auto rounded-full bg-cream-deep px-2.5 py-0.5 text-[11px] font-semibold text-ink/60">
            {product.ageLabel}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
