"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import RatingStars from "@/components/rating-stars";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({
  totalProducts,
  reviewCount,
}: {
  totalProducts: number;
  reviewCount: number;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* soft color wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 size-[480px] rounded-full bg-blush/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 size-[420px] rounded-full bg-butter/25 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-[1220px] items-center gap-14 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24 lg:pt-16">
        {/* Copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-card px-4 py-1.5 text-[13px] font-semibold tracking-wide text-ink/70"
          >
            <Sparkles size={14} className="text-clay" />
            Screen-free play, curated with care
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08, ease }}
            className="mt-6 font-display text-[clamp(2.6rem,6.4vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.02em]"
          >
            Play that never
            <br />
            needs{" "}
            <em className="relative whitespace-nowrap text-clay">
              charging.
              <svg
                viewBox="0 0 220 14"
                aria-hidden
                className="absolute -bottom-2 left-0 w-full"
              >
                <path
                  d="M4 10 C 60 3, 160 3, 216 9"
                  fill="none"
                  className="stroke-butter"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.16, ease }}
            className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-ink/65"
          >
            Wooden games that outlast childhoods and drawing books that turn
            quiet afternoons into small masterpieces — handpicked for curious
            kids and the grown-ups who love them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.24, ease }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 text-[15px] font-semibold text-cream transition-all hover:bg-clay active:scale-[0.98]"
            >
              Shop the collection
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/20 px-7 py-[15px] text-[15px] font-semibold transition hover:border-clay hover:text-clay"
            >
              New this season
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink/60"
          >
            <span className="flex items-center gap-2">
              <RatingStars rating={4.8} size={15} />
              <span>
                <strong className="font-semibold text-ink">4.8</strong> from{" "}
                {reviewCount} parent reviews
              </span>
            </span>
            <span className="hidden h-4 w-px bg-ink/20 sm:block" />
            <span>
              <strong className="font-semibold text-ink">{totalProducts}</strong>{" "}
              slow toys, zero batteries
            </span>
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[36px] shadow-[0_50px_100px_-30px_rgba(38,32,25,0.4)]">
            <Image
              src="/images/hero.jpg"
              alt="A curated still life of wooden games and drawing books on a warm cream backdrop"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 520px"
              className="object-cover"
            />
          </div>

          {/* Rotating sticker */}
          <div className="absolute -left-5 bottom-16 sm:-left-8">
            <div className="relative grid size-28 place-items-center rounded-full bg-butter shadow-lg sm:size-32">
              <svg viewBox="0 0 100 100" className="spin-slower absolute inset-0 size-full">
                <defs>
                  <path
                    id="circlePath"
                    d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                  />
                </defs>
                <text className="fill-ink text-[10.5px] font-bold uppercase tracking-[0.18em]">
                  <textPath href="#circlePath">
                    100% screen-free · made to last ·
                  </textPath>
                </text>
              </svg>
              <svg viewBox="0 0 64 64" className="size-9" aria-hidden>
                <path
                  d="M8 48a24 24 0 0 1 48 0"
                  fill="none"
                  className="stroke-ink"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Floating review chip */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease }}
            className="floaty absolute -right-3 top-10 w-44 rounded-2xl border border-ink/5 bg-card p-3.5 shadow-xl sm:-right-8 sm:w-52"
          >
            <RatingStars rating={5} size={12} />
            <p className="mt-1.5 text-[13px] font-medium leading-snug">
              “Our rainy-day saviour. Officially.”
            </p>
            <p className="mt-1 text-[11px] text-ink/50">— Jess K., Madison</p>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  );
}
