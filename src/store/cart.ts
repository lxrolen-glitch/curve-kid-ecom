"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";

export type CartLine = {
  id: number;
  slug: string;
  name: string;
  image: string;
  priceCents: number;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.id === item.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.id === item.id
                  ? { ...l, qty: Math.min(99, l.qty + qty) }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...item, qty }] };
        }),
      remove: (id) =>
        set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.id !== id)
              : state.lines.map((l) =>
                  l.id === id ? { ...l, qty: Math.min(99, qty) } : l,
                ),
        })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "curvekid-cart-v1",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.priceCents * l.qty, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}
