# CurveKid

A full-stack e-commerce storefront for **CurveKid** — screen-free wooden games and drawing books for curious kids and calm parents.

![CurveKid](public/images/hero.jpg)

## Features

- **Striking home page** — animated hero, featured collections, bestsellers carousel, brand story, testimonials pulled from the database, newsletter CTA
- **Product grid** (`/shop`) — category tabs, age/price/availability filters, live search, five sort orders, animated layout transitions, mobile filter sheet
- **Rich product pages** — image galleries with transitions, rating summaries, accordions, verified reviews with distribution bars, and a working review form (server action)
- **Slide-out cart** — persistent via `localStorage` (Zustand), free-shipping progress meter, quantity controls
- **Streamlined checkout** — single-page flow with demo payment, and a server action that **re-prices the entire order server-side** before persisting
- **Order confirmation** with timeline and itemized receipt
- Newsletter signup API (`/api/newsletter`) with unique-email handling

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **PostgreSQL** via **Drizzle ORM** (`products`, `reviews`, `orders`, `newsletter_subscribers`)
- **Tailwind CSS v4** with a custom design system (Fraunces + Outfit, warm cream/clay palette, film grain, marquee, squiggle underlines)
- **Framer Motion** animations, **Lucide** icons, **Zustand** cart state
- Imagery: AI-generated studio shots (`public/images`) + curated stock photography

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure the database
#    Create a .env file:
#    DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db

# 3. Push the schema
npx drizzle-kit push

# 4. Seed demo products & reviews
npx tsx src/db/seed.ts

# 5. Run
npm run dev
```

## Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npx drizzle-kit push` | Apply schema to PostgreSQL |
| `npx tsx src/db/seed.ts` | Reset & seed demo data (12 products, 36 reviews) |

## Notes

- Prices are stored in cents (`priceCents`) and every order total is recomputed on the server at checkout — client totals are never trusted.
- All database-backed pages are `force-dynamic`, so the production build works without a database connection.
- The checkout is a demo: no real payment is processed.
