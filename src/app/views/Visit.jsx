import { SHOP, SOCIALS } from '@constants/shop.js';
import PageHead from '@components/PageHead.jsx';
import VisitBlock from '@components/VisitBlock.jsx';
import StatusPill from '@components/StatusPill.jsx';
import Reveal from '@components/Reveal.jsx';

export default function Visit() {
  return (
    <main id="main">
      <PageHead
        guard="0"
        kicker="Visit"
        title="929 Main Street"
        lead={`Suite B, off Main in ${SHOP.city}. Call the shop for anything the hours below do not answer.`}
      />
      <section className="pb-28 sm:pb-36">
        <div className="shell">
          <StatusPill className="mt-8 mb-14" />
          <VisitBlock />

          <Reveal delay={160} className="mt-14 border-t hairline pt-12">
            <h2 className="kicker text-bone-100/45">Elsewhere</h2>
            <ul className="mt-6 flex flex-wrap gap-4">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="spec inline-flex h-11 items-center border border-bone-100/25 px-5 text-[10px] text-bone-100 transition-colors duration-300 hover:border-rust-ember hover:text-bone-50"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
