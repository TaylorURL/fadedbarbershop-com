import { useEffect, useRef } from 'react';
import { field } from '@app/lib/field.js';
import drawsInSoftware from '@app/lib/gpu.js';
import { drawStrand, makeStrand, stepStrand } from '@app/lib/hair.js';

const MAX = 260;
const LIFE = 1750;

export default function HairLayer() {
  const farRef = useRef(null);
  const nearRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Two full-window canvases, one of them blurred, redrawn every frame. With
    // no GPU behind them that is the whole viewport rasterised on the main
    // thread for as long as anything is falling, so a machine drawing in
    // software gets the still page a reduced-motion setting gets.
    if (drawsInSoftware()) return;
    const far = farRef.current;
    const near = nearRef.current;
    if (!far || !near) return;

    const fctx = far.getContext('2d');
    const nctx = near.getContext('2d');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      for (const c of [far, near]) {
        c.width = Math.round(window.innerWidth * dpr);
        c.height = Math.round(window.innerHeight * dpr);
      }
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const live = [];
    let raf = 0;
    let last = 0;
    let drawn = false;
    let idle = false;

    // The pointer sheds rather than trails. One strand per stretch of travel, so
    // a slow move drops nothing and a sweep leaves a few behind.
    let px = -1;
    let py = -1;
    let travel = 0;
    const onPointer = (e) => {
      if (px >= 0) travel += Math.hypot(e.clientX - px, e.clientY - py);
      px = e.clientX;
      py = e.clientY;
      if (travel > 130 && live.length < MAX) {
        travel = 0;
        const s = makeStrand(
          px + (Math.random() - 0.5) * 14,
          py + (Math.random() - 0.5) * 10,
          Math.random() < 0.3 ? 1 : 0.6,
          performance.now(),
        );
        s.near = Math.random() < 0.3;
        live.push(s);
        wake();
      }
    };

    const tick = (now) => {
      const dt = last ? Math.min(48, now - last) : 16;
      last = now;

      const wipe = field.wipe;
      const wiping = wipe > 0.001 && wipe < 0.999;

      if (wiping) {
        const bladeY = (wipe * 1.5 - 0.25) * window.innerHeight;
        const batch = Math.min(12, Math.round((dt / 16) * 8));
        for (let i = 0; i < batch && live.length < MAX; i += 1) {
          const nearField = Math.random() < 0.32;
          const s = makeStrand(
            Math.random() * window.innerWidth,
            bladeY + (Math.random() - 0.5) * 26,
            nearField ? 1 : 0.62,
            now,
          );
          s.near = nearField;
          live.push(s);
        }
      }

      if (live.length === 0 && !wiping) {
        if (drawn) {
          fctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          nctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          drawn = false;
        }
        raf = 0;
        idle = true;
        return;
      }
      drawn = true;

      fctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      nctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = live.length - 1; i >= 0; i -= 1) {
        const s = live[i];
        const age = now - s.born;
        if (age > LIFE || s.y > window.innerHeight + 90) {
          live.splice(i, 1);
          continue;
        }
        stepStrand(s, dt);
        drawStrand(s.near ? nctx : fctx, s, age, LIFE);
      }

      raf = requestAnimationFrame(tick);
    };

    function wake() {
      if (!idle && raf) return;
      idle = false;
      last = 0;
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    window.addEventListener('faded:wipe', wake);
    // Something answers for the click itself, and it is the same hair rather than
    // a ring drawn at the cursor.
    const onDown = (e) => {
      const now = performance.now();
      for (let i = 0; i < 4 && live.length < MAX; i += 1) {
        const s = makeStrand(
          e.clientX + (Math.random() - 0.5) * 22,
          e.clientY + (Math.random() - 0.5) * 16,
          Math.random() < 0.4 ? 1 : 0.6,
          now,
        );
        s.near = Math.random() < 0.3;
        live.push(s);
      }
      wake();
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('faded:wipe', wake);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45]">
      <canvas ref={farRef} className="absolute inset-0 h-full w-full" />
      {/* Out of focus, which is what gives the fall depth. */}
      <canvas
        ref={nearRef}
        className="absolute inset-0 h-full w-full"
        style={{ filter: 'blur(2.4px)' }}
      />
    </div>
  );
}
