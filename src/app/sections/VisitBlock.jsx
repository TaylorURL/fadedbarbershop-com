import { Phone, MapPin } from 'lucide-react';
import { SHOP, HOURS, DIRECTIONS_HREF } from '@constants/shop.js';
import useTodayStatus, { formatTime } from '@hooks/useTodayStatus.js';
import BookLink from '@components/ui/BookLink.jsx';
import Reveal from '@components/ui/Reveal.jsx';

export default function VisitBlock() {
  const status = useTodayStatus();

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
      <Reveal>
        <h2 className="kicker text-bone-100/45">Hours</h2>
        <table className="mt-6 w-full border-collapse">
          <tbody>
            {HOURS.map((h, i) => {
              const today = i === status.day;
              return (
                <tr
                  key={h.day}
                  className={`border-b hairline ${today ? 'text-bone-50' : 'text-bone-100/55'}`}
                >
                  <th scope="row" className="py-4 text-left align-top">
                    <span className="spec text-[11px]">{h.abbr}</span>
                    {today ? (
                      <span className="spec ml-3 text-[9px] text-rust-ember">Today</span>
                    ) : null}
                    {h.mode ? (
                      <span className="spec mt-1.5 block text-[9px] text-bone-100/55 sm:hidden">
                        {h.mode === 'walk-in' ? 'Walk-in' : 'Booked'}
                      </span>
                    ) : null}
                  </th>
                  <td className="py-4 text-right align-top">
                    <span className="spec whitespace-nowrap text-[10px] tracking-[0.08em] sm:text-[11px] sm:tracking-spec">
                      {h.open === null
                        ? 'Closed'
                        : `${formatTime(h.open)} – ${formatTime(h.close)}`}
                    </span>
                  </td>
                  <td className="hidden w-24 py-4 text-right align-top sm:table-cell">
                    <span className="spec text-[9px] text-bone-100/55">
                      {h.mode === 'walk-in' ? 'Walk-in' : h.mode === 'appointment' ? 'Booked' : ''}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="spec mt-6 text-[9px] leading-[1.9] text-bone-100/50">
          Tuesday to Thursday runs on appointment. Friday is the walk-in day.
        </p>
      </Reveal>

      <Reveal delay={160} className="flex flex-col">
        <h2 className="kicker text-bone-100/45">Find It</h2>
        <address className="mt-6 not-italic">
          <p className="font-head text-3xl font-[700] uppercase leading-tight text-bone-50 sm:text-4xl">
            {SHOP.street}
            <br />
            {SHOP.city}, {SHOP.region} {SHOP.postal}
          </p>
        </address>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            href={SHOP.phoneHref}
            className="spec inline-flex h-12 items-center justify-center gap-3 border border-bone-100/25 px-6 text-[11px] text-bone-100 transition-colors duration-300 hover:border-bone-50 hover:text-bone-50"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={1.8} />
            {SHOP.phone}
          </a>
          <a
            href={DIRECTIONS_HREF}
            target="_blank"
            rel="noreferrer"
            className="spec inline-flex h-12 items-center justify-center gap-3 border border-bone-100/25 px-6 text-[11px] text-bone-100 transition-colors duration-300 hover:border-bone-50 hover:text-bone-50"
          >
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
            Directions
          </a>
        </div>

        <div className="mt-6 border-t hairline pb-2 pt-6">
          <BookLink size="lg" label="Book On TheCut" />
          <p className="mt-5 max-w-md text-xs leading-relaxed text-bone-100/65">
            Booking opens on TheCut. An appointment is ${SHOP.bookingFee} for {SHOP.bookingMinutes}{' '}
            minutes and that covers the first service. Friday is first come, first served at the
            door.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
