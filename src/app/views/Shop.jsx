import { SHOP } from '@constants/shop.js';
import { TRAVELS } from '@constants/reviews.js';
import PageHead from '@components/layout/PageHead.jsx';
import Rule from '@sections/Rule.jsx';
import Figures from '@sections/Figures.jsx';
import Reveal from '@components/ui/Reveal.jsx';
import BookLink from '@components/ui/BookLink.jsx';

export default function Shop() {
  return (
    <main id="main">
      <PageHead
        guard="2"
        kicker="The Shop"
        title="Samantha cuts here"
        lead={`${SHOP.barber} has run the chair at ${SHOP.street} since ${SHOP.established}. Fades, beards, straight razor shaves, and a large share of the kids in Liberty County.`}
      />

      <section className="pb-24 sm:pb-32">
        <div className="shell grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Reveal className="space-y-6 text-[15px] leading-relaxed text-bone-100/75">
            <p>
              It is a working barber shop off Main Street, not a lounge. Reviewers write about the
              cut and the company in the same breath.
            </p>
            <p>
              The straight razor work is the oldest thing here. Hot towel, lather, one blade, the
              full half hour.
            </p>
            <p>
              Kids are a real part of the book. Parents write about her patience more than anything
              else.
            </p>
            <p>That includes the ones who bring a two-year-old who screams from start to finish.</p>
            <p>
              Regulars drive past closer shops to get here, from{' '}
              {TRAVELS.map((t, i) => (
                <span key={t.who}>
                  {i > 0 ? (i === TRAVELS.length - 1 ? ' and ' : ', ') : ''}
                  <span className="text-bone-50">{t.from}</span>
                </span>
              ))}
              .
            </p>
          </Reveal>

          <Reveal delay={180}>
            <img
              src="/brand/faded-logo-lockup.webp"
              srcSet="/brand/faded-logo-lockup.webp 660w"
              sizes="(max-width: 1024px) 70vw, 320px"
              alt=""
              width="660"
              height="987"
              loading="lazy"
              decoding="async"
              className="mx-auto h-auto w-[min(70%,320px)] opacity-90"
            />
          </Reveal>
        </div>
      </section>

      <Rule />

      <section className="py-24 sm:py-32">
        <div className="shell">
          <Figures />
          <Reveal delay={160} className="mt-14">
            <BookLink size="lg" label="Book A Chair" />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
