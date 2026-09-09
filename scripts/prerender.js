import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';
const shell = readFileSync(join(DIST, 'index.html'), 'utf8');
const entry = pathToFileURL(join(process.cwd(), 'node_modules/.faded-ssr/entry-server.js')).href;

// Each level of the import graph is otherwise a serial round trip: the browser
// cannot know a route's chunk exists until the entry has parsed.
const manifest = JSON.parse(readFileSync(join(DIST, '.vite/manifest.json'), 'utf8'));
const chunkFor = (route) => {
  const key =
    route === '/'
      ? null
      : `src/app/views/${route.slice(1).replace(/^./, (c) => c.toUpperCase())}.jsx`;
  const hits = new Set();
  const walk = (name) => {
    const e = manifest[name];
    if (!e || hits.has(e.file)) return;
    hits.add(e.file);
    for (const imp of e.imports || []) walk(imp);
  };
  if (key && manifest[key]) walk(key);
  return [...hits];
};
const { render, prepare, META, ORIGIN } = await import(entry);
await prepare();

// The bundler fingerprints the font files, so the preload hrefs are read back
// out of the build. Only the two the first screen actually sets type in: the
// display face and the body face. Space Mono is meta type and arrives later.
const fontFiles = readdirSync(join(DIST, 'assets')).filter((f) => f.endsWith('.woff2'));
const preloadFonts = ['big-shoulders-display-var', 'archivo-var']
  .map((stem) => fontFiles.find((f) => f.startsWith(stem)))
  .filter(Boolean)
  .map(
    (f) => `    <link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`,
  )
  .join('\n');

// React 19 SSR emits <link rel="preload" as="image" imageSrcSet="..."> for
// every <img srcSet>, but leaves off the href fallback.  Browsers that do not
// support imagesrcset on a <link> try to load the empty href instead, which
// fires a network error on every page load.  Patch each one with the largest
// source from its srcset so every browser has a valid URL to fetch.
const patchPreloadHrefs = (html) =>
  html.replace(
    /<link\s[^>]*rel="preload"[^>]*as="image"[^>]*>/gi,
    (tag) => {
      if (/\bhref\s*=/i.test(tag)) return tag;
      const m = tag.match(/imageSrcSet="([^"]+)"/i);
      if (!m) return tag;
      const sources = m[1].split(',').map((s) => s.trim());
      const last = sources[sources.length - 1].split(/\s+/)[0];
      return tag.replace(/\/?>\s*$/, ` href="${last}"/>`);
    },
  );

// Those same preloads are emitted into the body, because a string render has no
// head to hoist them into, and there they are worth nothing: the parser reaches
// them at the same moment it reaches the images they describe. Lifted into the
// head they are found before the markup is, which is the whole point of asking
// early, and the root is left holding only what the client renders, so the
// browser and the build agree on the tree being adopted.
const PRELOAD_TAG = /<link\s[^>]*rel="preload"[^>]*as="image"[^>]*>/gi;
const liftPreloads = (body) => {
  const tags = body.match(PRELOAD_TAG) || [];
  return {
    body: body.replace(PRELOAD_TAG, ''),
    preloads: tags.map((tag) => `    ${tag.replace(/\/>$/, ' />')}`).join('\n'),
  };
};

/*
 * Runs the bundle after the first frame rather than before it.
 *
 * Every route here is a finished document, so its first frame owes the bundle
 * nothing. A module script is deferred, which only means it waits for the
 * parser: it runs the moment parsing ends, and on a slow phone that moment
 * arrives before the browser has found a frame to paint the document in. The
 * page then sits blank while the bundle adopts markup nobody has been shown,
 * and the whole download is charged to the first paint.
 *
 * The entry keeps its early fetch as a module preload and loses its script tag.
 * An inline module in its place asks for the bundle one frame after the first,
 * which is the first frame the document can have been painted in and the
 * earliest the bundle can no longer hold it back. The preload asks at a low
 * priority, because the two faces and the mark are what the paint waits on and
 * the entry is what nothing waits on.
 *
 * The one thing it must not do is give up. The entry's filename carries a
 * content hash, so it belongs to the build that wrote it and the next deploy
 * takes the old one away: a document held open across a deploy, or handed back
 * out of a cache, names a bundle the origin no longer has, and a request
 * dropped on a thin connection reads the same from here. Left alone the page
 * then keeps the markup it was served and quietly never wakes up - it reads
 * fine and every menu, dial and booking link on it is dead.
 *
 * Asking a second time is not worth the request, and asking under a query is
 * worse. A module that failed to fetch is recorded as failed in the module map
 * and every later import of that name is answered from there without touching
 * the network, and the preload above has usually failed first, so the import
 * never reaches the wire at all. A query the static host ignores does reach it,
 * being a name the map has not seen - and it buys a second copy of the entry
 * rather than the one every route chunk statically imports, so the routes go on
 * asking for the name that is missing and fail one at a time behind a page that
 * looks like it started.
 *
 * So the answer is the new document, which brings the current names down with
 * it: one reload per visit, on the flag the route chunks share and never give
 * back, so a build that has moved on stops rather than loops.
 */
const boot = (src) => `
      const flag = 'faded:chunk-reload';
      const start = async () => {
        try {
          await import(${JSON.stringify(src)});
          return;
        } catch (ignored) { /* the bundle is not there to be had */ }
        // A browser that refuses storage cannot be asked whether it has already
        // reloaded, and a reload nothing remembers repeats forever, so an
        // unreadable flag reads as spent.
        let spent = true;
        try {
          spent = sessionStorage.getItem(flag) === '1';
          sessionStorage.setItem(flag, '1');
        } catch (ignored) { /* spent stays true */ }
        if (!spent) location.reload();
      };
      requestAnimationFrame(() => requestAnimationFrame(start));
    `;
const paintFirst = (html) =>
  html.replace(
    /<script type="module" crossorigin src="([^"]+)"><\/script>/,
    (tag, src) =>
      `<link rel="modulepreload" crossorigin fetchpriority="low" href="${src}" />` +
      `<script type="module">${boot(src)}</script>`,
  );

/*
 * Writes the stylesheet into the document instead of linking to it.
 *
 * A browser will not draw a page whose stylesheet is still in flight, and on a
 * phone that link is a round trip and a download before any of the markup after
 * it counts - which Lighthouse prices at most of half a second. The whole sheet
 * is seven kilobytes over the wire, less than the round trip that fetches it,
 * so the document carries it and the first paint waits on nothing but itself.
 *
 * The sheet is taken whole rather than reduced to what the first screen needs.
 * A page holding only part of its rules has a window between its first paint
 * and the rest landing, and everything the build could not see standing in that
 * window - a heading that shaves itself in, a panel that opens - is dressed
 * wrongly for as long as it lasts.
 */
const sheetFile = readdirSync(join(DIST, 'assets')).find((f) => f.endsWith('.css'));
const sheet = sheetFile ? readFileSync(join(DIST, 'assets', sheetFile), 'utf8') : null;
const inlineSheet = (html) =>
  sheet
    ? html.replace(
        /<link rel="stylesheet"[^>]*href="\/assets\/[^"]+\.css"[^>]*>/,
        () => `<style>${sheet}</style>`,
      )
    : html;

const swap = (html, pattern, replacement) =>
  pattern.test(html) ? html.replace(pattern, replacement) : html;

// The static hero in the shell is the no-JS first paint, and this replaces it
// with the route's own markup. #root is the last element in body, so the greedy
// match ends at its own closing tag rather than a nested one.
//
// The route it was rendered for is stamped as it goes. A document holding its
// own first screen is adopted by the bundle rather than drawn again, but only
// where the document and the router agree on which page this is. A rewrite can
// answer one address with another's document, and the markup would then be the
// home page while the router draws the not-found one: correcting a tree costs a
// rebuild and a reported error rather than the paint the stamp was meant to
// save. The 404 stands in for whatever was asked for and so names no route, and
// the dev server serves the shell untouched and carries no stamp at all.
const ROOT = /<div id="root">[\s\S]*(<\/div>\s*<\/body>)/;
const intoRoot = (body, route) =>
  shell.replace(
    ROOT,
    (_whole, tail) =>
      `<div id="root"${route ? ` data-prerendered="${route}"` : ''}>${body}${tail}`,
  );

for (const route of Object.keys(META)) {
  const meta = META[route];
  const href = `${ORIGIN}${route}`;
  const { body, preloads: images } = liftPreloads(patchPreloadHrefs(render(route)));
  let out = intoRoot(body, route);
  out = out.replace('<!--FONT-PRELOADS-->', [preloadFonts, images].filter(Boolean).join('\n'));
  out = swap(out, /<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`);
  out = swap(
    out,
    /<meta name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${meta.description}" />`,
  );
  out = swap(out, /<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${href}" />`);
  out = swap(
    out,
    /<meta property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${meta.title}" />`,
  );
  out = swap(
    out,
    /<meta property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${meta.description}" />`,
  );
  out = swap(
    out,
    /<meta property="og:url"[^>]*\/>/,
    `<meta property="og:url" content="${href}" />`,
  );

  // Only this route's own chunks. Prefetching the other routes measured 300ms
  // worse on LCP over a throttled connection: they compete for the same bytes
  // as the first screen.
  const preloads = chunkFor(route)
    .map((f) => `    <link rel="modulepreload" href="/${f}" />`)
    .join('\n');
  if (preloads) out = out.replace('</head>', `${preloads}\n  </head>`);

  out = inlineSheet(paintFirst(out));

  const file = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, out);
  const words = out
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  console.log(
    `${route.padEnd(10)} -> ${file.padEnd(28)} ${(out.length / 1024).toFixed(1)} KB, ${words} words`,
  );
}

// Vercel serves dist/404.html for anything it cannot match, which keeps the
// status honest instead of answering 200 from the SPA fallback.
{
  const { body, preloads: images } = liftPreloads(
    patchPreloadHrefs(render('/this-route-does-not-exist')),
  );
  let out = intoRoot(body, null);
  out = out.replace(/<title>[\s\S]*?<\/title>/, '<title>Not Found | Faded Barber Shop</title>');
  out = out.replace(/<meta name="robots"[^>]*\/>/, '<meta name="robots" content="noindex" />');
  out = out.replace('<!--FONT-PRELOADS-->', [preloadFonts, images].filter(Boolean).join('\n'));
  out = inlineSheet(paintFirst(out));
  writeFileSync(join(DIST, '404.html'), out);
  console.log(`404        -> dist/404.html                 ${(out.length / 1024).toFixed(1)} KB`);
}
