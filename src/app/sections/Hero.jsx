import { SHOP } from '@constants/shop.js';
import BookLink from '@components/ui/BookLink.jsx';
import StatusPill from '@components/ui/StatusPill.jsx';

// Sized in vh rather than vw so the whole lockup and both calls to action stay
// above the fold on a short laptop as well as a tall phone.
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-[clamp(7.5rem,15vh,9rem)] pt-[clamp(4.5rem,9vh,6rem)] text-center lg:pb-[clamp(4rem,9vh,7rem)]"
    >
      <p className="kicker mb-[clamp(1rem,2.6vh,2rem)]">
        {SHOP.town}
        <span className="mx-3 text-bone-100/40">/</span>
        Est. {SHOP.established}
      </p>

      {/* The shader carves this same box out of the hair field and hangs the ray
          fan behind it, so the mark reads as shaved rather than printed. */}
      <div data-fade-mark className="w-[clamp(126px,21vh,240px)]">
        <img
          src="/brand/faded-skull-480.webp"
          srcSet="/brand/faded-skull-280.webp 280w, /brand/faded-skull-480.webp 480w"
          sizes="(max-width: 640px) 46vw, 240px"
          alt=""
          width="734"
          height="693"
          fetchPriority="high"
          className="h-auto w-full drop-shadow-[0_18px_60px_rgba(0,0,0,0.9)]"
        />
      </div>

      <h1 className="sr-only">{SHOP.name}</h1>

      <div className="mt-[clamp(1rem,2.6vh,2rem)] w-[clamp(228px,40vh,420px)]">
        <img
          src="/brand/faded-wordmark-840.webp"
          srcSet="/brand/faded-wordmark-480.webp 480w, /brand/faded-wordmark-640.webp 640w, /brand/faded-wordmark-840.webp 840w"
          sizes="(max-width: 640px) 78vw, 420px"
          alt=""
          width="671"
          height="384"
          fetchPriority="high"
          className="h-auto w-full"
        />
      </div>

      <p className="spec mt-[clamp(1rem,2.6vh,2rem)] text-[11px] text-bone-200">{SHOP.tagline}</p>

      <StatusPill className="mt-[clamp(1rem,2.6vh,2rem)]" />

      <div className="mt-[clamp(1rem,2.6vh,2rem)] flex w-[min(20rem,100%)] flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
        <BookLink size="lg" className="w-full sm:w-auto" />
        <a
          href={SHOP.phoneHref}
          className="spec inline-flex h-14 items-center justify-center border border-bone-100/25 px-7 text-xs text-bone-100 transition-colors duration-300 hover:border-bone-50 hover:text-bone-50"
        >
          {SHOP.phone}
        </a>
      </div>
    </section>
  );
}
