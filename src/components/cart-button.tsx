"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { cartCount, useCart } from "@/store/cart";

export default function CartButton() {
  const lines = useCart((s) => s.lines);
  const open = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? cartCount(lines) : 0;

  return (
    <button
      onClick={open}
      className="group relative inline-flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-4 pr-3.5 text-cream transition-colors hover:bg-clay"
      aria-label={`Open basket, ${count} items`}
    >
      <ShoppingBag size={17} strokeWidth={2.2} />
      <span className="hidden text-sm font-semibold sm:inline">Basket</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 400 }}
          className="grid size-5 place-items-center rounded-full bg-butter text-[11px] font-bold text-ink"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
