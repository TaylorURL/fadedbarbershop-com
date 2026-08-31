import { useEffect, useRef, useState } from 'react';

// Reveals content on entry, and reports whether it should arrive without an
// animation. Nothing on the page may depend on a transition running: with no
// observer, with reduced motion, or in a background tab where the browser
// freezes transitions mid-way, the content is simply already there.
export default function useInView({ rootMargin = '-12% 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const skip = () => {
      setInstant(true);
      setShown(true);
    };

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      skip();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (document.hidden) skip();
        else setShown(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, shown, instant };
}
