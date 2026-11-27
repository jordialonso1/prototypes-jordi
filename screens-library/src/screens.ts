/* Registry of reusable screens. Each screen is a self-contained module in
   screens/<id>/ (index.html + screen.css + assets/), sharing screens/_base/
   (fonts, Pintxo tokens, small behaviours). To add a screen, create its
   folder and append an entry here. */

export interface LibraryScreen {
  id: string
  title: string
  /** Module page, relative to /screens-library/. */
  src: string
}

export const SCREENS: LibraryScreen[] = [
  { id: 'checkout', title: 'Checkout', src: './screens/checkout/index.html' },
  { id: 'home-page', title: 'Home page', src: './screens/home-page/index.html' },
  { id: 'food-wall', title: 'Food wall', src: './screens/food-wall/index.html' },
  { id: 'store-view', title: 'Store view', src: './screens/store-view/index.html' },
  { id: 'product-view', title: 'Product view', src: './screens/product-view/index.html' },
  { id: 'otp', title: 'OTP', src: './screens/otp/index.html' },
  { id: 'cart', title: 'Cart', src: './screens/cart/index.html' },
]
