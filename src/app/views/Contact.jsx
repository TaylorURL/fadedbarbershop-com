import { Phone, MapPin } from 'lucide-react';
import { SHOP, SOCIALS, DIRECTIONS_HREF } from '@constants/shop.js';
import { SOCIAL_ICONS } from '@components/ui/socialIcons.js';
import PageHead from '@components/layout/PageHead.jsx';
import StatusPill from '@components/ui/StatusPill.jsx';
import BookLink from '@components/ui/BookLink.jsx';
import Reveal from '@components/ui/Reveal.jsx';

export default function Contact() {
  return (
    <main id="main">
      <PageHead
        kicker="Contact"
        title="Reach the shop"
        lead="The phone is the fastest way to get an answer. Booking runs on TheCut, and walk-in days need no notice at all."
      />
      <section className="pb-28 sm:pb-36">
        <div className="shell">
          <StatusPill className="mt-8 mb-14" />

          <dl className="grid gap-px border hairline bg-bone-100/10 sm:grid-cols-2">
            <div className="bg-pitch-900/85 p-8">
              <dt className="kicker text-bone-100/45">Phone</dt>
              <dd className="mt-4">
                <a
                  href={SHOP.phoneHref}
                  className="inline-flex items-center gap-3 font-head text-3xl font-[700] uppercase text-bone-50 hover:text-rust-ember sm:text-4xl"
                >
                  <Phone className="h-5 w-5" strokeWidth={1.8} />
                  {SHOP.phone}
                </a>
              </dd>
            </div>
            <div className="bg-pitch-900/85 p-8">
              <dt className="kicker text-bone-100/45">Address</dt>
              <dd className="mt-4">
                <address className="not-italic">
                  <a
                    href={DIRECTIONS_HREF}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-3 font-head text-2xl font-[700] uppercase leading-tight text-bone-50 hover:text-rust-ember sm:text-3xl"
                  >
                    <MapPin className="mt-1 h-5 w-5 shrink-0" strokeWidth={1.8} />
                    <span>
                      {SHOP.street}
                      <br />
                      {SHOP.city}, {SHOP.region} {SHOP.postal}
                    </span>
                  </a>
                </address>
              </dd>
            </div>
          </dl>

          <Reveal delay={120} className="mt-14">
            <BookLink size="lg" label="Book On TheCut" />
            <p className="mt-5 max-w-lg text-xs leading-relaxed text-bone-100/65">
              An appointment is ${SHOP.bookingFee} for {SHOP.bookingMinutes} minutes and that covers
              the first service. Friday is the walk-in day, first come, first served at the door.
            </p>
          </Reveal>

          <Reveal delay={180} className="mt-14 border-t hairline pt-12">
            <h2 className="kicker text-bone-100/45">Elsewhere</h2>
            <ul className="mt-6 flex flex-wrap gap-4">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="spec inline-flex h-11 items-center gap-3 border border-bone-100/25 px-5 text-[10px] text-bone-100 transition-colors duration-300 hover:border-rust-ember hover:text-bone-50"
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
