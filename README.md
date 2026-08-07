# Mapalu Store

React + Tailwind rebuild of [mapalustore.com](https://mapalustore.com) — artificial
decoration, vertical gardens and synthetic grass, Medellín, Colombia.

**Phase 1 (the landing page) is complete.** Every other route resolves to an
on-brand placeholder, so there are no dead ends in the demo.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve dist/ at http://localhost:4173
```

## Deploy (Vercel)

Import the repo — `vercel.json` covers everything:

| Setting | Value |
|---|---|
| Framework | Vite (auto-detected) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |
| Root directory | `./` |

`vercel.json` also adds SPA rewrites (so deep links like `/proyectos` don't 404),
immutable caching on `/assets/images` and `/assets/videos`, and baseline security
headers.

## What's built

| Section | Effects |
|---|---|
| **Hero** | Full-bleed autoplay video, scroll-linked parallax + scale + blur, word-by-word headline reveal, magnetic CTA, film grain |
| **Trust marquee** | Infinite CSS marquee with edge fade |
| **Path chooser** | Two video cards (Proyectos / Productos) with 3D pointer tilt and dynamic glare |
| **Category grid** | Six 3D-tilting tiles, Ken Burns scale, ring-on-hover |
| **Project showcase** | Dark cinematic band, offset video panels with play/mute, glass price cards |
| **Antes y después** | Draggable before/after slider of a real restaurant install |
| **Product rail** | Product cards with 3D tilt, quick-add, wishlist, sale badges |
| **Closing CTA** | Video background, WhatsApp handoff |
| **Chrome** | Header that inverts over the hero, mega-nav, mobile drawer, cart drawer, search overlay, toasts, WhatsApp FAB, scroll progress |

Every animation is disabled under `prefers-reduced-motion`; videos fall back to
their poster images and are never fetched.

## Structure

```
src/
├── components/
│   ├── layout/   Header · Footer · Drawers (cart / menu / search / toast)
│   ├── product/  ProductCard
│   └── ui/       motion.jsx  Reveal · Stagger · Tilt3D · Magnetic · SplitWords · CountUp
│                 Video.jsx   BackgroundVideo · VideoPanel · BeforeAfter · VIDEOS
│                 Button.jsx  Button · IconButton · SectionHead
├── data/         product-index.json · collections.json   (bundled)
├── lib/          catalog.js · format.js · estimator.js
├── pages/        Home.jsx · Placeholder.jsx
└── store/        useStore.js   cart + wishlist, localStorage-persisted

public/
├── assets/images/   972 images (products, collections, content, logo)
├── assets/videos/   7 clips from the store's own CDN
└── data/            products.json — full records, fetched on demand
```

`public/data/products.json` (1.7 MB) carries the full product records including
the 12 project estimator configurations. It is fetched lazily — the landing page
never loads it.

## Data

Scraped from the live Shopify storefront: 222 products, 25 collections, 972
images, 9 videos. Prices are Colombian pesos formatted `$28.000,00`, matching
Shopify's `money_format`.

The store sells two ways, and the split drives the information architecture:

- **Productos** — per unit, shipped nationwide from Itagüí
- **Proyectos** — installed surfaces priced per m² (walls / ceilings / floors),
  Medellín metro only

## Fixes applied rather than carried over

Defects on the live Shopify site that were corrected here:

1. **7 collections render zero products**, 4 of them in the main nav
   (`Ramas de Follaje`, `Helechos`, `Ramas para Árbol`, `Otras Cositas`).
   `src/lib/catalog.js` rebuilds membership from `productType`/`tags`.
2. **`og:image` returned 404** — social shares had no image. Now a real photo.
3. **The obvious hero video** carries a burned-in `www.mapalustore.com` watermark
   and TikTok captions. Excluded; see the note in `src/components/ui/Video.jsx`.
4. **The before/after pair** is now the authentic one, matched by alt text from
   the live page.
5. **`Cerezos por Metro Lineal`** prices per linear metre; the live site labels
   every project `/ m²` regardless.

## Performance

| | Live Shopify site | This build |
|---|---|---|
| CSS | ~1.2 MB across 15 stylesheets | **41 KB** (8 KB gzip) |
| JS | jQuery + Slick + Fancybox + Bootstrap | 550 KB (151 KB gzip) |
| Images | unoptimised, up to 1200×1600 | re-encoded, max 1200px — 214 MB → 100 MB |

The JS figure includes the 161 KB product index; splitting it per route is a
phase-2 task.

## Phase 2

Collections, product detail, the m² project estimator, cart checkout, search
results, policies and contact. The estimator is fully reverse-engineered from the
Shopify markup — two modes (area / linear units), a slack toggle, bulk pricing
tiers and two add-on products — and its configuration already ships in
`public/data/products.json` under each project's `estimator` key.

A commerce backend still needs choosing: headless Shopify via the Storefront API,
or fully static with a WhatsApp quote flow. That decision shapes the cart,
accounts and checkout, so it should come before phase 2 starts.
