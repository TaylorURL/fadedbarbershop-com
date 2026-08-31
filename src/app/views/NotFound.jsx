import { Link } from 'react-router-dom';
import { ROUTES, SHOP } from '@constants/shop.js';
import BookLink from '@components/BookLink.jsx';

export default function NotFound() {
  return (
    <main
      id="main"
      className="shell flex min-h-[80svh] flex-col justify-center pb-24 pt-[calc(74px+4rem)]"
    >
      <p className="kicker">No such page</p>
      <h1 className="mt-6 text-[clamp(2.6rem,10vw,6rem)]">Taken off</h1>
      <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-bone-100/75">
        Whatever was here is gone. The chair is still at {SHOP.street} and the phone still rings.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <BookLink size="lg" />
        <Link
          to={ROUTES.home}
          className="spec inline-flex h-14 items-center justify-center border border-bone-100/25 px-7 text-xs text-bone-100 transition-colors duration-300 hover:border-bone-50 hover:text-bone-50"
        >
          Back To The Shop
        </Link>
      </div>
    </main>
  );
}
