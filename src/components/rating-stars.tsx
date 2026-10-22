import { Star } from "lucide-react";
import type { CSSProperties } from "react";

export default function RatingStars({
  rating,
  size = 14,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (filled: boolean) => (
    <span className="flex shrink-0" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={filled ? 0 : 1.6}
          className={
            filled
              ? "fill-butter text-butter"
              : "fill-transparent text-ink/30"
          }
        />
      ))}
    </span>
  );
  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {row(false)}
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` } as CSSProperties}
      >
        {row(true)}
      </span>
    </span>
  );
}
