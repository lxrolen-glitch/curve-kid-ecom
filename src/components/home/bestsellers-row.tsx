"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CardProduct } from "@/lib/data";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";

export default function BestsellersRow({
  products,
}: {
  products: CardProduct[];
}) {
  const scroller = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    scroller.current?.scrollBy({
      left: dir * Math.min(640, scroller.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  }

  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-[1220px] px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-clay">
                Most loved
              </p>
              <h2 className="mt-2 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight">
                The ones parents <em className="text-ink/60">whisper about.</em>
              </h2>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button
                onClick={() => scrollBy(-1)}
                className="grid size-11 place-items-center rounded-full border border-ink/15 transition hover:border-clay hover:bg-clay hover:text-cream"
                aria-label="Scroll back"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => scrollBy(1)}
                className="grid size-11 place-items-center rounded-full border border-ink/15 transition hover:border-clay hover:bg-clay hover:text-cream"
                aria-label="Scroll forward"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:px-8 lg:px-[max(2rem,calc((100vw-1220px)/2+2rem))]"
      >
        {products.map((p, i) => (
          <div key={p.id} className="snap-start">
            <ProductCard product={p} index={i} wide />
          </div>
        ))}
      </div>
    </section>
  );
}
