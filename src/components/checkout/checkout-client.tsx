"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { cartCount, cartSubtotal, useCart } from "@/store/cart";
import {
  EXPRESS_SHIPPING_CENTS,
  formatMoney,
  FREE_SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
} from "@/lib/format";
import { placeOrder } from "@/app/checkout/actions";

type ShippingMethod = "standard" | "express";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink/70">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function CheckoutClient() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [method, setMethod] = useState<ShippingMethod>("standard");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    name: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "United States",
    card: "",
    expiry: "",
    cvc: "",
  });

  useEffect(() => setMounted(true), []);

  const subtotal = cartSubtotal(lines);
  const count = cartCount(lines);
  const shipping =
    method === "express"
      ? EXPRESS_SHIPPING_CENTS
      : subtotal >= FREE_SHIPPING_THRESHOLD_CENTS
        ? 0
        : STANDARD_SHIPPING_CENTS;
  const total = subtotal + shipping;

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function formatCard(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (form.card.replace(/\s/g, "").length < 12) {
      setError("Please enter a valid card number (demo cards are fine).");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      setError("Please enter the card expiry as MM/YY.");
      return;
    }
    if (form.cvc.length < 3) {
      setError("Please enter the 3-digit CVC.");
      return;
    }

    setSubmitting(true);
    const result = await placeOrder({
      email: form.email,
      name: form.name,
      line1: form.line1,
      line2: form.line2,
      city: form.city,
      region: form.region,
      postalCode: form.postalCode,
      country: form.country,
      shippingMethod: method,
      lines: lines.map((l) => ({ id: l.id, qty: l.qty })),
    });
    if (result.ok) {
      clear();
      router.push(`/checkout/success?order=${result.orderId}`);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-24 sm:px-8">
        <div className="h-8 w-48 animate-pulse rounded-full bg-cream-deep" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto grid max-w-[700px] place-items-center px-5 py-28 text-center sm:px-8">
        <span className="grid size-20 place-items-center rounded-full bg-cream-deep text-clay">
          <ShoppingBag size={30} strokeWidth={1.6} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-medium">
          Your basket is empty
        </h1>
        <p className="mt-2 max-w-[38ch] text-[15.5px] text-ink/60">
          Nothing to check out yet — the shelf, however, is fully stocked and
          mercifully silent.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-semibold text-cream transition hover:bg-clay"
        >
          Back to the shelf
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 transition hover:text-clay"
      >
        <ArrowLeft size={15} />
        Keep browsing
      </Link>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.8rem)] font-medium">
        Almost there.
      </h1>
      <p className="mt-1.5 text-[15px] text-ink/60">
        {count} item{count === 1 ? "" : "s"} · This is a demo checkout — no
        real payment is taken.
      </p>

      <form
        onSubmit={submit}
        className="mt-9 grid items-start gap-8 lg:grid-cols-[1.25fr_1fr]"
      >
        {/* Left: forms */}
        <div className="space-y-6">
          <section className="rounded-[26px] border border-ink/8 bg-card p-6 sm:p-7">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold">
              <span className="grid size-8 place-items-center rounded-full bg-clay/12 text-clay">
                <Mail size={15} />
              </span>
              Contact
            </h2>
            <div className="mt-5">
              <Field label="Email for your order updates">
                <input
                  type="email"
                  className="field"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </Field>
            </div>
          </section>

          <section className="rounded-[26px] border border-ink/8 bg-card p-6 sm:p-7">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold">
              <span className="grid size-8 place-items-center rounded-full bg-clay/12 text-clay">
                <MapPin size={15} />
              </span>
              Shipping to
            </h2>
            <div className="mt-5 grid gap-4">
              <Field label="Full name">
                <input
                  className="field"
                  placeholder="Ada Lovelace"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
              </Field>
              <Field label="Address line 1">
                <input
                  className="field"
                  placeholder="123 Maple Street"
                  value={form.line1}
                  onChange={set("line1")}
                  required
                />
              </Field>
              <Field label="Address line 2 (optional)">
                <input
                  className="field"
                  placeholder="Apartment, floor…"
                  value={form.line2}
                  onChange={set("line2")}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="City">
                  <input
                    className="field"
                    placeholder="Portland"
                    value={form.city}
                    onChange={set("city")}
                    required
                  />
                </Field>
                <Field label="State / Region">
                  <input
                    className="field"
                    placeholder="OR"
                    value={form.region}
                    onChange={set("region")}
                    required
                  />
                </Field>
                <Field label="ZIP / Postcode">
                  <input
                    className="field"
                    placeholder="97201"
                    value={form.postalCode}
                    onChange={set("postalCode")}
                    required
                  />
                </Field>
              </div>
              <Field label="Country">
                <select
                  className="field"
                  value={form.country}
                  onChange={set("country")}
                >
                  {[
                    "United States",
                    "United Kingdom",
                    "Canada",
                    "Australia",
                    "Ireland",
                    "New Zealand",
                    "Denmark",
                    "Germany",
                    "Netherlands",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="rounded-[26px] border border-ink/8 bg-card p-6 sm:p-7">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold">
              <span className="grid size-8 place-items-center rounded-full bg-clay/12 text-clay">
                <Truck size={15} />
              </span>
              Delivery speed
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMethod("standard")}
                className={`rounded-2xl border-2 px-5 py-4 text-left transition ${
                  method === "standard"
                    ? "border-clay bg-clay/5"
                    : "border-ink/10 hover:border-ink/25"
                }`}
              >
                <p className="font-semibold">Standard · 3–5 days</p>
                <p className="mt-0.5 text-sm text-ink/60">
                  {subtotal >= FREE_SHIPPING_THRESHOLD_CENTS
                    ? "Free — nicely done"
                    : `${formatMoney(STANDARD_SHIPPING_CENTS)} · free over ${formatMoney(FREE_SHIPPING_THRESHOLD_CENTS)}`}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setMethod("express")}
                className={`rounded-2xl border-2 px-5 py-4 text-left transition ${
                  method === "express"
                    ? "border-clay bg-clay/5"
                    : "border-ink/10 hover:border-ink/25"
                }`}
              >
                <p className="font-semibold">Express · 1–2 days</p>
                <p className="mt-0.5 text-sm text-ink/60">
                  {formatMoney(EXPRESS_SHIPPING_CENTS)} · for the birthdays you
                  almost forgot
                </p>
              </button>
            </div>
          </section>

          <section className="rounded-[26px] border border-ink/8 bg-card p-6 sm:p-7">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold">
              <span className="grid size-8 place-items-center rounded-full bg-clay/12 text-clay">
                <CreditCard size={15} />
              </span>
              Payment
            </h2>
            <p className="mt-2 rounded-xl bg-butter/20 px-4 py-2.5 text-[13px] font-medium text-ink/70">
              Demo mode — use any card details. Nothing is charged, ever.
            </p>
            <div className="mt-5 grid gap-4">
              <Field label="Card number">
                <input
                  className="field tracking-wider"
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  value={form.card}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, card: formatCard(e.target.value) }))
                  }
                  maxLength={19}
                  required
                />
              </Field>
              <div className="grid gap-4 grid-cols-2">
                <Field label="Expiry">
                  <input
                    className="field"
                    placeholder="MM/YY"
                    inputMode="numeric"
                    value={form.expiry}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        expiry: formatExpiry(e.target.value),
                      }))
                    }
                    maxLength={5}
                    required
                  />
                </Field>
                <Field label="CVC">
                  <input
                    className="field"
                    placeholder="123"
                    inputMode="numeric"
                    value={form.cvc}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                      }))
                    }
                    required
                  />
                </Field>
              </div>
            </div>
          </section>
        </div>

        {/* Right: summary */}
        <aside className="rounded-[26px] border border-ink/8 bg-ink p-6 text-cream sm:p-7 lg:sticky lg:top-[128px]">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <div className="scroll-slim mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <motion.div key={line.id} layout className="flex items-center gap-3.5">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream/10">
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-butter text-[10px] font-bold text-ink">
                      {line.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">
                      {line.name}
                    </p>
                    <p className="text-[12.5px] text-cream/55">
                      {formatMoney(line.priceCents)} each
                    </p>
                  </div>
                  <p className="text-[14px] font-semibold">
                    {formatMoney(line.priceCents * line.qty)}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 space-y-2.5 border-t border-cream/15 pt-5 text-[14.5px]">
            <p className="flex justify-between text-cream/75">
              <span>Subtotal</span>
              <span className="font-medium text-cream">
                {formatMoney(subtotal)}
              </span>
            </p>
            <p className="flex justify-between text-cream/75">
              <span>Shipping</span>
              <span className="font-medium text-cream">
                {shipping === 0 ? "Free" : formatMoney(shipping)}
              </span>
            </p>
            <p className="flex justify-between border-t border-cream/15 pt-3.5 font-display text-xl font-semibold">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-clay/25 px-4 py-3 text-[13.5px] font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-clay py-4 text-[15.5px] font-semibold transition hover:bg-clay-deep active:scale-[0.99] disabled:opacity-70"
          >
            {submitting ? (
              "Placing your order…"
            ) : (
              <>
                <Lock size={15} />
                Place order · {formatMoney(total)}
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[12px] text-cream/50">
            Encrypted &amp; secure · 30-day returns · Play guarantee
          </p>
        </aside>
      </form>
    </div>
  );
}
