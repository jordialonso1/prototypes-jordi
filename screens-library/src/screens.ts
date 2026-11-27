/* Registry of reusable screens. To add one: append an entry below.
   `src` is the prototype's HTML (relative to this page), `screen` the
   data-screen id it understands via the { type: 'goto-screen' } message. */

export interface LibraryScreen {
  id: string
  title: string
  description: string
  /** Prototype the screen lives in. */
  source: string
  /** Prototype HTML, relative to /screens-library/. Omit while the screen is not on main. */
  src?: string
  /** data-screen id inside the prototype. */
  screen?: string
  /** Shown instead of the preview when `src` is missing. */
  pending?: string
}

export const SCREENS: LibraryScreen[] = [
  {
    id: 'homepage',
    title: 'Homepage',
    description: 'Store wall: search, categories, featured banners and store tiles, with the floating tab bar.',
    source: 'ai-label-prototype',
    src: '../ai-label-prototype/prototype/index.html',
    screen: 'store-wall',
  },
  {
    id: 'store-view',
    title: 'Store view',
    description: 'Store page: hero, logistics, top sellers and menu rows, with the sticky tab menu.',
    source: 'ai-label-prototype',
    src: '../ai-label-prototype/prototype/index.html',
    screen: 'store-view',
  },
  {
    id: 'product-view',
    title: 'Product view',
    description: 'Product detail with translations, dietary tags and the Add footer.',
    source: 'ai-label-prototype',
    src: '../ai-label-prototype/prototype/index.html',
    screen: 'product-view',
  },
  {
    id: 'otp',
    title: 'OTP',
    description: 'Order-time premium banner, expanded state.',
    source: 'ai-label-prototype',
    src: '../ai-label-prototype/prototype/index.html',
    screen: 'otp',
  },
  {
    id: 'cart',
    title: 'Cart',
    description: 'Regular cart, plus variants with missing customisation (CNA) and unavailable items (PNA).',
    source: 'pna-cna-replacements',
    pending: 'Lives in the PNA / CNA replacements prototype, which is not merged to main yet.',
  },
]
