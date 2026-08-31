export const SHOP = {
  name: 'Faded Barber Shop',
  shortName: 'Faded',
  tagline: 'Walkins Welcome',
  town: 'Liberty, Texas',
  established: 2018,
  barber: 'Samantha Taylor',
  barberShort: 'Samantha',
  rule: 'Leave your feelings at the door',
  phone: '(936) 402-4637',
  phoneHref: 'tel:+19364024637',
  street: '929 Main St, Suite B',
  city: 'Liberty',
  region: 'TX',
  postal: '77575',
  booking: 'https://book.thecut.co/FadedBarberShop',
  bookingFee: 39,
  bookingMinutes: 30,
};

export const SOCIALS = [
  {
    label: 'Facebook',
    handle: 'FadedBarberLibertytx',
    icon: 'facebook',
    href: 'https://www.facebook.com/FadedBarberLibertytx/',
  },
  {
    label: 'TheCut',
    handle: 'FadedBarberShop',
    icon: 'scissors',
    href: 'https://book.thecut.co/FadedBarberShop',
  },
  {
    label: 'Google',
    handle: 'Liberty, TX',
    icon: 'star',
    href: 'https://www.google.com/maps/search/?api=1&query=Faded+Barber+Shop+Liberty+TX',
  },
];

export const DIRECTIONS_HREF =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(`${SHOP.street}, ${SHOP.city}, ${SHOP.region} ${SHOP.postal}`);

export const ROUTES = {
  home: '/',
  services: '/services',
  shop: '/shop',
  reviews: '/reviews',
  visit: '/visit',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

// The guard number doubles as the page's index, so the navigation reads on the
// same scale as the shader.
export const NAV = [
  { to: ROUTES.services, label: 'Services', guard: '3' },
  { to: ROUTES.shop, label: 'The Shop', guard: '2' },
  { to: ROUTES.reviews, label: 'Reviews', guard: '1' },
  { to: ROUTES.visit, label: 'Visit', guard: '0' },
];

// Index matches Date.getDay(). `mode` splits the week the way the shop runs it:
// the chair is booked Tuesday to Thursday and first-come on Friday.
export const HOURS = [
  { day: 'Sunday', abbr: 'Sun', open: null, close: null, mode: null },
  { day: 'Monday', abbr: 'Mon', open: null, close: null, mode: null },
  { day: 'Tuesday', abbr: 'Tue', open: 600, close: 1080, mode: 'appointment' },
  { day: 'Wednesday', abbr: 'Wed', open: 600, close: 1080, mode: 'appointment' },
  { day: 'Thursday', abbr: 'Thu', open: 600, close: 1080, mode: 'appointment' },
  { day: 'Friday', abbr: 'Fri', open: 600, close: 1200, mode: 'walk-in' },
  { day: 'Saturday', abbr: 'Sat', open: null, close: null, mode: null },
];

export const SERVICES = [
  {
    guard: '3',
    name: 'The Fade',
    detail: 'Skin, low, mid or high. Clippers take it down, a straight razor sets the line.',
    long: 'The cut the shop is named for. Bring a photo or a guard number, or say how short and let her set it. Clippers take it down and the line is finished with a straight razor.',
  },
  {
    guard: '2',
    name: 'Beard Work',
    detail: 'Shaped, lined and cut to match the head, not treated as an afterthought.',
    long: 'Shaped against the jaw and the haircut, with the lines set by razor. Most people book it alongside a cut.',
  },
  {
    guard: '1',
    name: 'Straight Razor Shave',
    detail: 'Hot towel, lather, one blade. The oldest thing this shop does.',
    long: 'Hot towel, lather, one blade. It takes the full half hour and it is the oldest service on the list.',
  },
  {
    guard: '0',
    name: 'Kids And Head Shaves',
    detail: 'First cuts, school cuts, and heads taken to skin edge to edge.',
    long: 'Kids are a large share of the book, from first cuts to school cuts. Full head shaves are taken to skin and finished clean.',
  },
];
