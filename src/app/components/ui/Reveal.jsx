import useInView from '@hooks/useInView.js';

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const { ref, shown, instant } = useInView();

  return (
    <Tag
      ref={ref}
      className={`transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[6px]'
      } ${className}`}
      style={instant ? { transition: 'none' } : { transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
