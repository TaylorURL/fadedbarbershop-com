import ShaveHeading from '@components/ShaveHeading.jsx';
import Reveal from '@components/Reveal.jsx';

export default function PageHead({ kicker, title, lead, guard }) {
  return (
    <header className="relative overflow-hidden pb-14 pt-[calc(62px+clamp(3rem,9vh,6rem))] sm:pb-20 lg:pt-[calc(74px+clamp(3rem,9vh,6rem))]">
      <div className="shell relative">
        <div className="flex items-baseline gap-4">
          {guard ? <span className="spec text-[11px] text-rust-ember">{guard}</span> : null}
          <p className="kicker">{kicker}</p>
        </div>
        <ShaveHeading as="h1" className="mt-6 text-[clamp(2.8rem,11vw,7rem)]">
          {title}
        </ShaveHeading>
        {lead ? (
          <Reveal delay={140} className="mt-8 max-w-2xl">
            <p className="text-[15px] leading-relaxed text-bone-100/75 sm:text-base">{lead}</p>
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}
