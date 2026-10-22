"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  function go(next: number) {
    setDirection(next > index ? 1 : -1);
    setIndex((next + images.length) % images.length);
  }

  return (
    <div>
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[32px] bg-cream-deep">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60, scale: 1.02 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={index === 0 ? name : `${name} — view ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 92vw, 560px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 opacity-0 shadow-md backdrop-blur transition group-hover:opacity-100"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 opacity-0 shadow-md backdrop-blur transition group-hover:opacity-100"
            >
              <ChevronRight size={19} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => go(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-2xl transition-all ${
                i === index
                  ? "ring-2 ring-clay ring-offset-2 ring-offset-cream"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="130px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
