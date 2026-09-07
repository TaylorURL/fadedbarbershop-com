import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV, ROUTES, SHOP } from '@constants/shop.js';
import BookLink from '@components/ui/BookLink.jsx';
import MegaMenu from '@components/layout/MegaMenu.jsx';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const { pathname } = useLocation();

  // A sentinel at the top of the document reports the same thing a scroll
  // listener would, without a React state write on every scroll event.
  useEffect(() => {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText =
      'position:absolute;top:0;left:0;height:24px;width:1px;pointer-events:none';
    document.body.appendChild(sentinel);

    if (!('IntersectionObserver' in window)) {
      sentinel.remove();
      return;
    }

    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setMega(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          scrolled || open || mega
            ? 'border-b border-bone-100/12 bg-pitch-950/90 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <div className="shell flex h-[62px] items-center justify-between gap-6 lg:h-[74px]">
          <Link to={ROUTES.home} className="group flex items-center gap-3" aria-label={SHOP.name}>
            <img
              src="/brand/faded-skull-280.webp"
              srcSet="/brand/faded-skull-280.webp 280w, /brand/faded-skull-480.webp 480w"
              sizes="40px"
              alt=""
              width="280"
              height="264"
              className="h-9 w-auto transition-transform duration-500 group-hover:-translate-y-0.5 lg:h-10"
            />
            <span className="font-head text-lg font-[900] uppercase leading-none tracking-tight text-bone-50 lg:text-xl">
              Faded
            </span>
          </Link>

          <nav aria-label="Pages" className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="group relative flex items-baseline gap-2"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`spec text-[9px] transition-colors duration-300 ${
                        isActive ? 'text-rust-ember' : 'text-bone-100/35'
                      }`}
                    >
                      {item.guard}
                    </span>
                    <span
                      className={`spec text-[11px] transition-colors duration-300 ${
                        isActive ? 'text-bone-50' : 'text-bone-100/70 group-hover:text-bone-50'
                      }`}
                    >
                      {item.label}
                    </span>
                    {/* A blade edge marks the active page; a full-weight bar reads as a button. */}
                    <span
                      className={`absolute -bottom-2 left-0 h-[1px] bg-bone-50 transition-[width,opacity,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? 'w-full opacity-90'
                          : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-50'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <MegaMenu open={mega} setOpen={setMega} />
          </nav>

          <div className="flex items-center gap-3">
            <BookLink size="sm" className="hidden sm:inline-flex" label="Book" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu"
              className="grid h-10 w-10 cursor-pointer touch-manipulation place-items-center text-bone-100 transition-colors duration-300 hover:text-bone-50 focus-visible:text-bone-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bone-50/70 active:scale-95 lg:hidden"
            >
              <span className="sr-only">{open ? 'Close Menu' : 'Open Menu'}</span>
              {open ? (
                <X className="h-5 w-5" strokeWidth={1.7} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.7} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* The drawer stays in the document while it is closed, so that the
          staggered reveal has something to run from. Marking it inert takes its
          links back out of the tab order for as long as they are out of sight. */}
      <div
        id="menu"
        className={`fixed inset-0 z-30 lg:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={open ? undefined : 'true'}
        inert={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 cursor-pointer touch-manipulation bg-pitch-950/[0.97] backdrop-blur-sm transition-opacity duration-500 hover:bg-pitch-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bone-50/70 active:bg-pitch-950 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="sr-only">Close Menu</span>
        </button>
        <nav aria-label="Pages" className="relative flex h-full flex-col justify-center px-8 pt-16">
          {NAV.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="group flex items-baseline gap-4 border-b border-bone-100/10 py-6"
              style={{
                transform: open ? 'none' : 'translateY(18px)',
                opacity: open ? 1 : 0,
                transition: `transform 600ms cubic-bezier(0.16,1,0.3,1) ${i * 70}ms, opacity 500ms ${i * 70}ms`,
              }}
            >
              <span className="spec text-[11px] text-bone-100/35">{item.guard}</span>
              <span className="font-head text-4xl font-[900] uppercase leading-none text-bone-50">
                {item.label}
              </span>
            </NavLink>
          ))}
          <div
            className="mt-10"
            style={{
              opacity: open ? 1 : 0,
              transition: `opacity 500ms ${NAV.length * 70}ms`,
            }}
          >
            <BookLink size="lg" className="w-full" />
            <a
              href={SHOP.phoneHref}
              className="spec mt-4 flex h-14 items-center justify-center border border-bone-100/25 text-xs text-bone-100"
            >
              {SHOP.phone}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
