import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/reveal";

export default function Collections({
  gamesCount,
  booksCount,
}: {
  gamesCount: number;
  booksCount: number;
}) {
  return (
    <section className="mx-auto max-w-[1220px] px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-clay">
              The shelf
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight">
              Two aisles,{" "}
              <em className="text-ink/60">zero charging cables.</em>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ink transition hover:text-clay"
          >
            View everything
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Reveal delay={0.05}>
          <Link
            href="/shop?category=games"
            className="group relative block overflow-hidden rounded-[32px] bg-fern/10"
          >
            <div className="relative aspect-[16/11]">
              <Image
                src="/images/products/fishing-game.jpg"
                alt="Wooden magnetic fishing game with colorful pastel fish"
                fill
                sizes="(max-width: 768px) 92vw, 590px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-cream/80">
                  {gamesCount} pieces
                </p>
                <p className="mt-1 font-display text-3xl font-medium text-cream">
                  Wooden Games
                </p>
              </div>
              <span className="grid size-12 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:-rotate-45 group-hover:bg-butter">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </Link>
        </Reveal>

        <Reveal delay={0.12}>
          <Link
            href="/shop?category=books"
            className="group relative block overflow-hidden rounded-[32px] bg-sky/10"
          >
            <div className="relative aspect-[16/11]">
              <Image
                src="/images/products/draw-wild-things.jpg"
                alt="Learn-to-draw activity book with crayon safari animals"
                fill
                sizes="(max-width: 768px) 92vw, 590px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-cream/80">
                  {booksCount} titles
                </p>
                <p className="mt-1 font-display text-3xl font-medium text-cream">
                  Drawing Books
                </p>
              </div>
              <span className="grid size-12 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:-rotate-45 group-hover:bg-butter">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <Link
          href="/shop?sort=newest"
          className="group mt-5 flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-[32px] bg-ink px-7 py-6 text-cream transition sm:px-10 sm:py-7"
        >
          <div className="flex items-center gap-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-clay">
              <svg viewBox="0 0 64 64" className="size-6" aria-hidden>
                <path
                  d="M14 46a18 18 0 0 1 36 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <p className="font-display text-xl font-medium sm:text-2xl">
                Fresh off the shelf
              </p>
              <p className="text-sm text-cream/65">
                New arrivals land every few weeks — always battery-free.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-5 py-2.5 text-sm font-semibold transition group-hover:border-butter group-hover:bg-butter group-hover:text-ink">
            See what&apos;s new
            <ArrowRight size={16} />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
