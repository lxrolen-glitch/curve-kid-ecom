import { getAllProducts, getTopReviews, toCardProduct } from "@/lib/data";
import Marquee from "@/components/marquee";
import NewsletterForm from "@/components/newsletter-form";
import Reveal from "@/components/reveal";
import Hero from "@/components/home/hero";
import Collections from "@/components/home/collections";
import BestsellersRow from "@/components/home/bestsellers-row";
import StoryBand from "@/components/home/story-band";
import Testimonials from "@/components/home/testimonials";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [all, topReviews] = await Promise.all([getAllProducts(), getTopReviews(3)]);

  const games = all.filter((p) => p.category === "games");
  const books = all.filter((p) => p.category === "books");
  const reviewCount = all.reduce((sum, p) => sum + p.ratingCount, 0);

  const bestsellers = [...all]
    .sort((a, b) => {
      const aScore = (a.badge === "bestseller" ? 100 : 0) + a.ratingAvg * 10 + a.ratingCount;
      const bScore = (b.badge === "bestseller" ? 100 : 0) + b.ratingAvg * 10 + b.ratingCount;
      return bScore - aScore;
    })
    .slice(0, 8)
    .map(toCardProduct);

  return (
    <>
      <Hero totalProducts={all.length} reviewCount={reviewCount} />

      <Marquee
        items={[
          "Screen-free, always",
          "FSC-certified wood",
          "Water-based finishes",
          "Plastic-free packaging",
          "Ages 0–10",
          "30-day easy returns",
        ]}
        className="border-y border-ink/10 bg-clay py-3.5 font-display text-[15px] font-medium tracking-wide text-cream"
      />

      <Collections gamesCount={games.length} booksCount={books.length} />
      <BestsellersRow products={bestsellers} />

      <div className="bg-cream-deep/60">
        <StoryBand />
      </div>

      <Testimonials reviews={topReviews} />

      {/* CTA band */}
      <section className="mx-auto max-w-[1220px] px-5 pb-20 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] bg-ink px-7 py-14 text-cream sm:px-14 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-clay/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-butter/20 blur-3xl"
            />
            <div className="relative mx-auto max-w-xl text-center">
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-butter">
                The Slow Play Post
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.9rem)] font-medium leading-tight">
                One lovely play idea a week. <em>That&apos;s it.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-[44ch] text-[15.5px] leading-relaxed text-cream/70">
                Rainy-day setups, new arrivals and gentle reminders that
                childhood doesn&apos;t need a charging cable.
              </p>
              <div className="mx-auto mt-7 max-w-md">
                <NewsletterForm dark />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
