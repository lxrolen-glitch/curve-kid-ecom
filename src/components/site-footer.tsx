import Link from "next/link";
import NewsletterForm from "@/components/newsletter-form";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Shop All" },
      { href: "/shop?category=games", label: "Wooden Games" },
      { href: "/shop?category=books", label: "Drawing Books" },
      { href: "/shop?sort=newest", label: "New Arrivals" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#story", label: "Our Story" },
      { href: "/#story", label: "How We Curate" },
      { href: "/#story", label: "Sustainability" },
      { href: "mailto:hello@curvekid.shop", label: "Wholesale" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "mailto:hello@curvekid.shop", label: "Contact Us" },
      { href: "/checkout", label: "Shipping" },
      { href: "/checkout", label: "Returns" },
      { href: "/shop", label: "Gift Guide" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-cream-deep">
      <div className="mx-auto max-w-[1220px] px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-[1.7rem] font-semibold leading-tight">
              Good play,
              <br />
              <em className="text-clay">delivered monthly-ish.</em>
            </p>
            <p className="mb-5 mt-3 max-w-[36ch] text-[15px] text-ink/65">
              Play ideas, new arrivals and the occasional rainy-day rescue kit.
              No noise — we&apos;re anti-noise.
            </p>
            <NewsletterForm compact />
            <div className="mt-6 flex items-center gap-3">
              {[
                { mark: "Ig", label: "Instagram" },
                { mark: "Fb", label: "Facebook" },
                { mark: "Yt", label: "YouTube" },
              ].map(({ mark, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-ink/15 font-display text-[15px] font-semibold text-ink/70 transition hover:border-clay hover:bg-clay hover:text-cream"
                >
                  {mark}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink/50">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-ink/75 transition-colors hover:text-clay"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-6 text-[13px] text-ink/55 sm:flex-row">
          <p>© 2026 CurveKid Toy Co. All rights reserved.</p>
          <p className="font-display italic">
            Designed in Copenhagen, played everywhere.
          </p>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "Amex", "PayPal"].map((p) => (
              <span
                key={p}
                className="rounded-md border border-ink/12 bg-card px-2 py-1 text-[11px] font-semibold tracking-wide"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
