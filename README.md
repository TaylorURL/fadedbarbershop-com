<img src="public/og-card.jpg" width="480" alt="Faded Barber Shop" />

# Faded Barber Shop

Website for Faded Barber Shop, a barber shop on Main Street in Liberty, Texas.

[faded-barbershop.com](https://faded-barbershop.com)

<img src="https://img.shields.io/badge/version-2026.44.1-a8391f?style=for-the-badge" alt="Version 2026.44.1" />

Services, hours, reviews, directions and a booking link to TheCut. The page is a WebGL field of hair that gets shorter as you scroll, long at the top and down to skin at the bottom. The cursor shaves a path through it and the cut hair falls.

## How the hair works

`FadeField.jsx` is one fragment shader that draws a strand per vertical cell, cut off partway down. Scrolling only moves the guard, meaning how far down each strand still stands. The strand geometry never changes with scroll. Shift a noise frequency mid-scroll and the whole field looks like it's warping.

The shave is a coarse grid that gets cut wherever the pointer passes and slowly grows back. It's sampled with bilinear filtering, so a low-res grid still looks like a soft clipper path and is cheap to upload every frame.

The hair that falls is Canvas 2D, in `HairLayer.jsx`. It uses the same strand model (`src/app/lib/hair.js`) for what the pointer sheds and for the clipper pass on route change. Components write to shared state in `src/app/lib/field.js` and the shader reads it each frame, so nothing re-renders to move the hair. Even the nav's section numbers are clipper guard sizes.

## Things that bit me

- Software WebGL (SwiftShader, llvmpipe, Apple's fallback) runs the shader on the main thread. `src/app/lib/gpu.js` checks once with a one-pixel context and gives those machines the flat background, with the hair held still like under reduced motion.
- The browser caches a failed module import and answers every retry from that cache, so retrying a chunk in place never works. `src/app/lib/chunk.js` reloads the page once per visit instead, and doesn't hand that reload back, because that's how you get a loop.
- Open or closed is worked out in the shop's time zone, not the visitor's.

Hours, services, phone, the booking link and fee are all in `src/app/constants/shop.js`. Every route is prerendered from one route table, with the SSR build awaiting the lazy loaders so the HTML holds the real page.

```bash
npm install
npm run dev
npm run build   # builds and prerenders every page
```

Node 22 or newer, nothing to configure. React 19, Vite and Tailwind CSS on Vercel. The hair is plain WebGL and Canvas 2D, no 3D library. Proprietary, see [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
