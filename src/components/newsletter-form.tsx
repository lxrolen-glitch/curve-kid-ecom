"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterForm({
  dark = false,
  compact = false,
}: {
  dark?: boolean;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 font-medium ${
              dark ? "text-butter" : "text-fern"
            }`}
          >
            <span
              className={`grid size-6 place-items-center rounded-full ${
                dark ? "bg-butter/20" : "bg-fern/15"
              }`}
            >
              <Check size={14} strokeWidth={3} />
            </span>
            You&apos;re on the list. Play ideas are on their way.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -8 }}
            onSubmit={submit}
            className={`flex w-full ${compact ? "gap-2" : "gap-2.5"}`}
            noValidate
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="you@example.com"
              aria-label="Email address"
              className={`field flex-1 ${dark ? "!border-cream/25 !bg-cream/10 !text-cream placeholder:!text-cream/45" : ""}`}
              data-invalid={state === "error"}
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className={`group inline-flex shrink-0 items-center gap-1.5 rounded-xl font-semibold transition-all active:scale-[0.97] disabled:opacity-60 ${
                compact ? "px-3.5 py-2.5 text-sm" : "px-5 py-3"
              } ${
                dark
                  ? "bg-butter text-ink hover:bg-cream"
                  : "bg-ink text-cream hover:bg-clay"
              }`}
            >
              {state === "loading" ? "Joining…" : "Join"}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {state === "error" && (
        <p className="mt-2 text-sm text-clay-deep">
          Hmm — that email doesn&apos;t look right. Mind checking it?
        </p>
      )}
    </div>
  );
}
