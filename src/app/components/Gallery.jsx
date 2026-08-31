import { GALLERY } from '@constants/gallery.js';
import FadeSpecimen from '@components/FadeSpecimen.jsx';
import Reveal from '@components/Reveal.jsx';

export default function Gallery({ limit = GALLERY.length }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GALLERY.slice(0, limit).map((cut, i) => (
        <Reveal as="li" key={cut.id} delay={(i % 3) * 80}>
          <figure className="group relative overflow-hidden border hairline transition-colors duration-500 hover:border-bone-100/30">
            <div className="relative aspect-[4/5]">
              {cut.photo ? (
                <img
                  src={cut.photo}
                  srcSet={cut.photoSrcSet}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  alt={`${cut.name} cut by Samantha Taylor at Faded Barber Shop`}
                  width="800"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              ) : (
                <FadeSpecimen guard={cut.guard} className="h-full w-full" />
              )}

              {/* The note arrives under a razor pass rather than a fade. */}
              <figcaption className="absolute inset-x-0 bottom-0 bg-pitch-950/90 p-5 backdrop-blur-sm">
                <div className="flex items-baseline gap-3">
                  <span className="spec text-[11px] text-rust-ember">{cut.guard}</span>
                  <h3 className="font-head text-xl font-[700] uppercase text-bone-50">
                    {cut.name}
                  </h3>
                </div>
                <p className="mt-2 max-h-0 overflow-hidden text-xs leading-relaxed text-bone-100/70 transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-h-16 group-hover:opacity-100 opacity-0">
                  {cut.note}
                </p>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
