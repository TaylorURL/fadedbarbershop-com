// A fade drawn rather than photographed: vertical strands whose length is the
// guard, so the four lengths can be compared side by side.
export default function FadeSpecimen({ guard = 2, className = '' }) {
  // 0 is skin, 3 leaves the most length on.
  const crown = 26 + guard * 17;

  return (
    <div aria-hidden="true" className={`relative overflow-hidden bg-pitch-950 ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgb(232 225 213 / 0.62) 0 1px, transparent 1px 3px)',
          maskImage: `linear-gradient(to bottom, #000 0%, #000 ${crown * 0.45}%, transparent ${crown}%)`,
          WebkitMaskImage: `linear-gradient(to bottom, #000 0%, #000 ${crown * 0.45}%, transparent ${crown}%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgb(232 225 213 / 0.30) 0 1px, transparent 1px 5px)',
          maskImage: `linear-gradient(to bottom, #000 0%, transparent ${crown + 22}%)`,
          WebkitMaskImage: `linear-gradient(to bottom, #000 0%, transparent ${crown + 22}%)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          backgroundImage: 'radial-gradient(rgb(232 225 213 / 0.22) 0.5px, transparent 0.6px)',
          backgroundSize: '4px 4px',
        }}
      />
    </div>
  );
}
