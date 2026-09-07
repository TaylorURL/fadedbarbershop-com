<p align="center">
  <img src="public/brand/faded-logo-lockup.webp" width="200" alt="Faded Barber Shop" />
</p>

<h1 align="center">Faded Barber Shop</h1>

<p align="center">
  <b>Walkins Welcome</b>
</p>
<p align="center">
  Fades, beard work and straight razor shaves at 929 Main St, Suite B, Liberty, TX 77575.<br />
  Live at <a href="https://faded-barbershop.com">faded-barbershop.com</a>. Call (936) 402-4637.
</p>
<p align="center">
  <sub>Published for reading. Proprietary — see <a href="LICENSE.md">LICENSE.md</a>. Outside contributions are not accepted.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2026.37.0-a8391f?style=for-the-badge" alt="Version 2026.37.0" />
  <img src="https://img.shields.io/badge/React-19-a8391f?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-a8391f?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-a8391f?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3" />
  <img src="https://img.shields.io/badge/WebGL-0b0a09?style=for-the-badge&logo=webgl&logoColor=white" alt="WebGL" />
  <img src="https://img.shields.io/badge/Vercel-0b0a09?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<br />

## Why Faded

The site is one continuous fade. Scroll position drives a clipper guard, and a fullscreen fragment shader renders a field of hair at that length: long and unruly at the top of the page, taken down to skin at the bottom. Section markers are guard numbers rather than names, so the navigation and the shader are on the same scale, and the logo's skull is shaved out of the field rather than drawn over it.

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">Sharpest where it matters</h3>
      <p align="center">Legibility increases as the page descends, which puts the plainest screen at the bottom, where the hours, address, phone number and booking link are.</p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">The shader is never a dependency</h3>
      <p align="center">Without WebGL the page keeps a flat background and every word, link and phone number still works. Nothing a visitor came for is behind an effect.</p>
    </td>
  </tr>
</table>

<br />

## Pages

| Route                | Holds                                             |
| :------------------- | :------------------------------------------------ |
| `/`                  | Hero, the house rule, services, reviews, visit    |
| `/services`          | Every service in detail, and what to bring        |
| `/shop`              | Samantha, the straight razor work, the figures    |
| `/reviews`           | Published customer reviews, quoted and attributed |
| `/visit`             | Hours, address, directions, socials               |
| `/contact`           | Phone, address, booking, socials                  |
| `/privacy`, `/terms` | Legal routes                                      |

## Stack

| Layer        | Technology                                                 |
| :----------- | :--------------------------------------------------------- |
| UI           | React 19 + React Router 7                                  |
| Build & dev  | Vite 7, with an SSR pass and a prerender step              |
| Styling      | Tailwind CSS 3, on the token block in `tailwind.config.js` |
| Fade field   | Raw WebGL, one fullscreen fragment shader                  |
| Falling hair | Canvas 2D, two layers                                      |
| Icons        | `lucide-react`                                             |
| Footer bar   | `@taylorurl/split-rail`                                    |
| Hosting      | Vercel                                                     |
| Booking      | TheCut, off-site                                           |
| Versioning   | CalVer                                                     |

There is no 3D library. The mark is 2D line art and the field is a single quad, so the whole effect is a shader and a few kilobytes of setup rather than a scene graph.

## Getting started

```bash
npm install
npm run dev           # Vite dev server
npm run build         # browser bundle, SSR bundle, then a static page per route
```

Node 22 or newer. There is nothing to configure to run it locally: the site talks to no backend, holds no keys, and hands booking off to TheCut.

Hours, services, prices, phone number and booking URL all live in `src/app/constants/shop.js`, and page titles and descriptions in `src/app/constants/meta.js`. Nothing else hardcodes them.

### Scripts

| Script                 | Does                                                             |
| :--------------------- | :--------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server.                                       |
| `npm run build`        | Production build to `dist`, prerendered route by route.          |
| `npm run build:client` | The browser bundle alone, without the SSR pass or the prerender. |
| `npm run preview`      | Serve the built output.                                          |
| `npm run lint`         | Lint with ESLint.                                                |
| `npm run format`       | Format `src/**` with Prettier.                                   |
| `npm run format:check` | Check formatting without writing.                                |

## How it works

- **Every route is real HTML.** `npm run build` builds the browser bundle, builds `src/entry-server.jsx` for the server, and then `scripts/prerender.js` renders each route into the built shell and writes `dist/<route>/index.html`, plus a `404.html` carrying `noindex` so a miss answers with the right status instead of a 200 from the SPA fallback.
- **One canvas, four things.** Scroll drives the clipper guard. The pointer shaves the field where it passes, into a 128 by 72 grid that decays so the cut grows back. A ray fan sits behind the mark, taken from `public/brand/faded-skull-mask.webp`. A route change runs one clipper pass across the viewport.
- **The cut hair falls.** `HairLayer` draws tapered strands on two canvases, the near one blurred for depth, shed by the pointer as it travels and thrown off the blade line during a route change. `RazorPointer` replaces the cursor with a straight razor on fine pointers.
- **Two tiers, decided by the browser.** Without WebGL the page keeps its flat background. Under `prefers-reduced-motion` the field renders one static frame, the reveals resolve immediately, and neither the falling hair nor the razor pointer runs at all. Phones draw the field below their device pixel ratio.
- **The status is read in the shop's timezone.** `useTodayStatus` resolves the open, closed and walk-in state against `America/Chicago` rather than the visitor's clock, and re-reads it every thirty seconds.
- **Type is served from this origin.** Archivo, Big Shoulders Display and Space Mono are woff2 files in `src/assets/fonts/`, each with a metric-matched local fallback so the swap does not reflow the line. The prerender reads the fingerprinted filenames back out of the build and writes the preloads for the two faces the first screen sets type in.
- **Search and AI readers are served from source.** `index.html` carries `HairSalon` JSON-LD with the hours, address and offers; `public/` carries `robots.txt`, `sitemap.xml` and `llms.txt`.
- **Browser errors reach the shop's monitoring.** A small snippet in `index.html` reports uncaught errors, rejections, failed resource loads and 5xx responses, capped at ten per page so an error loop cannot flood.

## Project structure

```
fadedbarbershop-com/
├── api/
│   └── version.js          the commit the running deployment was built from
├── public/
│   ├── brand/              logo lockup, skull, wordmark, and the mask the shader reads (WebP)
│   ├── robots.txt          crawler rules, including the AI readers
│   ├── sitemap.xml         every route
│   └── llms.txt            hours, booking and pages in plain text
├── scripts/
│   └── prerender.js        writes a static page per route, plus 404.html
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── effects/    FadeField, HairLayer, Grain, RazorPointer — the ambient layers App mounts once
│   │   │   ├── layout/     Nav, MegaMenu, Dock, Footer, PageHead, and the two routing components
│   │   │   └── ui/         BookLink, Reveal, ShaveHeading, StatusPill, FadeSpecimen, socialIcons
│   │   ├── constants/      shop.js for hours, services and contact; meta.js, reviews.js, gallery.js
│   │   ├── hooks/          useTodayStatus for the live open state, useInView for the reveals
│   │   ├── lib/            field.js, the state the shader reads each frame; hair.js, the strand model; gpu.js, the software-renderer check
│   │   ├── sections/       Hero, Rule, ServiceList, Gallery, ReviewWall, Figures, VisitBlock
│   │   ├── views/          one file per route
│   │   └── routeTable.js   one route list, wrapped in lazy() by the client and awaited by the server build
│   ├── assets/fonts/       Archivo and Big Shoulders variable, Space Mono at two weights
│   ├── entry-server.jsx    prerender entry (react-dom/server)
│   ├── main.jsx            browser entry
│   └── index.css           fonts, base layer, the .spec and .shave-in components
├── index.html              head metadata, JSON-LD, the no-JS hero, the error reporter
└── vercel.json             caching and the SPA fallback
```

Vite writes a content hash into every filename under `/assets`, so one of those files cannot change without changing its name. `vercel.json` serves them `immutable` for a year on that basis, and the brand images for a week.

## Booking

TheCut publishes no embed and no API, so booking hands off to `book.thecut.co/FadedBarberShop`. The appointment fee and length are stated on the page before the handoff, so neither is a surprise on arrival. Friday is the walk-in day and takes no booking at all.

<br />

<p align="center">
  <sub>Leave your feelings at the door.</sub>
</p>
