import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { CheckCircle2, Package, PartyPopper, Truck } from "lucide-react";
import { db } from "@/db";
import { ensureDbReady } from "@/db/bootstrap";
import { orders } from "@/db/schema";
import { formatMoney } from "@/lib/format";
import Reveal from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orderId = typeof params.order === "string" ? params.order : "";

  await ensureDbReady();

  const rows = orderId
    ? await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    : [];
  const order = rows[0];

  if (!order) {
    return (
      <div className="mx-auto grid max-w-[700px] place-items-center px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-3xl font-medium">
          We couldn&apos;t find that order
        </h1>
        <p className="mt-2 text-[15.5px] text-ink/60">
          The link may be incomplete — or the toys are still being wrapped.
        </p>
        <Link
          href="/shop"
          className="mt-7 rounded-full bg-ink px-7 py-3.5 text-[15px] font-semibold text-cream transition hover:bg-clay"
        >
          Back to the shelf
        </Link>
      </div>
    );
  }

  const shortId = order.id.split("-")[0].toUpperCase();

  return (
    <div className="mx-auto max-w-[880px] px-5 py-14 sm:px-8 sm:py-20">
      <Reveal className="text-center">
        <span className="inline-grid size-20 place-items-center rounded-full bg-fern/12 text-fern">
          <PartyPopper size={34} strokeWidth={1.7} />
        </span>
        <h1 className="mt-6 font-display text-[clamp(2.1rem,5vw,3.4rem)] font-medium leading-tight">
          Hooray — it&apos;s <em className="text-clay">official.</em>
        </h1>
        <p className="mx-auto mt-3 max-w-[46ch] text-[16px] leading-relaxed text-ink/65">
          Order <strong className="text-ink">CK-{shortId}</strong> is
          confirmed. A receipt is on its way to{" "}
          <strong className="text-ink">{order.email}</strong> — and some very
          good play is on its way to {order.city}.
        </p>
      </Reveal>

      {/* Timeline */}
      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: CheckCircle2,
              title: "Confirmed",
              body: "Just now — wrapping paper selected",
              active: true,
            },
            {
              icon: Package,
              title: "Packed",
              body: "Within 24 hours, plastic-free",
              active: true,
            },
            {
              icon: Truck,
              title:
                order.shippingMethod === "express"
                  ? "Arriving in 1–2 days"
                  : "Arriving in 3–5 days",
              body: "Tracking by email as it ships",
              active: false,
            },
          ].map((step) => (
            <div
              key={step.title}
              className={`rounded-3xl border p-5 text-center ${
                step.active
                  ? "border-fern/30 bg-fern/8"
                  : "border-ink/10 bg-card"
              }`}
            >
              <step.icon
                size={22}
                className={`mx-auto ${step.active ? "text-fern" : "text-ink/40"}`}
              />
              <p className="mt-2 font-display text-[15.5px] font-semibold">
                {step.title}
              </p>
              <p className="mt-0.5 text-[13px] text-ink/55">{step.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Items */}
      <Reveal delay={0.15}>
        <div className="mt-10 overflow-hidden rounded-[26px] border border-ink/8 bg-card">
          <div className="border-b border-ink/8 px-6 py-4 sm:px-8">
            <h2 className="font-display text-lg font-semibold">
              What&apos;s in the box
            </h2>
          </div>
          <ul className="divide-y divide-ink/6">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 px-6 py-4 sm:px-8">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-cream-deep"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="truncate font-display text-[15.5px] font-semibold hover:text-clay"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[13px] text-ink/55">
                    Qty {item.qty} · {formatMoney(item.priceCents)} each
                  </p>
                </div>
                <p className="font-semibold">
                  {formatMoney(item.priceCents * item.qty)}
                </p>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5 border-t border-ink/8 px-6 py-5 text-[14.5px] sm:px-8">
            <p className="flex justify-between text-ink/65">
              <span>Subtotal</span>
              <span>{formatMoney(order.subtotalCents)}</span>
            </p>
            <p className="flex justify-between text-ink/65">
              <span>Shipping ({order.shippingMethod})</span>
              <span>
                {order.shippingCents === 0
                  ? "Free"
                  : formatMoney(order.shippingCents)}
              </span>
            </p>
            <p className="flex justify-between pt-1.5 font-display text-lg font-semibold">
              <span>Total</span>
              <span>{formatMoney(order.totalCents)}</span>
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mt-10 text-center">
        <p className="text-[15px] text-ink/60">
          A little tip: the basket they arrive in makes an excellent fort roof.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-semibold text-cream transition hover:bg-clay"
        >
          Keep exploring
        </Link>
      </Reveal>
    </div>
  );
}
