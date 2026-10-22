import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CartDrawer from "@/components/cart-drawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "CurveKid — Beautifully Slow Toys & Drawing Books",
    template: "%s · CurveKid",
  },
  description:
    "Screen-free wooden games and drawing books for curious kids and calm parents. Sustainably made, endlessly played with, and always battery-free.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="bg-cream text-ink antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <CartDrawer />
      </body>
    </html>
  );
}
