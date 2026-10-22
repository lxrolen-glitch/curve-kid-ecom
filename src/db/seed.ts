import "dotenv/config";
import { db } from "./index";
import {
  newsletterSubscribers,
  orders,
  products,
  reviews,
} from "./schema";

const PX_OVERRIDES: Record<number, string> = {
  159579:
    "https://images.pexels.com/photos/159579/crayons-coloring-book-coloring-book-159579.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const PX = (id: number) =>
  PX_OVERRIDES[id] ??
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

const productRows = [
  {
    slug: "the-rainbow-stacker",
    name: "The Rainbow Stacker",
    tagline: "Seven arches of open-ended magic.",
    description:
      "Cut from a single plank of FSC-certified beech and finished with silky water-based stains, our rainbow does whatever a kid tells it to: tunnels for trains, cradles for dolls, bridges for dinosaurs, a hat at dinner. Nothing clips, snaps or beeps — the physics are the fun. It also happens to be the toy guests always ask about, so we measured the box to fit a standard gift shelf. You're welcome.",
    category: "games",
    priceCents: 3600,
    compareAtCents: null,
    ageLabel: "2–6 yrs",
    ageMin: 2,
    ageMax: 6,
    players: "1+ players",
    playtime: null,
    materials:
      "Solid FSC-certified European beech, hand-sanded and finished with non-toxic water-based stains and a food-grade oil seal.",
    inBox: [
      "Seven graduated arches, 35 cm wide at the base",
      "Organic cotton storage pouch",
      "Play-ideas card with 12 starter builds",
      "Care & safety booklet (EN71 + ASTM certified)",
    ],
    images: ["/images/products/rainbow-stacker.jpg", PX(3661452), PX(3661352)],
    badge: "bestseller",
    featured: true,
    stock: 18,
  },
  {
    slug: "woodland-memory-match",
    name: "Woodland Memory Match",
    tagline: "The game that beats grandma, fairly.",
    description:
      "Twenty-four chunky beech tiles, twelve engraved woodland neighbours, and one delightfully humbling way to lose to a four-year-old. Each animal is engraved (never printed), so the artwork can't peel, fade or be licked away. Travel pouch included — this is the game we secretly pack for restaurants.",
    category: "games",
    priceCents: 2400,
    compareAtCents: null,
    ageLabel: "3–6 yrs",
    ageMin: 3,
    ageMax: 6,
    players: "1–4 players",
    playtime: "10–15 min",
    materials:
      "Engraved FSC beech tiles with a natural oil finish; GOTS-certified organic cotton pouch.",
    inBox: [
      "24 engraved beech tiles (12 pairs)",
      "Organic cotton drawstring pouch",
      "Rules card with 3 difficulty levels",
    ],
    images: ["/images/products/memory-match.jpg", PX(3662668), PX(3662666)],
    badge: "bestseller",
    featured: true,
    stock: 26,
  },
  {
    slug: "tumble-oak-tower",
    name: "Tumble Oak Tower",
    tagline: "54 blocks. One heartbeat of silence.",
    description:
      "Our oak tower weighs in at a deeply satisfying 1.2 kg, which means every pull comes with proper suspense. Roll the included die to add a colour twist, stack it past the cat, and enjoy the one game where collapse is the point. Sanded smooth enough for board-game grandmas, dense enough for block-architect dads.",
    category: "games",
    priceCents: 2900,
    compareAtCents: 3600,
    ageLabel: "5–9 yrs",
    ageMin: 5,
    ageMax: 9,
    players: "2–6 players",
    playtime: "15–25 min",
    materials:
      "Solid kiln-dried oak blocks, hand-sanded edges, finished with natural linseed oil. Wooden die with engraved pips.",
    inBox: [
      "54 solid oak blocks",
      "1 engraved decision die",
      "Stacking sleeve for tidy setup",
      "Canvas storage bag",
    ],
    images: ["/images/products/tumble-tower.jpg", PX(8762361), PX(39160066)],
    badge: null,
    featured: false,
    stock: 14,
  },
  {
    slug: "gone-fishin-pond-set",
    name: "Gone Fishin' Pond Set",
    tagline: "Twelve fish. Two rods. Infinite patience lessons.",
    description:
      "A wooden pond you can hold, twelve hand-dipped fish that refuse to cooperate, and two magnetic rods sized for small conquerors. Count the catch, sort by colour, invent the rules — this one quietly does years of maths homework before it ever looks like homework. The box is the pond, so tidy-up is part of the game.",
    category: "games",
    priceCents: 3200,
    compareAtCents: null,
    ageLabel: "3–6 yrs",
    ageMin: 3,
    ageMax: 6,
    players: "1–2 players",
    playtime: "10–20 min",
    materials:
      "Beech pond and rods, water-based pastel paints, embedded nickel-free magnets, linen drawstring bag.",
    inBox: [
      "12 hand-dipped wooden fish",
      "2 magnetic fishing rods",
      "Beech pond box (doubles as storage)",
      "Counting & colours play card",
    ],
    images: ["/images/products/fishing-game.jpg", PX(3662666), PX(3661452)],
    badge: "bestseller",
    featured: true,
    stock: 22,
  },
  {
    slug: "story-stones-meadow-tales",
    name: "Story Stones — Meadow Tales",
    tagline: "Pick two stones, tell one story, hear it back forever.",
    description:
      "Twelve smooth river stones, hand-painted with the makings of a thousand bedtime stories: a sun, a key, a grumpy-looking mushroom. Draw them blind from the pouch and let plot happen. Teachers buy these in threes; parents buy them after one car journey. Every set is painted by hand, so no two suns are quite the same.",
    category: "games",
    priceCents: 2600,
    compareAtCents: null,
    ageLabel: "4–8 yrs",
    ageMin: 4,
    ageMax: 8,
    players: "1+ players",
    playtime: "10 min – bedtime",
    materials:
      "Hand-selected river stones, non-toxic water-based paints, matte protective seal. Organic cotton pouch.",
    inBox: [
      "12 hand-painted story stones",
      "Organic cotton drawstring pouch",
      "Story-prompt card with 8 games",
    ],
    images: ["/images/products/story-stones.jpg", "/images/story-band.jpg", PX(3661452)],
    badge: "new",
    featured: false,
    stock: 16,
  },
  {
    slug: "domino-rally-deluxe",
    name: "Domino Rally Deluxe",
    tagline: "120 reasons to whisper 'don't breathe'.",
    description:
      "One hundred and twenty weighted birch dominoes in six muted-but-cheerful colours, made to topple at exactly the right dramatic pace. Build, nudge, narrate, rebuild. Comes with bridge and turning pieces for the ambitious, and a sturdy wooden crate for the rest of us at tidy-up o'clock.",
    category: "games",
    priceCents: 2200,
    compareAtCents: null,
    ageLabel: "4–8 yrs",
    ageMin: 4,
    ageMax: 8,
    players: "1–4 players",
    playtime: "15–40 min",
    materials:
      "Weighted European birch, water-based colour stains, pine storage crate.",
    inBox: [
      "120 birch dominoes in 6 colours",
      "2 bridge pieces & 2 turners",
      "Solid pine storage crate",
      "Course-ideas leaflet",
    ],
    images: [PX(39006181), PX(39006179), PX(19751328)],
    badge: null,
    featured: false,
    stock: 6,
  },
  {
    slug: "family-game-night-box",
    name: "The Family Game Night Box",
    tagline: "Four classics, one legendary Friday.",
    description:
      "Ludo, snakes & ladders, draughts and a racing dice game — all remade in wood and colour that look good enough to leave on the shelf (they will be). One box, four boards, sixty minutes of screen-free bragging rights. The rules are printed on the underside of the lid, because we know how your family loses rules.",
    category: "games",
    priceCents: 4400,
    compareAtCents: 5200,
    ageLabel: "Family · 4+",
    ageMin: 4,
    ageMax: 99,
    players: "2–6 players",
    playtime: "20–60 min",
    materials:
      "Birch plywood boards with enamel-style printed graphics, beech pieces, wooden dice, cotton parts bags.",
    inBox: [
      "4 double-sided wooden game boards",
      "48 beech playing pieces",
      "3 wooden dice",
      "Rules printed in-lid + quick-start card",
    ],
    images: [PX(39160066), PX(31674909), PX(17653597)],
    badge: null,
    featured: true,
    stock: 11,
  },
  {
    slug: "giant-floor-puzzle",
    name: "The Giant Floor Puzzle",
    tagline: "48 pieces big enough for the whole crew.",
    description:
      "Nearly a metre wide when finished, this floor puzzle turns the sitting room into mission control. The pieces are chunky, wipe-clean and weirdly satisfying to click — designed for two small builders or one very determined three-year-old. Finish it, name everything in it, then do the only sensible thing: take it apart and start again.",
    category: "games",
    priceCents: 2800,
    compareAtCents: null,
    ageLabel: "3–6 yrs",
    ageMin: 3,
    ageMax: 6,
    players: "1–2 players",
    playtime: "20–30 min",
    materials:
      "Extra-thick recycled puzzle board with a linen-embossed, wipe-clean finish. Vegetable-based inks.",
    inBox: [
      "48 chunky floor pieces (90 × 60 cm assembled)",
      "Full-size reference poster",
      "Carry handle box",
    ],
    images: [PX(7296367), PX(7269503), PX(7269453)],
    badge: null,
    featured: false,
    stock: 17,
  },
  {
    slug: "draw-wild-things",
    name: "Draw Wild Things",
    tagline: "From wobbly lines to proper lions in six steps.",
    description:
      "Our learn-to-draw book breaks 24 animals into gloriously doable steps — start with three circles, end with a mane. Every spread has a practice grid, a silly fact, and a 'your turn' page, because masterpieces need rehearsal. Printed on paper thick enough to survive both crayon pressure and sibling rivalry.",
    category: "books",
    priceCents: 1400,
    compareAtCents: null,
    ageLabel: "5–9 yrs",
    ageMin: 5,
    ageMax: 9,
    players: null,
    playtime: "Hours of quiet",
    materials:
      "120 gsm FSC paper (thick enough for felt tips), lay-flat stitched binding, card cover with rounded corners.",
    inBox: [
      "64-page guided drawing book",
      "12 practice grid pages",
      "Certificate of Very Good Drawing at the back",
    ],
    images: ["/images/products/draw-wild-things.jpg", PX(33761560), PX(159579)],
    badge: "bestseller",
    featured: true,
    stock: 34,
  },
  {
    slug: "little-artist-drawing-pad",
    name: "The Little Artist Drawing Pad",
    tagline: "Sixty enormous sheets of 'look what I made'.",
    description:
      "A3 sheets of proper, toothy 130 gsm paper that crayons love and felt tips can't bully. The spiral lies flat, pages tear out cleanly along the perforation, and the backing board doubles as a lap desk for car journeys. Fridge doors, prepare yourselves.",
    category: "books",
    priceCents: 1800,
    compareAtCents: null,
    ageLabel: "2–7 yrs",
    ageMin: 2,
    ageMax: 7,
    players: null,
    playtime: "Hours of quiet",
    materials:
      "130 gsm uncoated FSC paper, perforated pages, recycled board backing, metal spiral (lay-flat).",
    inBox: [
      "60 perforated A3 sheets",
      "Stiff backing board (lap-desk)",
      "First-page 'name & age' keepsake label",
    ],
    images: ["/images/products/drawing-pad.jpg", PX(39780355), PX(159579)],
    badge: null,
    featured: false,
    stock: 30,
  },
  {
    slug: "watercolor-and-wonder",
    name: "Watercolor & Wonder",
    tagline: "Twenty gentle scenes, paint included, talent optional.",
    description:
      "Each page is printed with a soft pencil scene — hills, harbours, one very smug cat — ready for small hands to flood with colour. Comes with an 8-pan tin of artist-grade paints and a real brush, and the paper is 200 gsm, which is paint-shop talk for 'won't crinkle, ever'. The results genuinely end up framed.",
    category: "books",
    priceCents: 1600,
    compareAtCents: null,
    ageLabel: "6–10 yrs",
    ageMin: 6,
    ageMax: 10,
    players: null,
    playtime: "Hours of quiet",
    materials:
      "200 gsm cold-pressed watercolor paper, non-toxic artist-grade pan paints, beech-handled brush.",
    inBox: [
      "20 printed 200 gsm scenes",
      "8-pan watercolor tin",
      "1 size-6 round brush",
      "2 practice 'colour weather' sheets",
    ],
    images: ["/images/products/watercolor-book.jpg", PX(7168985), "/images/story-band.jpg"],
    badge: "new",
    featured: true,
    stock: 19,
  },
  {
    slug: "color-quest-under-the-sea",
    name: "Color Quest — Under the Sea",
    tagline: "Dive in; crayons first.",
    description:
      "Forty-eight pages of reefs, wrecks and one long-suffering octopus, printed single-sided so masterpieces never bleed into each other. Gentle enough for a three-year-old's scribble, detailed enough to keep a seven-year-old suspiciously quiet. Perforated edges, fridge-ready.",
    category: "books",
    priceCents: 1200,
    compareAtCents: null,
    ageLabel: "3–7 yrs",
    ageMin: 3,
    ageMax: 7,
    players: null,
    playtime: "Hours of quiet",
    materials:
      "100 gsm FSC paper, single-sided printing, perforated edges, vegetable-based inks.",
    inBox: [
      "48 single-sided coloring pages",
      "Ocean fact bubbles on every spread",
      "Perforated tear-out edges",
    ],
    images: [PX(159579), PX(7104398), PX(29247743)],
    badge: null,
    featured: false,
    stock: 40,
  },
];

type ReviewSeed = {
  slug: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  date: string;
};

const reviewRows: ReviewSeed[] = [
  // The Rainbow Stacker
  {
    slug: "the-rainbow-stacker",
    author: "Hannah M.",
    location: "Austin, TX",
    rating: 5,
    title: "The toy that lives on our coffee table (willingly)",
    body: "Bought this for my daughter's second birthday assuming it would be a 'looks nice on the shelf' toy. Wrong — it's a tunnel, a bed for stuffed animals, a phone, and last Tuesday it was a pasta strainer (don't ask). The finish is stunning and it somehow still looks brand new after four months of daily use.",
    helpful: 24,
    date: "2025-11-14",
  },
  {
    slug: "the-rainbow-stacker",
    author: "Marcus T.",
    location: "Denver, CO",
    rating: 5,
    title: "Beautiful enough that I don't hide it",
    body: "Every other toy gets shoved in the basket at 8pm. This one stays out. Guests ask about it constantly. The colours are exactly as photographed — muted, warm, genuinely lovely. Worth every penny.",
    helpful: 11,
    date: "2025-09-02",
  },
  {
    slug: "the-rainbow-stacker",
    author: "Priya S.",
    location: "Seattle, WA",
    rating: 4,
    title: "Gorgeous, just slightly slick arches",
    body: "Wonderful quality and my son adores it. Docked one star because the oiled arches can slide against each other when he stacks them flat-side up — a small thing, and honestly part of the engineering practice. Would still buy again.",
    helpful: 6,
    date: "2026-01-08",
  },

  // Woodland Memory Match
  {
    slug: "woodland-memory-match",
    author: "Elena R.",
    location: "Portland, OR",
    rating: 5,
    title: "Grandma-proof and toddler-proof",
    body: "The engraved animals are the detail that sold me — no stickers to peel, and my 3yo has tested that theory thoroughly. We play a half-grid version with her and the full game with my 6yo. The pouch lives in my handbag now.",
    helpful: 18,
    date: "2025-12-20",
  },
  {
    slug: "woodland-memory-match",
    author: "Jess K.",
    location: "Madison, WI",
    rating: 5,
    title: "Our restaurant secret weapon",
    body: "We've played this on café tables across the Midwest. Quiet enough not to annoy anyone, engaging enough to survive the wait for mac and cheese. The tiles are the perfect size for small hands and the engraving detail is honestly gorgeous.",
    helpful: 31,
    date: "2025-10-05",
  },
  {
    slug: "woodland-memory-match",
    author: "Sofia B.",
    location: "Brooklyn, NY",
    rating: 5,
    title: "Buy the pouch, lose nothing",
    body: "Our third memory game and the first we haven't lost half of. The engraving means it still looks new after months, and my daughter names every animal like they're colleagues. The hedgehog is her nemesis.",
    helpful: 4,
    date: "2026-01-19",
  },

  // Tumble Oak Tower
  {
    slug: "tumble-oak-tower",
    author: "Dan W.",
    location: "Chicago, IL",
    rating: 5,
    title: "Family game night MVP",
    body: "The weight of these blocks is no joke — pulls are genuinely tense. We've owned plastic versions before and this is a different sport entirely. The die adds a nice twist for the kids. Collapse volume: significant. Complaints: zero.",
    helpful: 15,
    date: "2025-11-27",
  },
  {
    slug: "tumble-oak-tower",
    author: "Amelia F.",
    location: "Bath, UK",
    rating: 4,
    title: "Lovely set, very heavy box",
    body: "Beautiful oak, plays brilliantly, and the stacking sleeve makes setup surprisingly painless. It's heavier than I expected, which is a compliment about quality and a warning about toes. Just… keep it on the table.",
    helpful: 9,
    date: "2025-08-16",
  },
  {
    slug: "tumble-oak-tower",
    author: "Rachel P.",
    location: "Austin, TX",
    rating: 3,
    title: "Great game, wish the bag was sturdier",
    body: "The tower itself is fantastic and my kids (6 and 8) love it. But the canvas bag split at a seam after a month. Customer service replaced it immediately and kindly — so still a decent experience, just noting it.",
    helpful: 7,
    date: "2026-01-30",
  },

  // Gone Fishin'
  {
    slug: "gone-fishin-pond-set",
    author: "Tom H.",
    location: "Leeds, UK",
    rating: 5,
    title: "Pure joy in a wooden box",
    body: "My daughter is 3 and this taught her turn-taking faster than 400 parental lectures. The fish are chunky, the magnets just strong enough, and the box being the pond means clean-up is actually part of the game. Genius design.",
    helpful: 21,
    date: "2025-12-06",
  },
  {
    slug: "gone-fishin-pond-set",
    author: "Nina D.",
    location: "San Diego, CA",
    rating: 5,
    title: "The quiet-est noisy game we own",
    body: "Both kids (3 and 5) play this together with minimal refereeing, which might be the greatest review I've ever written. The colours are beautiful and it's survived being stepped on more than once.",
    helpful: 13,
    date: "2025-09-21",
  },
  {
    slug: "gone-fishin-pond-set",
    author: "Grace L.",
    location: "Nashville, TN",
    rating: 4,
    title: "Lovely, rods could be longer",
    body: "Beautiful set and a birthday hit. My only wish is rods a touch longer for fishing from the sofa — but my son seems to think leaning dramatically over the pond is the best part anyway.",
    helpful: 2,
    date: "2026-02-02",
  },

  // Story Stones
  {
    slug: "story-stones-meadow-tales",
    author: "Imogen C.",
    location: "Bristol, UK",
    rating: 5,
    title: "Bedtime, transformed",
    body: "We each draw two stones and take turns adding to the story. My 5-year-old's plot twist involving the mushroom and the key went on for three nights. These are the moments, aren't they? The painting is beautiful — genuinely hand-done, tiny imperfections and all.",
    helpful: 27,
    date: "2025-11-09",
  },
  {
    slug: "story-stones-meadow-tales",
    author: "Olivia N.",
    location: "Toronto, CA",
    rating: 5,
    title: "A teacher's dream stocking stuffer",
    body: "I bought three sets — one for home, two for my classroom. The stones have a lovely weight and the prompts card gave us a week's worth of new games. Kids beg for story-stone time. BEG.",
    helpful: 8,
    date: "2025-10-17",
  },
  {
    slug: "story-stones-meadow-tales",
    author: "Sam K.",
    location: "Denver, CO",
    rating: 4,
    title: "Wonderful, one stone is a bit cryptic",
    body: "Beautiful little set and a genuinely new kind of bedtime. One painted stone is… debatable (we've settled on 'mystery potato'). Honestly it gets the biggest laugh of the night, so five stars in spirit.",
    helpful: 3,
    date: "2026-01-11",
  },

  // Domino Rally
  {
    slug: "domino-rally-deluxe",
    author: "Ben C.",
    location: "Phoenix, AZ",
    rating: 5,
    title: "The whole house held its breath",
    body: "We built a course through three rooms during the holidays. Grandpa supervised the corners. The topple was so good my four-year-old applauded herself for ten minutes. The weighted dominoes fall perfectly — this is the good stuff.",
    helpful: 12,
    date: "2025-12-12",
  },
  {
    slug: "domino-rally-deluxe",
    author: "Martha E.",
    location: "Glasgow, UK",
    rating: 5,
    title: "Buy two, trust me",
    body: "One set builds a lovely little course. Two sets build an EVENT. The wooden crate is sturdy and my grandkids actually put the pieces away because stacking them in is its own game.",
    helpful: 5,
    date: "2025-09-28",
  },
  {
    slug: "domino-rally-deluxe",
    author: "Chris D.",
    location: "Seattle, WA",
    rating: 4,
    title: "Great quality, corners are the hard part",
    body: "Solid, colourful, satisfying. The turner pieces take some practice and younger kids will need help with corners — but that's also the point of it, I suppose. Hours of focus from a very kinetic six-year-old.",
    helpful: 1,
    date: "2026-01-22",
  },

  // Family Game Night Box
  {
    slug: "family-game-night-box",
    author: "Anjali P.",
    location: "Jersey City, NJ",
    rating: 5,
    title: "Christmas morning, rescued",
    body: "The TV remote 'went missing' and this box handled the rest. Four proper games, wooden pieces that feel wonderful, and the rules printed inside the lid is the single best design decision in board-game history. My in-laws stayed off their phones for two hours. Two. Hours.",
    helpful: 19,
    date: "2025-12-26",
  },
  {
    slug: "family-game-night-box",
    author: "Rob S.",
    location: "Manchester, UK",
    rating: 5,
    title: "Looks great on the shelf, plays even better",
    body: "Usually 'multi-game' boxes are a compromise. Not this one — every board is properly made and the pieces have real heft. Snakes & ladders has caused genuine feuds. As intended.",
    helpful: 6,
    date: "2025-11-18",
  },
  {
    slug: "family-game-night-box",
    author: "Dana F.",
    location: "Minneapolis, MN",
    rating: 4,
    title: "Wonderful, dice are very rollable",
    body: "Beautiful set, instant Friday tradition. One small note: the wooden dice are so nice and round they roll off the table with enthusiasm. We play inside the box lid. Problem solved, highly recommend.",
    helpful: 2,
    date: "2026-02-05",
  },

  // Giant Floor Puzzle
  {
    slug: "giant-floor-puzzle",
    author: "Karin S.",
    location: "Stockholm, SE",
    rating: 5,
    title: "The satisfying CLICK",
    body: "The pieces are properly thick — my daughter can press them together herself and they click in that deeply satisfying way. We've made it eleven times this month. The poster is a lovely touch for her to plan by.",
    helpful: 14,
    date: "2025-11-23",
  },
  {
    slug: "giant-floor-puzzle",
    author: "Mike O.",
    location: "Boston, MA",
    rating: 5,
    title: "Big enough to be an activity, not a task",
    body: "It's nearly a metre across, so it feels like Building Something together. My twins each claimed an end and met in the middle. Wipe-clean finish already proved itself against juice.",
    helpful: 11,
    date: "2025-12-29",
  },
  {
    slug: "giant-floor-puzzle",
    author: "Zoe L.",
    location: "Chicago, IL",
    rating: 4,
    title: "Lovely quality, wish there were more designs",
    body: "Great pieces, gorgeous art, and it survives our dog walking across it daily. I'd love a second design to rotate — we've memorized this one entirely. A good problem to have.",
    helpful: 0,
    date: "2026-02-08",
  },

  // Draw Wild Things
  {
    slug: "draw-wild-things",
    author: "Kate W.",
    location: "Edinburgh, UK",
    rating: 5,
    title: "My five-year-old draws lions now. Actually good lions.",
    body: "The step-by-step breakdown genuinely works — circles first, features last. After two weeks she freehands giraffes at nursery and the teachers asked where she learned. The 'silly fact' on each page is the bit she tells everyone about. Paper is properly thick, no bleed-through.",
    helpful: 33,
    date: "2025-10-30",
  },
  {
    slug: "draw-wild-things",
    author: "Lauren B.",
    location: "Portland, OR",
    rating: 5,
    title: "The lay-flat binding is the unsung hero",
    body: "Every kid drawing book should be built like this. It lies flat, the practice grids work, and the certificate at the back made my son stand up and bow. We gifted three copies immediately.",
    helpful: 10,
    date: "2025-12-15",
  },
  {
    slug: "draw-wild-things",
    author: "Meg T.",
    location: "Brooklyn, NY",
    rating: 5,
    title: "Quiet time that isn't a screen — a miracle",
    body: "Bought for a flight, still in rotation two months later. The animals scale up nicely in difficulty so my 6yo and 9yo are both into it. Best $14 I've spent on plane peace, honestly.",
    helpful: 4,
    date: "2026-01-26",
  },

  // Drawing Pad
  {
    slug: "little-artist-drawing-pad",
    author: "Sarah J.",
    location: "Rye, UK",
    rating: 5,
    title: "Proper paper, proper size, no flimsy nonsense",
    body: "You can feel the quality the second you crack the spiral. Crayon glides, felt tip doesn't bleed, and the backing board means my son draws in the car seat constantly. The tear-out edges are clean — fridge is full.",
    helpful: 16,
    date: "2025-11-05",
  },
  {
    slug: "little-artist-drawing-pad",
    author: "Adam R.",
    location: "Boulder, CO",
    rating: 4,
    title: "Excellent pad, goes fast in our house",
    body: "Sixty sheets sounds like a lot until you have a 4-year-old who draws a 'new dragon' every twelve minutes. That's not a complaint — we've ordered four. Just manage your expectations and your fridge space.",
    helpful: 7,
    date: "2025-09-14",
  },
  {
    slug: "little-artist-drawing-pad",
    author: "Felicity M.",
    location: "Dublin, IE",
    rating: 5,
    title: "The name-and-age label made me emotional",
    body: "Small touch, but filling in the keepsake label on page one with my daughter floored me. Pad itself is superb — thick, generous sheets. We frame one page a month. Send help (and more pads).",
    helpful: 3,
    date: "2026-01-15",
  },

  // Watercolor & Wonder
  {
    slug: "watercolor-and-wonder",
    author: "Beth A.",
    location: "Cambridge, UK",
    rating: 5,
    title: "Her paintings are on our wall. FRAMED.",
    body: "The printed scenes guide the colour choices just enough that everything turns out genuinely lovely. The 200 gsm paper doesn't buckle AT ALL — an actual miracle with an enthusiastic six-year-old. The included paints are proper quality, not the chalky stuff.",
    helpful: 22,
    date: "2025-12-02",
  },
  {
    slug: "watercolor-and-wonder",
    author: "Courtney H.",
    location: "San Francisco, CA",
    rating: 5,
    title: "Grandma gift of the year",
    body: "My mom does one page with my daughter every Sunday on FaceTime and mails the finished ones. I cannot overstate the cuteness. The paints wash off hands and table instantly — important data point.",
    helpful: 9,
    date: "2025-10-22",
  },
  {
    slug: "watercolor-and-wonder",
    author: "Jo P.",
    location: "Wellington, NZ",
    rating: 4,
    title: "Beautiful, wish it had more pages",
    body: "Twenty scenes went quickly here because they're so pleasant to do — my 8yo rationed them, which tells you everything. A refill pack would be an instant purchase. Brush is genuinely decent too.",
    helpful: 1,
    date: "2026-01-31",
  },

  // Color Quest
  {
    slug: "color-quest-under-the-sea",
    author: "Amy R.",
    location: "Cardiff, UK",
    rating: 5,
    title: "Single-sided pages = zero tears",
    body: "Whoever decided to print these one-sided deserves a medal. No bleed-through, every page is frameable, and the octopus has become a household character. My 4yo colours, my 7yo does the 'detail' versions. Peace achieved.",
    helpful: 17,
    date: "2025-10-11",
  },
  {
    slug: "color-quest-under-the-sea",
    author: "Jenna K.",
    location: "Los Angeles, CA",
    rating: 5,
    title: "The fact bubbles are the best part",
    body: "My son now lectures us about anglerfish at dinner. The colouring is almost secondary to the trivia, which is the highest praise I can give a colouring book. Lovely thick pages too.",
    helpful: 8,
    date: "2025-12-08",
  },
  {
    slug: "color-quest-under-the-sea",
    author: "Paul V.",
    location: "Antwerp, BE",
    rating: 4,
    title: "Great book, crayons not included",
    body: "Worth knowing it ships without crayons — fine for us, but if it's a gift, add the crayons. The book itself is excellent: bold lines for small kids, intricate corners for bigger ones.",
    helpful: 2,
    date: "2026-01-18",
  },
];

async function seed() {
  console.log("Clearing existing data…");
  await db.delete(reviews);
  await db.delete(orders);
  await db.delete(newsletterSubscribers);
  await db.delete(products);

  console.log(`Inserting ${productRows.length} products…`);
  const inserted = await db
    .insert(products)
    .values(productRows)
    .returning({ id: products.id, slug: products.slug });

  const idBySlug = new Map(inserted.map((p) => [p.slug, p.id]));

  console.log(`Inserting ${reviewRows.length} reviews…`);
  await db.insert(reviews).values(
    reviewRows.map((r) => ({
      productId: idBySlug.get(r.slug)!,
      author: r.author,
      location: r.location,
      rating: r.rating,
      title: r.title,
      body: r.body,
      helpful: r.helpful,
      verified: true,
      createdAt: new Date(`${r.date}T12:00:00Z`),
    })),
  );

  console.log("Seed complete:", {
    products: inserted.length,
    reviews: reviewRows.length,
  });
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
