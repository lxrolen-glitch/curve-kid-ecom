"use client";

import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Check, PenLine, Star, ThumbsUp, X } from "lucide-react";
import type { Review } from "@/lib/data";
import { addReview, type ReviewFormState } from "@/app/product/[slug]/actions";
import RatingStars from "@/components/rating-stars";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ReviewForm({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState<
    ReviewFormState | null,
    FormData
  >(addReview, null);
  const [rating, setRating] = useState(5);

  if (state?.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-2xl bg-fern/10 p-5"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-fern text-cream">
          <Check size={17} strokeWidth={3} />
        </span>
        <div>
          <p className="font-semibold">Thank you!</p>
          <p className="text-sm text-ink/60">
            Your review is live and helping other families choose well.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="space-y-3.5">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={22}
              className={
                n <= rating
                  ? "fill-butter text-butter"
                  : "fill-transparent text-ink/25"
              }
            />
          </button>
        ))}
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <input name="author" placeholder="Your name" className="field" required maxLength={60} />
        <input name="location" placeholder="City, State" className="field" required maxLength={60} />
      </div>
      <input name="title" placeholder="Headline — sum it up" className="field" required maxLength={120} />
      <textarea
        name="body"
        placeholder="How did it go down at your place?"
        rows={4}
        className="field resize-none"
        required
        maxLength={1200}
      />
      {state?.ok === false && (
        <p className="text-sm font-medium text-clay-deep">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-clay disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}

export default function ReviewsSection({
  slug,
  reviews,
  ratingAvg,
}: {
  slug: string;
  reviews: Review[];
  ratingAvg: number;
}) {
  const [showForm, setShowForm] = useState(false);
  const [helped, setHelped] = useState<Set<number>>(new Set());

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
      {/* Summary */}
      <div className="lg:sticky lg:top-[172px] lg:self-start">
        <p className="font-display text-[3.2rem] font-semibold leading-none">
          {ratingAvg.toFixed(1)}
        </p>
        <RatingStars rating={ratingAvg} size={17} className="mt-2" />
        <p className="mt-1.5 text-sm text-ink/55">
          Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </p>

        <div className="mt-6 space-y-1.5">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-2.5 text-[12.5px]">
              <span className="w-7 shrink-0 font-medium text-ink/60">
                {d.star}★
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-butter"
                  style={{
                    width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="w-5 text-right text-ink/45">{d.count}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="mt-7 inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/20 px-5 py-2.5 text-sm font-semibold transition hover:border-clay hover:text-clay"
        >
          <PenLine size={14} />
          Write a review
        </button>
      </div>

      {/* List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-[26px] border border-ink/8 bg-card p-6 sm:p-7"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <RatingStars rating={review.rating} size={14} />
              {review.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-fern/12 px-2.5 py-0.5 text-[11px] font-bold text-fern">
                  <BadgeCheck size={12} />
                  Verified purchase
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-[19px] font-semibold">
              {review.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
              {review.body}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-4 text-[13px] text-ink/55">
              <p>
                <span className="font-semibold text-ink">{review.author}</span>
                {" · "}
                {review.location}
                {" · "}
                {formatDate(review.createdAt)}
              </p>
              <button
                onClick={() =>
                  setHelped((prev) => new Set(prev).add(review.id))
                }
                disabled={helped.has(review.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium transition ${
                  helped.has(review.id)
                    ? "border-fern/40 bg-fern/10 text-fern"
                    : "border-ink/15 hover:border-ink/40"
                }`}
              >
                <ThumbsUp size={13} />
                Helpful ({review.helpful + (helped.has(review.id) ? 1 : 0)})
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Modal form */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px]"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-4 bottom-4 top-auto z-50 mx-auto max-w-lg rounded-[28px] bg-cream p-6 sm:top-1/2 sm:-translate-y-1/2 sm:p-8"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-2xl font-semibold">
                  Write a review
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="grid size-9 place-items-center rounded-full hover:bg-ink/5"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <ReviewForm slug={slug} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
