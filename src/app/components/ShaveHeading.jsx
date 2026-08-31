import useInView from '@hooks/useInView.js';

// The heading arrives as a clipper pass across it rather than a fade, which is
// the same gesture the field runs on.
export default function ShaveHeading({ as: Tag = 'h2', className = '', children }) {
  const { ref, shown, instant } = useInView({ rootMargin: '-10% 0px -10% 0px' });

  return (
    <Tag
      ref={ref}
      data-shown={shown ? 'true' : 'false'}
      className={`shave-in ${className}`}
      style={instant ? { transition: 'none' } : undefined}
    >
      {children}
    </Tag>
  );
}
