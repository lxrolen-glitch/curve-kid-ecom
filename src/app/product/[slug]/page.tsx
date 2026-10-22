import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviewsForProduct,
} from "@/lib/data";
import Gallery from "@/components/product/gallery";
import PurchasePanel from "@/components/product/purchase-panel";
import Accordion from "@/components/product/accordion";
import ReviewsSection from "@/components/product/reviews";
import ProductCard from "@/components/product-card";
import RatingStars from "@/components/rating-stars";
import Reveal from "@/components/reveal";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product),
  ]);

  return (
    <div>
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-[1220px] items-center gap-1.5 px-5 pt-6 text-[13px] text-ink/55 sm:px-8"
      >
        <Link href="/" className="hover:text-clay">
          Home
        </Link>
        <ChevronRight size={13} />
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-clay"
        >
          {product.category === "games" ? "Wooden Games" : "Drawing Books"}
        </Link>
        <ChevronRight size={13} />
        <span className="truncate font-medium text-ink">{product.name}</span>
      </nav>

      {/* Main */}
      <div className="mx-auto grid max-w-[1220px] gap-10 px-5 py-8 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <Gallery images={product.images} name={product.name} />

        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-clay">
            {product.category === "games" ? "Wooden Game" : "Drawing Book"}
          </p>
          <h1 className="mt-2 font-display text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.06]">
            {product.name}
          </h1>
          <a
            href="#reviews"
            className="mt-3 inline-flex items-center gap-2 text-sm text-ink/60 transition hover:text-ink"
          >
            <RatingStars rating={product.ratingAvg} size={15} />
            <span className="font-medium text-ink">
              {product.ratingAvg.toFixed(1)}
            </span>
            · {product.ratingCount} review
            {product.ratingCount === 1 ? "" : "s"}
          </a>
          <p className="mt-1.5 font-display text-lg italic text-ink/50">
            {product.tagline}
          </p>

          <div className="mt-5">
            <PurchasePanel product={product} />
          </div>

          <div className="mt-9">
            <Accordion
              items={[
                {
                  title: "Materials & care",
                  content: (
                    <p>
                      {product.materials} Wipe clean with a damp cloth — no
                      soaps needed, and please keep them out of the bath.
                    </p>
                  ),
                },
                {
                  title: "What's inside",
                  content: (
                    <ul className="list-disc space-y-1.5 pl-5">
                      {product.inBox.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  title: "Shipping & returns",
                  content: (
                    <p>
                      Orders ship within 24 hours, Monday to Friday. Standard
                      shipping is $5.95 (free over $60) and arrives in 3–5
                      business days; Express is $12.50 and arrives in 1–2.
                      Changed your mind? You have 30 days — return postage is
                      on us.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-28 bg-cream-deep/60 py-14 sm:py-20">
        <div className="mx-auto max-w-[1220px] px-5 sm:px-8">
          <Reveal>
            <h2 className="mb-10 font-display text-[clamp(1.7rem,3.5vw,2.5rem)] font-medium">
              What families say <em className="text-ink/60">about this one</em>
            </h2>
          </Reveal>
          <ReviewsSection
            slug={product.slug}
            reviews={reviews}
            ratingAvg={product.ratingAvg}
          />
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-[1220px] px-5 py-14 sm:px-8 sm:py-20">
        <Reveal>
          <h2 className="font-display text-[clamp(1.7rem,3.5vw,2.5rem)] font-medium">
            Pairs well with <em className="text-ink/60">a rainy day</em>
          </h2>
        </Reveal>
        <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
