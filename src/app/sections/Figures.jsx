import { RATINGS } from '@constants/reviews.js';
import Reveal from '@components/ui/Reveal.jsx';

// The reveal wraps the whole grid: animating each cell leaves the container's
// own background showing as a bare slab until the cells arrive.
export default function Figures({ className = '' }) {
  return (
    <Reveal className={className}>
      <dl className="grid gap-px border hairline bg-bone-100/10 sm:grid-cols-3">
        {RATINGS.map((r) => (
          <div key={r.label} className="bg-pitch-900/85 p-7">
            <dt className="font-head text-5xl font-[900] leading-none text-bone-50 sm:text-6xl">
              {r.value}
            </dt>
            <dd className="spec mt-4 text-[10px] leading-[1.8] text-bone-300">
              {r.href ? (
                <a href={r.href} target="_blank" rel="noreferrer" className="hover:text-bone-50">
                  {r.label}
                </a>
              ) : (
                r.label
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
