# KIN & TAIL — Shopify Online Store 2.0 Theme

A faithful migration of the KIN & TAIL React/Vite storefront into a native Shopify
Online Store 2.0 theme. Same design system, same motion language, same editorial
voice — now powered by Shopify products, collections, cart, navigation and search.

The original React application remains untouched at the repository root
(`src/`, `index.html`, `package.json`). This theme lives entirely in `shopify-theme/`.

---

## Where things live

```
shopify-theme/
├── assets/
│   ├── kt-theme.css        Full design system (tokens, sections, drawers, pages)
│   └── kt-theme.js         Vanilla JS: cart API, wishlist, concierge, search, PDP, reveals
├── config/
│   ├── settings_schema.json   Colors, logo, favicon, free-shipping threshold, social
│   └── settings_data.json     Default values
├── layout/theme.liquid        Fonts, SEO head, settings-driven CSS overrides, window.KT
├── locales/en.default.json    Storefront strings
├── sections/
│   ├── header.liquid            Menu-driven header + mobile menu
│   ├── footer.liquid            Menus, newsletter (customer form), social, payments
│   ├── overlays.liquid          Cart drawer, wishlist drawer, search modal, toasts
│   ├── hero.liquid              Cinematic hero (editor schema)
│   ├── announcement-ticker.liquid
│   ├── friendship-story.liquid
│   ├── category-worlds.liquid   Dogs / Cats panels → real collection URLs
│   ├── featured-collection.liquid  Real products + instant chip filtering
│   ├── craft-story.liquid       Sticky image + blocks + stats
│   ├── care-section.liquid      Blocks with icon picker
│   ├── brand-story.liquid
│   ├── concierge.liquid         Pet concierge (tag-based recommendations)
│   ├── final-cta.liquid
│   ├── main-product.liquid      Gallery, variants, qty, add-to-cart, accordions, JSON-LD
│   ├── product-recommendations.liquid
│   ├── main-collection.liquid   Sort, native filters, pagination
│   ├── main-cart.liquid         Real cart form → /checkout
│   ├── main-search.liquid       Native Shopify search results
│   ├── main-page.liquid
│   └── main-404.liquid
├── snippets/
│   ├── icons.liquid           All custom inline SVG icons
│   ├── product-card.liquid    Reusable card (sale/sold-out badges, quick add, wishlist)
│   └── price.liquid           Price + compare-at rendering
└── templates/
    index.json · product.json · collection.json · cart.json ·
    search.json · page.json · 404.json
```

## Migration map (React → Shopify)

| React source | Shopify equivalent |
| --- | --- |
| `src/index.css` + Tailwind | `assets/kt-theme.css` (semantic classes, same tokens) |
| `src/data/products.ts` | Products & collections in **Shopify Admin → Products** |
| `ShopContext` mock cart | Shopify Cart API (`/cart/add.js`, `/cart/change.js`) + `/checkout` |
| `ProductDetail` drawer | `templates/product.json` + `sections/main-product.liquid` |
| `Collection` filters | Client-side chips over rendered products; collection pages use sort + native filters |
| `SearchModal` over static data | `/search/suggest.json` predictive results + `templates/search.json` |
| `Concierge` scoring | Same algorithm in `kt-theme.js`, fed by product **tags** |
| `Wishlist` (React state) | `localStorage` wishlist with move-to-bag via Cart API |
| React navigation array | `linklists` (Shopify Admin → Navigation) |
| Mock checkout confirmation | Real Shopify checkout (no fake orders) |

## Before first launch — Admin configuration checklist

1. **Products** — create the catalog (titles, prices, images, descriptions).
   - Recommended square product photography (cards render 1:1).
   - Optional metafields (define once under Settings → Custom data → Products):
     - `kt.tagline` (single line text) — italic card tagline.
     - `kt.concierge_note` (single line text) — personal reason line in The Edit.
   - **Tags** (case-insensitive) drive the concierge:
     - Species: `dog`, `cat` (untagged = both).
     - Focus: `comfort`, `play`, `meals`, `grooming`, `walks`.
     - Life stage: `young`, `adult`, `senior` (or `puppy` / `kitten`).
     - Temperament: `calm`, `playful`, `adventurous`.

2. **Collections** — create `Dogs`, `Cats`, plus `Care`, `Home`, `Play` as desired.
   Assign them in *Customize → Featured Collection* (main collection + chips) and
   *Two Worlds* (Dogs/Cats panels).

3. **Navigation** — Admin → Online Store → Navigation:
   - Main menu: Shop, Dogs, Cats, Care, About (+ `/pages/about`, `/#concierge`, etc.).
   - Footer menu: contact, policies, etc. (falls back to policy pages automatically).

4. **Hero & story imagery** — replace the fallback URLs with uploaded images via
   the image pickers in *Customize* (the generated campaign URLs remain as defaults).

5. **Theme settings** — colors, logo, favicon, free-shipping threshold, social links
   under *Customize → Theme settings*.

## What was intentionally not migrated

- The React **mock checkout confirmation** — replaced by real Shopify checkout.
- The **2:1 plate-cropping** product imagery trick — real Shopify product images are
  rendered natively (square cards), so merchants upload normal product photos.
- The wishlist remains **client-side** (Shopify has no native wishlist); it behaves
  identically to the React version. To make it account-based, add a customer metafield
  flow later — the drawer UI is already in place.

## Connect to Shopify via GitHub

The theme directory is GitHub-ready. Because Shopify expects the theme folders at the
**repository root**:

**Option A — dedicated theme repository (recommended)**

1. Create a new GitHub repository, e.g. `kin-and-tail-theme`.
2. Copy the *contents* of `shopify-theme/` into the repository root:
   ```bash
   cp -R shopify-theme/* path/to/kin-and-tail-theme/
   cd path/to/kin-and-tail-theme
   git init && git add . && git commit -m "Kin & Tail theme"
   git branch -M main && git remote add origin git@github.com:you/kin-and-tail-theme.git
   git push -u origin main
   ```
3. Shopify Admin → Online Store → Themes → **Add theme → Connect from GitHub**.
4. Authorize Shopify, choose the repository and the `main` branch.

**Option B — monorepo subdirectory (Shopify CLI)**

Keep this repository as-is and push with the CLI:

```bash
shopify theme push --path shopify-theme --store your-store.myshopify.com
# or develop live:
shopify theme dev --path shopify-theme
```

Either way, the theme uploaded is exactly the folder `shopify-theme/`.

## Local preview without Shopify

The React storefront at the repo root still builds and runs (`npm run dev` /
`npm run build`) and mirrors the theme's look and interactions — useful for design
review. The Shopify theme itself requires a Shopify store (theme preview, CLI, or
GitHub connection above).
