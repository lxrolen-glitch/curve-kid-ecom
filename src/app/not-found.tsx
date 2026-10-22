import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-[700px] place-items-center px-5 py-28 text-center sm:px-8">
      <svg viewBox="0 0 200 90" className="w-52" aria-hidden>
        <path
          d="M20 80a30 30 0 0 1 60 0"
          fill="none"
          className="stroke-clay"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M70 80a30 30 0 0 1 60 0"
          fill="none"
          className="stroke-ink/15"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="4 12"
        />
        <circle cx="160" cy="52" r="8" className="fill-butter" />
      </svg>
      <h1 className="mt-6 font-display text-4xl font-medium">
        This piece rolled off the shelf
      </h1>
      <p className="mt-3 max-w-[40ch] text-[15.5px] text-ink/60">
        We looked under the sofa and behind the blocks — the page you&apos;re
        after isn&apos;t here.
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
