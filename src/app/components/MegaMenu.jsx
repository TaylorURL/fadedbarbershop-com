import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import { NAV, ROUTES, SERVICES, SHOP, HOURS, DIRECTIONS_HREF } from '@constants/shop.js';
import useTodayStatus, { formatTime } from '@hooks/useTodayStatus.js';
import BookLink from '@components/BookLink.jsx';

const OPEN_DELAY = 90;
const CLOSE_DELAY = 180;

export default function MegaMenu({ open, setOpen }) {
  const status = useTodayStatus();
  const timer = useRef(0);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // The panel mounts on first open and stays mounted, so the transition has
  // something to run from and the links stay in the tab order predictably.
  useEffect(() => {
    if (open) setReady(true);
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const hold = (next, delay) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), delay);
  };

  const today = HOURS[status.day];

  return (
    <div
      className="hidden lg:block"
      onPointerEnter={() => hold(true, OPEN_DELAY)}
      onPointerLeave={() => hold(false, CLOSE_DELAY)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mega"
        onClick={() => setOpen(!open)}
        onFocus={() => setOpen(true)}
        className="group flex cursor-pointer items-baseline gap-2 touch-manipulation transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bone-50/70 focus-visible:ring-offset-4 focus-visible:ring-offset-pitch-950 active:scale-95"
      >
        <span className="spec text-[9px] text-bone-100/35 transition-colors duration-300 group-hover:text-bone-100/70 group-focus-visible:text-bone-100/70">
          All
        </span>
        <span
          className={`spec text-[11px] transition-colors duration-300 ${
            open ? 'text-bone-50' : 'text-bone-100/70 group-hover:text-bone-50'
          }`}
        >
          Menu
        </span>
        <span
          className={`ml-1 h-[1px] transition-[width,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? 'w-6 bg-rust-ember' : 'w-3 bg-bone-100/30 group-hover:w-5'
          }`}
        />
      </button>

      {mounted
        ? createPortal(
            <div
              id="mega"
              aria-hidden={open ? undefined : 'true'}
              className={`fixed inset-x-0 top-[74px] z-30 border-y border-bone-100/12 bg-pitch-950/[0.98] backdrop-blur-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-2 opacity-0'
              }`}
              onPointerEnter={() => hold(true, 0)}
              onPointerLeave={() => hold(false, CLOSE_DELAY)}
            >
              {ready ? (
                <div className="shell grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
                  <div>
                    <h2 className="kicker text-bone-100/45">The Cuts</h2>
                    <ul className="mt-6 space-y-1">
                      {SERVICES.map((s) => (
                        <li key={s.name}>
                          <Link
                            to={ROUTES.services}
                            tabIndex={open ? 0 : -1}
                            className="group flex items-baseline gap-4 border-b border-bone-100/10 py-3"
                          >
                            <span className="spec w-4 text-[11px] text-bone-100/30 transition-colors group-hover:text-rust-ember">
                              {s.guard}
                            </span>
                            <span className="font-head text-xl font-[700] uppercase text-bone-100/85 transition-colors group-hover:text-bone-50">
                              {s.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="kicker text-bone-100/45">Pages</h2>
                    <ul className="mt-6 space-y-3">
                      {NAV.map((item) => (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            tabIndex={open ? 0 : -1}
                            className="spec text-[11px] text-bone-100/70 transition-colors hover:text-bone-50"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to={ROUTES.contact}
                          tabIndex={open ? 0 : -1}
                          className="spec text-[11px] text-bone-100/70 transition-colors hover:text-bone-50"
                        >
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="kicker text-bone-100/45">Today</h2>
                    <p className="mt-6 font-head text-3xl font-[900] uppercase leading-none text-bone-50">
                      {status.headline}
                    </p>
                    <p className="spec mt-3 text-[10px] text-bone-300">{status.detail}</p>
                    <p className="spec mt-6 text-[10px] leading-[1.9] text-bone-100/55">
                      {today.open === null
                        ? 'Closed today'
                        : `${formatTime(today.open)} – ${formatTime(today.close)}`}
                      <br />
                      {today.mode === 'walk-in'
                        ? 'Walk-in day'
                        : today.mode === 'appointment'
                          ? 'Appointment day'
                          : ''}
                    </p>
                  </div>

                  <div className="border-l border-bone-100/10 pl-10">
                    <h2 className="kicker text-bone-100/45">Take A Seat</h2>
                    <div className="mt-6 space-y-3">
                      <BookLink size="md" className="w-full" tabIndex={open ? 0 : -1} />
                      <a
                        href={SHOP.phoneHref}
                        tabIndex={open ? 0 : -1}
                        className="spec flex h-12 items-center justify-center gap-3 border border-bone-100/25 text-[11px] text-bone-100 transition-colors hover:border-bone-50"
                      >
                        <Phone className="h-3.5 w-3.5" strokeWidth={1.8} />
                        {SHOP.phone}
                      </a>
                      <a
                        href={DIRECTIONS_HREF}
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={open ? 0 : -1}
                        className="spec flex h-12 items-center justify-center gap-3 border border-bone-100/25 text-[11px] text-bone-100 transition-colors hover:border-bone-50"
                      >
                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                        Directions
                      </a>
                    </div>
                    <p className="spec mt-5 text-[9px] leading-[1.8] text-bone-100/45">
                      {SHOP.street}, {SHOP.city}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
