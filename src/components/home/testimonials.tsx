import Link from "next/link";
import { Quote } from "lucide-react";
import type { getTopReviews } from "@/lib/data";
import RatingStars from "@/components/rating-stars";
import Reveal from "@/components/reveal";

type TopReview = Awaited<ReturnType<typeof getTopReviews>>[number];

const TONES = ["bg-card", "bg-fern/10", "bg-blush/40"];

export default function Testimonials({
  reviews,
}: {
  reviews: TopReview[];
}) {
  return (
    <section className="mx-auto max-w-[1220px] px-5 py-16 sm:px-8 sm:py-24">
      <Reveal className="text-center">
        <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-clay">
          From the playroom floor
        </p>
        <h2 className="mx-auto mt-2 max-w-[22ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight">
          Words from grown-ups <em className="text-ink/60">we didn&apos;t pay.</em>
        </h2>
      </Reveal>

      <div className="mt-11 grid gap-5 md:grid-cols-3">
        {reviews.map((review, i) => (
          <Reveal key={review.id} delay={0.06 + i * 0.07}>
            <figure
              className={`flex h-full flex-col rounded-[28px] border border-ink/5 p-7 shadow-[0_20px_50px_-30px_rgba(38,32,25,0.35)] transition-transform duration-500 hover:-translate-y-1.5 ${
                TONES[i % TONES.length]
              } ${i === 1 ? "md:-rotate-1" : i === 0 ? "md:rotate-1" : ""}`}
            >
              <Quote size={26} className="text-clay/60" aria-hidden />
              <blockquote className="mt-4 flex-1 font-display text-[19px] font-medium leading-snug">
                “{review.title.replace(/\.$/, "")}.”
                <span className="mt-2 block font-body text-[14.5px] font-normal leading-relaxed text-ink/65">
                  {review.body}
                </span>
              </blockquote>
              <figcaption className="mt-6 border-t border-ink/10 pt-4">
                <RatingStars rating={review.rating} size={13} />
                <p className="mt-2 text-sm font-semibold">
                  {review.author}
                  <span className="font-normal text-ink/50">
                    {" "}
                    · {review.location}
                  </span>
                </p>
                <Link
                  href={`/product/${review.productSlug}`}
                  className="mt-0.5 inline-block text-[12.5px] font-medium text-clay hover:underline"
                >
                  About: {review.productName}
                </Link>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
