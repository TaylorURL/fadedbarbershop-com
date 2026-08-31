import { useEffect, useLayoutEffect } from 'react';

import { useLocation } from 'react-router-dom';
import { razorWipe } from '@app/lib/field.js';
import { META, ORIGIN } from '@constants/meta.js';
import { ROUTES } from '@constants/shop.js';

// A layout effect does nothing during prerendering and React says so on every
// route, so the server takes the plain effect.
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function setTag(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

// A new page arrives cut rather than faded: the field takes a clipper pass, the
// page starts at the top, and the head catches up with the route.
export default function RouteChange() {
  const { pathname } = useLocation();

  // Before paint, so a new page is never briefly shown at the old offset. The
  // root carries scroll-behavior: smooth, which would otherwise animate this,
  // and a lazy route mounts a frame later, so the top is asserted twice.
  useBeforePaint(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    toTop();
    const raf = requestAnimationFrame(toTop);
    const late = setTimeout(toTop, 120);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
    };
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) razorWipe();

    const meta = META[pathname] || META[ROUTES.home];
    document.title = meta.title;
    setTag('meta[name="description"]', 'content', meta.description);
    setTag('meta[property="og:title"]', 'content', meta.title);
    setTag('meta[property="og:description"]', 'content', meta.description);
    const href = `${ORIGIN}${pathname === '/' ? '/' : pathname}`;
    setTag('link[rel="canonical"]', 'href', href);
    setTag('meta[property="og:url"]', 'content', href);
    setTag('meta[name="twitter:title"]', 'content', meta.title);
    setTag('meta[name="twitter:description"]', 'content', meta.description);
  }, [pathname]);

  return null;
}
