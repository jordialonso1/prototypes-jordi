# PNA / CNA replacements prototype

Prototype of the Glovo Cart when a product is not available (PNA) or its customisations are not available (CNA). It uses a real Honest Greens catalog. Plain-HTML screens in an iframe, wrapped by a small React page.

Read this before iterating. It is the hand-off for a new session.

## What it is

- **Wrapper page** (`src/App.tsx`, `src/app.css`): same layout as the AI label prototype: a left column (`aside.page__side`) with the title and, below it, the **Option** selector, the **Use case** selector and a **Reset** button; the 390x844 device is centered and scaled down to fit. Below 900px wide it stacks and centers. It talks to the prototype with `postMessage`:
  - `goto-screen {screen}` shows a use case, `goto-option {option}` sets `data-option` on the prototype's `<html>`, `reset-screen {screen}` restores a use case.
- **Option** = which design we are prototyping. Only **Currently live** exists (how the app behaves today). New design proposals get added as further options that reuse the same screens, so stakeholders can compare them with the live behaviour. To add one: add it to `OPTIONS` in `App.tsx`, then make the screens react to `document.documentElement.dataset.option` in `prototype/index.html` (the hook is in the `message` listener at the bottom).
- **Use case** = the three Cart situations that exist today: `regular`, `cna` (missing customisation), `pna` (out of stock). Each is a `<section class="screen" data-screen="...">` in `prototype/index.html`.

## Files

```
pna-cna-replacements/
  src/App.tsx, app.css        wrapper page (selectors, Reset, device scaling)
  prototype/
    index.html                the Cart: markup of the 3 use cases + the script that renders/handles them
    catalog.js                window.CATALOG: ~20 Honest Greens products used by the cart (+ customisations of the CNA product)
    assets/                   cart icons (trash, plus, minus, back, info, warning, status bar)
    product-view/             COPY of the shared product view, iterated here (CNA change flow)
    store-view/               COPY of the shared store view (PNA add flow). Identical to the shared one since the user asked to update it (2026-11-27); keep them in sync only if asked
    _base/                    COPY of screens-library/screens/_base (fonts, tokens, typography). Both copies link ../_base/
catalogs/honest-greens/catalog.json   full fetched catalog (committed); raw/ responses are not committed
```

## Behaviour today (all in `prototype/index.html`)

State lives in `STATE` (one object per use case, `initialState()` builds a fresh one; Reset uses it). Everything re-renders with `render(id)`.

- **Counters**: left button is trash at quantity 1 and minus above that; plus adds. Line price = (product + chosen options) x quantity. Footer total, "N products from" line and checkout state update.
- **Tiles "You might also like"** (6): the "+" adds directly in every use case.
- **Empty cart** button (next to "Your cart") clears everything. Checkout is disabled when the cart is empty or only has out-of-stock items.
- **All use cases**: the "Honest Greens" link and "Add more items" open the **Store view**, and what is added there goes into the cart of the use case you came from (`storeFor`). `CATALOG.addMore` is no longer used.
- **PNA**: has an out-of-stock section (item with a counter whose plus is disabled; trash removes it).
- **CNA**: the Fruit Matcha Latte row says "Action required"; tapping the row opens the **Product view**. Confirming a section-complete selection removes the banner and enables checkout.

### Store view (all use cases)
`store-view/` is opened in an iframe (`#sv-frame`) from any use case as `store-view/index.html?cart=<json {id: qty}>&n=<count>&t=<total>`. It renders `store-catalog.js` (8 sections, 122 products) with tabs that scroll to sections, a collapsed counter ("+" only, neutral) that becomes the full counter after the first add, and a cart-style footer with "Go to cart". Messages to the cart: `sv-add {product}`, `sv-remove {id}`, `sv-close`. The header (image, logo, name, rating, delivery time, fee) is the shared module's Honest Greens header; rating, delivery time and fee are the design's placeholders (the API has none).

### Product view (CNA)
`product-view/` is opened in an iframe (`#pv-frame`) as `product-view/index.html?id=<product>&sel=<json {section title: [options]}>`. It renders the product's real customisation sections from `catalog.js`. Sections whose previous choice is no longer available come back **empty** (the milk of the latte); the others keep their selection. Required sections show a Pintxo tag: neutral, green with a check once picked, red with a warning after a failed "Confirm change" (which also scrolls to the first missing section). Messages to the cart: `pv-confirm {id, sel}`, `pv-close`. The unavailable-choice scenario is made up (the API has no availability data); it is encoded in `initialState().cna`.

## Reusing the shared libraries (rules)

1. **Pintxo components first.** Every screen links `shared-design-system/pintxo/pintxo.css`. Before writing CSS for a control, check `shared-design-system/README.md` and the gallery at `component-library/`. Used here: `pintxo-button`, `pintxo-icon-button`, `pintxo-counter` (+ `--l`, `--collapsed`), `pintxo-banner` + `pintxo-icon-blob`, `pintxo-radio-button`, `pintxo-checkbox`, `pintxo-tag`, `pintxo-section-header`, `pintxo-status-bar`, `pintxo-typography-*`.
2. **If a Pintxo component is missing, add it to the shared CSS** (values from uds-react, `/Users/jordi/claude-projects/uds-react/src/components/...` and `src/generated/style/`), then add its examples to `component-library/index.html` and a row to `shared-design-system/README.md`. Radio, checkbox, tag, section header, status bar and the collapsed counter were added this way.
3. **Shared screens (`screens-library/screens/`)**: embed by default; to iterate, copy the module (+ `_base`) into the prototype and edit the copy; **never edit the shared screen unless the user explicitly says so** (see `screens-library/README.md`). Here `product-view/` and `store-view/` are such copies. The shared **Cart** screen was updated on request with the Honest Greens content and the same interactions (regular cart only).
4. **Still not on shared components** (candidates for the next pass): the cart screens use their own section header and a status bar image (`assets/statusbar.svg`); the close (X) button in `product-view` is the old local `icon-btn`; `store-view` still uses local rows/tabs/tags from the shared module.

## Data

- Source: Glovo API through the `inject-catalog-uxd` skill. Store **"Honest Greens for Breakfast"**, store ID 34801, address ID 66944, city BCN (from the "Popular Store ID's" Google Sheet). Names and descriptions are in Spanish/Catalan (the store's own language). No original prices (so no crossed-out prices), no ratings, delivery time or fees in the API.
- Re-fetch: `python3 <skill dir>/scripts/fetch_catalog.py --name "Honest Greens" --store-id 34801 --address-id 66944` from the repo root (the skill is under `~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/.../skills/inject-catalog-uxd`; `~/.claude/skills` does not exist).
- Product photos are remote Glovo CDN URLs (the prototype needs internet). Identify products by `id`, never by name.

## Figma

File `90LJpeY9Y72kbnQeiYdwyQ` (PNA-CNA replacements). Frames: pna cart `33:2044`, cna cart `34:1394`, regular cart `85:9461`, CNA change-flow reference screenshots `68:9526` (section of 4 phone screenshots: cart, product view, required sections, confirm). A frame **"pna cart - Honest Greens (interactive version)"** (`110:446`) mirrors the PNA use case with the real content and photos. Design-to-code needs the `figma-design-to-code` skill before `get_design_context`; writes need `figma-use` + `figma-generate-design`.

## Dev

- `npm ci` once per worktree. Dev server: preview config `prototypes` (port 5173, falls back to 5174). Open `/pna-cna-replacements/`; a single use case: `/pna-cna-replacements/prototype/index.html?screen=pna`.
- `vite.config.ts` copies `pna-cna-replacements/prototype` and `shared-design-system/pintxo` as static dirs, so relative links like `../../../shared-design-system/pintxo/pintxo.css` work in dev and in dist.
- Gotchas: the shell's working directory persists between commands, use absolute paths; verify with real mouse clicks, not only `.click()` (a hidden input once scrolled the whole screen); the harness sometimes blocks shell writes to `shared-design-system/`, the file editor works.

## Open items / ideas

- CNA reference "Customize it quickly" block and translation notice are not built; product view shows every option of the catalog including unavailable ones.
- Products with customisations are added from the Store view without opening a product view (no selections).
- New **options** (design proposals) to be added on top of "Currently live".
- Unused: `prototype/assets/icon-chevron-forward-white.svg` (the chevron is now an inline SVG that follows the text color).
