import { Component } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, SHOP } from '@constants/shop.js';

// Suspense answers for a page that has not arrived yet. This answers for one
// that is not coming. A route throws on its way in - its code did not load, or
// it threw as it drew - and React takes the whole tree down with it rather than
// the one route, so without something to catch it the reader is left holding an
// empty document.
export default class RouteBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main
        id="main"
        className="shell flex min-h-[80svh] flex-col justify-center pb-24 pt-[calc(74px+4rem)]"
      >
        <p className="kicker">Bad line</p>
        <h1 className="mt-6 text-[clamp(2.6rem,10vw,6rem)]">Cut short</h1>
        <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-bone-100/75">
          This page did not come through. Load it again, and if it still will not, the chair is at{' '}
          {SHOP.street} and the phone still rings.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="spec inline-flex h-14 items-center justify-center bg-bone-50 px-7 text-xs text-pitch-900 transition-colors duration-300 hover:bg-rust hover:text-bone-50"
          >
            Try Again
          </button>
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
}
