"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import type { CardProduct } from "@/lib/data";
import ProductCard from "@/components/product-card";
import Marquee from "@/components/marquee";

type Category = "all" | "games" | "books";
type Sort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

const AGES = [
  { id: "0-3", label: "0–3 yrs", test: (p: CardProduct) => p.ageMin <= 3 },
  {
    id: "3-5",
    label: "3–5 yrs",
    test: (p: CardProduct) => p.ageMin <= 5 && p.ageMax >= 3,
  },
  {
    id: "5-8",
    label: "5–8 yrs",
    test: (p: CardProduct) => p.ageMin <= 8 && p.ageMax >= 5,
  },
  { id: "8plus", label: "8+ yrs", test: (p: CardProduct) => p.ageMax >= 8 },
];

const PRICES = [
  { id: "under-20", label: "Under $20", test: (p: CardProduct) => p.priceCents < 2000 },
  {
    id: "20-35",
    label: "$20 – $35",
    test: (p: CardProduct) => p.priceCents >= 2000 && p.priceCents <= 3500,
  },
  { id: "over-35", label: "Over $35", test: (p: CardProduct) => p.priceCents > 3500 },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

function sortProducts(products: CardProduct[], sort: Sort) {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.priceCents - b.priceCents);
    case "price-desc":
      return list.sort((a, b) => b.priceCents - a.priceCents);
    case "rating":
      return list.sort(
        (a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount,
      );
    case "newest":
      return list.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      );
    default:
      return list.sort((a, b) => {
        const score = (p: CardProduct) =>
          (p.badge === "bestseller" ? 100 : 0) +
          (p.featured ? 30 : 0) +
          p.ratingAvg * 10 +
          p.ratingCount;
        return score(b) - score(a);
      });
  }
}

export default function ShopClient({
  products,
  initialCategory,
  initialSort,
}: {
  products: CardProduct[];
  initialCategory?: string;
  initialSort?: string;
}) {
  const [category, setCategory] = useState<Category>(
    initialCategory === "games" || initialCategory === "books"
      ? initialCategory
      : "all",
  );
  const [sort, setSort] = useState<Sort>(
    (SORTS.find((s) => s.id === initialSort)?.id ?? "featured") as Sort,
  );
  const [ages, setAges] = useState<Set<string>>(new Set());
  const [prices, setPrices] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);

  const counts = useMemo(
    () => ({
      all: products.length,
      games: products.filter((p) => p.category === "games").length,
      books: products.filter((p) => p.category === "books").length,
    }),
    [products],
  );

  const filtered = useMemo(() => {
    const queryLower = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (ages.size > 0 && ![...ages].some((a) => AGES.find((x) => x.id === a)!.test(p)))
        return false;
      if (
        prices.size > 0 &&
        ![...prices].some((c) => PRICES.find((x) => x.id === c)!.test(p))
      )
        return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (
        queryLower &&
        !`${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(queryLower)
      )
        return false;
      return true;
    });
    return sortProducts(list, sort);
  }, [products, category, ages, prices, inStockOnly, query, sort]);

  const activeFilterCount =
    ages.size + prices.size + (inStockOnly ? 1 : 0) + (query ? 1 : 0);

  function toggleSet(setter: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearAll() {
    setAges(new Set());
    setPrices(new Set());
    setInStockOnly(false);
    setQuery("");
  }

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink/50">
          Age
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {AGES.map((a) => (
            <button
              key={a.id}
              onClick={() => toggleSet(setAges, a.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition ${
                ages.has(a.id)
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 bg-card hover:border-ink/40"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink/50">
          Price
        </h3>
        <div className="mt-3 space-y-2">
          {PRICES.map((c) => (
            <label
              key={c.id}
              className="flex cursor-pointer items-center gap-2.5 text-[14.5px] text-ink/80"
            >
              <input
                type="checkbox"
                checked={prices.has(c.id)}
                onChange={() => toggleSet(setPrices, c.id)}
                className="size-4 accent-clay"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink/50">
          Availability
        </h3>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[14.5px] text-ink/80">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="size-4 accent-clay"
          />
          In stock only
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-clay hover:underline"
        >
          <X size={14} />
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Header band */}
      <div className="border-b border-ink/8 bg-cream-deep/50">
        <div className="mx-auto max-w-[1220px] px-5 py-10 sm:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-clay">
            The CurveKid shelf
          </p>
          <h1 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-tight">
            {category === "games"
              ? "Wooden games for loud giggles"
              : category === "books"
                ? "Drawing books for quiet masterpieces"
                : "Everything, all at once."}
          </h1>
          <p className="mt-2 max-w-[52ch] text-[15.5px] text-ink/60">
            Every piece is parent-tested, kid-approved and guaranteed free of
            batteries, apps and hidden wirings.
          </p>
        </div>
      </div>

      {/* Category tabs + controls */}
      <div className="sticky top-[104px] z-30 border-b border-ink/8 bg-cream/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-[1220px] flex-wrap items-center gap-3 px-5 py-3.5 sm:px-8">
          <div className="flex rounded-full border border-ink/12 bg-card p-1">
            {(["all", "games", "books"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition ${
                  category === c
                    ? "bg-ink text-cream"
                    : "text-ink/65 hover:text-ink"
                }`}
              >
                {c === "all" ? "All" : c === "games" ? "Games" : "Books"}
                <span className="ml-1.5 text-[11px] opacity-60">
                  {counts[c]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative hidden min-w-[200px] flex-1 items-center md:flex">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 text-ink/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the shelf…"
              className="field !rounded-full !py-2.5 pl-10"
              aria-label="Search products"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <p className="hidden text-[13px] font-medium text-ink/55 sm:block">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="appearance-none rounded-full border border-ink/12 bg-card py-2.5 pl-4 pr-9 text-[13.5px] font-semibold outline-none transition focus:border-clay"
                aria-label="Sort products"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/50"
              />
            </div>
            <button
              onClick={() => setMobileFilters(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-card px-4 py-2.5 text-[13.5px] font-semibold lg:hidden"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-clay text-[11px] font-bold text-cream">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-[1220px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[172px]">{filterPanel}</div>
        </aside>

        <div>
          {/* Mobile search */}
          <div className="relative mb-6 md:hidden">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the shelf…"
              className="field !rounded-full pl-10"
              aria-label="Search products"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-[28px] border border-dashed border-ink/20 py-24 text-center">
              <p className="font-display text-2xl font-medium">
                Nothing on this shelf yet
              </p>
              <p className="mt-2 max-w-[34ch] text-[15px] text-ink/55">
                Try widening an age range or clearing a filter — the good stuff
                is hiding nearby.
              </p>
              <button
                onClick={clearAll}
                className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-clay"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <Marquee
        fast
        items={[
          "Free shipping over $60",
          "Gift wrap on every order",
          "30-day returns",
          "Tested by real kids",
        ]}
        className="border-t border-ink/10 bg-butter/25 py-3 text-[13.5px] font-semibold tracking-wide text-ink/70"
      />

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/45 lg:hidden"
              onClick={() => setMobileFilters(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[78vh] overflow-y-auto rounded-t-[28px] bg-cream p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setMobileFilters(false)}
                  className="grid size-10 place-items-center rounded-full hover:bg-ink/5"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
              {filterPanel}
              <button
                onClick={() => setMobileFilters(false)}
                className="mt-8 w-full rounded-full bg-ink py-3.5 text-[15px] font-semibold text-cream"
              >
                Show {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
