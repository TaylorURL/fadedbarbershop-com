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

const swap = (html, pattern, replacement) =>
  pattern.test(html) ? html.replace(pattern, replacement) : html;

for (const route of Object.keys(META)) {
  const meta = META[route];
  const href = `${ORIGIN}${route}`;
  // The static hero in the shell is the no-JS first paint, and this replaces it
  // with the route's own markup. #root is the last element in body, so the
  // greedy match ends at its own closing tag rather than a nested one.
  let out = shell.replace(/(<div id="root">)[\s\S]*(<\/div>\s*<\/body>)/, `$1${render(route)}$2`);
  out = patchPreloadHrefs(out);
  out = out.replace('<!--FONT-PRELOADS-->', preloadFonts);
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
  const body = render('/this-route-does-not-exist');
  let out = shell.replace(/(<div id="root">)[\s\S]*(<\/div>\s*<\/body>)/, `$1${body}$2`);
  out = patchPreloadHrefs(out);
  out = out.replace(/<title>[\s\S]*?<\/title>/, '<title>Not Found | Faded Barber Shop</title>');
  out = out.replace(/<meta name="robots"[^>]*\/>/, '<meta name="robots" content="noindex" />');
  out = out.replace('<!--FONT-PRELOADS-->', preloadFonts);
  writeFileSync(join(DIST, '404.html'), out);
  console.log(`404        -> dist/404.html                 ${(out.length / 1024).toFixed(1)} KB`);
}
