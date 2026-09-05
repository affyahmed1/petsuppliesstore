import { useEffect, useState } from 'react';
import { IMAGES } from '../data/products';
import { useShop, scrollToId } from '../store/ShopContext';
import type { CategoryId } from '../types';

export default function Hero() {
  const { setFilter } = useShop();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setInView(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const go = (f: CategoryId) => {
    setFilter(f);
    scrollToId('collection');
  };

  const line = (delay: number, children: React.ReactNode) => (
    <span className="rv-mask block">
      <span
        className="rv-mask-inner"
        style={{ transitionDelay: `${delay}ms`, transform: inView ? 'none' : undefined }}
      >
        {children}
      </span>
    </span>
  );

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
      {/* cinematic plate */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="A chocolate-brown dog and a cream cat sitting together in golden window light"
          className="kenburns h-full w-full object-cover object-[65%_center]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-ink/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40" />
      </div>

      {/* copy block — anchored low-left */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-36 sm:px-8">
        <div
          className={`mb-7 flex items-center gap-4 transition-all duration-1000 ${
            inView ? 'opacity-100' : 'translate-y-3 opacity-0'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          <span className="h-px w-12 bg-cream/70" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-cream sm:text-[11px]">
            Kin &amp; Tail — Lifestyle goods for dogs &amp; cats
          </p>
        </div>

        <h1 className="font-display text-[13.5vw] font-light leading-[0.98] tracking-[-0.01em] text-ivory sm:text-7xl lg:text-[6.3rem]">
          {line(250, 'Made for every')}
          {line(
            400,
            <>
              kind of <em className="italic text-cream">friendship.</em>
            </>,
          )}
        </h1>

        <p
          className={`mt-7 max-w-md text-[15px] font-light leading-relaxed text-ivory/70 transition-all duration-1000 ${
            inView ? 'opacity-100' : 'translate-y-3 opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          Considered objects for the companions we love — leather, stoneware and wool,
          designed with care and made to be lived with.
        </p>

        <div
          className={`mt-9 flex flex-wrap items-center gap-4 transition-all duration-1000 ${
            inView ? 'opacity-100' : 'translate-y-3 opacity-0'
          }`}
          style={{ transitionDelay: '750ms' }}
        >
          <button
            type="button"
            onClick={() => go('dogs')}
            className="group inline-flex items-center gap-3 bg-ivory px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-espresso transition-colors duration-500 hover:bg-cream"
          >
            Shop for Dogs
            <span className="block h-1.5 w-1.5 rounded-full bg-espresso/50 transition-transform duration-500 group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => go('cats')}
            className="group inline-flex items-center gap-3 border border-ivory/40 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors duration-500 hover:border-cream hover:text-cream"
          >
            Shop for Cats
            <span className="block h-1.5 w-1.5 rounded-full border border-current transition-transform duration-500 group-hover:translate-x-1" />
          </button>
        </div>

        {/* bottom meta strip */}
        <div
          className={`mt-16 flex items-end justify-between transition-opacity duration-1000 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '950ms' }}
        >
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-ivory/50">
            <span className="relative block h-10 w-px overflow-hidden bg-ivory/25">
              <span className="animate-scrolldrop absolute inset-x-0 top-0 h-1/2 bg-cream" />
            </span>
            Scroll — the story of us
          </div>
          <p className="hidden text-[10px] uppercase tracking-[0.3em] text-ivory/40 sm:block">
            Different personalities — one bond
          </p>
        </div>
      </div>
    </section>
  );
}
