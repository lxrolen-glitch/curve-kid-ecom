"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import CartButton from "@/components/cart-button";

const NAV = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=games", label: "Wooden Games" },
  { href: "/shop?category=books", label: "Drawing Books" },
  { href: "/#story", label: "Our Story" },
];

const MESSAGES = [
  "Free shipping on orders over $60",
  "100% screen-free, forever",
  "Plastic-free, gift-ready packaging",
];

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5"
      aria-label="CurveKid home"
    >
      <svg viewBox="0 0 64 64" className="size-8" aria-hidden>
        <rect width="64" height="64" rx="18" className="fill-ink" />
        <path
          d="M14 46a18 18 0 0 1 36 0"
          fill="none"
          className="stroke-clay"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M23 46a9 9 0 0 1 18 0"
          fill="none"
          className="stroke-butter"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-[1.45rem] font-semibold tracking-tight">
        CurveKid
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setMsgIndex((i) => (i + 1) % MESSAGES.length),
      4200,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="flex h-9 items-center justify-center bg-ink text-[13px] font-medium tracking-wide text-cream/90">
        <AnimatePresence mode="wait">
          <motion.span
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {MESSAGES[msgIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Main bar */}
      <div
        className={`border-b transition-all duration-500 ${
          scrolled
            ? "border-ink/10 bg-cream/85 shadow-[0_10px_40px_-18px_rgba(38,32,25,0.35)] backdrop-blur-xl"
            : "border-transparent bg-cream"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1220px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center rounded-full transition hover:bg-ink/5"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>
          </div>
          <div className="max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">
            <Logo />
          </div>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                data-active={
                  item.href === "/shop" && pathname === "/shop"
                    ? "true"
                    : undefined
                }
                className="nav-squiggle text-[15px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <CartButton />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-cream lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
                <Logo onClick={() => setMenuOpen(false)} />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="grid size-10 place-items-center rounded-full transition hover:bg-ink/5"
                  aria-label="Close menu"
                >
                  <X size={21} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 px-4 py-6">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-2xl px-4 py-3.5 font-display text-2xl font-medium transition hover:bg-cream-deep"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto px-6 pb-8 text-sm text-ink/60">
                <p className="font-medium text-ink">Need a hand?</p>
                <p className="mt-1">
                  Write to{" "}
                  <a
                    href="mailto:hello@curvekid.shop"
                    className="text-clay underline underline-offset-2"
                  >
                    hello@curvekid.shop
                  </a>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
