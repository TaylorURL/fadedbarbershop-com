import { GOOGLE_HREF, REVIEWS } from '@constants/reviews.js';
import PageHead from '@components/layout/PageHead.jsx';
import ReviewWall from '@sections/ReviewWall.jsx';
import Figures from '@sections/Figures.jsx';
import Reveal from '@components/ui/Reveal.jsx';
import BookLink from '@components/ui/BookLink.jsx';

export default function Reviews() {
  return (
    <main id="main">
      <PageHead
        guard="1"
        kicker="Reviews"
        title="In their words"
        lead="Quoted as published, with the reviewer's name on each one. The full set sits on Google, good and bad, and the shop answers both."
      />
      <section className="pb-28 sm:pb-36">
        <div className="shell">
          <Figures className="mb-5" />
          <ReviewWall />
          <Reveal
            delay={160}
            className="mt-14 flex flex-col gap-6 border-t hairline pt-12 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="max-w-lg text-sm leading-relaxed text-bone-100/65">
              {REVIEWS.length} of 86 shown. The shop answers its reviews, including the bad ones,
              under its own name.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href={GOOGLE_HREF}
                target="_blank"
                rel="noreferrer"
                className="spec inline-flex h-12 items-center justify-center border border-bone-100/25 px-6 text-[11px] text-bone-100 transition-colors duration-300 hover:border-bone-50 hover:text-bone-50"
              >
                Read All On Google
              </a>
              <BookLink label="Book A Chair" />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
