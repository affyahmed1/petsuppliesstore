import Reveal from './Reveal';
import { scrollToId } from '../store/ShopContext';
import { ArrowRight } from './Icons';

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-espresso py-32 text-ivory lg:py-44">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 0%, rgba(232,201,120,0.09) 0%, rgba(232,201,120,0) 70%)',
        }}
      />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="mx-auto block h-px w-20 bg-cream" />
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.4em] text-ivory/45">
            The closing frame
          </p>
        </Reveal>
        <h2 className="mt-8 font-display text-5xl font-light leading-[1.02] sm:text-7xl lg:text-[5.8rem]">
          <Reveal variant="mask" delay={100}>
            For every kind of
          </Reveal>
          <Reveal variant="mask" delay={260}>
            <em className="italic text-cream">companion.</em>
          </Reveal>
        </h2>
        <Reveal delay={340}>
          <p className="mx-auto mt-8 max-w-md text-[15px] font-light leading-relaxed text-ivory/60">
            Dogs. Cats. And the people who love them. Everything your friendship
            needs, brought together with care.
          </p>
        </Reveal>
        <Reveal delay={440}>
          <button
            type="button"
            onClick={() => scrollToId('collection')}
            className="group mt-11 inline-flex items-center gap-4 bg-cream px-10 py-4.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-espresso transition-colors duration-500 hover:bg-champagne"
          >
            Shop the Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
          </button>
          <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-ivory/35">
            Complimentary shipping over $120
          </p>
        </Reveal>
      </div>
    </section>
  );
}
