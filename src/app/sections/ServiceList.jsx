import { SERVICES, SHOP } from '@constants/shop.js';
import Reveal from '@components/ui/Reveal.jsx';

export default function ServiceList({ detailed = false }) {
  return (
    <>
      <ul>
        {SERVICES.map((service, i) => (
          <Reveal as="li" key={service.name} delay={i * 80} className="group border-t hairline">
            <div className="grid grid-cols-[3rem_1fr] items-baseline gap-x-6 gap-y-3 py-6 sm:grid-cols-[4rem_1fr_minmax(0,28rem)] sm:py-7">
              <span className="spec text-xl text-bone-100/30 transition-colors duration-500 group-hover:text-rust-ember sm:text-3xl">
                {service.guard}
              </span>
              <h3 className="font-head text-2xl font-[700] uppercase text-bone-50 sm:text-[2rem]">
                {service.name}
              </h3>
              <p className="col-start-2 text-sm leading-relaxed text-bone-100/70 sm:col-start-3">
                {detailed ? service.long : service.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={120} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
        <span className="spec text-[10px] text-bone-300">
          Appointment ${SHOP.bookingFee}, covers the first service
        </span>
        <span className="spec text-[10px] text-bone-300">{SHOP.bookingMinutes} minutes</span>
      </Reveal>
    </>
  );
}
