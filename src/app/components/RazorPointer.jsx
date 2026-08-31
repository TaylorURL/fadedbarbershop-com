import { useEffect, useRef } from 'react';

// A straight razor standing in for the cursor on pointer devices. The steel is
// built from stacked gradients rather than a flat fill: a hollow-ground blade
// reads as metal because its face is light at the hone, dark through the grind
// and light again at the spine, and because the highlight moves when it turns.
export default function RazorPointer() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    let x = -300;
    let y = -300;
    let cx = -300;
    let cy = -300;
    let angle = -32;
    let raf = 0;
    let shown = false;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        wrap.style.opacity = '1';
        document.documentElement.style.cursor = 'none';
      }
    };
    const onLeave = () => {
      shown = false;
      wrap.style.opacity = '0';
      document.documentElement.style.cursor = '';
    };

    const tick = () => {
      cx += (x - cx) * 0.26;
      cy += (y - cy) * 0.26;
      const dx = x - cx;
      const dy = y - cy;
      const speed = Math.min(1, Math.hypot(dx, dy) / 80);

      // Held at a working angle, turned by how it is being moved, and always
      // drifting a little so the steel never sits dead still.
      const target = -32 + dx * 0.5 - dy * 0.18;
      angle += (target - angle) * 0.12;
      const drift = Math.sin(performance.now() / 1400) * 2.5;

      wrap.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotate(${angle + drift}deg) scale(${1 + speed * 0.1})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = '';
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden opacity-0 transition-opacity duration-300 md:block"
      style={{ width: 56, height: 19, marginLeft: -3, marginTop: -10 }}
    >
      <svg
        viewBox="0 0 132 44"
        className="h-full w-full"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Across the blade: hone, hollow grind, spine. Kept bright, because
              steel on a near-black page reads as plastic if it is not. */}
          <linearGradient id="rp-steel" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.10" stopColor="#f2f5f8" />
            <stop offset="0.30" stopColor="#b6bec6" />
            <stop offset="0.50" stopColor="#8d959d" />
            <stop offset="0.70" stopColor="#ced5dc" />
            <stop offset="0.88" stopColor="#7b828a" />
            <stop offset="1" stopColor="#565c63" />
          </linearGradient>
          <linearGradient id="rp-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.62" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="0.78" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rp-horn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a4038" />
            <stop offset="0.24" stopColor="#221c17" />
            <stop offset="0.55" stopColor="#332a23" />
            <stop offset="1" stopColor="#100d0a" />
          </linearGradient>
          <filter id="rp-shadow" x="-30%" y="-80%" width="170%" height="280%">
            <feDropShadow
              dx="0"
              dy="2.5"
              stdDeviation="2.6"
              floodColor="#000"
              floodOpacity="0.45"
            />
          </filter>
        </defs>

        <g filter="url(#rp-shadow)">
          {/* Scales first, then the tang and pivot, then the blade over them. */}
          <rect x="74" y="15" width="54" height="14" rx="7" fill="url(#rp-horn)" />
          <rect x="77" y="17.2" width="48" height="1.8" rx="0.9" fill="#c9c1b4" opacity="0.3" />
          <rect x="77" y="26" width="48" height="1.4" rx="0.7" fill="#000" opacity="0.55" />

          <path d="M62 16.6 L78 15.6 L78 28.4 L62 27.4 Z" fill="#6d747c" />
          <path d="M62 16.6 L78 15.6 L78 21 L62 21 Z" fill="#9aa1a9" opacity="0.7" />
          <circle cx="75" cy="22" r="2.6" fill="#dfe4e9" />
          <circle cx="75" cy="22" r="1.05" fill="#3f454b" />

          {/* Blade. Straight spine, edge sweeping up to a rounded point. */}
          <path
            d="M6.8 28.8 C22 30.4 42 30.2 62 28.6 L62 16.4 C42 15.0 22 15.2 6.8 17.0
               C5.0 17.2 5.0 28.6 6.8 28.8 Z"
            fill="url(#rp-steel)"
          />
          <path
            d="M6.8 28.8 C22 30.4 42 30.2 62 28.6 L62 16.4 C42 15.0 22 15.2 6.8 17.0
               C5.0 17.2 5.0 28.6 6.8 28.8 Z"
            fill="url(#rp-sheen)"
          />
          {/* The hone. The one hard highlight on the whole object. */}
          <path
            d="M7.2 29.2 C22.4 30.8 42 30.6 62 29.0"
            stroke="#ffffff"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          {/* The spine, thicker and darker than the face it sits above. */}
          <path
            d="M7.4 16.7 C22.4 14.9 42 14.7 62 16.1"
            stroke="#454b52"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M7.8 18.1 C22.6 16.3 42 16.1 62 17.5"
            stroke="#e8ecf0"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      </svg>
    </div>
  );
}
