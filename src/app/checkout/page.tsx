import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/checkout-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Almost there — just a few details and the toys are on their way.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
