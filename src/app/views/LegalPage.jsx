import { Link } from 'react-router-dom';
import { ROUTES, SHOP } from '@constants/shop.js';

export default function LegalPage({ title, children }) {
  return (
    <main
      id="main"
      className="shell min-h-[70svh] pb-28 pt-[calc(62px+5rem)] lg:pt-[calc(74px+6rem)]"
    >
      <Link to={ROUTES.home} className="spec text-[10px] text-bone-300 hover:text-bone-50">
        Back
      </Link>
      <h1 className="mt-8 text-[clamp(2.2rem,7vw,4rem)]">{title}</h1>
      <div className="mt-10 max-w-2xl space-y-6 text-sm leading-relaxed text-bone-100/75">
        {children}
      </div>
      <p className="spec mt-16 text-[10px] text-bone-100/45">
        {SHOP.name} · {SHOP.street}, {SHOP.city}, {SHOP.region} {SHOP.postal} · {SHOP.phone}
      </p>
    </main>
  );
}
