import Image from "next/image";
import { Leaf, Puzzle, ShieldCheck, TreePine } from "lucide-react";
import Reveal from "@/components/reveal";

const VALUES = [
  {
    icon: TreePine,
    title: "FSC-certified wood",
    body: "Every block, tile and arch starts as responsibly managed European beech or birch.",
  },
  {
    icon: Puzzle,
    title: "Designed for real play",
    body: "Open-ended by design — no single 'right way', so imagination does the heavy lifting.",
  },
  {
    icon: ShieldCheck,
    title: "Tested beyond the rules",
    body: "EN71 and ASTM certified, finished with baby-safe water-based stains and oils.",
  },
  {
    icon: Leaf,
    title: "Plastic-free, always",
    body: "Packaged in recycled board, sealed with paper tape and posted carbon-neutral.",
  },
];

export default function StoryBand() {
  return (
    <section id="story" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1220px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative">
            <div className="relative aspect-[5/6] overflow-hidden rounded-b-[999px] rounded-t-[36px] shadow-[0_50px_100px_-40px_rgba(38,32,25,0.4)]">
              <Image
                src="/images/story-band.jpg"
                alt="Flat lay of wooden toys, drawing books and crayons on warm linen"
                fill
                sizes="(max-width: 1024px) 92vw, 560px"
                className="object-cover"
              />
            </div>
            <div className="floaty-late absolute -right-4 top-8 rounded-2xl border border-ink/5 bg-card px-4 py-3 shadow-xl sm:-right-8">
              <p className="font-display text-2xl font-semibold text-clay">0</p>
              <p className="text-[12px] font-medium text-ink/60">
                batteries shipped.
                <br />
                Ever.
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-clay">
              Our story
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.08]">
              We started CurveKid after one Christmas{" "}
              <em className="text-ink/60">too many beeping boxes.</em>
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-ink/65">
              CurveKid is a small, fussy toy shelf. We test everything with the
              toughest critics we know — actual kids, and their
              low-on-sleep parents — and only stock what survives both. If it
              needs a screen, a subscription or an apology, it doesn&apos;t make
              the cut.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={0.08 + i * 0.05}>
                <div className="flex gap-3.5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-fern/12 text-fern">
                    <v.icon size={19} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="font-display text-[17px] font-semibold">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink/60">
                      {v.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-ink/10 pt-7">
              {[
                ["2,300+", "families playing"],
                ["36", "hand-picked pieces"],
                ["4.8★", "average review"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-[1.9rem] font-semibold leading-none">
                    {num}
                  </p>
                  <p className="mt-1.5 text-[13px] font-medium text-ink/55">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
