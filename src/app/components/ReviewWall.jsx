import { Star } from 'lucide-react';
import { REVIEWS, GOOGLE_HREF } from '@constants/reviews.js';
import Reveal from '@components/Reveal.jsx';

export default function ReviewWall({ limit = REVIEWS.length }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {REVIEWS.slice(0, limit).map((review, i) => (
        <Reveal
          as="li"
          key={review.name}
          delay={(i % 3) * 90}
          className="group relative flex flex-col border hairline p-7 transition-colors duration-500 hover:border-bone-100/30"
        >
          {/* The accent arrives as a razored line along the top edge. */}
          <span className="absolute inset-x-0 top-0 h-[2px] w-0 bg-rust-ember transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
          <div className="flex gap-1 text-rust-ember" role="img" aria-label="Five stars">
            {[0, 1, 2, 3, 4].map((s) => (
              <Star key={s} className="h-3 w-3" strokeWidth={0} fill="currentColor" />
            ))}
          </div>
          <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-bone-100/85">
            {review.text}
          </blockquote>
          <footer className="mt-4 flex items-baseline justify-between gap-4 border-t hairline pt-4">
            <cite className="spec not-italic text-[10px] text-bone-50">{review.name}</cite>
            <a
              href={GOOGLE_HREF}
              target="_blank"
              rel="noreferrer"
              className="spec text-[9px] text-bone-100/45 transition-colors hover:text-bone-100"
            >
              {review.source}
            </a>
          </footer>
          {review.note ? (
            <p className="spec mt-4 text-[9px] text-bone-100/40">{review.note}</p>
          ) : null}
        </Reveal>
      ))}
    </ul>
  );
}
