import useTodayStatus from '@hooks/useTodayStatus.js';

export default function StatusPill({ className = '' }) {
  const status = useTodayStatus();

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className={`absolute inset-0 rounded-full ${
            status.open ? 'animate-ember-pulse bg-rust-ember' : 'bg-bone-100/30'
          }`}
        />
      </span>
      <span className="spec text-[10px] text-bone-50">{status.headline}</span>
      {status.detail ? (
        <span className="spec text-[10px] text-bone-300">{status.detail}</span>
      ) : null}
    </div>
  );
}
