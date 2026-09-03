// Shared state between the DOM and the fade field. The shader reads these every
// frame, so a component can drive the field without re-rendering anything.
export const field = {
  wipe: 0,
};

let wipeRaf = 0;

// Dev only: lets the wipe be held at a position while the fall is inspected.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__field = field;
}

// One pass of the clippers across the whole viewport, used when the route
// changes so a new page arrives cut rather than faded in.
export function razorWipe(duration = 1000) {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }
  cancelAnimationFrame(wipeRaf);
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('faded:wipe'));
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    field.wipe = t < 1 ? t : 0;
    if (t < 1) wipeRaf = requestAnimationFrame(step);
  };
  wipeRaf = requestAnimationFrame(step);
}
