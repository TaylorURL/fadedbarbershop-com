import { Phone, MapPin, Scissors } from 'lucide-react';
import { SHOP, DIRECTIONS_HREF } from '@constants/shop.js';

const ITEM =
  'flex flex-1 flex-col items-center justify-center gap-1.5 py-3 font-spec text-[9px] uppercase tracking-spec';

// The three things a local visitor came for, reachable from any scroll position
// and never dependent on the shader.
export default function Dock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bone-100/20 bg-pitch-950/95 backdrop-blur-md lg:hidden">
      <div className="flex items-stretch divide-x divide-bone-100/10 pb-[env(safe-area-inset-bottom)]">
        <a href={SHOP.phoneHref} className={`${ITEM} text-bone-100`}>
          <Phone className="h-4 w-4" strokeWidth={1.7} />
          Call
        </a>
        <a
          href={DIRECTIONS_HREF}
          target="_blank"
          rel="noreferrer"
          className={`${ITEM} text-bone-100`}
        >
          <MapPin className="h-4 w-4" strokeWidth={1.7} />
          Directions
        </a>
        <a
          href={SHOP.booking}
          target="_blank"
          rel="noreferrer"
          className={`${ITEM} bg-bone-50 text-pitch-900`}
        >
          <Scissors className="h-4 w-4" strokeWidth={1.9} />
          Book
        </a>
      </div>
    </div>
  );
}
