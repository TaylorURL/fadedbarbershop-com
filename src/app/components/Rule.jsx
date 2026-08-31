import { SHOP } from '@constants/shop.js';
import ShaveHeading from '@components/ShaveHeading.jsx';
import Reveal from '@components/Reveal.jsx';

// Samantha's line. It runs at full width because in the shop it is a sign, not
// a sentence.
export default function Rule() {
  return (
    <section className="relative overflow-hidden border-y border-bone-100/12 py-24 sm:py-32">
      <div className="shell relative text-center">
        <p className="kicker">The House Rule</p>
        <ShaveHeading className="mx-auto mt-6 max-w-5xl text-[clamp(2.4rem,10vw,6.5rem)]">
          {SHOP.rule}
        </ShaveHeading>
        <Reveal delay={160} className="mx-auto mt-8">
          <p className="spec text-[10px] text-bone-300">
            {SHOP.barber}
            <span className="mx-3 text-bone-100/30">/</span>
            On the wall since {SHOP.established}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
