"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { cartCount, cartSubtotal, useCart } from "@/store/cart";
import { formatMoney, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/format";

export default function CartDrawer() {
  const { lines, isOpen, close, setQty, remove } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const subtotal = cartSubtotal(lines);
  const count = cartCount(lines);
  const remaining = FREE_SHIPPING_THRESHOLD_CENTS - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_CENTS) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[3px]"
            onClick={close}
          />
          <motion.aside
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-2xl"
            role="dialog"
            aria-label="Shopping basket"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-xl font-semibold">
                Your basket{" "}
                <span className="text-base font-normal text-ink/50">
                  ({count})
                </span>
              </h2>
              <button
                onClick={close}
                className="grid size-10 place-items-center rounded-full transition hover:bg-ink/5"
                aria-label="Close basket"
              >
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="grid size-20 place-items-center rounded-full bg-cream-deep text-clay">
                  <ShoppingBag size={30} strokeWidth={1.6} />
                </span>
                <p className="font-display text-2xl font-medium">
                  Your basket is feeling light
                </p>
                <p className="max-w-[26ch] text-[15px] text-ink/60">
                  Fill it with things that never need charging, updating or
                  muting.
                </p>
                <Link
                  href="/shop"
                  onClick={close}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-clay"
                >
                  Browse the shelf
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                {/* Free shipping meter */}
                <div className="border-b border-ink/10 px-6 py-4">
                  <p className="flex items-center gap-2 text-[13px] font-medium text-ink/75">
                    <Truck size={15} className="text-fern" />
                    {remaining > 0 ? (
                      <span>
                        You&apos;re{" "}
                        <strong className="text-ink">
                          {formatMoney(remaining)}
                        </strong>{" "}
                        away from free shipping
                      </span>
                    ) : (
                      <span className="text-fern">
                        You&apos;ve unlocked free standard shipping
                      </span>
                    )}
                  </p>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <motion.div
                      className="h-full rounded-full bg-fern"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", damping: 26, stiffness: 200 }}
                    />
                  </div>
                </div>

                {/* Lines */}
                <div className="scroll-slim flex-1 overflow-y-auto px-6 py-4">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.div
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.28 }}
                        className="mb-4 flex gap-4"
                      >
                        <Link
                          href={`/product/${line.slug}`}
                          onClick={close}
                          className="relative size-[84px] shrink-0 overflow-hidden rounded-2xl bg-cream-deep"
                        >
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="84px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${line.slug}`}
                              onClick={close}
                              className="truncate font-display text-[15.5px] font-semibold hover:text-clay"
                            >
                              {line.name}
                            </Link>
                            <button
                              onClick={() => remove(line.id)}
                              className="grid size-7 shrink-0 place-items-center rounded-full text-ink/40 transition hover:bg-clay/10 hover:text-clay"
                              aria-label={`Remove ${line.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="mt-0.5 text-sm text-ink/55">
                            {formatMoney(line.priceCents)}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-card px-1 py-1">
                              <button
                                onClick={() => setQty(line.id, line.qty - 1)}
                                className="grid size-6 place-items-center rounded-full transition hover:bg-ink/5"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">
                                {line.qty}
                              </span>
                              <button
                                onClick={() => setQty(line.id, line.qty + 1)}
                                className="grid size-6 place-items-center rounded-full transition hover:bg-ink/5"
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <span className="text-[15px] font-semibold">
                              {formatMoney(line.priceCents * line.qty)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-ink/10 bg-card px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] text-ink/65">Subtotal</span>
                    <span className="font-display text-xl font-semibold">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-ink/50">
                    Shipping &amp; taxes calculated at checkout.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-clay py-3.5 text-[15px] font-semibold text-cream transition hover:bg-clay-deep active:scale-[0.99]"
                  >
                    Continue to checkout
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                  <div className="mt-3.5 flex items-center justify-center gap-5 text-[12px] font-medium text-ink/55">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-fern" />
                      Secure checkout
                    </span>
                    <span className="flex items-center gap-1.5">
                      <RotateCcw size={14} className="text-fern" />
                      30-day returns
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
