<p align="center">
  <img src="public/og-card.jpg" width="480" alt="Faded Barber Shop" />
</p>

<h1 align="center">Faded Barber Shop</h1>

<p align="center">Website for Faded Barber Shop, a barber shop on Main Street in Liberty, Texas.</p>
<p align="center"><a href="https://faded-barbershop.com">faded-barbershop.com</a></p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2026.44.0-a8391f?style=for-the-badge" alt="Version 2026.44.0" />
</p>

Faded has been cutting hair on Main Street in Liberty since 2018: fades, beard work, straight razor shaves and kids' cuts. Appointments are booked on TheCut and Friday is walk-in day. The whole page is a WebGL field of hair that gets shorter as you scroll, long at the top and down to skin at the bottom, and your cursor shaves a path through it.

## What's on the site

- The fade itself. Scrolling takes the hair down, the cursor shaves it and the cut hair falls. On a desktop the cursor turns into a straight razor.
- The section numbers in the nav are clipper guard sizes, so the menu and the fade use the same scale.
- The services, the hours, and a live open or closed status in the shop's time zone.
- A booking link to TheCut, with the appointment fee and length shown before you leave the site.
- Customer reviews, and a visit page with the address, directions and socials.
- Without WebGL the page falls back to a plain background, and with reduced motion turned on the hair holds still. Everything else works the same.

## Running it locally

You need Node 22 or newer. There's nothing to configure.

```bash
npm install
npm run dev        # Vite dev server
npm run build      # builds the site and prerenders every page
```

The hours, services, phone number, booking link and booking fee all live in `src/app/constants/shop.js`.

## Built with

React 19, React Router, Vite and Tailwind CSS. The hair is plain WebGL and Canvas 2D, no 3D library. Hosted on Vercel.

## License

Proprietary. Copyright (c) 2026 TaylorURL LLC, all rights reserved. See [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
