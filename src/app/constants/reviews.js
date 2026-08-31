// Published customer reviews, quoted as written and attributed to the reviewer.
// Nothing in this file is copy written for the shop.
export const REVIEWS = [
  {
    text: 'For you adults, leave your feelings at the door. You will definitely catch a laugh.',
    name: 'Jacob Cantu',
    source: 'Google',
    note: 'Going since the shop opened',
  },
  {
    text: 'Samantha is a genuinely good person and she KNOWS HOW TO CUT AND STYLE HAIR.',
    name: 'Jeremy Whistler',
    source: 'Google',
    note: null,
  },
  {
    text: 'My son will only let Sam cut his hair. She boosts his confidence so much every time she does her thing.',
    name: 'Dominque Carter',
    source: 'Google',
    note: null,
  },
  {
    text: 'I am really meticulous about my haircuts. Samantha did a great job the first time and every time I have been there since.',
    name: 'Rudy Ramirez',
    source: 'Google',
    note: null,
  },
  {
    text: 'I had been getting my haircut at the same place for 25 years. Outstanding haircut, and awesome vibe in the shop.',
    name: 'Ryan Robertson',
    source: 'Google',
    note: null,
  },
  {
    text: 'No stray hairs left when she is done, plus the environment is friendly.',
    name: 'Corey Abney',
    source: 'Google',
    note: 'Cut and beard',
  },
  {
    text: 'Definitely a comedy show, great experience. Sam is really off in the best way.',
    name: 'George Vinson',
    source: 'Google',
    note: null,
  },
  {
    text: 'She stayed calm and gave him a great hair cut.',
    name: 'Jamie Mayden',
    source: 'Google',
    note: 'Two-year-old, screaming the whole time',
  },
  {
    text: 'The only person I trust with my beard.',
    name: 'Justin Vaclavik',
    source: 'Google',
    note: null,
  },
  {
    text: 'Very meticulous, she takes her time and gets it right.',
    name: 'Gavin Tomlinson',
    source: 'Google',
    note: null,
  },
];

// Reviewers who drive past closer shops to get here.
export const TRAVELS = [
  { from: 'Atascocita', who: 'Christna Taylor' },
  { from: 'Spring', who: 'Tori Gibson' },
  { from: 'Houston', who: 'Richard Rode' },
  { from: 'Wyoming, when he is home', who: 'Colton Massey' },
];

export const GOOGLE_HREF =
  'https://www.google.com/maps/search/?api=1&query=Faded+Barber+Shop+Liberty+TX';

export const RATINGS = [
  {
    value: '106',
    label: 'Five-star bookings on TheCut',
    href: 'https://book.thecut.co/FadedBarberShop',
  },
  { value: '4.6', label: 'Average over 86 Google reviews', href: GOOGLE_HREF },
  { value: '2018', label: 'Open on Main Street since', href: null },
];
