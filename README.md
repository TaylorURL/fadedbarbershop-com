<img src="public/og-card.jpg" width="480" alt="Faded Barber Shop" />

# Faded Barber Shop

Website for Faded Barber Shop, a barber shop on Main Street in Liberty, Texas.

[faded-barbershop.com](https://faded-barbershop.com)

<img src="https://img.shields.io/badge/version-2026.44.1-a8391f?style=for-the-badge" alt="Version 2026.44.1" />

Services, hours, reviews, directions and a booking link to TheCut. The page is a WebGL field of hair that gets shorter as you scroll, long at the top and down to skin at the bottom. The cursor shaves a path through it and the cut hair falls.

## How it's built

- **The field is one fragment shader.** `FadeField.jsx` draws a strand per vertical cell, cut off partway down. Scroll only moves the guard, how far down each strand still stands. Strand geometry never changes with scroll, because shifting a noise frequency mid-scroll reads as warping.
- **The shave is a low-res buffer.** Wherever the pointer passes, a coarse grid gets cut and grows back. It's sampled with bilinear filtering, so a low grid looks like a soft clipper path and costs a few KB to upload per frame.
- **Falling hair is Canvas 2D.** `HairLayer.jsx` draws strands shed by the pointer and by a clipper pass on route change. One strand model (`src/app/lib/hair.js`) for both: a tapered curve, a lit edge, color variance, and a blurred near layer for depth.
- **DOM drives the shader without re-renders.** `src/app/lib/field.js` holds the shared state. The shader reads it every frame. Components write to it.
- **The nav uses guard sizes.** Section numbers are clipper guards, the same scale as the fade.
- **Prerendered.** One route table (`src/app/routeTable.js`) feeds both sides. The client wraps each loader in `lazy()`. The SSR build awaits them so the HTML holds the real page. `scripts/prerender.js` writes each route and preloads its chunk and fonts.

<details>
<summary>Decisions and tradeoffs</summary>

- A software WebGL renderer (SwiftShader, llvmpipe, Apple's fallback) runs the shader on the main thread. `src/app/lib/gpu.js` checks once with a one-pixel context. On a software renderer the page gets the flat background a no-WebGL machine gets, and the hair holds still like it does under reduced motion.
- Open or closed is read in the shop's time zone, not the visitor's (`useTodayStatus.js`).
- A chunk that fails to load is never retried in place. The browser caches a failed module import and answers every retry from that cache. `src/app/lib/chunk.js` reloads the page once per visit instead, and doesn't hand that reload back, because handing it back is how you get a loop.
- Hours, services, phone, booking link and booking fee all live in `src/app/constants/shop.js`.
- `middleware.js` checks a TaylorURL status endpoint and shows a holding page if the site is paused. Fails open. `api/version.js` returns the deployed commit, uncached.

</details>

<details>
<summary>Running it locally</summary>

You need Node 22 or newer. Nothing to configure.

```bash
npm install
npm run dev        # Vite dev server
npm run build      # builds the site and prerenders every page
```

</details>

## Built with

React 19, React Router, Vite and Tailwind CSS. The hair is plain WebGL and Canvas 2D, no 3D library. Hosted on Vercel.

<details>
<summary>License</summary>

Proprietary. Copyright (c) 2026 TaylorURL LLC, all rights reserved. See [LICENSE.md](LICENSE.md).

</details>

Built and maintained by [TaylorURL](https://www.taylorurl.com).
