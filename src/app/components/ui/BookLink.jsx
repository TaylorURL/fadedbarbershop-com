import { SHOP } from '@constants/shop.js';

const BASE =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden font-spec uppercase tracking-spec transition-colors duration-300';

const SIZES = {
  lg: 'h-14 px-8 text-xs',
  md: 'h-12 px-6 text-[11px]',
  sm: 'h-9 px-5 text-[10px]',
};

export default function BookLink({ size = 'md', className = '', label = 'Book A Chair', ...rest }) {
  return (
    <a
      href={SHOP.booking}
      target="_blank"
      rel="noreferrer"
      className={`${BASE} ${SIZES[size]} bg-bone-50 text-pitch-900 hover:text-bone-50 ${className}`}
      {...rest}
    >
      {/* The fill arrives as a razor pass rather than a fade. */}
      <span className="absolute inset-0 -translate-x-full bg-rust transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
      <span className="relative">{label}</span>
      <span className="relative h-[1px] w-5 bg-current opacity-60 transition-[width] duration-300 group-hover:w-8" />
    </a>
  );
}
