import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** Gentle parallax — transform-driven, disabled under reduced motion. */
export function useParallax<T extends HTMLElement>(speed = 0.07) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const centre = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-centre * speed).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [speed]);

  return ref;
}

interface RevealProps {
  children: ReactNode;
  variant?: 'up' | 'fade' | 'mask';
  delay?: number;
  className?: string;
  innerClassName?: string;
  as?: ElementType;
}

export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  innerClassName = '',
  as,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const Tag = (as ?? 'div') as ElementType;

  if (variant === 'mask') {
    // span (display block) keeps masks valid inside headings
    const MaskTag = (as ?? 'span') as ElementType;
    return (
      <MaskTag ref={ref} className={`rv-mask block ${inView ? 'in' : ''} ${className}`}>
        <span
          className={`rv-mask-inner ${innerClassName}`}
          style={{ transitionDelay: `${delay}ms` }}
        >
          {children}
        </span>
      </MaskTag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={`${variant === 'up' ? 'rv-up' : 'rv-fade'} ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
