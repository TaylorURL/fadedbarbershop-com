import { SHOP } from '@constants/shop.js';
import PageHead from '@components/PageHead.jsx';
import ServiceList from '@components/ServiceList.jsx';
import Gallery from '@components/Gallery.jsx';
import ShaveHeading from '@components/ShaveHeading.jsx';
import BookLink from '@components/BookLink.jsx';
import Reveal from '@components/Reveal.jsx';

export default function Services() {
  return (
    <main id="main">
      <PageHead
        guard="3"
        kicker="Services"
        title="Every cut in the book"
        lead={`Four things, done properly. Tuesday to Thursday runs on appointment and Friday is the walk-in day. An appointment is $${SHOP.bookingFee} for ${SHOP.bookingMinutes} minutes and that covers the first service.`}
      />
      <section className="pb-28 sm:pb-36">
        <div className="shell">
          <ServiceList detailed />

          <div className="mt-14">
            <div className="flex items-baseline gap-4">
              <span className="spec text-[11px] text-rust-ember">2</span>
              <p className="kicker">The Lengths</p>
            </div>
            <ShaveHeading className="mt-6 text-[clamp(2.2rem,7vw,4.2rem)]">
              Pick a number
            </ShaveHeading>
            <div className="mt-14">
              <Gallery />
            </div>
          </div>
          <Reveal delay={140} className="mt-14 border-t hairline pt-12">
            <h2 className="font-head text-2xl font-[700] uppercase text-bone-50 sm:text-3xl">
              Before booking
            </h2>
            <ul className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-bone-100/70">
              <li className="flex gap-4">
                <span className="spec shrink-0 pt-1 text-[10px] text-rust-ember">01</span>
                Bring a photo or a guard number. Either one saves the first five minutes.
              </li>
              <li className="flex gap-4">
                <span className="spec shrink-0 pt-1 text-[10px] text-rust-ember">02</span>
                The walk-in day fills early, and the book closes when the day does.
              </li>
            </ul>
            <div className="mt-14">
              <BookLink size="lg" label="Book On TheCut" />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
