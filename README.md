# Mapalu Store — Landing Page (React + Tailwind)

Rebuild of [mapalustore.com](https://mapalustore.com) as a modern React storefront.
**Phase 1 — the landing page — is complete and ready to show the client.**

## Run it

```bash
cd app
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # production build → dist/
npm run preview   # serve dist/ at http://localhost:4173
```

> `public/assets/images` and `public/assets/videos` are **directory junctions** to
> `../assets/*` so the 214 MB of media isn't duplicated. If you clone this to
> another machine, recreate them (or copy the folders in):
>
> ```powershell
> New-Item -ItemType Junction -Path app\public\assets\images -Target assets\images
> New-Item -ItemType Junction -Path app\public\assets\videos -Target assets\videos
> ```

## What's built

| Section | Effects |
|---|---|
| **Hero** | Full-bleed autoplay video, scroll-linked parallax + scale + blur, word-by-word headline reveal, magnetic CTA, film grain |
| **Trust marquee** | Infinite CSS marquee with edge fade |
| **Path chooser** | Two video cards (Proyectos / Productos), 3D pointer tilt with dynamic glare |
| **Category grid** | Six 3D-tilting tiles, Ken Burns image scale, ring-on-hover |
| **Project showcase** | Dark cinematic band, two offset video panels with play/mute controls, glass price cards |
| **Antes y después** | Draggable before/after comparison of the real restaurant install |
| **Product rail** | 8 product cards with 3D tilt, quick-add, wishlist, sale badges |
| **Closing CTA** | Video background, WhatsApp handoff |
| **Chrome** | Sticky header that inverts over the hero, mega-nav, mobile drawer, cart drawer, search overlay, toasts, WhatsApp FAB, scroll progress bar |

All motion respects `prefers-reduced-motion` — videos fall back to posters and every transform is disabled.

## Structure

```
src/
├── components/
│   ├── layout/   Header · Footer · Drawers (cart/menu/search/toast)
│   ├── product/  ProductCard
│   └── ui/       motion.jsx (Reveal, Stagger, Tilt3D, Magnetic, SplitWords, CountUp)
│                 Video.jsx  (BackgroundVideo, VideoPanel, BeforeAfter, VIDEOS)
│                 Button.jsx (Button, IconButton, SectionHead)
├── data/         product-index.json · collections.json   (static import)
├── lib/          catalog.js · format.js · estimator.js
├── pages/        Home.jsx · Placeholder.jsx
└── store/        useStore.js (cart + wishlist, localStorage-persisted)
```

`public/data/products.json` (1.7 MB, full records incl. estimator configs) is fetched
lazily — only product pages will need it.

## Verification

`node shot.mjs` screenshots 5 viewports (320 / 390 / 834 / 1280 / 1440) and reports
console errors, page errors, failed requests and horizontal overflow.
`node shot-section.mjs` captures each section individually.

Current status: **no console errors, no page errors, no broken images, no horizontal overflow at any breakpoint.**

## Bugs from the Shopify site fixed here

1. **Empty collections** — 7 collections render zero products live, 4 of them in the nav.
   `lib/catalog.js` backfills them from `productType`/`tags`, and drops the dead ones from the nav.
2. **Broken `og:image`** — the old theme pointed at a 404'd `logo.png`. Now a real photo.
3. **Watermarked hero video** — `video-01` carries a burned-in `www.mapalustore.com`
   bar and TikTok captions. Excluded; see the note in `ui/Video.jsx`.
4. **Wrong before/after pair** — the authentic pair is matched by the alt text from the live page.
5. **Linear-metre pricing** — `Cerezos por Metro Lineal` shows `/ m lineal`, not `/ m²`.

## Not built yet (phase 2)

Collections, product detail, the m² estimator, cart checkout, search results page,
policies and contact. Every route already resolves to an on-brand placeholder, so
the demo has no dead ends. Specs live in `../docs/`, and the estimator is fully
reverse-engineered in `../docs/08-project-calculator.md`.

## Notes

- Bundle: **41 KB CSS** (8 KB gzip) and 550 KB JS (151 KB gzip). The old site
  shipped ~1.2 MB of CSS across 15 stylesheets.
- The JS figure includes the 161 KB product index; code-splitting it per route is
  a phase-2 task.
- Product photos are unoptimised WhatsApp JPEGs straight from Shopify. Converting
  them to WebP/AVIF is the single biggest remaining performance win.
