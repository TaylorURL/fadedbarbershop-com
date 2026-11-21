<img src="public/og-card.jpg" width="480" alt="Faded Barber Shop" />

# Faded Barber Shop

Website for Faded Barber Shop, a barber shop on Main Street in Liberty, Texas.

[faded-barbershop.com](https://faded-barbershop.com)

<img src="https://img.shields.io/badge/version-2026.47.1-a8391f?style=for-the-badge" alt="Version 2026.47.1" />

Services, hours, reviews, directions and a booking link to TheCut. The page is a WebGL field of hair that gets shorter as you scroll, long at the top and down to skin at the bottom. The cursor shaves a path through it and the cut hair falls.

## How the hair works

`FadeField.jsx` is one fragment shader that draws a strand per vertical cell, cut off partway down. Scrolling only moves the guard, meaning how far down each strand still stands. The strand geometry never changes with scroll. Shift a noise frequency mid-scroll and the whole field looks like it's warping.

The shave is a coarse grid that gets cut wherever the pointer passes and slowly grows back. It's sampled with bilinear filtering, so a low-res grid still looks like a soft clipper path and is cheap to upload every frame.

The hair that falls is Canvas 2D, in `HairLayer.jsx`. It uses the same strand model (`src/app/lib/hair.js`) for what the pointer sheds and for the clipper pass on route change. Components write to shared state in `src/app/lib/field.js` and the shader reads it each frame, so nothing re-renders to move the hair. Even the nav's section numbers are clipper guard sizes.

## Things that bit me

- Software WebGL (SwiftShader, llvmpipe, Apple's fallback) runs the shader on the main thread. `src/app/lib/gpu.js` checks once with a one-pixel context and gives those machines the flat background, with the hair held still like under reduced motion.
- A module that fails to fetch is marked failed in the document's module map, and every later import of that name is answered from there without touching the network. So importing again buys nothing. A plain request for the same URL does reach the wire, so the boot script `scripts/prerender.js` writes asks for the entry three more times that way before the page spends anything. A route chunk goes straight to the reload, in `src/app/lib/chunk.js`.
- The reload is one flag in sessionStorage, and the new document brings the current chunk names down with it. Clearing the flag when the bundle arrives is the loop, because the bundle arrives on every pass. It clears ten seconds into a page that's still standing instead, so a second dropped request later in the visit still has a reload to spend. Once it's genuinely spent the page says so and puts the reload behind a button.
- Open or closed is worked out in the shop's time zone, not the visitor's.

Hours, services, phone, the booking link and fee are all in `src/app/constants/shop.js`. Every route is prerendered from one route table, with the SSR build awaiting the lazy loaders so the HTML holds the real page. The prerender also takes out the entry's script tag and asks for the bundle a frame after the first paint, because a finished document owes it nothing. The stylesheet is inlined rather than linked, since it's smaller than the round trip that would fetch it.

```bash
npm install
npm run dev
npm run build   # builds and prerenders every page
```

Node 22 or newer, nothing to configure. React 19, Vite and Tailwind CSS on Vercel. The hair is plain WebGL and Canvas 2D, no 3D library. Proprietary, see [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
