import { Link } from 'react-router-dom';
import { ROUTES } from '@constants/shop.js';
import { TRAVELS } from '@constants/reviews.js';
import Hero from '@sections/Hero.jsx';
import Rule from '@components/Rule.jsx';
import ServiceList from '@components/ServiceList.jsx';
import ReviewWall from '@components/ReviewWall.jsx';
import Gallery from '@components/Gallery.jsx';
import Figures from '@components/Figures.jsx';
import VisitBlock from '@components/VisitBlock.jsx';
import ShaveHeading from '@components/ShaveHeading.jsx';
import Reveal from '@components/Reveal.jsx';

function More({ to, children }) {
  return (
    <Link
      to={to}
      className="group spec mt-14 inline-flex items-center gap-4 text-[10px] text-bone-100"
    >
      {children}
      <span className="h-[1px] w-8 bg-bone-100/40 transition-[width,background-color] duration-300 group-hover:w-14 group-hover:bg-rust-ember" />
    </Link>
  );
}

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Rule />

      <section className="py-24 sm:py-32">
        <div className="shell">
          <div className="flex items-baseline gap-4">
            <span className="spec text-[11px] text-rust-ember">3</span>
            <p className="kicker">The Cuts</p>
          </div>
          <ShaveHeading className="mt-6 text-[clamp(2.4rem,8vw,5rem)]">
            Taken down by the number
          </ShaveHeading>
          <div className="mt-14">
            <ServiceList />
          </div>
          <div className="mt-14">
            <Gallery limit={3} />
          </div>
          <More to={ROUTES.services}>Every Service</More>
        </div>
      </section>

      <section className="border-t border-bone-100/12 py-24 sm:py-32">
        <div className="shell">
          <div className="flex items-baseline gap-4">
            <span className="spec text-[11px] text-rust-ember">1</span>
            <p className="kicker">What People Say</p>
          </div>
          <ShaveHeading className="mt-6 text-[clamp(2.4rem,8vw,5rem)]">
            Eighty-six reviews deep
          </ShaveHeading>
          <Figures className="mt-14" />
          <div className="mt-5">
            <ReviewWall limit={3} />
          </div>
          <Reveal delay={200} className="mt-10">
            <p className="text-sm leading-relaxed text-bone-100/65">
              People drive in from{' '}
              {TRAVELS.map((t, i) => (
                <span key={t.who}>
                  {i > 0 ? (i === TRAVELS.length - 1 ? ' and ' : ', ') : ''}
                  <span className="text-bone-50">{t.from}</span>
                </span>
              ))}
              . Their words, not ours.
            </p>
          </Reveal>
          <More to={ROUTES.reviews}>All Reviews</More>
        </div>
      </section>

      <section
        id="visit"
        className="border-t border-bone-100/12 bg-pitch-950/70 py-24 backdrop-blur-sm sm:py-32"
      >
        <div className="shell">
          <div className="flex items-baseline gap-4">
            <span className="spec text-[11px] text-rust-ember">0</span>
            <p className="kicker">Visit</p>
          </div>
          <ShaveHeading className="mt-6 text-[clamp(2.4rem,8vw,5rem)]">Take a seat</ShaveHeading>
          <div className="mt-14">
            <VisitBlock />
          </div>
        </div>
      </section>
    </main>
  );
}
