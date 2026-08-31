import { Link } from 'react-router-dom';
import { SOCIAL_ICONS } from '@components/socialIcons.js';
import { SHOP, SOCIALS, NAV, HOURS, ROUTES, DIRECTIONS_HREF } from '@constants/shop.js';
import { formatTime } from '@hooks/useTodayStatus.js';

export default function Footer({ children }) {
  return (
    <footer className="relative overflow-hidden border-t border-bone-100/12 bg-pitch-950 pb-2">
      <div className="shell relative grid gap-12 pb-16 pt-20 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <img
            src="/brand/faded-wordmark-480.webp"
            srcSet="/brand/faded-wordmark-480.webp 480w, /brand/faded-wordmark-640.webp 640w"
            sizes="180px"
            alt={SHOP.name}
            loading="lazy"
            decoding="async"
            width="480"
            height="275"
            className="h-16 w-auto"
          />
          <p className="mt-6 max-w-xs font-head text-xl font-[700] uppercase leading-tight text-bone-100/80">
            {SHOP.rule}
          </p>
          <p className="spec mt-6 text-[10px] leading-[1.9] text-bone-300">
            {SHOP.street}
            <br />
            {SHOP.city}, {SHOP.region} {SHOP.postal}
          </p>
          <a
            href={SHOP.phoneHref}
            className="spec mt-6 inline-block text-[10px] text-bone-100 hover:text-rust-ember"
          >
            {SHOP.phone}
          </a>
        </div>

        <nav aria-label="Pages">
          <h2 className="kicker text-bone-100/45">Index</h2>
          <ul className="mt-5 space-y-3">
            {NAV.map((item) => (
              <li key={item.to} className="flex items-baseline gap-3">
                <span className="spec text-[9px] text-bone-100/30">{item.guard}</span>
                <Link
                  to={item.to}
                  className="spec text-[10px] text-bone-100/70 transition-colors hover:text-bone-50"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex items-baseline gap-3">
              <span className="spec text-[9px] text-bone-100/30">·</span>
              <a
                href={DIRECTIONS_HREF}
                target="_blank"
                rel="noreferrer"
                className="spec text-[10px] text-bone-100/70 transition-colors hover:text-bone-50"
              >
                Directions
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="kicker text-bone-100/45">Hours</h2>
          <ul className="mt-5 space-y-3">
            {HOURS.filter((h) => h.open !== null).map((h) => (
              <li key={h.day} className="flex items-baseline justify-between gap-3">
                <span className="spec text-[10px] text-bone-100/70">{h.abbr}</span>
                <span className="spec whitespace-nowrap text-[10px] text-bone-300">
                  {formatTime(h.open)} – {formatTime(h.close)}
                </span>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-3">
              <span className="spec text-[10px] text-bone-100/70">Sun, Mon</span>
              <span className="spec text-[10px] text-bone-300">Closed</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="kicker text-bone-100/45">Follow</h2>
          <ul className="mt-5 space-y-3">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 text-bone-100/70 transition-colors hover:text-bone-50"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center border border-bone-100/15 transition-colors duration-300 group-hover:border-rust-ember group-hover:text-rust-ember">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
                    </span>
                    <span className="spec text-[10px]">{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="shell relative flex flex-col gap-4 border-t border-bone-100/10 pb-8 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="spec text-[9px] text-bone-100/45">
          {SHOP.name} · {SHOP.town} · Est. {SHOP.established}
        </p>
        <div className="flex items-center gap-6">
          <Link
            to={ROUTES.privacy}
            className="spec text-[9px] text-bone-100/45 hover:text-bone-100"
          >
            Privacy
          </Link>
          <Link to={ROUTES.terms} className="spec text-[9px] text-bone-100/45 hover:text-bone-100">
            Terms
          </Link>
        </div>
      </div>

      {children}
    </footer>
  );
}
